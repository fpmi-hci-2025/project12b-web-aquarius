import { ReactComponent as Menu } from "../../assets/menuIcon.svg"
import { ReactComponent as Cancel } from "../../assets/cancelIcon.svg"
import { useContext } from "react"
import { ActiveContext } from "../../Сontext/Context"
import style from "./BurgerMenu.module.scss"
import { useDispatch, useSelector } from "react-redux"
import { toggleActive } from "../../store/activeSlice"

interface IActive {
  active: {
    isActive: boolean
  }
}

const BurgerMenu = () => {
  const { isActive } = useSelector((state: IActive) => state.active)

  const dispatch = useDispatch()
  return (
    <button
      onClick={() => dispatch(toggleActive())}
      className={style.burgerBtn}
    >
      {!isActive ? <Menu /> : <Cancel className={style.cancel} />}
    </button>
  )
}
export default BurgerMenu
