
# Config Management System

This repository contains a Config Management System that provides a web-based panel to manage application configurations and a REST API for retrieving configurations, including support for country-specific settings.

## Features

1. **Configuration Management Panel**:
   - Add, edit, delete configurations.
   - Manage default configurations and country-specific configurations.
   - Requires Bearer token authentication for accessing endpoints.

2. **Mobile Clients API**:
   - Retrieve configurations based on the client’s country and other parameters.
   - Requires `x-api-key` header for accessing endpoints.
   - Provides query parameter support for country-specific data.

3. **Country-Specific Configuration**:
   - Default configurations are returned when no country-specific value is provided.
   - Specific values for a parameter can be set and accessed for different countries.

---

## Accessing the Deployed Application

### 1. Deployed API
- **Base URL**: `http://config-management.eu-central-1.elasticbeanstalk.com/api`
- **Authentication**: Use `x-api-key` header for mobile client endpoints (sent through email).
- **Mobile Client Endpoints**:
  - `GET /mobileClients`: Fetch all configurations.
  - `GET /mobileClients?country=[countryCode]`: Fetch configurations specific to that country.

### 2. Deployed Panel
- **URL**: `http://config-management-frontend.s3-website.eu-central-1.amazonaws.com/`
- **Authentication**: Use your admin credentials to log in (sent through email).
- **Features**:
  - View, create, edit, and delete configurations.
  - Add and manage country-specific configurations.

---

## Running the Application Locally

You can run the application locally using Docker Compose.

### Prerequisites
1. Install [Docker](https://www.docker.com/products/docker-desktop) and [Docker Compose](https://docs.docker.com/compose/).
2. Clone this repository:
   ```bash
   git clone https://github.com/Se-Gu/Config-Management-App.git
   ```

3. Create a `.env` file in the root directory and populate it with the following environment variables:
   ```
   # Backend
   PORT=5000
   REDIS_URL=redis://redis:6379
   REDIS_CACHE_EXPIRATION=3600
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_PRIVATE_KEY="your_private_key"
   FIREBASE_CLIENT_EMAIL=your_client_email
   PREDEFINED_API_TOKEN=predefined_api_token

   # Frontend
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

### Running the App
1. Start the application:
   ```bash
   docker compose up
   ```
2. Access the application:
   - **Frontend**: `http://localhost:5173`
   - **Backend API**: `http://localhost:5000`


---

## Notes
- For the deployed API, make sure you have the required API keys and tokens.
- For local usage, ensure your `.env` file is correctly configured.
