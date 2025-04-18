import { Route, Routes } from "react-router-dom"
import { useState } from "react"

import Home from "./components/home"
import Register from "./components/register"
import Login from "./components/login"
import Lobby from "./components/lobby"
import Game from "./components/game"

function App() {
  const [token, setToken] = useState(localStorage.getItem(`token`))
  
  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/register" element={<Register setToken={setToken}/>}/>
      <Route path="/login" element={<Login setToken={setToken}/>}/>
      <Route path="/lobby" element={<Lobby token={token}/>}/> 
      <Route path="/game" element={<Game/>}/>
    </Routes> 
  )
}

export default App
