import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = ({setToken}) =>{
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submitForm = async(e) => {
    e.preventDefault();
    const response = await fetch('https://pictionary-183l.onrender.com/register',{
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        email:email,
        username:username,
        password:password
      })
    });
    const registerMessage = await response.json();
    const accessToken = registerMessage.token;
    setToken(accessToken);
    setEmail("");
    setUsername("");
    setPassword("");
    if (accessToken){
      localStorage.setItem('token', accessToken);
      navigate(`/lobby`)
    }
      else{alert("Please enter valid information.")}
    };

  return (
    <>
      <form onSubmit={submitForm} id="register">
        <label>Email: </label> <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
        <label>Username </label> <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)}/>
        <label>Password: </label><input type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
        <button>Submit</button>
      </form>
    </>
  )
}

export default Register