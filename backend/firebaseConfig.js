import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";


createUserWithEmailAndPassword(auth, email, password)

    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
  });

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    // ...
  } else {
    // User is signed out
    // ...
  }
});

const firebaseConfig = {
    apiKey: "AIzaSyDVUnKPEOIVT4JjvO4XXR5_oXxYqv5hmFM",
    authDomain: "revapp-bfb2c.firebaseapp.com",
    projectId: "revapp-bfb2c",
    storageBucket: "revapp-bfb2c.appspot.com",
    messagingSenderId: "933759176360",
    appId: "1:933759176360:web:e80d32b184611251b13c9d",
    measurementId: "G-MKYP338DRH"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const auth = getAuth(app);