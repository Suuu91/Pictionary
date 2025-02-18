import { useNavigate } from "react-router-dom"
import "../styles/home.css"

const Home = () => {
  const navigate = useNavigate()
  
  return (
    <>
      <h1>Welcome to Pictionary !</h1>
      <section id='homeNav'>
        <button onClick={()=>{navigate(`/register`)}}>New User</button>
        <button onClick={()=>{navigate(`/login`)}}>Existing User</button>
      </section>
    </>
  )
}

export default Home