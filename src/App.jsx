import { Route, Routes,useNavigate} from "react-router-dom"
import { useState } from "react"

import Home from "./components/home"
import Register from "./components/register"
import Login from "./components/login"
import Lobby from "./components/lobby"
import Game from "./components/game"
import Profile from "./components/profile"


function App() {
  const [token, setToken] = useState(localStorage.getItem(`token`))
  const [userId, setUserId] = useState(localStorage.getItem(`userId`))
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/register" element={<Register setUserId={setUserId} setToken={setToken}/>}/>
        <Route path="/login" element={<Login setUserId={setUserId} setToken={setToken}/>}/>
        <Route path="/lobby" element={<Lobby token={token}/>}/> 
        <Route path="/game" element={<Game/>}/>
        <Route path="/profile" element={<Profile userId={userId} setUserId={setUserId} token={token} setToken={setToken}/>}/>
      </Routes> 
    </>
  )
}

export default App
