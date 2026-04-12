# Video Call App

## Overview

This repository contains a full-stack video call application with both a user-facing client and an admin dashboard. It includes:

- `client/` — React + Vite frontend for users, now configured as a Progressive Web App (PWA).
- `admin/` — React + Vite admin dashboard for management and analytics.
- `server/` — Express backend with MongoDB, authentication, real-time socket support, and Cloudinary integration.

## Purpose

The project is built to provide a complete video and voice calling experience with:

- user authentication
- real-time messaging and call signaling
- group chat and call support
- an admin panel for managing users and application data
- PWA-ready client for installable mobile and desktop experiences

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, Redux Toolkit
- Backend: Express, Node.js, MongoDB, Socket.IO
- Media: WebRTC and real-time socket signaling
- Deployment: Vite production build + Express server
- PWA: `vite-plugin-pwa`

## What was updated for production readiness

- `client/` now includes a valid PWA manifest plus service worker configuration via `vite-plugin-pwa`.
- `server/server.js` now supports production static serving of the built client app and places error middleware after all routes.
- `.env.example` now includes production-ready sample values and frontend API configuration.

## Prerequisites

- Node.js 18+ installed
- npm installed
- MongoDB connection string
- Cloudinary account credentials

## Clone the repository

```bash
git clone <repo-url> "video call app"
cd "video call app"
```

## Environment setup

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

### Required environment variables

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

VITE_API_BASE_URL=http://localhost:5000/api
```

- `MONGO_URI` — your MongoDB connection URI
- `JWT_SECRET` — secret string for signing JWT tokens
- Cloudinary variables — used for image uploads and avatars
- `VITE_API_BASE_URL` — the backend URL used by both client and admin frontends

## Install dependencies

Install packages in each folder:

```bash
cd server
npm install

cd ../client
npm install

cd ../admin
npm install
```

## Run locally

### Server

```bash
cd server
npm run dev
```

### Client

```bash
cd client
npm run dev
```

### Admin

```bash
cd admin
npm run dev
```

## Build for production

### Client

```bash
cd client
npm run build
```

### Admin

```bash
cd admin
npm run build
```

### Server

The server can serve a production-built client app if `NODE_ENV=production` and `client/dist` exists:

```bash
cd server
NODE_ENV=production npm start
```

> On Windows, use a tool such as `cross-env` or set environment variables through PowerShell before running the command.

## Deployment notes

- Build the client and admin apps first.
- Ensure `MONGO_URI`, `JWT_SECRET`, and Cloudinary keys are set in production.
- If deploying the backend and frontend separately, update `VITE_API_BASE_URL` to point to the backend URL.
- The client is PWA-ready and will register a service worker when built.

## PWA details

The client app is configured with `vite-plugin-pwa` and includes:

- auto-update service worker registration
- offline caching for static assets
- installable web app settings
- standalone display mode

## Project structure

- `admin/` — admin dashboard source code
- `client/` — end user React app source code
- `server/` — Express backend and API logic
- `.env.example` — environment variable samples

## Troubleshooting

- If the frontend cannot reach the backend, verify `VITE_API_BASE_URL`.
- If authentication fails, confirm `JWT_SECRET` matches the server-side value.
- If the PWA is not installing, make sure the client build is generated and the app is served over HTTPS or localhost.

## Contact / next steps

Use this README as the starting point for deployments, custom environment setup, and local development.
Add real production domains and secrets before launch.
