import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({setToken}) => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const userLogin = async(e) => {
    e.preventDefault();
    const response = await fetch("https://pictionary-183l.onrender.com/login", {
      method:"POST",
      headers: {"Content-Type":"application/json"},
      body:JSON.stringify({
        email:email,
        password:password
      })
    });
    const loginMessage = await response.json();
    const accessToken = loginMessage.token;
    setToken(accessToken);
    setEmail("")
    setPassword("")
    if (accessToken){
      localStorage.setItem('token', accessToken);
      navigate(`/lobby`)
    }
      else{alert("Please enter valid information.")}
    };

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