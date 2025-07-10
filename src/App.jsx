import { Route, Routes, useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect} from "react"

import Home from "./components/home"
import Register from "./components/register"
import Login from "./components/login"
import Lobby from "./components/lobby"
import Game from "./components/game"
import Profile from "./components/profile"
import socket from "./components/socket"

function App() {
  const [token, setToken] = useState(localStorage.getItem(`token`))
  const [userId, setUserId] = useState(localStorage.getItem(`userId`))
  const [user, setUser] = useState(localStorage.getItem(`user`))
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (token && user && userId) {
      const handleConnect = () => {
        console.log(`You are connected with id: ${socket.id}`);
      };
      socket.on("connect", handleConnect);
      if (!socket.connected) {
        socket.connect()
      }
      return () => {
        socket.off("connect", handleConnect);
      };
    } 
  }, [token, userId, user]);

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
          setUser(null)
          localStorage.removeItem("token")
          localStorage.removeItem("userId")
          localStorage.removeItem("user")
          navigate("/")
        }
      } catch (error) {
        console.error(error)
      }
    } ;
    checkToken()
  },[token])
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/register" element={<Register setUser={setUser} setUserId={setUserId} setToken={setToken}/>}/>
        <Route path="/login" element={<Login setUser={setUser} setUserId={setUserId} setToken={setToken}/>}/>
        <Route path="/lobby" element={<Lobby token={token}/>}/> 
        <Route path="/lobby/:id/" element={<Game userId={userId} user={user} token={token}/>}/>
        <Route path="/profile" element={<Profile setUser={setUser} userId={userId} setUserId={setUserId} token={token} setToken={setToken}/>}/>
      </Routes> 
    </>
  )
}

export default App
