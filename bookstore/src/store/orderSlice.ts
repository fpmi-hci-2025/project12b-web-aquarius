import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

const API = "https://bookstore-backend-qgjq.onrender.com/api"

export const createOrder = createAsyncThunk(
  "orders/create",
  async (
    {
      deliveryAddress,
      customerNotes,
      items,
    }: {
      deliveryAddress: string
      customerNotes?: string
      items: { bookId: string; count: number }[]
    },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("accessToken")

      const res = await fetch(`${API}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          deliveryAddress,
          customerNotes,
          orderItems: items,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        return rejectWithValue(err.message || "Order failed")
      }

      return await res.json() // ← order object
    } catch (e: any) {
      return rejectWithValue(e.message)
    }
  }
)

export const payOrder = createAsyncThunk(
  "orders/pay",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken")

      const res = await fetch(`${API}/orders/${orderId}/pay`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const err = await res.json()
        return rejectWithValue(err.message)
      }

      return await res.json()
    } catch (e: any) {
      return rejectWithValue(e.message)
    }
  }
)

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    currentOrder: null as any,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false
        state.currentOrder = action.payload
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default orderSlice.reducer
