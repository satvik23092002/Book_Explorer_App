# ■ Book Explorer App
An online bookstore system that scrapes book data from [Books to
Scrape](https://books.toscrape.com/) and provides a full-stack solution with scraping, backend
APIs, and a modern React frontend.
■ **GitHub Repository:** [Book Explorer
App](https://github.com/satvik23092002/Book_Explorer_App)
---
## ■ Features
- **Scraper**: Extracts book details (Title, Price, Availability, Rating, Thumbnail, Detail Page URL)
from *Books to Scrape*.
- **Backend (Node.js + Express + MongoDB)**:
- REST APIs with pagination, search, and filters.
- Book details endpoint.
- (Bonus) Refresh endpoint for scraping again.
- **Frontend (React)**:
- Paginated grid of books with Title, Price, Rating, Availability, and Thumbnail.
- Search and filter options.
- Detailed book info modal/page.
- Responsive and user-friendly UI.
---
## ■ Project Structure
Book_Explorer_App/
■
■■■ scraper/ # Scraper script (scraper.js)
■■■ backend/ # Backend service (Node.js + Express)
■■■ frontend/ # Frontend React app
■■■ README.md # Project documentation
---
## ■■ Installation
Clone the repository:
git clone https://github.com/satvik23092002/Book_Explorer_App.git
cd Book_Explorer_App
You will need **Node.js (>=16)** and **MongoDB** installed.
---
## ■■ Running the Scraper
Navigate to the `scraper/` folder and install dependencies:
cd scraper
npm install
Run the scraper:
node scraper.js
■ This will fetch all book data from *Books to Scrape* and save it into MongoDB.
(You can also schedule it with `cron` for automatic refresh).
---
## ■■ Running the Backend
Navigate to the `backend/` folder:
cd ../backend
npm install
Create a `.env` file in the backend folder with the following:
MONGODB_URI=your_mongodb_connection_string
PORT=3001
Start the backend server:
npm start
■ API Endpoints:
- GET /api/books → Paginated list (with search & filters).
- GET /api/books/:id → Single book details.
- POST /api/refresh → Refresh scraping data (bonus).
---
## ■ Running the Frontend
Navigate to the `frontend/` folder:
cd ../frontend
npm install
Start the development server:
npm start
Frontend runs on http://localhost:3000 (by default).
---
## ■ Deployment
- **Backend** → Deploy on Render / Heroku.
- **Frontend** → Deploy on Vercel or Netlify.
■■ Don’t forget to update frontend `.env` file with your deployed backend API URL before
deployment.
---
## ■■ Database
- Database: **MongoDB**
- Collection: `books`
- Schema fields:
- `title` (String)
- `price` (Number)
- `availability` (String)
- `rating` (String/Number)
- `url` (String)
- `image` (String)
Indexes can be added on `title`, `price`, `rating` for faster search & filters.