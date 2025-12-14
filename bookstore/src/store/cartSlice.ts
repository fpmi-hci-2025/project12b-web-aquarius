// cartSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

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

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken")

      if (!token) {
        return rejectWithValue("No access token")
      }

      const res = await fetch(`${API}/carts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("accessToken")
          return rejectWithValue("Session expired")
        }
        const err = await res.json()
        return rejectWithValue(err.message || "Failed to load cart")
      }

      const data = await res.json()
      return data
    } catch (e: any) {
      return rejectWithValue(e.message)
    }
  }
)

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (bookId: string, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem("accessToken")

      if (!token) {
        return rejectWithValue("Please login to add to cart")
      }

      const res = await fetch(`${API}/carts/${bookId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) {
        const err = await res.json()
        return rejectWithValue(err.message || "Failed to add to cart")
      }

      // Обновляем корзину после добавления
      await dispatch(fetchCart())
      return bookId
    } catch (e: any) {
      return rejectWithValue(e.message)
    }
  }
)

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (bookId: string, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem("accessToken")

      if (!token) {
        return rejectWithValue("Please login to remove from cart")
      }

      const res = await fetch(`${API}/carts/${bookId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const err = await res.json()
        return rejectWithValue(err.message || "Failed to remove from cart")
      }

      // Обновляем корзину после удаления
      await dispatch(fetchCart())
      return bookId
    } catch (e: any) {
      return rejectWithValue(e.message)
    }
  }
)

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Очистка корзины при выходе
    clearCart: (state) => {
      state.items = []
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false
        const response = action.payload

        if (response.cartItems && Array.isArray(response.cartItems)) {
          state.items = response.cartItems.map((item: any) => {
            const title = item.bookTitle || item.title || "Unknown title"

            const price =
              item.bookPrice?.toString() || item.price?.toString() || "0"
            const normalizeImage = (image: string) => {
              if (!image) return "/placeholder.png"

              if (image.startsWith("http") || image.startsWith("data:image")) {
                return image
              }

              return image.startsWith("/") ? image : `${API}/${image}`
            }

            return {
              bookId: item.bookId || item.id,
              title,
              price,
              image: normalizeImage(
                item.image || item.bookImage || item.imageUrl
              ),
              quantity: item.quantity || 1,
            }
          })

          // Сохраняем в localStorage для кэширования
          localStorage.setItem("cart_cache", JSON.stringify(state.items))
        } else if (Array.isArray(response)) {
          // Если ответ - массив
          state.items = response.map((item: any) => ({
            bookId: item.bookId || item.id,
            title: item.bookTitle || item.title || "Unknown title",
            price: item.bookPrice?.toString() || item.price?.toString() || "0",
            image: item.image || item.bookImage || `/placeholder.png`,
            quantity: item.quantity || 1,
          }))
        } else {
          state.items = []
        }
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        // Если не удалось загрузить, используем кэш
        const cache = localStorage.getItem("cart_cache")
        if (cache) {
          try {
            state.items = JSON.parse(cache)
          } catch (e) {
            state.items = []
          }
        }
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true
      })
      .addCase(removeFromCart.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearCart } = cartSlice.actions
export default cartSlice.reducer
// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
// import { mapCartItemToBookCard } from "../utils/mapCartItemToBookCard"

// const API = "https://bookstore-backend-qgjq.onrender.com/api"

// export interface CartItem {
//   bookId: string
//   title: string
//   price: string
//   image: string
//   quantity: number
// }

// interface CartState {
//   items: CartItem[]
//   loading: boolean
//   error: string | null
// }

// const initialState: CartState = {
//   items: [],
//   loading: false,
//   error: null,
// }

// export const fetchCart = createAsyncThunk(
//   "cart/fetchCart",
//   async (_, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem("accessToken")

//       const res = await fetch(`${API}/carts`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//       console.log("TOKEN FROM LS:", token)

//       if (!res.ok) {
//         const err = await res.json()
//         return rejectWithValue(err.message || "Failed to load cart")
//       }

//       return await res.json()
//     } catch (e: any) {
//       return rejectWithValue(e.message)
//     }
//   }
// )

// export const addToCart = createAsyncThunk(
//   "cart/addToCart",
//   async (bookId: string, { rejectWithValue, dispatch }) => {
//     try {
//       const token = localStorage.getItem("accessToken")

//       const res = await fetch(`${API}/carts/${bookId}`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })

//       if (!res.ok) {
//         const err = await res.json()
//         return rejectWithValue(err.message)
//       }

//       // build a CartItem from client state if possible
//       // const state: any = getState()
//       // const books: any[] = state.pagination?.books || []
//       // const found = books.find(
//       //   (b: any) => b.isbn13 === bookId || b.id === bookId
//       // )

//       // const item = found
//       //   ? {
//       //       bookId,
//       //       title: found.title || "",
//       //       price: found.price || "",
//       //       image: found.image || "",
//       //       quantity: 1,
//       //     }
//       //   : { bookId, title: "", price: "", image: "", quantity: 1 }

//       await dispatch(fetchCart())
//       return bookId
//     } catch (e: any) {
//       return rejectWithValue(e.message)
//     }
//   }
// )

// export const removeFromCart = createAsyncThunk(
//   "cart/removeFromCart",
//   async (bookId: string, { rejectWithValue, dispatch }) => {
//     try {
//       const token = localStorage.getItem("accessToken")

//       const res = await fetch(`${API}/carts/${bookId}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//       if (!token) {
//         return rejectWithValue("No access token, please login")
//       }
//       if (!res.ok) {
//         const err = await res.json()
//         return rejectWithValue(err.message)
//       }
//       await dispatch(fetchCart())
//       return bookId
//     } catch (e: any) {
//       return rejectWithValue(e.message)
//     }
//   }
// )

// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchCart.pending, (state) => {
//         state.loading = true
//       })
//       // .addCase(fetchCart.fulfilled, (state, action) => {
//       //   state.loading = false

//       //   const items = Array.isArray(action.payload.cartItems)
//       //     ? action.payload.cartItems
//       //     : action.payload

//       //   state.items = items.map(
//       //     (i: {
//       //       bookId: any
//       //       bookTitle: any
//       //       bookPrice: any
//       //       image: any
//       //       quantity: any
//       //     }) => ({
//       //       bookId: i.bookId,
//       //       title: i.bookTitle, // правильно мапим
//       //       price: i.bookPrice, // правильно мапим
//       //       image: i.image || "/placeholder.png",
//       //       quantity: i.quantity,
//       //     })
//       //   )
//       //   // state.items = items
//       // })
//       // .addCase(fetchCart.fulfilled, (state, action) => {
//       //   state.loading = false

//       //   const response = action.payload

//       //   // Проверяем структуру ответа
//       //   console.log("Cart response:", response)

//       //   if (response.cartItems && Array.isArray(response.cartItems)) {
//       //     state.items = response.cartItems.map((item: any) => ({
//       //       bookId: item.bookId,
//       //       title: item.bookTitle || "Unknown title", // Сохраняем как title
//       //       price: item.bookPrice?.toString() || "0", // Сохраняем как string
//       //       image: item.image || "/placeholder.png",
//       //       quantity: item.quantity || 1,
//       //     }))
//       //   } else if (Array.isArray(response)) {
//       //     state.items = response.map((item: any) => ({
//       //       bookId: item.bookId || item.id,
//       //       title: item.bookTitle || item.title || "Unknown title",
//       //       price: item.bookPrice?.toString() || item.price?.toString() || "0",
//       //       image: item.image || "/placeholder.png",
//       //       quantity: item.quantity || 1,
//       //     }))
//       //   } else {
//       //     state.items = []
//       //   }
//       // })
//       .addCase(fetchCart.fulfilled, (state, action) => {
//         state.loading = false
//         const response = action.payload

//         if (response.cartItems && Array.isArray(response.cartItems)) {
//           state.items = response.cartItems.map((item: any) => ({
//             bookId: item.bookId,
//             title: item.bookTitle || "Unknown title",
//             price: item.bookPrice?.toString() || "0",
//             image: item.image || "/placeholder.png",
//             quantity: item.quantity || 1,
//           }))
//           // Сохраняем в localStorage для быстрого отображения
//           localStorage.setItem("cart_cache", JSON.stringify(state.items))
//         } else {
//           state.items = []
//           localStorage.removeItem("cart_cache")
//         }
//       })
//       .addCase(fetchCart.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload as string
//       })
//       .addCase(addToCart.pending, (state) => {
//         state.loading = true
//       })
//       .addCase(addToCart.fulfilled, (state, action) => {
//         state.loading = false
//         const payload = action.payload
//         if (!payload) return
//         if (typeof payload === "string") {
//           state.items.push({
//             bookId: payload,
//             title: "",
//             price: "",
//             image: "",
//             quantity: 1,
//           })
//         } else if (payload.bookId) {
//           const exists = state.items.find(
//             (i: any) => i.bookId === payload.bookId
//           )
//           if (!exists) state.items.push(payload)
//         }
//       })
//       .addCase(addToCart.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload as string
//       })
//       .addCase(removeFromCart.pending, (state) => {
//         state.loading = true
//       })
//       .addCase(removeFromCart.fulfilled, (state, action) => {
//         state.loading = false
//         const bookId = action.payload
//         state.items = state.items.filter((i: any) => i.bookId !== bookId)
//       })
//       .addCase(removeFromCart.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload as string
//       })
//   },
// })

// export default cartSlice.reducer
