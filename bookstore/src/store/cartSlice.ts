import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { mapCartItemToBookCard } from "../utils/mapCartItemToBookCard"

const API = "https://bookstore-backend-qgjq.onrender.com/api"

export interface CartItem {
  bookId: string
  title: string
  price: string
  image: string
  quantity: number
}

interface CartState {
  items: CartItem[]
  loading: boolean
  error: string | null
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
}

/* 🔹 GET /api/carts */
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken")

      const res = await fetch(`${API}/carts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const err = await res.json()
        return rejectWithValue(err.message || "Failed to load cart")
      }

      return await res.json()
    } catch (e: any) {
      return rejectWithValue(e.message)
    }
  }
)

/* 🔹 POST /api/carts/{bookId} */
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (bookId: string, { rejectWithValue, getState }) => {
    try {
      const token = localStorage.getItem("accessToken")

      const res = await fetch(`${API}/carts/${bookId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const err = await res.json()
        return rejectWithValue(err.message)
      }

      // build a CartItem from client state if possible
      const state: any = getState()
      const books: any[] = state.pagination?.books || []
      const found = books.find(
        (b: any) => b.isbn13 === bookId || b.id === bookId
      )

      const item = found
        ? {
            bookId,
            title: found.title || "",
            price: found.price || "",
            image: found.image || "",
            quantity: 1,
          }
        : { bookId, title: "", price: "", image: "", quantity: 1 }

      return item
    } catch (e: any) {
      return rejectWithValue(e.message)
    }
  }
)

/* 🔹 DELETE /api/carts/{bookId} */
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (bookId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken")

      const res = await fetch(`${API}/carts/${bookId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const err = await res.json()
        return rejectWithValue(err.message)
      }

      return bookId
    } catch (e: any) {
      return rejectWithValue(e.message)
    }
  }
)

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false
        const items = Array.isArray(action.payload)
          ? action.payload
          : action.payload.items || []

        state.items = items.map(mapCartItemToBookCard)
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload
        if (!payload) return
        if (typeof payload === "string") {
          state.items.push({
            bookId: payload,
            title: "",
            price: "",
            image: "",
            quantity: 1,
          })
        } else if (payload.bookId) {
          const exists = state.items.find(
            (i: any) => i.bookId === payload.bookId
          )
          if (!exists) state.items.push(payload)
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false
        const bookId = action.payload
        state.items = state.items.filter((i: any) => i.bookId !== bookId)
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default cartSlice.reducer
