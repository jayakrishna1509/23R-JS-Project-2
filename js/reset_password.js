// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import {
  getAuth,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

// Your Firebase configuration
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
      showError(emailInput, "Please fill out this field");
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
      showError(newPasswordInput, "Please fill out this field");
      isValid = false;
    }

    // Validate confirm password
    if (!confirmPasswordInput.value) {
      showError(confirmPasswordInput, "Please fill out this field");
      isValid = false;
    } else if (newPasswordInput.value !== confirmPasswordInput.value) {
      showError(confirmPasswordInput, "Please fill out this field");
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
          showError(currentPasswordInput, "Please fill out this field");
        } else if (error.code === "auth/user-mismatch") {
          showError(emailInput, "Please fill out this field");
        } else {
          showError(emailInput, "Please fill out this field");
        }
      }
    }
  });

  emailInput.addEventListener("focus", () => clearError(emailInput));
  currentPasswordInput.addEventListener("focus", () =>
    clearError(currentPasswordInput)
  );
  newPasswordInput.addEventListener("focus", () =>
    clearError(newPasswordInput)
  );
  confirmPasswordInput.addEventListener("focus", () =>
    clearError(confirmPasswordInput)
  );

  // Add input event listeners for real-time validation
  emailInput.addEventListener("input", function () {
    if (this.value && !validateEmail(this.value)) {
      showError(this, "Please fill out this field");
    } else {
      clearError(this);
    }
  });

  newPasswordInput.addEventListener("input", function () {
    if (this.value && this.value.length < 6) {
      showError(this, "Please fill out this field");
    } else {
      clearError(this);
    }
  });

  confirmPasswordInput.addEventListener("input", function () {
    if (this.value && this.value !== newPasswordInput.value) {
      showError(this, "Please fill out this field");
    } else {
      clearError(this);
    }
  });
});
