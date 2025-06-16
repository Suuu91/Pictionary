import { useState, useEffect } from "react";
import Canvas from "./canvas";

const Game = ({lobbyId, token})  => {
  const [lobbyInfo, setLobbyInfo] = useState({})
  useEffect(()=> {
    const getLobbyInfo = async() => {
      const res = await fetch (`https://pictionary-183l.onrender.com/lobby/${lobbyId}`,{
        headers: {
          Authorization: `Bearer ${token}`}
      })
      const currentLobby = await res.json()
      setLobbyInfo(currentLobby)
    }
    getLobbyInfo()
  },[lobbyId, token])

  return (
    <>
      <h1>{lobbyInfo.name}</h1>
      <Canvas/>
    </>
  )
}

export default Game