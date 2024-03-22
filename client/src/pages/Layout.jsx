import React from "react";
import Navbar from "../components/Navbar/Navbar";

const Layout = ({ Children }) => {
  return (
    <>
      <Navbar />
      <Children/>
    </>
  );
};

export default Layout;