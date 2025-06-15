import { useEffect } from "react";
import Canvas from "./canvas";

const Game = ({lobbyId, token})  => {
  useEffect(()=> {
    const getLobbyInfo = async() => {
      const res = await fetch (`https://pictionary-183l.onrender.com/lobby/${lobbyId}`,{
        headers: {
          Authorization: `Bearer ${token}`}
      })
      const lobbyInfo = await res.json()
    }
    getLobbyInfo()
  },[])

  return (
    <>
      <Canvas/>
    </>
  )
}

export default Game