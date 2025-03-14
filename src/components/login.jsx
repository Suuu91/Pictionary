import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const userLogin = async(e) => {
    e.preventDefault();
    const response = fetch("",{
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
      <form onSubmit={userLogin}>
        <label>Email: </label> <input onChange={(e)=>{setEmail(e.target.value)}}/>
        <label>Password: </label> <input onChange={(e)=>{setPassword(e.target.value)}}/>
        <button>Login</button>
      </form>
    </>
  )
}

export default Login