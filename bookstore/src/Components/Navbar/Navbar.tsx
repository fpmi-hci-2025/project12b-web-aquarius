import { Link, useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import style from "./Navbar.module.scss"
import styles from "./Navbar.module.scss"
import Person from "../Person/Person"
import { toggleActive } from "../../store/activeSlice"
import { logout } from "../../store/signInSlice"
import { IActive, ISignIn } from "../../types/types"
import { useContext } from "react"
import { ThemeContext } from "../../Сontext/Context"
import { switchTheme } from "../../store/themeSlice"
import { ReactComponent as Dark } from "../../assets/dark.svg"
import { ReactComponent as Light } from "../../assets/light.svg"

const Navbar = () => {
  const location = useLocation()
  const theme = useContext(ThemeContext)
  const btnIsActive = (path: string) => location.pathname === path

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isActive } = useSelector((state: IActive) => state.active)
  const { auth } = useSelector((state: ISignIn) => state.signIn)

  const logOutHandler = () => {
    dispatch(logout())
    dispatch(toggleActive())
    navigate("/sign-in")
  }

  return (
    <div
      className={
        !isActive ? styles.navbar : `${styles.navbar} ${styles.active}`
      }
    >
      <div className={style.navbarBtnsWrap}>
        <div className={style.navbarBtn}>
          <Person />
        </div>

        <div
          className={`${style.navbarBtn} ${
            btnIsActive("/") ? style.active : ""
          }`}
        >
          <Link
            to="/"
            className={style.navbarLink}
            onClick={() => dispatch(toggleActive())}
          >
            <p>New Release</p>
          </Link>
        </div>

        <div
          className={`${style.navbarBtn} ${
            btnIsActive("/bookmarks") ? style.active : ""
          }`}
        >
          <Link
            to="/bookmarks"
            className={style.navbarLink}
            onClick={() => dispatch(toggleActive())}
          >
            <p>Bookmarks</p>
          </Link>
        </div>
      </div>
      <div className={style.themeAndLogOutWrap}>
        <button onClick={theme?.toggleTheme} className={style.themeWrap}>
          <div
            onClick={() => {
              dispatch(toggleActive())
              dispatch(switchTheme("light"))
            }}
            className={style.themeBtn}
          >
            <Light />
          </div>
          <div
            onClick={() => {
              dispatch(toggleActive())
              dispatch(switchTheme("dark"))
            }}
            className={style.themeBtn}
          >
            <Dark />
          </div>
        </button>
        {auth ? (
          <button onClick={logOutHandler} className={style.logOutBtn}>
            Log Out
          </button>
        ) : (
          <button
            onClick={() => {
              dispatch(toggleActive())
              navigate("/sign-in")
            }}
            className={style.logOutBtn}
          >
            Log In
          </button>
        )}
      </div>
    </div>
  )
}
export default Navbar
