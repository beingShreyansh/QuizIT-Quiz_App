import React from "react";
import UserHistory from "./UseHistory";
import Navbar from "../../../components/Navbar/Navbar";
const UserHistoryStats = () => {
  return (
    <>
      <Navbar />
      <center>
        <h2>User Statistics</h2>
      </center>
      <UserHistory />
    </>
  );
};

export default UserHistoryStats;
