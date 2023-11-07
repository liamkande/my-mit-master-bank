# My Bank Web Application

This represents the culmination of my academic journey in the prestigious MIT Professional Certificate program in Coding: Full Stack Development – a capstone project that showcases my mastery of cutting-edge technology and programming expertise, solidifying my status as a forward-thinking and accomplished Full Stack Software Engineer.

## Features

- User registration and authentication using Firebase Authentication.
- Account creation and management.
- Deposit and withdraw money from user accounts.
- View account balances.
- A simple user interface for interacting with the bank.
- Data persistence using Firebase Firestore.

## Technologies Used

- Firebase: Firebase Authentication for user management and Firebase Firestore for data storage.
- React: Front-end framework for building the web application.
- Express (Development): Used for setting up a simple server for development.
- Jest (Development): Used for testing.
- JavaScript: Programming language used for the application.
- dal (Development): Data access layer for interacting with the database.
- react-router-dom: Used for routing.
- react-bootstrap: Used for styling. 
- Docker (Optional): Containerization for easy deployment.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed.
- Firebase project set up with Authentication and Firestore enabled.
- Docker (optional, for containerization).

## Getting Started

1. Clone this repository to your local machine.
git clone https://github.com/liamkande/my-mit-master-bank

## Available Scripts

In the project directory, you can run:

### `npm start` for backend
### `npm client` for frontend

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
make sure to add your firebase serviceAccountKey.json file to the backend folder.
you can generate your serviceAccountKey.json file from your firebase project settings.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\


### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

### Deployed app Link: 
https://my-mit-bank-app.web.app

### Docker image link (Optional): 
`cd backend && docker build -t my-bank-app . && docker run -p 8080:8080 my-bank-app`