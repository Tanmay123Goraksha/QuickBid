
```markdown
# 🛒 QuickBid – Real-Time Auction Platform

QuickBid is a full-stack real-time auction platform where users can create listings,
 participate in live bidding, and manage their auction activities. Built for speed, scalability,
and a seamless user experience.

---

## 📌 Features

- ✅ JWT-based User Authentication
- ✅ Create and List Auctions
- ✅ Real-Time Bidding via Socket.IO
- ✅ Countdown Timers for Auctions
- ✅ View Participated & Won Auctions
- ✅ Bidding History per User
- ✅ Search Auctions
- ✅ End Auctions (Seller Only)
- ✅ Responsive, Clean UI

---

## 💻 Tech Stack

**Frontend**  
- React.js  
- React Router DOM  
- Axios  
- Socket.io-client  
- CSS Modules

**Backend**  
- Node.js  
- Express.js  
- Socket.io  
- PostgreSQL  
- JWT (JSON Web Tokens)  
- bcrypt (Password Hashing)

**Dev Tools**  
- Vite (Frontend Bundler)  
- npm  
- Git & GitHub

---

## 📁 Project Structure

```

QuickBid/
├── client/           # React frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       └── App.jsx
├── server/           # Node.js backend
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── index.js
├── package.json
└── README.md

````

---

## 🧪 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Tanmay123Goraksha/QuickBid.git
cd QuickBid
````

---

### 2. Backend Setup (Node.js)

```bash
cd server
npm install
```

**Create a `.env` file:**

```env
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/auction_db
JWT_SECRET=your_jwt_secret_key
```

**Run the backend:**

```bash
node index.js
# or with nodemon
npm run dev
```

---

### 3. Frontend Setup (React)

```bash
cd client
npm install
npm run dev
```

Visit: [http://localhost:5173](http://localhost:5173)

---

## 🔐 Authentication

* **Register/Login** to receive a JWT
* Token is stored in `localStorage`
* Protected routes require `Authorization: Bearer <token>` in headers
* Auth middleware handles verification on backend

---

## 📦 API Endpoints

### 🔑 Auth

* `POST /auth/register`
* `POST /auth/login`

### 👤 Profile

* `GET /auction/profile`
* `PUT /auction/profile/update`
* `GET /auction/profile/bidding-history`
* `GET /auction/profile/participated-auctions`
* `GET /auction/profile/won-auctions`

### 📦 Auctions

* `GET /auction/active`
* `GET /auction/search?query=...`
* `GET /auction/my-auctions`
* `GET /auction/:id`
* `POST /auction/create`
* `POST /auction/:id/bid`
* `PATCH /auction/:id/end`




---

## ✨ Author

**Tanmay Goraksha**

* 🔗 [GitHub](https://github.com/Tanmay123Goraksha)
* ✉️ [tanmay1goraksha@gmail.com](mailto:tanmay1goraksha@gmail.com)

---

> *Built with passion and real-time tech to simplify online auctions!*

```

---


```
