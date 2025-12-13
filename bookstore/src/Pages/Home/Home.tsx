import { useDispatch, useSelector } from "react-redux"
import Title from "../../Components/Title/Title"
import style from "../Home/Home.module.scss"
import AllBooks from "../AllBooks/AllBooks"

const Home = () => {
  return (
    <div className={style.bookstore}>
      <div className={style.container}>
        <Title title={"Bookstore"} />
        <AllBooks />
      </div>
    </div>
  )
}
export default Home
