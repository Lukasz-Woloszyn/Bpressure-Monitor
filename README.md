# React + Vite + Firebase

## Engineering Thesis
**Title:** A web application facilitating the recording and analysis of blood pressure test results

**University:** Cracow University of Technology - WIEIK 

**Author:** Łukasz Wołoszyn 

**Year:** 2024

## Main Features
- Adding, editing, and deleting blood pressure test results
- Generating reports (PDF, XLSX, CSV, TXT)
- Email notifications
- Generating chart and statistics
- Toast notification about abnormal results
- Sending messages to app support

## Tech Stack
- **Frontend:** React with Vite for fast development and HMR (Hot Module Replacement)
- **Backend:** Firebase for authentication and database
- **Server:** Express for sending email notification and support
- **Other Tools:** ESLint, Toastify, Express, CORS, Axios, Sass, Jest, Jspdf, Papaparse

## Getting Started

### Netlify
For now application is deployed on Netlify server. 
If you want to run this code locally:
- Replace your enviroment variables: App Tokens, Mailtrap API Token, Mailtrap Endpoint URL (src/firebaseConfig.js; netlify/functions/send-contact-email.js, send-email.js).
- Change your POST URL to local in src/components/common/Help/index.jsx: line 22
- Change your POST URL to local in src/helpers/sendEmailNotification.jsx: line 15

### Frontend

1. Clone the repository:
    ```bash
    git clone [repo link]
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm run dev
    ```

4. Build the project for production:
    ```bash
    npm run build
    ```

### Backend LOCAL

To run the email server:

1. Navigate to the `/server` directory:
    ```bash
    cd server
    ```

2. Install backend dependencies:
    ```bash
    npm install
    ```

3. Start the server:
    ```bash
    node server.js
    ```



## Vite + React Plugins

This setup includes two official Vite plugins:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md): Uses [Babel](https://babeljs.io/) for Fast Refresh.
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc): Uses [SWC](https://swc.rs/) for Fast Refresh.
