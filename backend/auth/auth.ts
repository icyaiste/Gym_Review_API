import { auth } from "express-openid-connect";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 3000;
const clientCallbackUrl =
  process.env.AUTH0_REDIRECT_URI || "http://localhost:5173/callback";

const config = {
  authRequired: false,
  auth0Logout: false,
  idpLogout: false,
  secret:
    process.env.AUTH0_SECRET ||
    process.env.SECRET ||
    "dev-auth0-secret-change-me-dev-auth0-secret-change-me",
  baseURL: process.env.AUTH0_BASE_URL || `http://localhost:${port}`,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  issuerBaseURL:
    process.env.AUTH0_ISSUER_BASE_URL ||
    (process.env.AUTH0_DOMAIN ? `https://${process.env.AUTH0_DOMAIN}` : undefined),
  routes: {
    callback: "/callback",
    logout: false as const,
  },
  authorizationParams: {
    response_type: 'code',
    scope: 'openid profile email',
  },
};

export const authMiddleware = auth(config);