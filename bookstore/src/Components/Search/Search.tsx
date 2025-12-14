import { useLocation, useNavigate } from "react-router-dom"
import { ReactComponent as SearchBtn } from "../../assets/search.svg"
import style from "./Search.module.scss"
import { useDispatch, useSelector } from "react-redux"
import {
  searchBooks,
  setPage,
  setSearchQuery,
  setSearchQueryTitle,
} from "../../store/searchSlice"
import { ReactComponent as Cancel } from "../../assets/cancelIcon.svg"
import { useEffect, useState, useRef } from "react"
import { ISearch } from "../../types/types"

const Search = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()

  useEffect(() => {
    if (location.pathname !== "/search") {
      setFormOpen(false)
    }
  }, [location.pathname])

  const { searchQuery } = useSelector((state: ISearch) => state.search)

  const [form, setFormOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const debounceRef = useRef<number | null>(null)

  const handlerSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    // immediate server search on submit
    dispatch(searchBooks({ query: searchQuery }))
    dispatch(setPage(1))
    dispatch(setSearchQueryTitle(searchQuery))
  }

  const handlerInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    // update store immediately so the input is controlled by redux
    dispatch(setSearchQuery(value))

    // debounce server search to reduce requests and perceived latency
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current)
    }
    debounceRef.current = window.setTimeout(() => {
      // don't dispatch empty queries
      if ((value || "").trim()) {
        dispatch(searchBooks({ query: value }))
        dispatch(setPage(1))
        dispatch(setSearchQueryTitle(value))
      }
    }, 400)
  }
  return (
    <div className={style.searchWrap}>
      {form && (
        <form className={style.searchForm} onSubmit={handlerSubmit}>
          <input
            ref={inputRef}
            className={style.searchInput}
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handlerInput}
          />
          <Cancel
            onClick={() => setFormOpen(false)}
            className={style.searchCancel}
          />
        </form>
      )}
      <button
        onClick={() => {
          setFormOpen(true)
          navigate("/search")
        }}
        className={style.searchBtn}
      >
        <SearchBtn />
      </button>
    </div>
  )
}
export default Search
