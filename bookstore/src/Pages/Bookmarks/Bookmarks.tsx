import style from "./Bookmarks.module.scss"
import BookCard from "../../Components/BookCard/BookCard"
import Title from "../../Components/Title/Title"
import { useDispatch, useSelector } from "react-redux"
import Pagination from "../../Components/Pagination/Pagination"
import { IBook, IBookCard, IPagination } from "../../types/types"
import { setPage } from "../../store/paginationSlice"
import { toggleBookmark } from "../../store/bookSlice"

const Bookmarks = () => {
  const dispatch = useDispatch()

  const { bookmarks } = useSelector((state: IBook) => state.books)

  const { currentPage, itemsPerPage } = useSelector(
    (state: IPagination) => state.pagination
  )

  const totalItems = bookmarks.length

  const paginatedBooks = bookmarks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePageChange = (pageNumber: number) => {
    dispatch(setPage(pageNumber))
  }

  return (
    <div className={style.bookstore}>
      <div className={style.container}>
        <Title title="Bookmarks" />

        <div className={style.booksWrap}>
          {paginatedBooks.length > 0 ? (
            paginatedBooks.map(
              ({
                title,
                subtitle,
                isbn13,
                price,
                image,
                url,
                authors,
                publisher,
                pages,
                desc,
              }: IBookCard) => (
                <div key={isbn13} className={style.bookWrap}>
                  <BookCard
                    title={title}
                    subtitle={subtitle}
                    isbn13={isbn13}
                    price={price}
                    image={image}
                    url={url}
                    authors={authors}
                    publisher={publisher}
                    pages={pages}
                    desc={desc}
                  />
                </div>
              )
            )
          ) : (
            <div>No bookmarks yet!</div>
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

export default Bookmarks
