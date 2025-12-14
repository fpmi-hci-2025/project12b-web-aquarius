import { useMemo } from "react"
import style from "./Peson.module.scss"
import { useSelector } from "react-redux"
import { ReactComponent as PersonIcon } from "../../assets/person.svg"
import { ISignIn } from "../../types/types"

const Person = () => {
  const { firstName, lastName } = useSelector((state: ISignIn) => state.signIn)

  const fullName = useMemo(() => {
    if (!firstName || !lastName) return null
    return `${firstName} ${lastName}`.trim()
  }, [firstName, lastName])

  const initials = useMemo(() => {
    if (!fullName)
      return (
        <div className={style.personIcon}>
          <PersonIcon />
        </div>
      )
    return fullName
      .split(" ")
      .map((letter: string) => letter[0])
      .join("")
  }, [fullName])

  return (
    <div className={style.personFIO}>
      <div className={style.personFIOWrap}>
        <div className={style.personInitials}>
          <span>{initials}</span>
        </div>
        <div className={style.personName}>
          <span>{fullName || "Guest"}</span>
        </div>
      </div>
    </div>
  )
}

export default Person
