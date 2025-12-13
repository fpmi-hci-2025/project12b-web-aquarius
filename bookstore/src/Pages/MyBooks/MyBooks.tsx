import Title from "../../Components/Title/Title"
import style from "./AllBooks.module.scss"
import { useDispatch, useSelector } from "react-redux"
import { fetchBooks, setPage } from "../../store/paginationSlice"
import { useEffect } from "react"
import BookCard from "../../Components/BookCard/BookCard"
import Pagination from "../../Components/Pagination/Pagination"
import { IBookCard, IPagination } from "../../types/types"

const MyBooks = () => {
  const dispatch = useDispatch()
  const { books, loading, error, currentPage, itemsPerPage, totalItems } =
    useSelector((state: IPagination) => state.pagination)

  useEffect(() => {
    dispatch(fetchBooks())
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Error...</div>
  }

  const paginatedBooks = books.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePageChange = (pageNumber: number) => {
    dispatch(setPage(pageNumber))
  }

  return (
    <div className={style.bookstore}>
      <div className={style.container}>
        <div className={style.booksWrap}>
          {paginatedBooks.map(
            ({ title, subtitle, isbn13, price, image, url }: IBookCard) => {
              return (
                <div key={isbn13} className={style.bookWrap}>
                  <BookCard
                    title={title}
                    subtitle={subtitle}
                    isbn13={isbn13}
                    price={price}
                    image={image}
                    url={url}
                  />
                </div>
              )
            }
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
export default MyBooks
