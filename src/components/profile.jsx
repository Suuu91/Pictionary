import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "../styles/profile.module.css"

const Profile = ({setToken, token, setUserId, userId}) => {
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState({})

  useEffect(() => {
    const getUser = async() => {
      const res = await fetch(`https://pictionary-183l.onrender.com/user/${userId}`, {
  headers: {
    Authorization: `Bearer ${token}`}
  });
      const user = await res.json()
      setUserInfo(user)
    };
    if(token) getUser()
  },[])

  const handleLogout = () => {
    localStorage.removeItem(`token`);
    localStorage.removeItem(`userId`);
    setToken("");
    setUserId("");
    navigate("/login");
  }
  const navToLogin = () => {
    navigate("/login")
  }

  const handleBack = () => {
    navigate("/lobby")
  }

  return (
    <>
      <form id={styles.backNav}>
        <label id={styles.back} onClick={handleBack}>Back</label>
      </form>
      {
        token ? (
          <section className={styles.profile}>
            <h1>Profile</h1>
            <h3>User: {userInfo.username}</h3>
            <h3>Email: {userInfo.email}</h3>
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