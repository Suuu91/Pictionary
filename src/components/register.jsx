import { useState } from "react"

const Register = () =>{
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

    const submitForm = async(e) =>{
      e.preventDefault();
      const response = await fetch('',{
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          username:username,
          email:email,
          password:password
        })
      }).then(response => response.json())
      .then(result => {
        console.log(result);
      })
      .catch(console.error);

      setUsername("");
      setEmail("");
      setPassword("");
    }

  return (
    <>
    <form onSubmit={submitForm}>
      <label>Username </label> <input onChange={(e)=>setUsername(e.target.value)}/>
      <label>Email: </label> <input onChange={(e)=>setEmail(e.target.value)}/>
      <label>Password: </label><input onChange={(e)=>setPassword(e.target.value)}/>
      <button>Submit</button>
    </form>
      
    </>
  )
}

export default Register