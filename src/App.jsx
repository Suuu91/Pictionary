import { Route, Routes, useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect} from "react"

import Home from "./components/home"
import Register from "./components/register"
import Login from "./components/login"
import Lobby from "./components/lobby"
import Game from "./components/game"
import Profile from "./components/profile"


function App() {
  const [token, setToken] = useState(localStorage.getItem(`token`))
  const [userId, setUserId] = useState(localStorage.getItem(`userId`))
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!token) return;
    const checkToken = async() => {
      try {
        const res = await fetch('https://pictionary-183l.onrender.com/validate-token', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const validation = await res.json();
          if (validation.valid === true) {
            if (location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/")
              navigate("/lobby")
          }
        } else {
          alert(`session expired, please login again`)
          setToken(null)
          setUserId(null)
          localStorage.removeItem("token")
          localStorage.removeItem("userId")
          navigate("/")
        }
      } catch (error) {
        console.error
      }
    } ;
    checkToken()
  },[])
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/register" element={<Register setUserId={setUserId} setToken={setToken}/>}/>
        <Route path="/login" element={<Login setUserId={setUserId} setToken={setToken}/>}/>
        <Route path="/lobby" element={<Lobby token={token}/>}/> 
        <Route path="/lobby/:id/" element={<Game token={token}/>}/>
        <Route path="/profile" element={<Profile userId={userId} setUserId={setUserId} token={token} setToken={setToken}/>}/>
      </Routes> 
    </>
  )
}

export default App
