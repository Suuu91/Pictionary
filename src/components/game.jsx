import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../styles/game.module.css"
import Canvas from "./canvas";

const Game = ({token})  => {
  const [lobbyInfo, setLobbyInfo] = useState({})
  const [permission, SetPermission] = useState(true)
  const [showPopup, setShowPopup] = useState(false)
  const [showTopicInput, setShowTopicInput] = useState(false)
  const [drawingTopic, setDrawingTopic] = useState("")
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const { id: lobbyId } = useParams();

  useEffect(()=> {
    if(token && permission) {setShowTopicInput(true)};
    const getLobbyInfo = async() => {
      const res = await fetch (`https://pictionary-183l.onrender.com/lobby/${lobbyId}`,{
        headers: {
          Authorization: `Bearer ${token}`}
      })
      if (res.status === 403) {
        SetPermission(false)
        return;
      } 
      const currentLobby = await res.json()
      setLobbyInfo(currentLobby)
    }
    getLobbyInfo()
  },[lobbyId, token])

  const handleYes = async() => {
    try {
      await fetch(`https://pictionary-183l.onrender.com/lobby/${lobbyId}/leave`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
      });
    } catch (error) {
      console.error("Leave lobby failed", error);
    }
    navigate("/lobby")
  };

  const handleNo = () => 
    setShowPopup(false)

  const handleTopicSet = () => {
    setShowTopicInput(false)
  }
  

  return (
    <>
      <form id={styles.navBack}>
        <label 
          id={styles.backButton}
          onClick={()=>!permission || !token? navigate("/lobby"):setShowPopup(true)}>Exit</label>
      </form>

      {!permission || !token ? (
        <div id={styles.noPerm}>
          <h1>No Permission, please log in or join room</h1>
        </div>
       ):(
         <>
          <h1>{lobbyInfo.name}</h1>
          <Canvas/>
         </>
      )}

      {showPopup && (
        <div id={styles.popUp}>
          <div>
            <p>Drawing will not be saved, are you sure you want to exit?</p>
            <button onClick={handleYes}>Yes</button>
            <button onClick={handleNo}>No</button>
          </div>
         </div>
      )}

      {showTopicInput && (
         <div id={styles.topicPopup}>
           <div id={styles.topicInputBar}>
            <h1>Please decide a topic to draw</h1>
            <input
              ref={inputRef}
              type="text"
              placeholder="Enter your topic here"
              onChange={(e)=>{setDrawingTopic(e.target.value)}}
            />
            <div id={styles.topicButton}>
              <button onClick={handleTopicSet}>Submit</button>
             </div>
           </div>
        </div>
      )}
    </>
  )
}

export default Game