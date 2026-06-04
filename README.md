# Gym_Review_API
Gym review API with authorization and testing

This repository contains a backend API and a React client for reviewing gyms. The project uses Auth0 for authentication and Vitest for testing.

**Shared env reference:** See [/.env.example](.env.example) for the variables used by both client and backend.

## Quick Start

- **Deployed URLs** (when available):
  - Frontend: `https://gym-review-api.vercel.app` 
  - Backend API: `https://gym-review-api.onrender.com`
  - *(Update these URLs in `VITE_BACKEND_URL` and `CLIENT_ORIGIN` after deployment)*

## Setup

- **How to clone the repository**

	```bash
	git clone https://github.com/<your-username>/Gym_Review_API.git
	cd Gym_Review_API
	```

- **How to install dependencies**

	Backend:
	```bash
	cd backend
	npm install
	```

	Client:
	```bash
	cd client
	npm install
	```

- **How to configure environment variables**

	Copy the example file and fill in required secrets:

	```bash
	cp .env.example .env
	# Edit .env and backend/.env (or set environment variables in your environment)
	```

	- The shared example is available at [/.env.example](.env.example). Fill in `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`, and `AUTH0_SECRET` for the backend and the callback URLs for the client.

- **Generate the Prisma client:**

	```bash
	npx prisma generate
	```

- **Run migrations**
 (creates the tables in your database):

	```bash
	npx prisma migrate dev
	```
- **View your data in the browser**(optional):

	```bash
	npx prisma studio
	```

	- Note: You need a valid DATABASE_URL in backend/.env before running any Prisma commands. See .env.example for the expected format.

## Run Locally

- **Start the backend**

	```bash
	cd backend
	npm run dev
	```

- **Start the client**

	```bash
	cd client
	npm run dev
	```

	The client expects the backend at `VITE_BACKEND_URL` (default `http://localhost:3000`)

	## Run with Docker

Make sure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed.

1. **Create environment files**

   Copy the example file and fill in your Auth0 credentials:
   ```bash
   cp .env.example .env
   # Edit .env with your Auth0 credentials:
   # - AUTH0_DOMAIN
   # - AUTH0_CLIENT_ID
   # - AUTH0_CLIENT_SECRET
   # - AUTH0_SECRET
   ```

2. Build and start the containers:

```bash
	docker compose up --build -d
```

   - `-d` runs containers in the background
   - `--build` rebuilds images if needed


3. **Run database migrations**

   ```bash
   docker compose exec backend npx prisma migrate deploy
   ```

   This creates and initializes your database schema inside the container.

4. **Verify services are running**

   ```bash
   docker compose ps
   ```

   You should see the backend and client containers running.

