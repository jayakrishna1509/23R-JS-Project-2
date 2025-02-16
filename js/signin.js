// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
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

    // Validate email
    if (!emailInput.value) {
      showError(emailInput, "Email is required");
      isValid = false;
    } else if (!validateEmail(emailInput.value)) {
      showError(emailInput, "Please enter a valid email address");
      isValid = false;
    }

    // Validate password
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
        console.log("User signed in:", userCredential.user);

        // Store user info in localStorage
        const user = {
          name: userCredential.user.email.split("@")[0],
          email: userCredential.user.email,
        };
        localStorage.setItem("userinfo", JSON.stringify([user]));

        alert("SignIn Successful");
        form.reset();
        window.location.href = "./main.html"; // Redirect after successful login
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
