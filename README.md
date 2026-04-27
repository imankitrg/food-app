This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# 🍔 FoodBite — Frontend

Next.js based frontend for the FoodBite food ordering web app.

---

## 🚀 Tech Stack

- **Framework** — Next.js (App Router)
- **Styling** — Tailwind CSS
- **Auth** — JWT (stored in localStorage)
- **State** — React useState / useEffect
- **HTTP** — Native fetch API

---

## 📁 Project Structure

```
app/
├── page.jsx                  # Home / Landing page
├── menu/
│   └── page.jsx              # Menu listing page
├── cart/
│   └── page.jsx              # Cart page
├── checkout/
│   └── page.jsx              # Checkout page
├── auth/
│   └── page.jsx              # User login / register
└── admin/
    ├── login/
    │   └── page.jsx          # Admin login page
    └── dashboard/
        └── page.jsx          # Admin dashboard (orders management)
```

---

## 📄 Pages Overview

### 🏠 `/menu`
- Displays all available food items fetched from the backend
- Users can add items to cart (saved in `localStorage`)

### 🛒 `/cart`
- Shows all items added to cart
- Quantity controls, remove item, clear cart
- Displays **"Order Delivered" banner** if latest order status is `completed`
- Promo code input (UI only)
- Proceeds to `/checkout`

### ✅ `/checkout`
- **Auth protected** — redirects to `/auth` if no token found
- Delivery details form (Name, Phone, Email, Address, City, Pincode, Landmark)
- Special instructions field
- Payment method — Cash on Delivery only (for now)
- Right side order summary with item breakdown
- Calls `POST /api/orders` with JWT token to place order

### 🔐 `/auth`
- Login and Register for regular users
- On success, JWT token saved to `localStorage`

### 🛡️ `/admin/login`
- Separate login page for admin
- Decodes JWT after login — checks `payload.role === "admin"`
- If not admin → shows "Access Denied", stays on login page
- If admin → redirects to `/admin/dashboard`

### 📊 `/admin/dashboard`
- Auth + role protected (redirects if no token or role !== admin)
- Fetches all orders from `GET /api/orders`
- Filter orders by status — All / Pending / Confirmed / Completed / Cancelled
- Click any order → expand to see items breakdown
- Update order status via `PUT /api/orders/:id`
- Optimistic UI update on status change
- Logout clears token and redirects to `/admin/login`

---

## 🔑 Authentication Flow

```
User Login → POST /api/auth/login
          → Save token to localStorage
          → Decode JWT payload for role check

Token Usage → Authorization: Bearer <token>  (on every protected API call)

Admin Check → JWT payload.role === "admin"
           → If not admin → redirect to /admin/login
```

---

## 🛒 Cart Logic

Cart is stored in `localStorage` as a JSON array:

```json
[
  { "_id": "abc123", "name": "Butter Chicken", "price": 280, "quantity": 2 }
]
```

Pricing formula used across cart and checkout:

```
Subtotal  = sum(item.price × item.quantity)
Delivery  = ₹40 (flat)
Tax       = 5% of subtotal (rounded)
Total     = Subtotal + Delivery + Tax
```

---

## 📡 API Endpoints Used

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | User / Admin login | ❌ |
| POST | `/api/auth/register` | User registration | ❌ |
| GET | `/api/orders/my` | Get logged-in user's orders | ✅ User |
| POST | `/api/orders` | Place a new order | ✅ User |
| GET | `/api/orders` | Get all orders | ✅ Admin |
| PUT | `/api/orders/:id` | Update order status | ✅ Admin |

---

## ⚙️ Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

> Make sure your backend server is running on the correct port.

### 3. Run the development server

```bash
npm run dev
```

App will be available at `http://localhost:3000`

---

## 🌐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000` |

---

## 📝 Notes

- All API calls use relative paths (e.g. `/api/orders`) — configure a proxy in `next.config.js` if backend runs on a different port
- JWT token is stored in `localStorage` — for production consider `httpOnly` cookies for better security
- Admin role is determined by `payload.role` field inside the JWT
- Cart persists across sessions via `localStorage` until cleared or order is placed

---

## 🔮 Upcoming Features

- [ ] Online payment integration (UPI / Razorpay)
- [ ] Multiple saved addresses
- [ ] Real-time order tracking
- [ ] Menu management from admin dashboard
- [ ] User profile page
- [ ] Order history page (`/my-orders`)