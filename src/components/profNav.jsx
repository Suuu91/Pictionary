import { useNavigate } from "react-router-dom";
import styles from "../styles/profNav.module.css"

const ProfNav = () => {
  const navigate = useNavigate();
  const profileOnClick = () => {
  navigate("/profile")
  }

  return (
    <form id={styles.profnav}>
      <label id={styles.prof} onClick={profileOnClick}>Profile</label>
    </form>
  )
}

export default ProfNav