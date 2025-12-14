import { useSelector } from "react-redux"
import BurgerMenu from "../BurgerMenu/BurgerMenu"
import Button from "../Button/Button"
import Cart from "../Cart/Cart"
import Person from "../Person/Person"
import Search from "../Search/Search"
import style from "./Header.module.scss"
import { ISignIn } from "../../types/types"
import { isAdmin } from "../../utils/isAdmin"

const Header = () => {
  const { auth } = useSelector((state: ISignIn) => state.signIn)
  const { username } = useSelector((state: any) => state.signIn)
  return (
    <header className={style.header}>
      <div className={style.headerWrap}>
        <div>
          <BurgerMenu />
        </div>

        <Search />
        {auth && !isAdmin(username) && <Cart />}
        <div className={style.searchPesonBtn}>
          <Person />
        </div>
      </div>
    </header>
  )
}
export default Header
