// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import {
  getAuth,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js"; // ✅ fixed import

// Your Firebase configuration
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

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("resetPasswordForm");
  const emailInput = document.getElementById("email");
  const currentPasswordInput = document.getElementById("currentPassword");
  const newPasswordInput = document.getElementById("newPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const successNotification = document.getElementById("successNotification");

  function showError(input, message) {
    input.setCustomValidity(message);
    input.reportValidity();
  }

  function clearError(input) {
    input.setCustomValidity("");
  }

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    let isValid = true;

    clearError(emailInput);
    clearError(currentPasswordInput);
    clearError(newPasswordInput);
    clearError(confirmPasswordInput);

    // Validate email
    if (!emailInput.value) {
      showError(emailInput, "Please fill out this field");
      isValid = false;
    } else if (!validateEmail(emailInput.value)) {
      showError(emailInput, "Please enter a valid email");
      isValid = false;
    }

    // Validate current password
    if (!currentPasswordInput.value) {
      showError(currentPasswordInput, "Please fill out this field");
      isValid = false;
    }

    // Validate new password
    if (!newPasswordInput.value) {
      showError(newPasswordInput, "Please fill out this field");
      isValid = false;
    } else if (newPasswordInput.value.length < 6) {
      showError(newPasswordInput, "Password must be at least 6 characters");
      isValid = false;
    }

    // Validate confirm password
    if (!confirmPasswordInput.value) {
      showError(confirmPasswordInput, "Please fill out this field");
      isValid = false;
    } else if (newPasswordInput.value !== confirmPasswordInput.value) {
      showError(confirmPasswordInput, "Passwords do not match");
      isValid = false;
    }

    if (isValid) {
      try {
        const user = auth.currentUser;
        if (!user) {
          throw new Error("No user is currently signed in");
        }

        // Create credentials and reauthenticate
        const credential = EmailAuthProvider.credential(
          emailInput.value,
          currentPasswordInput.value
        );

        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPasswordInput.value);

        successNotification.style.display = "block";
        form.reset();
        setTimeout(function () {
          window.location.href = "signin.html";
        }, 3000);
      } catch (error) {
        console.error("Error updating password:", error);

        if (error.code === "auth/wrong-password") {
          showError(currentPasswordInput, "Incorrect current password");
        } else if (error.code === "auth/user-mismatch") {
          showError(emailInput, "Email does not match current user");
        } else {
          alert(`Password update failed: ${error.message}`);
        }
      }
    }
  });

  // Clear errors on focus
  [emailInput, currentPasswordInput, newPasswordInput, confirmPasswordInput].forEach(
    (input) => {
      input.addEventListener("focus", () => clearError(input));
    }
  );

  // Real-time validation
  emailInput.addEventListener("input", function () {
    if (this.value && !validateEmail(this.value)) {
      showError(this, "Please enter a valid email");
    } else {
      clearError(this);
    }
  });

  newPasswordInput.addEventListener("input", function () {
    if (this.value && this.value.length < 6) {
      showError(this, "Password must be at least 6 characters");
    } else {
      clearError(this);
    }
  });

  confirmPasswordInput.addEventListener("input", function () {
    if (this.value && this.value !== newPasswordInput.value) {
      showError(this, "Passwords do not match");
    } else {
      clearError(this);
    }
  });
});