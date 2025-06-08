import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "../styles/profile.module.css"

const Profile = ({setToken, token}) => {
  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem(`token`);
    setToken("")
    navigate("/login")
  }
  const navToLogin = () => {
    navigate("/login")
  }

  return (
    <>
      {
        token ? (
          <section className={styles.profile}>
            <h1>Profile</h1>
            <button onClick={handleLogout}>Logout</button>
          </section>
        ) : (
          <section className={styles.profile}>
            <h1>You are not logged in</h1>
            <button onClick={navToLogin}>Click to log in</button>
          </section>
        )
      }
    </>
  )
}

export default Profile