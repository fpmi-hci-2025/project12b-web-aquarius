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
  // Для серверной корзины (авторизованные)
  const serverCart = useSelector((state: any) => state.cart.items || [])

  const isBookmarked = bookmarks.some(
    (book: IBookCard) => book.isbn13 === isbn13
  )

  // Правильная проверка в зависимости от авторизации
  const isInLocalCart = localCart.some((item: any) => item.isbn13 === isbn13)
  const isInServerCart = serverCart.some((item: any) => item.bookId === isbn13)

  // Определяем, находится ли книга в активной корзине
  const isInCart = auth ? isInServerCart : isInLocalCart

  const handleCartToggle = () => {
    if (auth && !isAdmin(username)) {
      // Для авторизованных: работа с серверной корзиной
      if (isInServerCart) {
        dispatch(removeFromCart(isbn13))
      } else {
        dispatch(addToCart(isbn13))
      }
    } else {
      // Для неавторизованных: работа с локальной корзиной
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

  // return (
  //   <div className={style.bookCardWrap}>
  //     <div className={style.bookCardWrapUp}>
  //       <div className={style.imgWrap}>
  //         <img
  //           onClick={() => {
  //             // Prefer the provided url when available; fallback to isbn13 route
  //             navigate(url || `/${isbn13}`)
  //           }}
  //           className={style.bookCardImg}
  //           src={image}
  //         />
  //       </div>

  //       <div className={style.bookCardPrice}>{price}</div>
  //       <h2 className={style.bookCardTitle}>
  //         <div
  //           onClick={() => {
  //             navigate(url || `/${isbn13}`)
  //           }}
  //           className={style.bookCardTitleLink}
  //         >
  //           {title}
  //         </div>
  //       </h2>
  //     </div>

  //     <div className={style.saveDotsWrap}>
  //       <div className={style.interactivePart}>
  //         <button
  //           className={style.faBookmark}
  //           onClick={() => {
  //             dispatch(
  //               toggleBookmark({
  //                 title,
  //                 subtitle,
  //                 isbn13,
  //                 price,
  //                 image,
  //                 url,
  //               })
  //             )
  //           }}
  //         >
  //           <FontAwesomeIcon
  //             icon={faBookmark}
  //             style={{
  //               fontSize: "25px",
  //               color: isBookmarked ? "2231aa" : "",
  //             }}
  //             cursor={"pointer"}
  //           />
  //         </button>
  //         {auth && (
  //           <button
  //             onClick={() => {
  //               const exists = isInCart
  //               if (exists) {
  //                 dispatch(removeFromCart(isbn13))
  //               } else {
  //                 dispatch(addToCart(isbn13))
  //               }
  //               // dispatch(
  //               //   toggleCart({
  //               //     title,
  //               //     subtitle,
  //               //     isbn13,
  //               //     price,
  //               //     image,
  //               //     url,
  //               //   })
  //               // )
  //               // dispatch(addToCart(isbn13))

  //               // dispatch(removeFromCart(isbn13))
  //             }}
  //             className={style.faCartShopping}
  //           >
  //             <FontAwesomeIcon
  //               icon={faCartShopping}
  //               style={{
  //                 fontSize: "25px",
  //                 color: isInCart ? "#2231aa" : "",
  //               }}
  //             />
  //           </button>
  //         )}
  //         {showRemoveButton && (
  //           <button onClick={onRemove} className={style.faCartShopping}>
  //             <FontAwesomeIcon
  //               icon={faCartShopping}
  //               style={{
  //                 fontSize: "25px",
  //                 color: isInCart ? "#d51212ff" : "",
  //               }}
  //             />
  //           </button>
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // )
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

          {auth && (
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
