# CRM - Multi-Channel Customer Relationship Management

A multi-channel CRM for wholesale businesses with WhatsApp + Email integration and AI-powered automation.

## Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma

## Project Structure

```
crm/
├── client/          # React frontend
├── server/          # Express backend
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── app.ts
│   └── prisma/
└── README.md
```

## Setup

### Backend

```bash
cd server
npm install
cp .env.example .env  # Configure your database URL
npx prisma migrate dev
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

## Environment Variables

See `server/.env.example` for required variables.
