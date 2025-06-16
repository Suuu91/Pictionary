import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Canvas from "./canvas";

const Game = ({token})  => {
  const [lobbyInfo, setLobbyInfo] = useState({})
  const [permission, SetPermission] = useState(true)
  const { id: lobbyId } = useParams();

  useEffect(()=> {
    const getLobbyInfo = async() => {
      const res = await fetch (`https://pictionary-183l.onrender.com/lobby/${lobbyId}`,{
        headers: {
          Authorization: `Bearer ${token}`}
      })
      if (res.status === 403) {
        SetPermission(false)
        alert("No permission, you are not in this room.");
        return;
      } 
      const currentLobby = await res.json()
      setLobbyInfo(currentLobby)
    }
    getLobbyInfo()
  },[lobbyId, token])

  return (
    <>
    {
      !permission || !token ?(
        <h1>No Permission, please log in or join room</h1>
      ):(
        <>
          <h1>{lobbyInfo.name}</h1>
          <Canvas/>
        </>
      )
    }
    </>
  )
}

export default Game