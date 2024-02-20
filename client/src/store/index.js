const isAuthenticated = () => {
  const accessToken = localStorage.getItem("accessToken");
  const expirationTime = localStorage.getItem("expirationTime");

  if (accessToken && expirationTime) {
    const currentTime = Date.now();
    return currentTime < parseInt(expirationTime, 10);
  }

  return false;
};

const loggedInRole = () => {
  return localStorage.getItem("role");
};

const getUserInfo = () => {
  try {
    const userInfo = localStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error("Error parsing user info:", error);
    return null;
  }
};

const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("role");
  localStorage.removeItem("expirationTime");
  localStorage.removeItem("userInfo");
};

export { isAuthenticated, getUserInfo, logout, loggedInRole };
