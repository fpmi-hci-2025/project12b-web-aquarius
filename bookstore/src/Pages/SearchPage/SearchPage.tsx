import { useEffect } from "react"
import style from "./SearchPage.module.scss"
import { useDispatch, useSelector } from "react-redux"
import { searchBooks, setPage } from "../../store/searchSlice"
import Title from "../../Components/Title/Title"
import BookCard from "../../Components/BookCard/BookCard"
import Pagination from "../../Components/Pagination/Pagination"
import { IBookCard, ISearch } from "../../types/types"

const SearchPage = () => {
  const dispatch = useDispatch()

  const {
    books,
    loading,
    error,
    currentPage,
    itemsPerPage,
    totalItems,
    searchQuery,
  } = useSelector((state: ISearch) => state.search)

  const searchQueryTitle = useSelector(
    (state: ISearch) => state.search.searchQueryTitle
  )

  useEffect(() => {
    if (searchQuery.trim()) {
      dispatch(searchBooks({ query: searchQuery }) as any)
    }
  }, [searchQuery, dispatch])

  if (loading) {
    return <div>loading...</div>
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
    <div className={style.searchWrap}>
      <div className={style.container}>
        <Title title={`Search results "${searchQueryTitle}"`} />
        <div className={style.booksCardWrap}>
          {paginatedBooks.map(
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
            }: IBookCard) => {
              return (
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

export default SearchPage
