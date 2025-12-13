import { Link, NavLink } from "react-router-dom"
import style from "./ResetPassword.module.scss"
import Title from "../../Components/Title/Title"
import Input from "../../Components/Input/Input"

const ResetPassword = () => {
  return (
    <div className={style.resetPassword}>
      <div className={style.container}>
        <div className={style.resetPasswordWrap}>
          <Link className={style.backHomeBtn} to={"/"}>
            Back to Home
          </Link>
          <Title title={"Reset Password"} />
          <div className={style.resetPasswordFormBorder}>
            <div className={style.resetPasswordForm}>
              <div className={style.resetPasswordText}>
                <p>
                  You will receive an email <span>example@gmail.com</span> with
                  a link to reset your password!
                </p>
              </div>
              <Input
                title={"Email"}
                type={"email"}
                value={"Your email"}
                placeholder="example@gmail.com"
              />
              <div className={style.resetPasswordBtn}>
                <NavLink className={style.resetPasswordNavLink} to={"/"}>
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
export default ResetPassword
