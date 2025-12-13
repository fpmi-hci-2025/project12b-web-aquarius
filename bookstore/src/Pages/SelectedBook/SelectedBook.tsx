import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import style from "./SelectedBook.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCartShopping, faBookmark } from "@fortawesome/free-solid-svg-icons"
import { ReactComponent as LeftArrow } from "../../assets/left_arrow.svg"
import { ReactComponent as RightArrow } from "../../assets/right_arrow.svg"
import { useDispatch, useSelector } from "react-redux"

import { getBookInfo } from "../../store/selectedBookSlice"
import { toggleBookmark, toggleCart } from "../../store/bookSlice"
import { IBook, IBookCard, IPagination, ISelectedPage } from "../../types/types"

const SelectedBook = () => {
  const { isbn13 } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector(
    (state: ISelectedPage) => state.selectedBook
  )

  const { books } = useSelector((state: IPagination) => state.pagination)
  const currentIndex = books.findIndex((b: IBookCard) => b.isbn13 === isbn13)
  const previousBook = books[currentIndex - 1]
  const nextBook = books[currentIndex + 1]

  const bookmarks = useSelector((state: IBook) => state.books.bookmarks)
  const isBookmarked = bookmarks.some(
    (book: IBookCard) => book.isbn13 === isbn13
  )

  const cart = useSelector((state: any) => state.books.cart || [])
  const isInCart = cart.some((cartItem: any) => cartItem.isbn13 === isbn13)
  const { book } = useSelector((state: any) => state.selectedBook)

  useEffect(() => {
    if (isbn13) dispatch(getBookInfo(isbn13))
  }, [isbn13])

  if (loading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Error...</div>
  }

  // Guard: if book data is not yet available, show loading fallback.
  if (!book) {
    return <div>Loading...</div>
  }

  return (
    <div className={style.bookCard}>
      <div className={style.container}>
        <div className={style.homeBookWrap}>
          <button className={style.homeBtn} onClick={() => navigate("/")}>
            Home
          </button>
          <div className={style.bookId}>
            <p>Book {isbn13}</p>
          </div>
        </div>

        <div className={style.bookCardWrap}>
          <div className={style.bookCardInf}>
            <div className={style.bookCardWrapUp}>
              <div className={style.imgWrap}>
                <img
                  onClick={() => {
                    navigate(`/${isbn13}`)
                  }}
                  className={style.bookCardImg}
                  src={book.image}
                />
              </div>
              <h2 className={style.bookCardTitle}>{book.title}</h2>
              <div className={style.bookDecription}>{book.desc}</div>

              <div className={style.bookInfTable}>
                <div className={style.bookTableValue}>Price</div>
                <div className={style.bookTableValue}>{book.price}</div>
                <div className={style.bookTableValue}>Subtitle</div>
                <div className={style.bookTableValue}>{book.subtitle}</div>
                <div className={style.bookTableValue}>Authors</div>
                <div className={style.bookTableValue}>{book.authors}</div>
                <div className={style.bookTableValue}>Pages</div>
                <div className={style.bookTableValue}>{book.pages}</div>
                <div className={style.bookTableValue}>Publisher</div>
                <div className={style.bookTableValue}>{book.publisher}</div>
              </div>
            </div>

            <div className={style.saveDotsWrap}>
              <div className={style.interactivePart}>
                <button
                  className={style.faBookmark}
                  onClick={() => {
                    dispatch(toggleBookmark(book))
                  }}
                >
                  <FontAwesomeIcon
                    icon={faBookmark}
                    style={{
                      fontSize: "25px",
                      color: isBookmarked ? "2231aa" : "white",
                    }}
                    cursor={"pointer"}
                  />
                </button>
                <button
                  onClick={() => {
                    dispatch(toggleCart(book))
                  }}
                  className={style.faCartShopping}
                >
                  <FontAwesomeIcon
                    icon={faCartShopping}
                    style={{
                      fontSize: "25px",
                      color: isInCart ? "2231aa" : "white",
                    }}
                    cursor={"pointer"}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={style.numbersWrapper}>
          <div className={style.leftArrowWrap}>
            <button
              className={style.leftArrow}
              onClick={() => navigate(`/${previousBook?.isbn13}`)}
              disabled={!previousBook}
            >
              <LeftArrow className={style.leftArrowSvg} />
            </button>
            <div className={style.prevWrap}>
              <button
                className={style.prevBtn}
                onClick={() => navigate(`/${previousBook?.isbn13}`)}
                disabled={!previousBook}
              >
                Prev
              </button>
              <div className={style.prevTitle}>
                {previousBook ? previousBook.title : "No previous book"}
              </div>
            </div>
          </div>
          <div className={style.rightArrowWrap}>
            <div className={style.nextWrap}>
              <button
                className={style.nextBtn}
                onClick={() => navigate(`/${nextBook?.isbn13}`)}
                disabled={!nextBook}
              >
                Next
              </button>
              <div className={style.nextTitle}>
                {nextBook ? nextBook.title : "No next book"}
              </div>
            </div>
            <button
              className={style.rightArrow}
              onClick={() => navigate(`/${nextBook?.isbn13}`)}
              disabled={!nextBook}
            >
              <RightArrow className={style.rightArrowSvg} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SelectedBook
