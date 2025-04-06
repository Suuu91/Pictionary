import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Lobby = (token) => {
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

  const getInputBar = () => {
    setISButtonVisible("none");
    setIsInputVisible("");
  };

  const createLobby = async(event) => {
    const loggedUser = localStorage.getItem(username)
    event.preventDefault()
    const res = await fetch('https://pictionary-183l.onrender.com/lobby', {
      method: `POST`,
      headers: {
        "Content-Type":"application/json",
        'Authorization': `Bearer ${token}` 
      },
      body:JSON.stringify({
        name:partyName,
        user:loggedUser
      })
    });
    if (res.ok) {
      const newLobby = await res.json()
      // navigate(`/lobby/${newLobby.id}`)
    }
    else {
      alert("please enter a valid party name")
    }
  }

  return (
    <>
    <h1>All Lobbies</h1>
    <section id="alllobby">
      <section>
        <button style={{display:isButtonVisible}} onClick={getInputBar}>Create Lobby</button>
        <form style={{display:isInputVisible}} id="createroom" onSubmit={createLobby}>
          <label>Party Name :</label> <input onChange={(e)=>{setPartyName(e.target.value)}}></input>
          <button id="createroom">Create</button>
        </form>
      </section>
      <h3 id="or">OR</h3>
      <section id="lobbylist">
        <h3>Join a Lobby</h3>
        {
          allLobby.map((singleLobby) => {
            const goSingleLobby = () => {
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

export default Lobby;