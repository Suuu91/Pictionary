import { Route, Routes } from "react-router-dom"

import Home from "./components/home"
import Register from "./components/register"
import Login from "./components/login"
import Lobby from "./components/lobby"
import Game from "./components/game"

function App() {
  
  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/lobby" element={<Lobby/>}/>
      <Route path="/game" element={<Game/>}/>
    </Routes> 
  )
}

export default App
