import { useEffect } from "react"
import style from "./CartPage.module.scss"
import { useDispatch, useSelector } from "react-redux"
import { setPage } from "../../store/paginationSlice"
import Title from "../../Components/Title/Title"
import BookCard from "../../Components/BookCard/BookCard"
import Pagination from "../../Components/Pagination/Pagination"
import { IBookCard, IPagination, IBook } from "../../types/types"
import { toggleCart } from "../../store/bookSlice"

const CartPage = () => {
  const dispatch = useDispatch()

  const { cart } = useSelector((state: IBook) => state.books)

  const {
    loading: paginationLoading,
    error: paginationError,
    currentPage,
    itemsPerPage,
  } = useSelector((state: IPagination) => state.pagination)

  useEffect(() => {
    dispatch(setPage(1))
  }, [dispatch])

  if (paginationLoading) {
    return <div>Loading...</div>
  }

  if (paginationError) {
    return <div>Error...</div>
  }

  // Read cart from bookSlice (client-side cart like bookmarks)
  const itemsArray: IBookCard[] = Array.isArray(cart) ? cart : []

  const totalItems = itemsArray.length

  const paginatedBooks = itemsArray.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePageChange = (pageNumber: number) => {
    dispatch(setPage(pageNumber))
  }

  return (
    <div className={style.cartWrap}>
      <div className={style.container}>
        <Title title="My cart" />

        <div className={style.booksCardWrap}>
          {paginatedBooks.length > 0 ? (
            paginatedBooks.map((item) => (
              <BookCard
                key={item.isbn13}
                {...item}
                showRemoveButton
                onRemove={() => dispatch(toggleCart(item))}
              />
            ))
          ) : (
            <div>No books in cart yet!</div>
          )}
        </div>

        <div className={style.numbersWrapper}>
          <Pagination
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  )
}

export default CartPage
