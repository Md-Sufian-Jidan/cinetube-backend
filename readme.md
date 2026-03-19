Started the project

setup the project
// "dev": "ts-node-dev --respawn --transpile-only src/server.ts",


# 🔐 Authentication & Seeding

> This project uses **[Better Auth](https://better-auth.com)** with **Prisma** to handle authentication and user management, along with a seeding system to bootstrap initial users.

---

## 📋 Table of Contents

- [Seed Admin](#-seed-admin)
- [Normal User Registration](#-normal-user-registration)
- [Architecture Notes](#-architecture-notes)
- [Summary](#-summary)

---

## 🌱 Seed Admin

### Purpose

The `seedAdmin` script creates a default **Admin** user in the system, ensuring:

- The system always has at least one admin
- Admins can access and manage protected resources
- No manual database insertion is required

### How It Works

1. Checks if an admin already exists via Prisma
2. If not, creates one using the Better Auth signup API
3. After creation:
   - Marks the user as **email verified**
   - Sets status to **`ACTIVE`**
4. The script is **idempotent** — safe to run multiple times

### Run Seed Script

```bash
pnpm seed:admin
```

### Environment Variables

Set the following in your `.env` file before running:

```env
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@1234
```

> ⚠️ These variables are **required**. The script will throw if either is missing or empty.

### Key Features

| Feature | Details |
|---|---|
| Secure creation | Uses Better Auth for password hashing & signup |
| Duplicate prevention | Skips if a super admin already exists |
| Email auto-verified | No manual verification step needed |
| Failure cleanup | Rolls back orphaned auth user on transaction failure |

---

## 👤 Normal User Registration

### Purpose

Normal users register themselves via the public authentication API. They can:

- Sign up independently
- Access public features
- Be assigned default role and status automatically

### How It Works

1. User sends a `POST` request to the signup endpoint
2. Better Auth handles password hashing, validation, and user creation

### Signup Endpoint

```
POST /api/auth/sign-up/email
```

**Request Body:**

```json
{
  "name": "Test User",
  "email": "testuser@example.com",
  "password": "Test@1234",
  "role": "USER"
}
```

> ✅ No need to send other's details — they will set automatically by the system.

### Notes

- Email verification is **enabled**
- Password must be **at least 6 characters**
- Role and status are handled server-side — do not send them from the client

---

## 🧠 Architecture Notes

- **Better Auth** manages all authentication logic (signup, hashing, sessions)
- **Prisma** handles all database interactions
- Auth and database layers are intentionally **kept separate** for flexibility
- Seed scripts are used for **controlled, reproducible environment setup**

---

## 🚀 Summary

| Feature | Description |
|---|---|
| **Seed Admin** | Creates a default super admin user via script |
| **User Signup** | Public API for self-registration |
| **Auth Provider** | Better Auth (with Prisma adapter) |