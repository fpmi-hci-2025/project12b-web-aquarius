import { useLocation, useNavigate, useParams } from "react-router-dom"
import style from "./Payment.module.scss"
import { useDispatch } from "react-redux"
import { payOrder } from "../../store/orderSlice"

const Payment = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { orderId } = useParams()
  const dispatch = useDispatch()

  const onPay = async () => {
    await dispatch(payOrder(orderId!) as any)
    alert("Оплата успешна")
  }

  if (!orderId) {
    return (
      <div className={style.paymentWrap}>
        <div className={style.container}>
          <div>No order data. Please create an order first.</div>
        </div>
      </div>
    )
  }

  return (
    <div className={style.paymentWrap}>
      <div className={style.container}>
        <h2>Payment</h2>
        <div className={style.orderBox}>
          <div>Items: {orderId.items.length}</div>
          <div>Items total: {Number(orderId.itemsTotal).toFixed(2)}</div>
          <div>Delivery: {Number(orderId.delivery).toFixed(2)}</div>
          <div>
            <strong>Total: {Number(orderId.total).toFixed(2)}</strong>
          </div>
          <button onClick={onPay}>Оплатить</button>
          <div style={{ marginTop: 8 }}>
            <button onClick={() => navigate("/")}>Return Home</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment
