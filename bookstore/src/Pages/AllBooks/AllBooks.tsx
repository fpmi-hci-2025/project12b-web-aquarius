import Title from "../../Components/Title/Title"
import style from "./AllBooks.module.scss"
import { useDispatch, useSelector } from "react-redux"
import { fetchBooks, setPage } from "../../store/paginationSlice"
import { useEffect } from "react"
import BookCard from "../../Components/BookCard/BookCard"
import Pagination from "../../Components/Pagination/Pagination"
import { IBookCard, IPagination } from "../../types/types"

const AllBooks = () => {
  const dispatch = useDispatch()
  const { books, loading, error, currentPage, itemsPerPage, totalItems } =
    useSelector((state: IPagination) => state.pagination)

  useEffect(() => {
    dispatch(fetchBooks())
  }, [])
  useEffect(() => {
    const duplicates = books.filter(
      (book, index) =>
        books.findIndex((b) => b.isbn13 === book.isbn13) !== index
    )
    if (duplicates.length > 0) {
      console.log("Duplicate books found:", duplicates)
    }

    const booksWithoutIsbn = books.filter((b) => !b.isbn13)
    if (booksWithoutIsbn.length > 0) {
      console.log("Books without isbn13:", booksWithoutIsbn)
    }
  }, [books])
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
          {paginatedBooks.map((book: IBookCard) => {
            return (
              <div key={book.isbn13} className={style.bookWrap}>
                <BookCard
                  title={book.title}
                  subtitle={book.subtitle}
                  isbn13={book.isbn13}
                  price={book.price}
                  image={book.image}
                  url={book.url}
                  authors={book.authors}
                  publisher={book.publisher}
                  pages={book.pages}
                  desc={book.desc}
                />
              </div>
            )
          })}
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
export default AllBooks
