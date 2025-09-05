require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const { Book } = require('./models/Book');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
async function connectToDatabase() {
	try {
		await mongoose.connect(process.env.MONGODB_URI, { autoIndex: true });
		console.log('Connected to MongoDB');
	} catch (error) {
		console.error('MongoDB connection error:', error);
		process.exit(1);
	}
}

// Function to run the scraper
function runScraper() {
	return new Promise((resolve, reject) => {
		console.log('Starting scheduled scrape...');
		
		const scraperPath = path.join(__dirname, '..', 'scraper', 'index.js');
		const scraper = spawn('node', [scraperPath], {
			cwd: path.join(__dirname, '..', 'scraper'),
			env: { ...process.env }
		});

		let output = '';
		let errorOutput = '';

		scraper.stdout.on('data', (data) => {
			output += data.toString();
			console.log('Scheduled Scraper:', data.toString());
		});

		scraper.stderr.on('data', (data) => {
			errorOutput += data.toString();
			console.error('Scheduled Scraper error:', data.toString());
		});

		scraper.on('close', (code) => {
			if (code === 0) {
				console.log('Scheduled scraping completed successfully');
				resolve({ success: true, output: output.trim() });
			} else {
				console.error('Scheduled scraping failed:', errorOutput.trim());
				reject(new Error(`Scraping failed with code ${code}: ${errorOutput.trim()}`));
			}
		});

		scraper.on('error', (error) => {
			console.error('Scheduled scraper process error:', error);
			reject(error);
		});
	});
}

// Setup cron job for scheduled scraping
function setupCronJob() {
	const cronEnabled = process.env.CRON_ENABLED === 'true';
	const cronSchedule = process.env.CRON_SCHEDULE || '0 3 * * *'; // Default: daily at 3 AM
	
	if (cronEnabled) {
		console.log(`Cron job enabled with schedule: ${cronSchedule}`);
		
		cron.schedule(cronSchedule, async () => {
			try {
				await runScraper();
			} catch (error) {
				console.error('Scheduled scraping error:', error);
			}
		}, {
			scheduled: true,
			timezone: "UTC"
		});
		
		console.log('Cron job scheduled successfully');
	} else {
		console.log('Cron job disabled (CRON_ENABLED=false)');
	}
}

// API Routes

// GET /api/books - List books with pagination, filters, and search
app.get('/api/books', async (req, res) => {
	try {
		const {
			page = 1,
			limit = 20,
			search,
			rating,
			inStock,
			minPrice,
			maxPrice,
			sortBy = 'title',
			sortOrder = 'asc'
		} = req.query;

		// Build filter object
		const filter = {};
		
		if (search && String(search).trim()) {
			filter.title = { $regex: String(search).trim(), $options: 'i' };
		}
		
		const ratingNum = Number(rating);
		if (!Number.isNaN(ratingNum) && rating !== '') {
			filter.rating = ratingNum;
		}
		
		if (inStock !== undefined && inStock !== '') {
			filter.inStock = inStock === 'true';
		}
		
		const minNum = Number(minPrice);
		const maxNum = Number(maxPrice);
		const hasMin = !Number.isNaN(minNum) && minPrice !== undefined && minPrice !== '';
		const hasMax = !Number.isNaN(maxNum) && maxPrice !== undefined && maxPrice !== '';
		if (hasMin || hasMax) {
			filter.price = {};
			if (hasMin) filter.price.$gte = minNum;
			if (hasMax) filter.price.$lte = maxNum;
		}

		// Build sort object
		const sort = {};
		sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

		// Calculate pagination
		const skip = (parseInt(page) - 1) * parseInt(limit);

		// Execute query
		const [books, total] = await Promise.all([
			Book.find(filter)
				.sort(sort)
				.skip(skip)
				.limit(parseInt(limit))
				.lean(),
			Book.countDocuments(filter)
		]);

		res.json({
			books,
			pagination: {
				currentPage: parseInt(page),
				totalPages: Math.ceil(total / parseInt(limit)),
				totalBooks: total,
				hasNext: skip + books.length < total,
				hasPrev: parseInt(page) > 1
			}
		});
	} catch (error) {
		console.error('Error fetching books:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// GET /api/books/:id - Get single book details
app.get('/api/books/:id', async (req, res) => {
	try {
		const book = await Book.findById(req.params.id).lean();
		
		if (!book) {
			return res.status(404).json({ error: 'Book not found' });
		}
		
		res.json(book);
	} catch (error) {
		console.error('Error fetching book:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// POST /api/refresh - Trigger fresh scraping
app.post('/api/refresh', async (req, res) => {
	try {
		console.log('Starting manual scrape...');
		
		const result = await runScraper();
		res.json({ 
			message: 'Scraping completed successfully',
			output: result.output
		});

	} catch (error) {
		console.error('Error starting scraper:', error);
		res.status(500).json({ 
			error: 'Scraping failed',
			message: error.message
		});
	}
});

// Health check endpoint
app.get('/api/health', (req, res) => {
	res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
async function startServer() {
	await connectToDatabase();
	
	// Setup cron job for scheduled scraping
	setupCronJob();
	
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
		console.log(`Health check: http://localhost:${PORT}/api/health`);
		console.log(`Books API: http://localhost:${PORT}/api/books`);
	});
}

startServer().catch(console.error);
