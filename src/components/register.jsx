import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/auth.module.css";

const Register = ({setToken, setUserId, setUser}) =>{
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
    const registerUserId = registerMessage.user.id
    const registerUser = registerMessage.user.username
    setToken(accessToken);
    setUserId(registerUserId)
    setUser(registerUser)
    setEmail("");
    setUsername("");
    setPassword("");
    if (accessToken){
      localStorage.setItem('token', accessToken);
      localStorage.setItem(`userId`, registerUserId);
      localStorage.setItem(`user`, registerUser);
      navigate(`/lobby`)
    }
      else{alert("Please enter valid information.")}
    };

  return (
    <>
      <form onSubmit={submitForm} id={styles.register}>
        <label>Email: </label> <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
        <label>Username </label> <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)}/>
        <label>Password: </label><input type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
        <button>Submit</button>
      </form>
    </>
  )
}

export default Register