# HRMS - Human Resource Management System
HRMS Lite is a lightweight, web-based Human Resource Management System designed to handle essential HR operations for a small organization. The application allows an admin to manage employee records and track daily attendance through a simple, clean, and professional interface.

The system focuses on core functionality such as adding and managing employees, marking attendance, and viewing attendance history, while ensuring proper data validation, error handling, and persistent storage. It is built as a full-stack application with a RESTful backend and a responsive frontend connected to a live API.

HRMS Lite is intentionally scoped to remain simple, stable, and realistically usable, avoiding unnecessary complexity while demonstrating end-to-end full-stack development best practices.

---
## Workflow in Application
1. visit : https://hrms-lite-vone.vercel.app/
2. Visit landing page and click on Go to dashboard
3. For the first time user click on Setup workspace and fill all details(HR Id Must be unique for all)
4. Deploy the workspace
5. For the repeated user stays on access console and fill information that you fill at time of register
6. Access the dashboard overview page
7. Employees Tab has option to add new employees and make edit to employees information
8. Attendence Tab has option to mark attendence Present/Absent for the employees
9. Calender view is also there to go to previous dates to check the status
10. On clicking Full history in Attendence section HR will be able to select particular employee to see their all days attendence with total present days
    
---
## Tech Stack Used

### Frontend
- **React** – Component-based UI development
- **TypeScript** – Type-safe development for better maintainability
- **Vite** – Fast development server and optimized production builds
- **HTML5 & CSS3** – Application structure and styling
- **Reusable Components** – Modular components for dashboard, employee management, attendance tracking, and layout

### Backend / Services
- **Firebase** – Backend-as-a-Service used for:
  - Data storage and persistence
  - Managing employee and attendance records
- **Service Layer Architecture** – Centralized business logic implemented in `services/hrService.ts`

### Configuration & Tooling
- **Environment Variables (`.env.local`)** – Secure configuration management
- **TypeScript Configuration (`tsconfig.json`)** – Type checking and project configuration
- **Vite Configuration (`vite.config.ts`)** – Build and development setup
- **Git & GitHub** – Version control and source code hosting

### Deployment
- **Frontend Hosting** – Deployed using Vercel 

---
## Note:
- This project uses the Gemini API. To run it locally, you must generate and configure your own Gemini API key.
  
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
