import React, { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import style from "./Payment.module.scss"

const Payment = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [paid, setPaid] = useState(false)

  const currentOrder = useSelector((state: any) => state.order?.currentOrder)

  if (!currentOrder || currentOrder.id !== orderId) {
    return (
      <div className={style.paymentWrap}>
        <div className={style.container}>
          <div className={style.orderBox}>
            <h2>Order not found</h2>
            <p>Please create an order first.</p>
            <div className={style.actionButtons}>
              <button className={style.homeBtn} onClick={() => navigate("/")}>
                Return Home
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handlePayment = () => {
    setPaid(true)
  }

  if (paid) {
    return (
      <div className={style.paymentWrap}>
        <div className={style.container}>
          <div className={style.successMessage}>
            <h2>Payment completed</h2>
            <p>
              Спасибо за покупку! Ваш заказ <strong>{currentOrder.id}</strong>{" "}
              оформлен.
            </p>
          </div>

          <div className={style.summaryBox}>
            <div>Items: {currentOrder.items?.length || 0}</div>
            <div>
              <strong>
                Total: {(currentOrder.totalAmount ?? 0).toFixed(2)}
              </strong>
            </div>
          </div>

          <div className={style.actionButtons}>
            <button className={style.homeBtn} onClick={() => navigate("/")}>
              Return Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={style.paymentWrap}>
      <div className={style.container}>
        <div className={style.orderBox}>
          <h2>Payment</h2>

          <div className={style.summaryBox}>
            <div>
              Order ID: <strong>{currentOrder.id}</strong>
            </div>
            <div>Items: {currentOrder.items?.length || 0}</div>
            <div>
              <strong>
                Total: {(currentOrder.totalAmount ?? 0).toFixed(2)}
              </strong>
            </div>
          </div>

          <div className={style.actionButtons}>
            <button className={style.payBtn} onClick={handlePayment}>
              Pay
            </button>
            <button className={style.homeBtn} onClick={() => navigate("/")}>
              Return Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment
