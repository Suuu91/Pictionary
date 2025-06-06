import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Profile = () => {
  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem(`token`);
    navigate("/login")
  }

  return (
    <>
      <h1>Profile</h1>
      <button onClick={handleLogout}>Logout</button>
    </>
  )
}

export default Profile