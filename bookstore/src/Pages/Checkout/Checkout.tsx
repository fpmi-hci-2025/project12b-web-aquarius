import { useEffect, useMemo, useState } from "react"
import style from "./Checkout.module.scss"
import { useSelector } from "react-redux"
import { IBookCard } from "../../types/types"
import { useNavigate } from "react-router-dom"
import Input from "../../Components/Input/Input"
import { useDispatch } from "react-redux"
import { createOrder } from "../../store/orderSlice"
import { fetchCart } from "../../store/cartSlice"

const parsePrice = (p: any): number => {
  console.log("Parsing price:", p, typeof p)

  if (typeof p === "number") return p
  if (!p) return 0

  const s = String(p)
    .replace(/[^0-9.,-]/g, "")
    .replace(/,/g, ".")
  const n = parseFloat(s)
  const result = isNaN(n) ? 0 : n
  console.log("Parsed result:", result)
  return result
}
const Checkout = () => {
  const navigate = useNavigate()
  const { auth } = useSelector((state: any) => state.signIn)
  const { username } = useSelector((state: any) => state.signIn)
  const dispatch = useDispatch()

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (!token) {
      navigate("/sign-in")
      return
    }

    if (auth && !isAdmin(username)) {
      dispatch(fetchCart() as any)
    }
  }, [auth, dispatch])

  const localCart: IBookCard[] = useSelector(
    (state: any) => state.books.cart || []
  )
  const serverCart: any[] = useSelector((state: any) => state.cart.items || [])

  const cartItems = useSelector((state: any) => state.cart.items || [])
  useEffect(() => {
    console.log("Full cart items:", cartItems)
    console.log(
      "Cart items mapped:",
      cartItems.map((it: any) => ({
        id: it.bookId,
        title: it.title,
        price: it.price,
        rawPrice: it.price,
        parsedPrice: parsePrice(it.price),
      }))
    )
  }, [cartItems])

  const items = useMemo(
    () =>
      cartItems.map((it: any) => ({
        id: it.bookId,
        title: it.title,
        price: parsePrice(it.price), // Парсим здесь
        rawPrice: it.price, // Сохраняем оригинальную цену для отладки
        quantity: it.quantity ?? 1,
      })),
    [cartItems]
  )

  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")

  const lineItems = useMemo(() => {
    return items.map((it: { id: string | number; price: number }) => {
      const qty = quantities[it.id] || 0
      return { ...it, quantity: qty, lineTotal: it.price * qty }
    })
  }, [items, quantities])
  console.log("ITEMS", items)
  console.log("QUANTITIES", quantities)
  console.log("LINE ITEMS", lineItems)

  const itemsTotal = lineItems.reduce(
    (s: any, i: { lineTotal: any }) => s + i.lineTotal,
    0
  )
  const delivery = 0
  const total = itemsTotal + delivery

  const orderItems = lineItems
    .filter((i: { quantity: number }) => i.quantity > 0)
    .map((i: { id: any; quantity: any }) => ({
      bookId: i.id,
      count: i.quantity,
    }))

  const updateQty = (id: string, value: number) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(0, Math.floor(value)) }))
  }

  const onSubmit = async () => {
    if (!address.trim()) {
      alert("Please provide delivery address")
      return
    }

    if (orderItems.length === 0) {
      alert("Корзина пуста")
      return
    }

    const result = await dispatch(
      createOrder({
        deliveryAddress: address,
        customerNotes: `Email: ${email}, Name: ${name}`,
        items: orderItems,
      }) as any
    )

    if (createOrder.fulfilled.match(result)) {
      const orderId = result.payload.id
      navigate(`/payment/${orderId}`)
    } else {
      alert("Ошибка создания заказа")
    }
  }

  return (
    <div className={style.checkoutWrap}>
      <div className={style.container}>
        <h2>Checkout</h2>

        <table className={style.itemsTable}>
          <thead>
            <tr>
              <th>Book</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Line total</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((it: any) => (
              <tr key={it.id}>
                <td>{it.title}</td>
                <td>{it.price.toFixed(2)}</td>
                <td>
                  <Input
                    name="quantity"
                    placeholder="Quantity"
                    inputEvent={(e) => updateQty(it.id, Number(e.target.value))}
                    title={""}
                    type={"text"}
                    value={quantities[it.id] ?? it.quantity}
                  />
                </td>
                <td>{it.lineTotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={style.summary}>
          <div>Items total: {itemsTotal.toFixed(2)}</div>
          <div>Delivery: {delivery.toFixed(2)}</div>
          <div>
            <strong>Total: {total.toFixed(2)}</strong>
          </div>
        </div>

        <h3>Customer</h3>
        <div className={style.formRow}>
          <div className={style.formCol}>
            <Input
              title="Email"
              name="email"
              type="email"
              value={email}
              placeholder="example@mail.com"
              inputEvent={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={style.formCol}>
            <Input
              title="Name"
              name="name"
              type="text"
              value={name}
              placeholder="Your name"
              inputEvent={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <h3>Delivery address</h3>
        <div>
          <Input
            title="Address"
            name="address"
            type="text"
            placeholder="Country / City / Street"
            inputEvent={(e) => setAddress(e.target.value)}
            value={address}
          />
        </div>

        <div className={style.actions}>
          <button className={style.paymentBtn} onClick={onSubmit}>
            Proceed to payment
          </button>
        </div>
      </div>
    </div>
  )
}

export default Checkout
