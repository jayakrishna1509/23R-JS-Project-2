// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc
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
  const form = document.getElementById("signupForm");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");

  function validateEmail(email) {
    return email.includes("@");
  }

  function showError(input, message) {
    input.setCustomValidity(message);
    input.reportValidity();
  }

  function clearError(input) {
    input.setCustomValidity("");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let isValid = true;

    clearError(nameInput);
    clearError(emailInput);
    clearError(passwordInput);
    clearError(confirmPasswordInput);

    if (!nameInput.value) {
      showError(nameInput, "Name is required");
      isValid = false;
    }

    if (!emailInput.value || !validateEmail(emailInput.value)) {
      showError(emailInput, "Valid email is required");
      isValid = false;
    }

    if (!passwordInput.value) {
      showError(passwordInput, "Password is required");
      isValid = false;
    }

    if (!confirmPasswordInput.value) {
      showError(confirmPasswordInput, "Confirm password is required");
      isValid = false;
    }

    if (passwordInput.value !== confirmPasswordInput.value) {
      showError(confirmPasswordInput, "Passwords do not match");
      isValid = false;
    }

    if (isValid) {
      const user = {
        name: nameInput.value,
        email: emailInput.value,
        password: passwordInput.value,
      };

      let user_records = JSON.parse(localStorage.getItem("users")) || [];

      if (user_records.some((record) => record.email === user.email)) {
        showError(emailInput, "Email already exists");
      } else {

        // Store in localStorage (⚠ not secure but kept as you requested)
        user_records.push(user);
        localStorage.setItem("users", JSON.stringify(user_records));

        // Firebase Authentication
        createUserWithEmailAndPassword(auth, user.email, user.password)
          .then((userCredential) => {

            const firebaseUser = userCredential.user;

            // 🔥 Save user data in Firestore
            setDoc(doc(db, "users", firebaseUser.uid), {
              name: user.name,
              email: user.email,
              createdAt: new Date()
            });

            console.log("User signed up:", firebaseUser);
            alert("SignUp Successful");
            form.reset();
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            console.error("Signup error", errorCode, errorMessage);
            alert(`Signup failed: ${errorMessage}`);

            // Remove from localStorage if Firebase fails
            user_records.pop();
            localStorage.setItem("users", JSON.stringify(user_records));
          });
      }
    }
  });

  [nameInput, emailInput, passwordInput, confirmPasswordInput].forEach(
    (input) => {
      input.addEventListener("focus", () => clearError(input));
    }
  );
});