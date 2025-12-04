/*
  Firebase initialization file.

  NOTE: You must provide real Firebase config values in environment variables
  (recommended) or paste them directly here for local development. This file
  initializes the Firebase App and (optionally) Analytics if running in a
  browser environment.

  How to configure:
  - Create a Firebase project with Analytics (GA4)
  - Add a web app and copy the config
  - In development, you can set env variables in Vite as VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, etc.
*/
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// NOTE: you provided the following Firebase web-app configuration. For local
// convenience these are included as fallbacks so the app initializes if you
// haven't yet created a `.env.local`. Prefer setting the VITE_* vars in
// `.env.local` to avoid committing real keys.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBle9Kr-mI4-GQGIDMd9QsXZwFafoRzFvM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "cocha-turismo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "cocha-turismo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "cocha-turismo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "814334659870",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:814334659870:web:8a8f2c7a4cb40598af8d0f",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-X052853P53",
};

const app = initializeApp(firebaseConfig);

// Analytics must run only in the browser (window available)
let analytics;
if (typeof window !== "undefined") {
  try {
    analytics = getAnalytics(app);
  } catch (err) {
    // Analytics may throw in non-supported environments, swallow errors in server builds
    // eslint-disable-next-line no-console
    console.warn("Firebase analytics not available", err);
  }
}

export { app, analytics };
