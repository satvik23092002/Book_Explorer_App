require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
// const pLimit = require('p-limit'); // ES module, using alternative
const { URL } = require('url');

const { Book } = require('./models/Book');

const BASE_URL = 'https://books.toscrape.com/';

function normalizeUrl(base, relativeOrAbsolute) {
	try {
		return new URL(relativeOrAbsolute, base).toString();
	} catch (_) {
		return relativeOrAbsolute;
	}
}

function parsePrice(text) {
	const num = parseFloat(text.replace(/[^0-9.]/g, ''));
	return Number.isNaN(num) ? null : num;
}

function parseAvailability(text) {
	const trimmed = text.replace(/\s+/g, ' ').trim();
	const inStock = /in stock/i.test(trimmed);
	const match = trimmed.match(/(\d+) available/i);
	const stockCount = match ? parseInt(match[1], 10) : (inStock ? 1 : 0);
	return { inStock, stockCount, raw: trimmed };
}

function parseRating(classText) {
	const map = { One: 1, Two: 2, Three: 3, Four: 4, Five: 5 };
	const parts = (classText || '').split(/\s+/);
	for (const key of Object.keys(map)) {
		if (parts.includes(key)) return map[key];
	}
	return null;
}

async function connectToDatabase() {
	const uri = process.env.MONGODB_URI;
	if (!uri) {
		throw new Error('MONGODB_URI is not set in environment. Create a .env file with MONGODB_URI.');
	}
	await mongoose.connect(uri, { autoIndex: true });
	console.log('Connected to MongoDB');
}

async function fetchHtml(url) {
	const res = await axios.get(url, { headers: { 'User-Agent': 'BookExplorerBot/1.0 (practice scraper)' } });
	return res.data;
}

async function scrapePage(pageUrl) {
	const html = await fetchHtml(pageUrl);
	const $ = cheerio.load(html);

	const books = [];
	$('ol.row > li').each((_, el) => {
		const article = $(el).find('article.product_pod');
		const linkEl = article.find('h3 a');
		const title = linkEl.attr('title')?.trim() || linkEl.text().trim();
		const detailHref = linkEl.attr('href');
		const detailUrl = normalizeUrl(pageUrl, detailHref);
		const priceText = article.find('.price_color').text();
		const price = parsePrice(priceText);
		const ratingClass = article.find('.star-rating').attr('class') || '';
		const rating = parseRating(ratingClass);
		const availabilityText = article.find('.availability').text();
		const { inStock, stockCount, raw } = parseAvailability(availabilityText);
		let imgSrc = article.find('img').attr('src');
		imgSrc = imgSrc ? normalizeUrl(pageUrl, imgSrc) : null;

		books.push({
			title,
			price,
			rating,
			inStock,
			stockCount,
			availabilityText: raw,
			detailUrl,
			imageUrl: imgSrc,
		});
	});

	let nextUrl = null;
	const nextHref = $('li.next a').attr('href');
	if (nextHref) nextUrl = normalizeUrl(pageUrl, nextHref);

	return { books, nextUrl };
}

async function upsertBooks(bookDocs) {
	if (!bookDocs.length) return 0;
	let upserted = 0;
	// Process in batches of 10 to avoid overwhelming the database
	const batchSize = 10;
	for (let i = 0; i < bookDocs.length; i += batchSize) {
		const batch = bookDocs.slice(i, i + batchSize);
		await Promise.all(
			batch.map(async (doc) => {
				await Book.updateOne(
					{ detailUrl: doc.detailUrl },
					{ $set: doc },
					{ upsert: true }
				);
				upserted += 1;
			})
		);
	}
	return upserted;
}

async function scrapeAll() {
	let pageUrl = BASE_URL;
	let total = 0;
	let pageCount = 0;
	while (pageUrl) {
		pageCount += 1;
		console.log(`Scraping page ${pageCount}: ${pageUrl}`);
		const { books, nextUrl } = await scrapePage(pageUrl);
		const count = await upsertBooks(books);
		total += count;
		console.log(`\tUpserted ${count} books from this page. Total so far: ${total}`);
		pageUrl = nextUrl;
	}
	console.log(`Finished. Upserted ${total} books total across ${pageCount} pages.`);
}

async function main() {
	try {
		await connectToDatabase();
		await scrapeAll();
	} catch (err) {
		console.error(err);
		process.exitCode = 1;
	} finally {
		await mongoose.disconnect();
	}
}

if (require.main === module) {
	main();
}

module.exports = { scrapeAll };
