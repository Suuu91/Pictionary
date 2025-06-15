import { useEffect } from "react";
import Canvas from "./canvas";

const Game = ({lobbyId})  => {
  useEffect(()=> {
    console.log(lobbyId)
    const getLobbyInfo = async() => {
      const res = await fetch (`https://pictionary-183l.onrender.com/lobby/${lobbyId}`)
      const lobbyInfo = await res.json()
      console.log(lobbyInfo)
    }
  },[])

  return (
    <>
      <Canvas/>
    </>
  )
}

export default Game