import { useState, useEffect } from "react";

const Lobby = () => {
  const [allLobby, setAllLobby] = useState([])

  useEffect(() => {
    const getAllRoom = async() => {
      const res = await fetch('https://pictionary-183l.onrender.com/lobby')
      const allLobbyInfo = await res.json()
      setAllLobby(allLobbyInfo)
    };
    getAllRoom()
  },[])

  return (
    <>
      <h1>All Lobbies</h1>
      <section>
        {
          allLobby.map((singleLobby) => {
            return (
              <section key={singleLobby.id}>
                <ul>{singleLobby.name}</ul>
              </section>
            )
          })
        }
      </section>
    </>
  )
}

export default Lobby;