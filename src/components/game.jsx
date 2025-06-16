import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Canvas from "./canvas";

const Game = ({token})  => {
  const [lobbyInfo, setLobbyInfo] = useState({})
  const { id: lobbyId } = useParams();

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