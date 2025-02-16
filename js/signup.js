// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3Aqo1D1-cm-hoWLQAbNDnddeKhpzaJTs",
  authDomain: "tour-planner-fa16a.firebaseapp.com",
  projectId: "tour-planner-fa16a",
  storageBucket: "tour-planner-fa16a.firebasestorage.app",
  messagingSenderId: "705159543203",
  appId: "1:705159543203:web:cf35ffd74078adbbfc4216",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

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
        // Store in localStorage
        user_records.push(user);
        localStorage.setItem("users", JSON.stringify(user_records));

        // Firebase Authentication
        createUserWithEmailAndPassword(auth, user.email, user.password)
          .then((userCredential) => {
            // Signed up
            const firebaseUser = userCredential.user;
            console.log("User signed up:", firebaseUser);
            alert("SignUp Successful");
            form.reset();
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Signup error", errorCode, errorMessage);
            alert(`Signup failed: ${errorMessage}`);
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
