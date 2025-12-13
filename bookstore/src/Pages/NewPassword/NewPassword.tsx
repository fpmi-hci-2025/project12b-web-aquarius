import { Link, NavLink } from "react-router-dom"
import style from "./NewPassword.module.scss"
import Title from "../../Components/Title/Title"
import Input from "../../Components/Input/Input"

const NewPassword = () => {
  return (
    <div className={style.newPassword}>
      <div className={style.container}>
        <div className={style.newPasswordWrap}>
          <Link className={style.backHomeBtn} to={"/"}>
            Back to Home
          </Link>
          <Title title={"New Password"} />
          <div className={style.newPasswordFormBorder}>
            <div className={style.newPasswordForm}>
              <Input
                title={"Password"}
                type={"password"}
                value={"Your password"}
                placeholder="Your password"
              />
              <Input
                title={"Confirm password"}
                type={"password"}
                value={"Confirm password"}
                placeholder="Confirm password"
              />

              <button className={style.newPasswordBtn}>Set Password</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default NewPassword
