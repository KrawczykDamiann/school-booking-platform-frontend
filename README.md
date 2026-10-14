# Lessio — Lesson Booking Platform

Lessio is a web application that allows students to browse available lessons and book time slots. It also provides an administration interface for managing the platform.

## Features

### Student

- Sign in using a magic link sent to the user's email.

- Browse available subjects.

- View available lesson slots in an interactive calendar.

- Filter lessons by time of day.

- Navigate between calendar dates.

- View active bookings.

### Administrator

- Sign in using email and password.

- Access protected administration pages.

- Navigate the administration dashboard.

- Manage teacher-related information.

## Tech Stack

- React — UI development

- TypeScript — static typing

- React Router — client-side routing and protected routes

- SCSS Modules — component-scoped styling

- Axios — HTTP requests and REST API integration

- i18next — internationalization

- Git & GitHub — version control and collaboration

- Vite — development server and build tooling

## Demo

Live application: [Lessio](https://lessio.koder95.dpdns.org/login)

## Project Structure

The application is organized into reusable components, pages, layouts, and feature-specific logic.

```
src/
├── api/          # API client and requests
├── assets/       # Images, icons, and other static assets
├── components/   # Shared UI components
├── context/      # Shared React context
├── features/     # Feature-specific functionality
├── hooks/        # Custom React hooks
├── layouts/      # Application layouts
├── locales/      # Translation files and localization
├── modals/       # Modal components
├── pages/        # Route-level pages
├── services/     # Shared services
├── styles/       # Global styles
├── types/        # TypeScript types and interfaces
└── utils/        # Utility functions
```

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js (LTS version recommended)

- npm

- Access to the backend API

### Installation

1. Clone the repository:

`git clone https://github.com/KrawczykDamiann/school-booking-platform-frontend.git`

2. Navigate to the project directory:

`cd school-booking-platform-frontend`

3. Install dependencies:

`npm install`

4. Configure the environment variables required by the frontend to connect to the backend API. Check the project's API configuration and .env.example file, if available.

5. Start the development server:

`npm run dev`

6.Open the local URL displayed in the terminal.

## Backend

The backend is maintained in a separate repository and provides the REST API used by the frontend.

Backend repository: [Backend](https://github.com/koder95/school-booking-platform-backend)

Local development: the backend can be started using Docker Compose in the backend repository.

Make sure the frontend API configuration points to the appropriate backend URL for your environment.
