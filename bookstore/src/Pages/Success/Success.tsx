import { Link, NavLink } from "react-router-dom"
import style from "./Success.module.scss"
import Title from "../../Components/Title/Title"

const Success = () => {
  return (
    <div className={style.success}>
      <div className={style.container}>
        <div className={style.successWrap}>
          <Link className={style.backHomeBtn} to={"/"}>
            Back to Home
          </Link>
          <Title title={"Success"} />
          <div className={style.successFormBorder}>
            <div className={style.successForm}>
              <div className={style.successText}>
                <p>Email confirmed.</p>
                <p>Your registration is now completed</p>
              </div>
              <div className={style.successBtn}>
                <NavLink className={style.successNavLink} to={"/"}>
                  {"Go to home"}
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Success
