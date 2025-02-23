import { Route, Routes } from "react-router-dom"

import Home from "./components/home"
import Register from "./components/register"
import Login from "./components/login"

function App() {
  
  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
    </Routes> 
  )
}

export default App
