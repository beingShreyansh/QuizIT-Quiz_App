const validatePassword = (password, automaticLogin = false) => {
  if (!automaticLogin) {
    if (password.length < 8) return "Password should be at least 8 characters!";
    if (!/[A-Z]/.test(password)) {
      return "Password should contain at least one uppercase letter.";
    }
    if (!/[a-z]/.test(password)) {
      return "Password should contain at least one lowercase letter.";
    }
    if (!/\d/.test(password)) {
      return "Password should contain at least one numeric digit.";
    }
    if (!/[!@#$%^&*()_+{}:;<>,.?/~\\-]/.test(password)) {
      return "Password should contain at least one special character.";
    }
  }

  // If the password passes validation or it's an automatic login
  return true;
};

// passwordValidation.js
const validateEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    return "Invalid email address.";
  }

  // If the email is valid
  return true;
};


const passwordValidations = {
  validatePassword,
  validateEmail,
};

export default passwordValidations;
