import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const userLogin = async(e) => {
    e.preventDefault();
    const response = fetch("https://pictionary-183l.onrender.com/login", {
      method:"POST",
      headers: {"Content-Type":"application/Json"},
      body:{
        email:email,
        password:password
      }
    })

    setEmail("")
    setPassword("")
    navigate(`/lobby`)
  }

  return(
    <>
      <form onSubmit={userLogin} id="login">
        <label>Email: </label> <input type="email" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
        <label>Password: </label> <input type="password" value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
        <button>Login</button>
      </form>
    </>
  )
}

export default Login