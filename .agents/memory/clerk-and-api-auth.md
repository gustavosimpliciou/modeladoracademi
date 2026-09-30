---
name: Academy authentication
description: Durable auth boundary and routing constraint for the Nativos Academy web app.
---

Use Replit-managed Clerk for user authentication. Browser API calls rely on Clerk's same-origin session cookies, not manually attached bearer tokens. The Clerk proxy middleware belongs before Express body parsers, and sign-in/sign-up routes must include the artifact base path because Clerk reads the full browser pathname.

**Why:** The app is served through a path-aware artifact proxy and Clerk's OAuth callbacks depend on the exact full path; switching to local auth or token handling would bypass the managed session and break published routing.

**How to apply:** When adding protected academy routes or account screens, keep Clerk as the auth source, keep public landing accessible while signed out, and use the existing base-aware sign-in and sign-up routes.