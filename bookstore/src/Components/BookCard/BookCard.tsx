import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCartShopping, faBookmark } from "@fortawesome/free-solid-svg-icons"
import style from "./BookCard.module.scss"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { IBook, IBookCard, ISignIn } from "../../types/types"
import { toggleBookmark, toggleCart } from "../../store/bookSlice"
import { addToCart, removeFromCart } from "../../store/cartSlice"
import { isAdmin } from "../../utils/isAdmin"

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
  const { username } = useSelector((state: any) => state.signIn)
  const bookmarks = useSelector((state: IBook) => state.books.bookmarks)
  const localCart = useSelector((state: any) => state.books.cart || [])
  const serverCart = useSelector((state: any) => state.cart.items || [])

  const isBookmarked = bookmarks.some(
    (book: IBookCard) => book.isbn13 === isbn13
  )

  const isInLocalCart = localCart.some((item: any) => item.isbn13 === isbn13)
  const isInServerCart = serverCart.some((item: any) => item.bookId === isbn13)

  const handleCartToggle = () => {
    if (auth && !isAdmin(username)) {
      if (isInServerCart) {
        dispatch(removeFromCart(isbn13))
      } else {
        dispatch(addToCart(isbn13))
      }
    } else {
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
    }
  }

  return (
    <div className={style.bookCardWrap}>
      <div className={style.bookCardWrapUp}>
        <div className={style.imgWrap}>
          <img
            onClick={() => navigate(url || `/${isbn13}`)}
            className={style.bookCardImg}
            src={image}
            alt={title}
          />
        </div>

        <div className={style.bookCardPrice}>{price}</div>
        <h2 className={style.bookCardTitle}>
          <div
            onClick={() => navigate(url || `/${isbn13}`)}
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
                color: isBookmarked ? "#2231aa" : "",
              }}
              cursor={"pointer"}
            />
          </button>

          {auth && !isAdmin(username) && (
            <button onClick={handleCartToggle} className={style.faCartShopping}>
              <FontAwesomeIcon
                icon={faCartShopping}
                style={{
                  fontSize: "25px",
                  color: isInServerCart ? "#2231aa" : "",
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
                  color: "#d51212",
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
