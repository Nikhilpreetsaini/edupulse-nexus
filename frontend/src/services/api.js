import axios from 'axios';

// Create an axios instance with a base URL pointing at the backend
// During development the backend runs on port 8000 when launched via uvicorn.
// Adjust the URL if you deploy the backend behind a different host or port.
const api = axios.create({
  baseUR: t'https://edupulse-nexus-backend.onrender.com',
});

export default api;
