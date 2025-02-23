import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const userLogin = async(e) => {
    e.preventDefault();
    const response = fetch("",{
      method:"POST",
      headers: {"Content-Type":"application/Json"},
      body:{
        username:username,
        password:password
      }
    })

    setUsername("")
    setPassword("")
    // navigate("/lobby")
  }

  return(
    <>
      <form onSubmit={userLogin}>
        <label>Username: </label> <input onChange={(e)=>{setUsername(e.target.value)}}/>
        <label>Password: </label> <input onChange={(e)=>{setPassword(e.target.value)}}/>
        <button>Login</button>
      </form>
    </>
  )
}

export default Login