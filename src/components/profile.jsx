import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "../styles/profile.module.css"

const Profile = ({setToken, token, setUserId, userId}) => {
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState({})
  const [showTopicSubmit, setShowTopicSubmit] = useState(false)
  const [topicToSub, setTopicToSub] = useState("")

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

  const handleTopicSub = () => {
    setShowTopicSubmit(true)
  }

  const submitTopic = async() => {
    const res = await fetch("https://pictionary-183l.onrender.com/topicsubmit", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body:JSON.stringify({text:topicToSub})
    });
    const submittedTopic = await res.json()
    console.log(submittedTopic)
    setShowTopicSubmit(false)
  }

  return (
    <>
      <form id={styles.backNav}>
        <label id={styles.back} onClick={handleBack}>Back</label>
      </form>

      {token ? (
        <div className={styles.profile}>
          <h1>Profile</h1>
          <h3>User: {userInfo.username}</h3>
          <h3>Email: {userInfo.email}</h3>
          <button onClick={handleLogout}>Logout</button>
          <div>
            {userInfo.role === "ADMIN"? (
              <form className={styles.topicSub}>
                <label className={styles.topic} onClick={handleTopicSub}>Show All Submitted Topics</label>
              </form>
            ): (
              <form className={styles.topicSub}>
                <label className={styles.topic} onClick={handleTopicSub}>Click to Submit a Topic!</label>
              </form>
            )}
          </div>
        </div>
        ) : (
          <div className={styles.profile}>
            <h1>You are not logged in</h1>
            <button onClick={navToLogin}>Click to log in</button>
          </div>
      )}

      {showTopicSubmit && (
        <div>
          {userInfo.role === "ADMIN"?(
            <h1>All Pending Topics</h1>
          ): (
            <div id={styles.topicSubPop}>
              <div id={styles.topicSubBar}>
                <span id={styles.xButton} onClick={()=>setShowTopicSubmit(false)} role="button">❌</span>
                <h1>Contribute Your Idea !</h1>
                <input
                  type="text"
                  placeholder="Enter topic to submit"
                  onChange={(e)=>{setTopicToSub(e.target.value)}}
                />
                <div id={styles.topicButton}>
                  <button onClick={submitTopic}>Submit</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default Profile