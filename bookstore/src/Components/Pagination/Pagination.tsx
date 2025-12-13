import style from "./Pagination.module.scss"
import { ReactComponent as LeftArrow } from "../../assets/left_arrow.svg"
import { ReactComponent as RightArrow } from "../../assets/right_arrow.svg"
import { IPaginationComponent } from "../../types/types"

const Pagination = ({
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
}: IPaginationComponent) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const renderPageNumber = () => {
    const pageNumber = []
    const maxPageNumber = 5
    const startPage = Math.max(currentPage - Math.floor(maxPageNumber / 2), 1)
    const endPage = Math.min(startPage + maxPageNumber - 1, totalPages)

    for (let i = startPage; i <= endPage; i++) {
      pageNumber.push(
        <button
          className={style.numbers}
          style={{ color: i === currentPage ? "#2231aa" : "" }}
          key={i}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>
      )
    }

    return pageNumber
  }

  return (
    <div className={style.numbersWrapper}>
      <div className={style.leftArrowWrap}>
        <button
          className={style.leftArrow}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <LeftArrow className={style.leftArrowSvg} />
        </button>
        <button
          className={style.prevWrap}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
      </div>
      <div className={style.pageNubmers}>{renderPageNumber()}</div>
      <div className={style.rightArrowWrap}>
        <button
          className={style.nextWrap}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        <button
          className={style.rightArrow}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <RightArrow className={style.rightArrowSvg} />
        </button>
      </div>
    </div>
  )
}

export default Pagination
