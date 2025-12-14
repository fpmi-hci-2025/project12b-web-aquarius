import { useMemo } from "react"
import style from "./Peson.module.scss"
import { useSelector } from "react-redux"
import { ReactComponent as PersonIcon } from "../../assets/person.svg"
import { ISignIn } from "../../types/types"

const Person = () => {
  const { firstName, lastName, username } = useSelector(
    (state: ISignIn) => state.signIn
  )

  const fullName = useMemo(() => {
    if (!firstName || !lastName) return null
    return `${firstName} ${lastName}`.trim()
  }, [firstName, lastName])

  const displayName = fullName || username || "Guest"

  const initials = useMemo(() => {
    if (!fullName) {
      if (username) {
        return username.charAt(0).toUpperCase()
      }
      return (
        <div className={style.personIcon}>
          <PersonIcon />
        </div>
      )
    }
    return fullName
      .split(" ")
      .map((letter: string) => letter[0])
      .join("")
  }, [fullName, username])

  return (
    <div className={style.personFIO}>
      <div className={style.personFIOWrap}>
        <div className={style.personInitials}>
          <span>{initials}</span>
        </div>
        <div className={style.personName}>
          <span>{displayName}</span>
        </div>
      </div>
    </div>
  )
}

export default Person
