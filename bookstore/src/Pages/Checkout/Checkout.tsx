import { useMemo, useState } from "react"
import style from "./Checkout.module.scss"
import { useSelector } from "react-redux"
import { IBookCard } from "../../types/types"
import { useNavigate } from "react-router-dom"
import Input from "../../Components/Input/Input"

const parsePrice = (p: any): number => {
  if (typeof p === "number") return p
  if (!p) return 0
  // remove non-digit except dot and comma
  const s = String(p)
    .replace(/[^0-9.,-]/g, "")
    .replace(/,/g, ".")
  const n = parseFloat(s)
  return isNaN(n) ? 0 : n
}

const Checkout = () => {
  const navigate = useNavigate()
  const { auth } = useSelector((state: any) => state.signIn)

  const localCart: IBookCard[] = useSelector(
    (state: any) => state.books.cart || []
  )
  const serverCart: any[] = useSelector((state: any) => state.cart.items || [])

  const items = auth
    ? serverCart.map((it) => ({
        id: it.bookId || it.id,
        title: it.title || "",
        price: parsePrice(it.price),
        quantity: it.quantity || 1,
      }))
    : localCart.map((it: any) => ({
        id: it.isbn13 || it.id,
        title: it.title,
        price: parsePrice(it.price),
        quantity: 1,
      }))

  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {}
    items.forEach((it) => {
      map[it.id] = it.quantity
    })
    return map
  })

  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")

  const lineItems = useMemo(() => {
    return items.map((it) => {
      const qty = quantities[it.id] || 0
      return { ...it, quantity: qty, lineTotal: it.price * qty }
    })
  }, [items, quantities])

  const itemsTotal = lineItems.reduce((s, i) => s + i.lineTotal, 0)
  const delivery = 0
  const total = itemsTotal + delivery

  const updateQty = (id: string, value: number) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(0, Math.floor(value)) }))
  }

  const onSubmit = () => {
    const totalItems = Object.values(quantities).reduce((s, x) => s + x, 0)
    if (totalItems <= 0) {
      alert("Cart is empty. Cannot checkout.")
      return
    }
    if (!email || !/.+@.+\..+/.test(email)) {
      alert("Please provide a valid email")
      return
    }
    if (!address.trim()) {
      alert("Please provide delivery address")
      return
    }

    const order = {
      items: lineItems,
      itemsTotal,
      delivery,
      total,
      customer: { email, name, address },
    }

    // In a real app we'd POST to backend here then redirect to payment.
    navigate("/payment", { state: { order } })
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
                  <input
                    type="number"
                    min={0}
                    value={it.quantity}
                    onChange={(e) => updateQty(it.id, Number(e.target.value))}
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
