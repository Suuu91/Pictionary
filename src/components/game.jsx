import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../styles/game.module.css"
import Canvas from "./canvas";

const Game = ({token, user})  => {
  const [lobbyInfo, setLobbyInfo] = useState({})
  const [permission, SetPermission] = useState(true)
  const [showPopup, setShowPopup] = useState(false)
  const [showTopicInput, setShowTopicInput] = useState(false)
  const [topicToAdd, setTopicToAdd] = useState("")
  const [drawingTopic, setDrawingTopic] = useState("")
  const [paths, setPaths] = useState([]);
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const { id: lobbyId } = useParams();

  useEffect(() => {
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
      setDrawingTopic(currentLobby.title)
      if(token && permission) {
        if(!currentLobby.title) {setShowTopicInput(true)}
      };
    };
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

  const handleTopicSet = async() => {
    const res = await fetch(`https://pictionary-183l.onrender.com/lobby/${lobbyId}/title`, {
      method:"POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title:topicToAdd
      })
    })
    const lobbyInfo = await res.json()
    setDrawingTopic(lobbyInfo.lobby.title)
    setShowTopicInput(false)
  };

  const handleGetRandom = async() => {
    try {
      const res = await fetch("https://pictionary-183l.onrender.com/topics/random", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const randomTopicInfo = await res.json();
      await fetch(`https://pictionary-183l.onrender.com/lobby/${lobbyId}/title`, {
        method:"POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title:randomTopicInfo.text
        })
      })
      setDrawingTopic(randomTopicInfo.text)
      alert(`Your Topic is ${randomTopicInfo.text}`)
      setShowTopicInput(false)
    } catch (error) {
      console.error("error:", error)
    };
  };

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
          <form id={styles.topicForm}>
            <label 
              id={styles.topic} 
              onClick={() => {
                if (paths.length === 0) setShowTopicInput(true)
              }}
              style={{
                opacity: paths.length>0 ? 0.5 : 1,
                pointerEvents: paths.length > 0 ? 'none' : 'auto'
              }}
            >
              {drawingTopic}
            </label>
          </form>
          <Canvas user={user} paths={paths} setPaths={setPaths}/>
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
            <span id={styles.xButton} onClick={()=>setShowTopicInput(false)} role="button">❌</span>
            <h1>Please decide a topic to draw</h1>
            <input
              ref={inputRef}
              type="text"
              placeholder="Enter your topic here"
              onChange={(e)=>{setTopicToAdd(e.target.value)}}
            />
            <div id={styles.topicButton}>
              <button onClick={handleTopicSet}>Submit</button>
            </div>
            <div>
              <p>Don't Have An Idea?</p>
              <form id={styles.randomTopicForm}>
                <label id={styles.getRandomTopic} onClick={handleGetRandom}>Get A Random Topic</label>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Game