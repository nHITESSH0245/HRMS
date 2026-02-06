# HRMS
Human Resource Management System

This project uses the Gemini API. To run it locally, you must generate and configure your own Gemini API key.

---

## Prerequisites
- Node.js (v18 or later recommended)
- npm
- Google account
- Gemini API key

---

## Steps to Get a Gemini API Key

1. Open your browser and go to:
   https://aistudio.google.com/

2. Sign in with your Google account.

3. In the left sidebar, click **Get API key**
   (or **API keys**, if visible).

4. Click **Create API key**.

5. Select an existing Google Cloud project
   or create a new project when prompted.

6. Your Gemini API key will be generated.

7. Copy the API key and store it securely.

---

## Steps to Run the Project Locally

1. Open the project folder in **VS Code**.

2. Install dependencies:
   ```
   npm install
3. Create a file named .env.local in the root directory.

   Add your Gemini API key:

   GEMINI_API_KEY=YOUR_GEMINI_API_KEY

4. Start the development server:
   ```
   npm run dev

5. Open your browser and visit:
   ```
   http://localhost:3000
