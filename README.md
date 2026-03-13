# UR Aerotech - Aircraft Repair & Aviation Parts E-commerce Platform

A modern, professional e-commerce platform for aircraft repair services and aviation parts supply built with Next.js 14, TypeScript, MongoDB, and Prisma.

## Features

### Public Features
- Modern, responsive homepage with hero section
- Services catalog with detailed descriptions
- Products catalog with search and filtering
- Quote request system
- About and Contact pages

### Authentication
- User registration (B2C and B2B customers)
- Secure login with NextAuth.js
- JWT-based session management
- Password hashing with bcrypt

### Customer Dashboard
- View recent orders
- Track quote requests
- Manage account information
- Order history

### Admin Dashboard
- Manage products (CRUD operations)
- Manage orders and update status
- Review and approve/reject quotes
- User management
- Analytics and statistics

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Prisma ORM
- **Authentication**: NextAuth.js with JWT
- **Payment**: Stripe (prepared for integration)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd uraerotech
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory with the following:

```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/uraerotech?retryWrites=true&w=majority"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
```

4. Generate Prisma Client:
```bash
npx prisma generate
```

5. Push the database schema:
```bash
npx prisma db push
```

6. (Optional) Seed the database:
```bash
npm run seed
```

7. Run the development server:
```bash
npm run dev
```

8. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
uraerotech/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── products/     # Product endpoints
│   │   └── quotes/       # Quote endpoints
│   ├── auth/             # Auth pages (signin, signup)
│   ├── admin/            # Admin dashboard
│   ├── dashboard/        # Customer dashboard
│   ├── products/         # Product pages
│   ├── services/         # Services pages
│   ├── quote/            # Quote request page
│   ├── about/            # About page
│   ├── contact/          # Contact page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage
├── components/           # Reusable components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── SessionProvider.tsx
├── lib/                  # Utility functions
│   ├── prisma.ts         # Prisma client
│   └── auth.ts           # Auth configuration
├── prisma/
│   └── schema.prisma     # Database schema
└── types/                # TypeScript types
```

## Database Schema

### User Roles
- `PUBLIC`: Non-authenticated users
- `B2C`: Individual customers
- `B2B`: Business customers
- `ADMIN`: Platform administrators

### Main Models
- **User**: User accounts with authentication
- **Product**: Aviation parts and tools
- **Category**: Product categories
- **Service**: Repair services offered
- **Order**: Customer orders
- **OrderItem**: Individual items in orders
- **Quote**: Quote requests from customers

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (Admin)
- `GET /api/products/[id]` - Get single product
- `PATCH /api/products/[id]` - Update product (Admin)
- `DELETE /api/products/[id]` - Delete product (Admin)

### Quotes
- `GET /api/quotes` - Get user quotes
- `POST /api/quotes` - Submit quote request
- `PATCH /api/quotes/[id]` - Update quote status (Admin)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/checkout` - Create new order
- `PATCH /api/orders/[id]` - Update order status (Admin)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

Make sure to set all environment variables in your deployment platform:
- `DATABASE_URL`
- `NEXTAUTH_SECRET` (generate a secure random string)
- `NEXTAUTH_URL` (your production URL)
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

## Creating an Admin User

To create an admin user, you can either:

1. Register normally and update the role in the database:
```javascript
// In MongoDB or using Prisma Studio
db.users.updateOne(
  { email: "admin@uraerotech.com" },
  { $set: { role: "ADMIN" } }
)
```

2. Or create a seed script to add admin users

## Future Enhancements

- Email notifications for orders and quotes
- Payment processing with Stripe
- Product reviews and ratings
- Wishlist functionality
- Advanced search and filtering
- Inventory management alerts
- Multi-language support
- Real-time order tracking

## License

This project is proprietary software for UR Aerotech.

## Support

For support, email support@uraerotech.com or contact our team.
