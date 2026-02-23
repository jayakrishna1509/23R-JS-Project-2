// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2TnHdt-Xzu9WCWWrq7uZCPoi1uXPk84c",
  authDomain: "tour-planner-js.firebaseapp.com",
  projectId: "tour-planner-js",
  storageBucket: "tour-planner-js.firebasestorage.app",
  messagingSenderId: "449021203433",
  appId: "1:449021203433:web:ed3dd40b0f35b0fe57b178"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);   // 🔥 Firestore initialized


document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("signinForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function showError(input, message) {
    input.setCustomValidity(message);
    input.reportValidity();
  }

  function clearError(input) {
    input.setCustomValidity("");
  }

  emailInput.addEventListener("input", function () {
    if (this.value && !validateEmail(this.value)) {
      showError(this, "Please enter a valid email address");
    } else {
      clearError(this);
    }
  });

  passwordInput.addEventListener("input", function () {
    if (this.value && this.value.length < 6) {
      showError(this, "Password must be at least 6 characters");
    } else {
      clearError(this);
    }
  });

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    let isValid = true;

    clearError(emailInput);
    clearError(passwordInput);

    if (!emailInput.value) {
      showError(emailInput, "Email is required");
      isValid = false;
    } else if (!validateEmail(emailInput.value)) {
      showError(emailInput, "Please enter a valid email address");
      isValid = false;
    }

    if (!passwordInput.value) {
      showError(passwordInput, "Password is required");
      isValid = false;
    }

    if (isValid) {
      const email = emailInput.value;
      const password = passwordInput.value;

      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const firebaseUser = userCredential.user;
        console.log("User signed in:", firebaseUser);

        // 🔥 Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

        if (userDoc.exists()) {
          const userData = userDoc.data();

          // Store user info in localStorage
          localStorage.setItem("userinfo", JSON.stringify([userData]));
        }

        alert("SignIn Successful");
        form.reset();
        window.location.href = "./main.html";

      } catch (error) {
        console.error("SignIn error:", error);

        if (
          error.code === "auth/user-not-found" ||
          error.code === "auth/wrong-password"
        ) {
          showError(emailInput, "Invalid Email or Password");
        } else {
          alert(`SignIn failed: ${error.message}`);
        }
      }
    }
  });

  [emailInput, passwordInput].forEach((input) => {
    input.addEventListener("focus", () => clearError(input));
  });
});