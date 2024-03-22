// Spinner.js

import React from "react";
import "./Spinner.css";
const Spinner = () => {
  return (
    <div class="spinner-overlay">
      <div class="spinner">
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
      </div>
    </div>
  );
};

export default Spinner;
