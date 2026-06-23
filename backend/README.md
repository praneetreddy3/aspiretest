# MentorMe Backend

Express/Node.js backend for MentorMe with JWT authentication and Google OAuth.

## Prerequisites

- Node.js
- MongoDB running locally on `mongodb://localhost:27017/mydatabase`
- Google Cloud OAuth 2.0 credentials

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment template and add your Google OAuth credentials:

```bash
cp .env.example .env
```

3. In [Google Cloud Console](https://console.cloud.google.com):
   - Create a project (or use an existing one)
   - Go to **APIs & Services → OAuth consent screen** → External → set app name → Save
   - Go to **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Authorized redirect URI: `http://localhost:5055/auth/google/callback`
   - Copy the Client ID and Client Secret into your `.env` file:

```
GOOGLE_CLIENT_ID=your_actual_client_id
GOOGLE_CLIENT_SECRET=your_actual_client_secret
```

4. Start the server:

```bash
node server.js
```

The server runs on port **5055**.

## Google OAuth Flow

1. Open `http://localhost:5055/auth/google` in your browser
2. Sign in with Google and approve access
3. You will be redirected to `http://localhost:3000/oauth-success?token=...`
4. The token in the URL is a JWT — use it the same way as a regular login token

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/register` | Register a new user |
| POST | `/login` | Login with username, password, and OTP |
| POST | `/forgotpassword` | Request password reset OTP |
| POST | `/resetpassword` | Reset password with OTP |
| GET | `/secure` | Protected route (requires JWT in `Authorization` header) |
| GET | `/auth/google` | Start Google OAuth login |
| GET | `/auth/google/callback` | Google OAuth callback (handled by Passport) |

## Troubleshooting

- **redirect_uri_mismatch** — Ensure the redirect URI in Google Cloud exactly matches `http://localhost:5055/auth/google/callback`
- **Cannot find module** — Run `npm install` again
- **`.env` not loading** — Confirm `require('dotenv').config()` is at the top of `server.js`
