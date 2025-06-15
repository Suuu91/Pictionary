import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/lobby.module.css"
import ProfNav from "./profNav";

const Lobby = ({token, setLobbyId}) => {
  const [allLobby, setAllLobby] = useState([]);
  const [isButtonVisible, setISButtonVisible] = useState("");
  const [isInputVisible, setIsInputVisible] = useState("none");
  const [partyName, setPartyName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getAllRoom = async() => {
      const res = await fetch('https://pictionary-183l.onrender.com/lobby')
      const allLobbyInfo = await res.json()
      setAllLobby(allLobbyInfo)
    };
    getAllRoom()
  },[])

  const getInputBar = (e) => {
    e.preventDefault()
    setISButtonVisible("none");
    setIsInputVisible("");
  };

  const createLobby = async(event) => {
    event.preventDefault()
    const res = await fetch('https://pictionary-183l.onrender.com/lobby', {
      method: `POST`,
      headers: {
        "Content-Type":"application/json",
        'Authorization':`Bearer ${token}` 
      },
      body:JSON.stringify({
        name:partyName
      })
    });
    const newLobby = await res.json()
    if (res.ok) {
      setLobbyId(newLobby.lobby.id)
      navigate(`/lobby/${newLobby.lobby.id}`)
    } else if (res.status === 401) {
    alert("You must be logged in to create a lobby");
    } else {
      alert("please enter a valid party name")
    }
  }

  return (
    <>
    <ProfNav/>
    <h1>All Lobbies</h1>
    <section id={styles.alllobby}>
      <section>
        <button style={{display:isButtonVisible}} onClick={getInputBar}>Create Lobby</button>
        <form style={{display:isInputVisible}} id={styles.createroom} onSubmit={createLobby}>
          <label>Party Name :</label> <input onChange={(e)=>{setPartyName(e.target.value)}}></input>
          <button id={styles.createroom}>Create</button>
        </form>
      </section>
      <h3>OR</h3>
      <section id={styles.lobbylist}>
          <h3>Join a Lobby</h3>
        {
          allLobby.map((singleLobby) => {
            const goSingleLobby = () => {
              setLobbyId(singleLobby.id)
              navigate(`/lobby/${singleLobby.id}`)
            }
            return (
              <section key={singleLobby.id} onClick={goSingleLobby}>
                <ul>{singleLobby.name}</ul>
              </section>
            )
          })
        }
      </section>
    </section>
    </>
  )
}

export default Lobby