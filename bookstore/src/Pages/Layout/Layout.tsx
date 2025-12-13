import { Outlet } from "react-router-dom"
import Header from "../../Components/Header/Header"
import { ActiveContext } from "../../Сontext/Context"
import { useEffect, useState } from "react"
import Navbar from "../../Components/Navbar/Navbar"
import { useSelector } from "react-redux"
import Footer from "../../Components/Footer/Footer"
import style from "./Layout.module.scss"

interface ITheme {
  themeInStoreConfiguration: {
    theme: string
  }
}
const Layout = () => {
  const [active, setActive] = useState(false)
  const { theme } = useSelector(
    (state: ITheme) => state.themeInStoreConfiguration
  )

  useEffect(() => {
    document.body.classList.remove("light-theme", "dark-theme")
    document.body.classList.add(`${theme}-theme`)
  }, [theme])
  return (
    <ActiveContext.Provider
      value={{ isActive: active, SetIsActive: setActive }}
    >
      <Header />
      <Navbar />
      <div className={style.layoutWrap}>
        <main className={style.content}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </ActiveContext.Provider>
  )
}
export default Layout
