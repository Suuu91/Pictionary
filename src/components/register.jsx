import { useState } from "react"
import { useNavigate } from "react-router-dom";

const Register = () =>{
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()

    const submitForm = async(e) =>{
      e.preventDefault();
      const response = await fetch('https://pictionary-183l.onrender.com/register',{
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          email:email,
          username:username,
          password:password
        })
      }).then(response => response.json())
      .then(result => {
        console.log(result);
      })
      .catch(console.error);

      setEmail("");
      setUsername("");
      setPassword("");
      navigate(`/lobby`)
    }

  return (
    <>
    <form onSubmit={submitForm}>
      <label>Email: </label> <input onChange={(e)=>setEmail(e.target.value)}/>
      <label>Username </label> <input onChange={(e)=>setUsername(e.target.value)}/>
      <label>Password: </label><input onChange={(e)=>setPassword(e.target.value)}/>
      <button>Submit</button>
    </form>
      
    </>
  )
}

export default Register