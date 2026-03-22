# Katalon tests for AppDistributionWebsite

This folder contains a simple Katalon Studio test to verify login and access to the `Library` page.

Setup
- Open Katalon Studio and add a new project or import this folder into your project structure.
- In the active Profile (e.g., `default`), set the following Global Variables:
  - `BASE_URL` — e.g. `http://localhost:3000`
  - `TEST_EMAIL` — test account email
  - `TEST_PASSWORD` — test account password

Usage
1. Make sure the frontend is running (`pnpm dev` or `npm run dev` in `fe`).
2. In Katalon Studio, open the Test Case `katalon/testcases/LoginAndLibraryTest.groovy`.
3. Run the Test Case or add it to a Test Suite.

Notes
- The test uses dynamic XPath selectors to find the email/password inputs and the Sign In button. If your login page markup changes, update the XPath in the Test Case.
- For stronger server-side verification, consider using an API-based login that sets an HttpOnly cookie on the server side; this test uses the UI login flow.
