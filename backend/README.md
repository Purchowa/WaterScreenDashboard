# Water Screen Dashboard - Backend

The **backend** of the Water Screen Dashboard is a REST API server built using **Node.js** and **Express**, with **MongoDB** as the database. The backend is implemented in **TypeScript**.

## Prerequisites

Ensure you have the following installed before running the backend:
- **Node.js** (Latest LTS version recommended)
- **npm** (Node Package Manager)
- **MongoDB** (Local or remote instance)

## Setup

1. After clonging the repository navigate to the `backend` folder.
2. **Create a `.env` file** based on `.env-example`.
3. **Install dependencies**:
   ```sh
   npm install
   ```

## Running the Backend

For development mode with automatic restart on file changes (**nodemon** is used):
```sh
npm run watch
```

For production mode:
```sh
npm run build
npm start
```


## Notes

- Modify the `.env` file to match your database and server configuration.


