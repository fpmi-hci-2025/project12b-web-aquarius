import { useNavigate } from "react-router-dom"
import style from "./Cart.module.scss"
import { ReactComponent as CartBtn } from "../../assets/cart.svg"

const Cart = () => {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => {
        navigate("/cart")
      }}
      className={style.cartBtn}
    >
      <CartBtn className={style.cartIcon} />
    </button>
  )
}
export default Cart
