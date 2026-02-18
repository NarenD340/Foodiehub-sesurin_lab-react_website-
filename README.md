# Foodiehub-sesurin_lab-react_website-

FoodieHub is a modern web application for browsing, filtering, and ordering recipes. Users can:
Search recipes by title.
Filter recipes by calories, cuisine, total time, and rating.
View popular recipes.
Add recipes to a cart for ordering.
View detailed recipe information including nutrition values.
The app uses a React frontend and Node.js/Express backend with REST API endpoints for fetching and searching recipes.

Features

Search & Filters: Easily search by title and filter by calories, cuisine, total time, or rating.
Pagination: Load recipes page by page.
Dynamic Images: Each recipe displays a relevant image based on keywords.
Cart: Add/remove recipes to an order.
Popular Recipes: Highlight the top 3 recipes by rating.
Modal: Show recipe details, description, and nutrition facts in a modal popup.

Tech Stack

Frontend: React, CSS
Backend: Node.js, Express
Database: MongoDB (assumed, since insert.js is used)
Tools: Fetch API for client-server communication
Installation & Setup
Clone the repository:
git clone https://github.com/your-username/foodiehub.git
cd foodiehub

Backend Setup:

Install dependencies:

cd backend
npm install


Insert initial recipes (optional, using insert.js):

node insert.js


Start the server:

node server.js


The backend runs on http://localhost:5000 by default.

Frontend Setup:

cd frontend
npm install
npm start


The React app runs on http://localhost:3000 by default.

API Endpoints

GET /api/recipes → Fetch paginated recipes (supports filters like calories, title, cuisine, total_time, rating)

GET /api/recipes/search?title=VALUE → Search recipes by title

Usage

Open http://localhost:3000 in your browser.

Use the search bar to find recipes.

Apply filters to narrow results.

Click Add to Cart to order recipes.

Click a recipe to view detailed information.

Folder Structure
foodiehub/
├─ frontend/        # React app
│  ├─ src/
│  │  ├─ App.js
│  │  └─ App.css
├─ backend/         # Node.js/Express backend
│  ├─ server.js
│  ├─ insert.js
│  └─ package.json
├─ README.md

Contributing

Fork the repository.

Create a new branch (git checkout -b feature/your-feature).

Make your changes and commit (git commit -m "Add feature").

Push to your branch (git push origin feature/your-feature).

Create a Pull Request.
