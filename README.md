🛒 QuickBid – Online Auction Platform
QuickBid is a full-stack real-time online auction platform that allows users to list items for auction, place live bids, track their participation and bidding history, and manage their profile. The system is designed to be responsive, secure, and scalable, offering a seamless user experience for both sellers and bidders.

🔍 Table of Contents
🛠️ Features

💻 Tech Stack

📦 Project Structure

🧪 Setup Instructions

1. Backend Setup

2. Frontend Setup

📸 Screenshots

🧩 APIs & Routes

🔐 Authentication

📈 Future Enhancements

📄 License

🛠️ Features
✅ User Authentication (JWT-based)

✅ Create & Manage Auctions

✅ Real-time Bidding using WebSockets (socket.io)

✅ Auction Countdown Timer

✅ Track Bidding History

✅ View Participated and Won Auctions

✅ User Profile with Edit Support

✅ Search Auctions

✅ End Auction (Seller Only)

✅ Responsive and modern UI

💻 Tech Stack
Frontend:
React.js

React Router DOM

Axios

Socket.io-client

CSS (Modular & Custom)

Backend:
Node.js

Express.js

Socket.io

JWT Authentication

PostgreSQL (via pg library)

DevOps:
Git & GitHub

npm (package manager)

Vite (React bundler)

📦 Project Structure
csharp
Copy
Edit
QuickBid/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/        # Navbar, AuctionCard, etc.
│   │   ├── pages/             # Profile, Home, Bidding, etc.
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   └── index.html
│
├── server/                    # Node Backend
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── models/ (if using ORM)
│   ├── index.js
│   └── db.js
│
├── .gitignore
├── README.md
└── package.json
🧪 Setup Instructions
1. Backend Setup
Install dependencies:

bash
Copy
Edit
cd server
npm install
Configure PostgreSQL Database:

Create a database named auction_db (or as per your config).

Add .env file with the following:

ini
Copy
Edit
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/auction_db
JWT_SECRET=your_jwt_secret
Run backend server:

bash
Copy
Edit
node index.js
or with nodemon:

bash
Copy
Edit
npm run dev
2. Frontend Setup
Install dependencies:

bash
Copy
Edit
cd client
npm install
Run frontend app:

bash
Copy
Edit
npm run dev
Visit http://localhost:5173

🧩 APIs & Routes
🔐 Authentication
POST /auth/register

POST /auth/login

JWT token used for protected routes.

🧑‍💼 User Profile
GET /auction/profile – Get user info

PUT /auction/profile/update – Update profile

GET /auction/profile/bidding-history

GET /auction/profile/participated-auctions

GET /auction/profile/won-auctions

📦 Auctions
GET /auction/active

GET /auction/search?query=...

GET /auction/my-auctions

GET /auction/:id – Get auction details

POST /auction/create

POST /auction/:id/bid

PATCH /auction/:id/end

🔐 Authentication
JWT token is issued on login and stored in localStorage

Token is sent in Authorization: Bearer <token> header

Middleware protects sensitive routes on backend


📄 License
This project is open-source and available under the MIT License.
