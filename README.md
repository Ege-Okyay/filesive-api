# Filesive Express Api

This is a basic Express TypeScript application that follows the Model-View-Controller (MVC) pattern. The application uses the following directory structure:

- `src`
  - `controllers`: Contains the controllers for the application. These controllers handle the incoming requests and produce the corresponding responses.
  - `middleware`: Contains the middleware for the application. These middlewares are executed before the corresponding controller is executed.
  - `models`: Contains the models for the application. These models define the structure of the data and interact with the database.
  - `routes`: Contains the routes for the application. These routes define the URLs and the corresponding HTTP methods for the incoming requests.
  - `app.ts`: The entry point for the application.

## Getting Started

To get started, follow these steps:

1. Clone the repository: `git clone https://github.com/Ege-Okyay/filesive-api.git`
2. Install dependencies: `npm install`
3. Start the application: `npm run dev`

The application should now be running on `http://localhost:3000`.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The app will automatically reload if you make changes to the code.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `dist` folder.\
It correctly bundles the app in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!