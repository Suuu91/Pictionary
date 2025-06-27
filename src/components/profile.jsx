import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "../styles/profile.module.css"

const Profile = ({setToken, token, setUserId, userId, setUser}) => {
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState({})
  const [showTopicSubmit, setShowTopicSubmit] = useState(false)
  const [topicToSub, setTopicToSub] = useState("")
  const [allPendingTopics, setAllPendingTopics] = useState([])

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
    localStorage.removeItem(`user`);
    setToken("");
    setUserId("");
    setUser("")
    navigate("/login");
  }

  const navToLogin = () => {
    navigate("/login")
  }

  const handleBack = () => {
    navigate("/lobby")
  }

  const handleTopicSub = async() => {
    setShowTopicSubmit(true);
    if (userInfo.role === "ADMIN") {
      try {
        const res = await fetch("https://pictionary-183l.onrender.com/topicsubmit", {
          methods: "GET",
          headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
          },
        });
        const allTopicsInfo = await res.json()
        setAllPendingTopics(allTopicsInfo)
      } catch (error) {
        console.error("error:", error)
      }
    }
  }

  const submitTopic = async() => {
    try {
      const res = await fetch("https://pictionary-183l.onrender.com/topicsubmit", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body:JSON.stringify({text:topicToSub})
      });
      if (res.ok) {
        alert (`Your topic has been submitted, thank you for your contribution!`)
        setShowTopicSubmit(false)
      }
    } catch (error) {
        console.error("error:", error)
    };
  };

  const handleApprove = async(topicId) =>{
    try {
      const res = await fetch("https://pictionary-183l.onrender.com/topicsubmit/approve", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          id: topicId,
          approve: true
        })
      });
      if (res.ok) {
        setAllPendingTopics(prevTopics => 
          prevTopics.filter(topic => topic.id !== topicId)
        )
      }
    } catch (error) {
      console.error("Error:", error)
    };
  };

  const handleReject = async(topicId) => {
    try {
      const res = await fetch("https://pictionary-183l.onrender.com/topicsubmit/approve", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          id: topicId,
          approve: false
        })
      });
      if (res.ok) {
        setAllPendingTopics(prevTopics => 
          prevTopics.filter(topic => topic.id !== topicId)
        )
      }
    } catch (error) {
      console.error("Error:", error)
    };
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
            <div id={styles.topicSubPop}>
              <div id={styles.topicSubBar}>
                <span id={styles.xButton} onClick={()=>setShowTopicSubmit(false)} role="button">❌</span>
                <h1>Pending Topics</h1>
                {
                  allPendingTopics.map((singlePendingTopic)=>{
                    return (
                      <div key={singlePendingTopic.id} id={styles.pendingTopics}>
                        <span>{singlePendingTopic.text}</span>
                        <button onClick={()=>handleApprove(singlePendingTopic.id)}>Approve</button>
                        <button onClick={()=>handleReject(singlePendingTopic.id)}>Reject</button>
                      </div>
                    )
                  })
                }
              </div>
            </div>
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