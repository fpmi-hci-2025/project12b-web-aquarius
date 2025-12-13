import { Link, NavLink, useParams } from "react-router-dom"
import style from "./RegistrationConfirmation.module.scss"
import Title from "../../Components/Title/Title"
import { useDispatch } from "react-redux"
import { useEffect } from "react"
import { activateUser } from "../../store/SignUpSlice"

const RegistrationConfirmation = () => {
  const data = useParams()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(activateUser(data))
  }, [])
  return (
    <div className={style.registrationConfirmation}>
      <div className={style.container}>
        <div className={style.registrationConfirmationWrap}>
          <Link className={style.backHomeBtn} to={"/"}>
            Back to Home
          </Link>
          <Title title={"Registration Confirmation"} />
          <div className={style.registrationConfirmationFormBorder}>
            <div className={style.registrationConfirmationForm}>
              <div className={style.registrationConfirmationText}>
                <p>
                  Please activate your account with the activation link in the
                  email <span>example@gmail.com.</span> Please, check your email
                </p>
              </div>
              <div className={style.registrationConfirmationBtn}>
                <NavLink
                  className={style.registrationConfirmationNavLink}
                  to={"/"}
                >
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
export default RegistrationConfirmation
