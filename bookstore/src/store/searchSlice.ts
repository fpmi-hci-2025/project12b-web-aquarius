import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export const searchBooks = createAsyncThunk(
  "books/searchBooks",
  async (objectFromBooksPage, { rejectWithValue }) => {
    let { query }: any = objectFromBooksPage

    try {
      const response = await fetch(
        `https://bookstore-backend-qgjq.onrender.com/api/books/search`
      )

      if (!response.ok) {
        throw new Error("error")
      }

      const data = await response.json()

      return data
    } catch (error: any) {
      return rejectWithValue(error.message || "error")
    }
  }
)

const searchSlice = createSlice({
  name: "search",
  initialState: {
    books: [],
    totalItems: 0,
    currentPage: 1,
    itemsPerPage: 10,
    searchQueryTitle: "",
    searchQuery: "",
    loading: false,
    error: null as string | null,
  },
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload
    },
    setSearchQueryTitle: (state, action) => {
      state.searchQueryTitle = action.payload
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchBooks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchBooks.fulfilled, (state, action) => {
        state.loading = false
        state.books = action.payload.books || []
        state.totalItems = state.books.length
      })
      .addCase(searchBooks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})
export const { setPage, setSearchQueryTitle, setSearchQuery } =
  searchSlice.actions

export default searchSlice.reducer
