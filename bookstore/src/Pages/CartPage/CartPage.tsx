// CartPage.tsx
import { useEffect } from "react"
import style from "./CartPage.module.scss"
import { useDispatch, useSelector } from "react-redux"
import { setPage } from "../../store/paginationSlice"
import Title from "../../Components/Title/Title"
import BookCard from "../../Components/BookCard/BookCard"
import Pagination from "../../Components/Pagination/Pagination"
import { IBookCard, IPagination } from "../../types/types"
import { useNavigate } from "react-router-dom"
import { removeFromCart } from "../../store/cartSlice"
import { toggleCart } from "../../store/bookSlice"

const CartPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { auth } = useSelector((state: any) => state.signIn)

  // Используем правильную корзину в зависимости от авторизации
  const localCart = useSelector((state: any) => state.books.cart || [])
  const serverCart = useSelector((state: any) => state.cart.items || [])

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
  const books = useSelector((state: any) => state.pagination.books)

  const getBookImage = (bookId: string) => {
    const book = books.find((b: any) => b.isbn13 === bookId)
    return book?.image || "/placeholder.png"
  }

  // Выбираем правильную корзину и добавляем уникальные ключи
  const itemsArray: IBookCard[] = auth
    ? serverCart.map((item: any, index: number) => ({
        id: `${item.bookId}_${index}_${Date.now()}`, // Уникальный ключ
        isbn13: item.bookId,
        title: item.title || "Unknown title",
        price: `$${parseFloat(item.price || "0").toFixed(2)}`,
        image: getBookImage(item.bookId),

        url: `/books/${item.bookId}`,
        subtitle: "",
        authors: "",
        publisher: "",
        pages: "",
        desc: "",
      }))
    : localCart.map((item: any, index: number) => ({
        ...item,
        id: `${item.isbn13}_${index}_${Date.now()}`, // Уникальный ключ
      }))

  // Убираем дубликаты по isbn13
  const uniqueItems = itemsArray.filter(
    (item, index, self) =>
      self.findIndex((t) => t.isbn13 === item.isbn13) === index
  )

  const totalItems = uniqueItems.length

  const paginatedBooks = uniqueItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePageChange = (pageNumber: number) => {
    dispatch(setPage(pageNumber))
  }

  const handleRemove = (item: any) => {
    if (auth) {
      dispatch(removeFromCart(item.isbn13))
    } else {
      // Для локальной корзины используйте toggleCart из bookSlice
      dispatch(toggleCart(item))
    }
  }

  return (
    <div className={style.cartWrap}>
      <div className={style.container}>
        <Title title="My cart" />

        <div className={style.booksCardWrap}>
          {paginatedBooks.length > 0 ? (
            paginatedBooks.map((item) => (
              <BookCard
                key={item.id} // Используем уникальный id вместо isbn13
                {...item}
                showRemoveButton
                onRemove={() => handleRemove(item)}
              />
            ))
          ) : (
            <div>No books in cart yet!</div>
          )}
        </div>
        <div>
          <button
            className={style.checkoutBtn}
            onClick={() => {
              if (totalItems <= 0) {
                alert("Нельзя оформить пустую корзину")
                return
              }
              navigate("/checkout")
            }}
            disabled={totalItems <= 0}
          >
            Оформить заказ
          </button>
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
// CartPage.tsx
// import { useEffect } from "react"
// import style from "./CartPage.module.scss"
// import { useDispatch, useSelector } from "react-redux"
// import { setPage } from "../../store/paginationSlice"
// import Title from "../../Components/Title/Title"
// import BookCard from "../../Components/BookCard/BookCard"
// import Pagination from "../../Components/Pagination/Pagination"
// import { IBookCard, IPagination } from "../../types/types"
// import { useNavigate } from "react-router-dom"
// import { removeFromCart } from "../../store/cartSlice"
// import { toggleCart } from "../../store/bookSlice"

// const CartPage = () => {
//   const dispatch = useDispatch()
//   const navigate = useNavigate()

//   const { auth } = useSelector((state: any) => state.signIn)

//   // Используем правильную корзину в зависимости от авторизации
//   const localCart = useSelector((state: any) => state.books.cart || [])
//   const serverCart = useSelector((state: any) => state.cart.items || [])

//   const {
//     loading: paginationLoading,
//     error: paginationError,
//     currentPage,
//     itemsPerPage,
//   } = useSelector((state: IPagination) => state.pagination)

//   useEffect(() => {
//     dispatch(setPage(1))
//   }, [dispatch])

//   if (paginationLoading) {
//     return <div>Loading...</div>
//   }

//   if (paginationError) {
//     return <div>Error...</div>
//   }

//   // Выбираем правильную корзину
//   const itemsArray: IBookCard[] = auth
//     ? serverCart.map((item: any) => ({
//         isbn13: item.bookId,
//         title: item.title || "Unknown title",
//         price: `$${parseFloat(item.price || "0").toFixed(2)}`,
//         image: item.image || "/placeholder.png",
//         url: `/books/${item.bookId}`,
//         subtitle: "",
//         authors: "",
//         publisher: "",
//         pages: "",
//         desc: "",
//       }))
//     : localCart

//   const totalItems = itemsArray.length

//   const paginatedBooks = itemsArray.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   )

//   const handlePageChange = (pageNumber: number) => {
//     dispatch(setPage(pageNumber))
//   }

//   const handleRemove = (item: any) => {
//     if (auth) {
//       dispatch(removeFromCart(item.isbn13))
//     } else {
//       // Для локальной корзины используйте toggleCart из bookSlice
//       dispatch(toggleCart(item))
//     }
//   }

//   return (
//     <div className={style.cartWrap}>
//       <div className={style.container}>
//         <Title title="My cart" />

//         <div className={style.booksCardWrap}>
//           {paginatedBooks.length > 0 ? (
//             paginatedBooks.map((item) => (
//               <BookCard
//                 key={item.isbn13}
//                 {...item}
//                 showRemoveButton
//                 onRemove={() => handleRemove(item)}
//               />
//             ))
//           ) : (
//             <div>No books in cart yet!</div>
//           )}
//         </div>
//         <div>
//           <button
//             className={style.checkoutBtn}
//             onClick={() => {
//               if (totalItems <= 0) {
//                 alert("Нельзя оформить пустую корзину")
//                 return
//               }
//               navigate("/checkout")
//             }}
//             disabled={totalItems <= 0}
//           >
//             Оформить заказ
//           </button>
//         </div>
//         <div className={style.numbersWrapper}>
//           <Pagination
//             currentPage={currentPage}
//             itemsPerPage={itemsPerPage}
//             totalItems={totalItems}
//             onPageChange={handlePageChange}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default CartPage

// import { useEffect } from "react"
// import style from "./CartPage.module.scss"
// import { useDispatch, useSelector } from "react-redux"
// import { setPage } from "../../store/paginationSlice"
// import Title from "../../Components/Title/Title"
// import BookCard from "../../Components/BookCard/BookCard"
// import Pagination from "../../Components/Pagination/Pagination"
// import { IBookCard, IPagination, IBook } from "../../types/types"
// import { toggleCart } from "../../store/bookSlice"
// import { useNavigate } from "react-router-dom"

// const CartPage = () => {
//   const dispatch = useDispatch()
//   const navigate = useNavigate()

//   const { cart } = useSelector((state: IBook) => state.books)

//   const {
//     loading: paginationLoading,
//     error: paginationError,
//     currentPage,
//     itemsPerPage,
//   } = useSelector((state: IPagination) => state.pagination)

//   useEffect(() => {
//     dispatch(setPage(1))
//   }, [dispatch])

//   if (paginationLoading) {
//     return <div>Loading...</div>
//   }

//   if (paginationError) {
//     return <div>Error...</div>
//   }

//   // Read cart from bookSlice (client-side cart like bookmarks)
//   const itemsArray: IBookCard[] = Array.isArray(cart) ? cart : []

//   const totalItems = itemsArray.length

//   const paginatedBooks = itemsArray.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   )

//   const handlePageChange = (pageNumber: number) => {
//     dispatch(setPage(pageNumber))
//   }

//   return (
//     <div className={style.cartWrap}>
//       <div className={style.container}>
//         <Title title="My cart" />

//         <div className={style.booksCardWrap}>
//           {paginatedBooks.length > 0 ? (
//             paginatedBooks.map((item) => (
//               <BookCard
//                 key={item.isbn13}
//                 {...item}
//                 showRemoveButton
//                 onRemove={() => dispatch(toggleCart(item))}
//               />
//             ))
//           ) : (
//             <div>No books in cart yet!</div>
//           )}
//         </div>
//         <div>
//           <button
//             className={style.checkoutBtn}
//             onClick={() => {
//               if (totalItems <= 0) {
//                 alert("Нельзя оформить пустую корзину")
//                 return
//               }
//               navigate("/checkout")
//             }}
//             disabled={totalItems <= 0}
//           >
//             Оформить заказ
//           </button>
//         </div>
//         <div className={style.numbersWrapper}>
//           <Pagination
//             currentPage={currentPage}
//             itemsPerPage={itemsPerPage}
//             totalItems={totalItems}
//             onPageChange={handlePageChange}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default CartPage