### Accessing the Application

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:3000`
- **Database Studio** (Prisma): 
  ```bash
  docker compose exec backend npx prisma studio
  ```

## Testing

- **How to run the tests locally**

	Backend tests:
	```bash
	cd backend
	npm test
	```

	Client tests:
	```bash
	cd client
	npm test
	```

- **Screenshots**

	- Passing tests locally:
<img width="873" height="291" alt="image" src="https://github.com/user-attachments/assets/7ca5c8c3-8c78-4ab5-a5d6-99375ecdd3fe" />

		

## Authentication

- **Provider chosen:** Auth0

- **Why Auth0?**

	- The backend is already wired to `express-openid-connect` and Auth0 environment variables (`AUTH0_*`) are used in the project. Auth0 provides a managed, standards-compliant OAuth2 / OpenID Connect provider which simplifies secure authentication flows and session handling.

- **How authentication is implemented**

	- The backend uses `express-openid-connect` (see [backend/auth/auth.ts](backend/auth/auth.ts#L1-L999)) which performs the OpenID Connect flow and manages user sessions server-side using an encrypted session cookie. Routes that require authentication use a `requireAuth` middleware that checks `req.oidc.isAuthenticated()`.

	- The client uses the callback URL from the Auth0 configuration (`VITE_AUTH0_CALLBACK_URL`) to complete the login flow and then the server-side session cookie is used to authenticate API requests.

## Security Decisions (Checklist)

Below is a list of common security checklist items and an explanation of what the project does and why.

### 1. **Tokens & Storage: HttpOnly Session Cookies (Not localStorage)**

**What we do:**
- Tokens are **not** stored in `localStorage`, `sessionStorage`, or any client-side JavaScript-accessible storage
- Instead, we rely on the **HttpOnly, Secure session cookie** provided by `express-openid-connect`
- This cookie is set by the Auth0 middleware and automatically sent with every API request

### 2. **CORS: Locked Down to Specific Origin**

**What we do:**
```typescript
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,  // Allow cookies in cross-origin requests
}))
```

**Why this matters:**
- **Prevents unauthorized cross-origin requests**: Only requests from `CLIENT_ORIGIN` can access the API
- **Credentials flag**: `credentials: true` tells the browser to include cookies in cross-origin requests **only if the origin matches**

### 3. **Session Cookie: Secure & SameSite Flags**

**What we do:**
```typescript
session: {
  cookie: {
    sameSite: 'None' as const,  // Allow cross-site cookies (needed for deployed setup)
    secure: process.env.NODE_ENV === 'production',  // HTTPS only in production
  }
}
```

**Why this matters:**

**Secure flag:**
- In production, cookies are only sent over **HTTPS** (not HTTP)
- Automatically enforced in production (`NODE_ENV === 'production'`)

### 4. **Authentication Middleware on Protected Routes**

**What we do:**
```typescript
function requireAuth(req, res, next) {
  if (process.env.NODE_ENV === 'test' && req.headers.authorization === 'Bearer test-token') {
    return next()  // Allow tests to bypass Auth0
  }
  return requiresAuth()(req, res, next)  // Check Auth0 session in production
}

// Protected route example:
app.post('/gyms/:id/reviews', requireAuth, async (req, res) => {
  // Only authenticated users can post reviews
})

*Why this matters:**
- **Per-route protection**: Each sensitive endpoint explicitly requires authentication
- **Fail-secure**: Unauthenticated requests return `401 Unauthorized` instead of succeeding
- **Test-friendly**: Tests can use a test token to bypass Auth0 without mocking the middleware
- **Prevents direct API abuse**: Users cannot bypass authentication by calling the API directly (e.g., with curl or Postman)

**Unprotected routes:**
- `GET /gyms` - Anyone can read gym data
- `GET /gyms/:id` - Anyone can view individual gyms
- `GET /me` - Public endpoint, tells client if user is authenticated (doesn't reveal user data)

**Protected routes:**
- `POST /gyms` - Only authenticated users can add gyms
- `POST /gyms/:id/reviews` - Only authenticated users can post reviews

---


 
 
# Reflection:
**Implementation choices**: We chose Auth0 with express-openid-connect over Firebase because the session-based approach kept authentication logic server-side, which aligned with our security goals — no tokens exposed to client-side JavaScript. Using requiresAuth() middleware also made it straightforward to protect routes consistently without repeating auth logic in each handler.

For the database we used an in-memory array, which let us focus on testing and authentication rather than database setup and migrations. It also made integration tests simpler since there was no external dependency to seed or tear down.

**What was challenging**: The hardest part was protecting routes and then testing them correctly, especially in integration tests. We needed to verify that POST /gyms and POST /gyms/:id/reviews return 401 for unauthenticated requests — but without spinning up a real Auth0 session. We solved this by testing the raw HTTP responses against our app instance directly using node:http, which let us confirm the 401 behavior without mocking the auth middleware away entirely.
 
---
# Reflection update after production :
**Implementation choices:**
For the database I used Prisma with a relational database, which let me focus on testing and authentication rather than database setup. The ORM also helps prevent SQL injection attacks by parameterizing queries.

**What was challenging:**

Cookies and CORS configuration in production. 
Getting cookies and CORS to work correctly was trickier than expected, especially when deploying frontend and backend to separate domains. By default, browsers don't send cookies on cross-origin requests so if I set SameSite: Strict, cookies wouldn't work across domains but if I set SameSite: None without Secure (HTTPS), it fails in production.

Another challenge was managing different environment variables for local and production environments because I had to create a new app on Auth0 because now I'm working alone on the project and reconnect the app. I forgot to set some variables in a new environment which broke authentication silently.
