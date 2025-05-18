# IoT Alarm System

This repository contains both the frontend and backend components of the IoT Alarm System.

## Project Structure

- `alarm_system.fe/` - Frontend React application built with Vite
- `alarm_system.be/` - Backend Express server

## Local Development

For local development, run the frontend and backend separately:

1. Frontend:
   ```
   cd alarm_system.fe
   npm install
   npm run dev
   ```

2. Backend:
   ```
   cd alarm_system.be
   npm install
   npx nodemon src/server.js
   ```

## Deployment to Render

This application is configured for deployment to Render as a single service.

### Deployment Steps

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Sign up for or log in to [Render](https://render.com)
3. Create a new Web Service
4. Connect your Git repository
5. Use the following settings:
   - Build Command: `npm install && npm run build:client`
   - Start Command: `npm start`
   - Environment Variables:
     - `NODE_ENV`: `production`
     - `PORT`: `10000` (or whatever port Render assigns)
     - `MONGODB_URI`: Your MongoDB connection string
     - Add any other environment variables your application needs

### Automatic Deployment

This repository includes a `render.yaml` file that can be used for Blueprint deployments on Render.

## Environment Variables

Make sure to set the following environment variables in your Render dashboard:

- `MONGODB_URI`: Your MongoDB connection string
- Any other environment variables used in your application

## WebSocket Connection

For WebSocket connections in production, make sure to connect to the correct endpoint:

```javascript
const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const wsUrl = `${wsProtocol}//${window.location.host}/ws`;
const socket = new WebSocket(wsUrl);
``` 