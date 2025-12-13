import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCartShopping, faBookmark } from "@fortawesome/free-solid-svg-icons"
import style from "./BookCard.module.scss"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { IBook, IBookCard, ISignIn } from "../../types/types"
import { toggleBookmark, toggleCart } from "../../store/bookSlice"

interface Props extends IBookCard {
  showRemoveButton?: boolean
  onRemove?: () => void
}

const BookCard = ({
  title,
  subtitle,
  isbn13,
  price,
  image,
  url,
  showRemoveButton = false,
  onRemove,
}: Props) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { auth } = useSelector((state: ISignIn) => state.signIn)

  const bookmarks = useSelector((state: IBook) => state.books.bookmarks)

  const isBookmarked = bookmarks.some(
    (book: IBookCard) => book.isbn13 === isbn13
  )
  const cartItems = useSelector((state: any) => state.books.cart || [])

  const isInCart = cartItems.some((item: any) => item.isbn13 === isbn13)

  return (
    <div className={style.bookCardWrap}>
      <div className={style.bookCardWrapUp}>
        <div className={style.imgWrap}>
          <img
            onClick={() => {
              // Prefer the provided url when available; fallback to isbn13 route
              navigate(url || `/${isbn13}`)
            }}
            className={style.bookCardImg}
            src={image}
          />
        </div>

        <div className={style.bookCardPrice}>{price}</div>
        <h2 className={style.bookCardTitle}>
          <div
            onClick={() => {
              navigate(url || `/${isbn13}`)
            }}
            className={style.bookCardTitleLink}
          >
            {title}
          </div>
        </h2>
      </div>

      <div className={style.saveDotsWrap}>
        <div className={style.interactivePart}>
          <button
            className={style.faBookmark}
            onClick={() => {
              dispatch(
                toggleBookmark({
                  title,
                  subtitle,
                  isbn13,
                  price,
                  image,
                  url,
                })
              )
            }}
          >
            <FontAwesomeIcon
              icon={faBookmark}
              style={{
                fontSize: "25px",
                color: isBookmarked ? "2231aa" : "",
              }}
              cursor={"pointer"}
            />
          </button>
          {auth && (
            <button
              onClick={() => {
                dispatch(
                  toggleCart({
                    title,
                    subtitle,
                    isbn13,
                    price,
                    image,
                    url,
                  })
                )
              }}
              className={style.faCartShopping}
            >
              <FontAwesomeIcon
                icon={faCartShopping}
                style={{
                  fontSize: "25px",
                  color: isInCart ? "#2231aa" : "",
                }}
              />
            </button>
          )}
          {showRemoveButton && (
            <button onClick={onRemove} className={style.faCartShopping}>
              <FontAwesomeIcon
                icon={faCartShopping}
                style={{
                  fontSize: "25px",
                  color: isInCart ? "#d51212ff" : "",
                }}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookCard
