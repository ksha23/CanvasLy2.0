# CanvasLy

## Setup Locally

1. Create .env file in root of backend folder
2. Go to Google Developer Console and set up Web Application Credentials. Enable profile scope and the Google Calendar API
3. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, DB_CONNECTION_CLOUD, PORT, OUR_URL, OUR_REACT in .env file
4. Make sure ip is allowed if using MongoDB Atlas
5. Just "npm install" for backend and frontend and run npm start for both to start the servers!

## Example .env file

PORT=
DB_CONNECTION_CLOUD=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

OUR_URL=http://localhost:4000
OUR_REACT=http://localhost:5173
