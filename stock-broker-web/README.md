# 💻 Stock Broker Web (Frontend)

This is the React-based frontend application for the **Enterprise Stock Brokerage System**, providing an intuitive and high-fidelity user interface for trading and administration. 

The application is bootstrapped using **Vite** for incredibly fast Hot Module Replacement (HMR) and optimized production builds.

## 🛠️ Technology Stack

- **React 18** - UI Component Library.
- **Vite 5** - Frontend Tooling and Bundler.
- **TailwindCSS** - Utility-first CSS framework for styling.
- **Axios** - Promise-based HTTP client for API requests.
- **React Router** - For Single Page Application (SPA) navigation.

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js version 18 or higher installed.

### Installation
Clone the repository and install the dependencies:
```bash
cd stock-broker-web
npm install
```

### Running the Development Server
To start the application locally with Hot Module Replacement:
```bash
npm run dev
```
The application will be accessible at `http://localhost:5173`.

> **Note on Backend Integration:** 
> By default, the application is configured to communicate with the Spring Boot backend running at `http://localhost:8080`. Ensure the backend server is running concurrently for full functionality (Authentication, Trading, etc.).

### Building for Production
To generate optimized static assets for production deployment:
```bash
npm run build
```
This will create a `dist/` directory containing the minified files, ready to be served by any static file server (e.g., Nginx, Apache, or Node.js Express).

## 🗂️ Project Structure
- `src/components/` - Reusable UI components (buttons, modals, charts).
- `src/pages/` - Top-level page components (Dashboard, Login, AdminPanel).
- `src/api/` - Axios configurations and API service functions.
- `src/context/` - React Context providers for state management (e.g., AuthContext).

## 🧑‍💻 Available Scripts

- `npm run dev` - Starts the dev server.
- `npm run build` - Builds the app for production.
- `npm run lint` - Runs ESLint to identify code formatting issues.
- `npm run preview` - Locally previews the production build.
