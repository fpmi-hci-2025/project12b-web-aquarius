import { useEffect, useState } from "react"
import { NavLink, Route, useNavigate } from "react-router-dom"
import style from "./PopUp.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ReactComponent as Cancel } from "../../assets/cancelIcon.svg"
import {
  faThumbsUp,
  faThumbsDown,
  faEllipsisH,
  faBookmark,
} from "@fortawesome/free-solid-svg-icons"
import { useDispatch, useSelector } from "react-redux"
import { incrementDislike, incrementLike } from "../../store/counterSlice"
import { toggleBookmark } from "../../store/bookSlice"

interface IBookCard {
  id: number
  image?: string
  text?: string
  date: string
  title: string
  isFavorite: boolean
  close: () => void
}

interface ICounter {
  counter: {
    likes: number
    dislikes: number
  }
}

const PopUp = ({
  id,
  image,
  text,
  date,
  title,
  isFavorite,
  close,
}: IBookCard) => {
  const navigate = useNavigate()
  const { likes, dislikes } = useSelector((state: ICounter) => state.counter)

  const dispatch = useDispatch()
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  return (
    <div className={style.popUpBackground}>
      <div className={style.popUp}>
        <div className={style.cancelWrap}>
          <Cancel onClick={close} className={style.cancel} />
        </div>
        <div className={style.bookCardWrapMain}>
          <div className={style.bookCardWrapUp}>
            <div className={style.bookCardWrapLeft}>
              <div className={style.bookCardDate}>{date}</div>
              <h2 className={style.bookCardTitle}>
                <a
                  className={style.bookCardTitleLink}
                  onClick={() => {
                    navigate(`${id}`)
                  }}
                >
                  {title}
                </a>
              </h2>
              <div className={style.bookCardSubtitle}>{text}</div>
            </div>
            <div className={style.bookCardWrapRight}>
              <div className={style.imgWrap}>
                <img className={style.bookCardImg} src={image}></img>
              </div>
            </div>
          </div>

          <div className={style.bookCardWrapDown}>
            <div className={style.thumbsWrap}>
              <div className={style.thumbsUpWrap}>
                <FontAwesomeIcon
                  onClick={() => dispatch(incrementLike())}
                  cursor={"pointer"}
                  icon={faThumbsUp}
                  style={{ fontSize: "25px" }}
                />
                <div>{likes}</div>
              </div>
              <div className={style.thumbsDownWrap}>
                <FontAwesomeIcon
                  onClick={() => dispatch(incrementDislike())}
                  cursor={"pointer"}
                  icon={faThumbsDown}
                  style={{ fontSize: "25px" }}
                />
                <div>{dislikes}</div>
              </div>
            </div>
            <div className={style.saveDotsWrap}>
              <div className={style.saveDots}>
                <button
                  className={style.faBookmark}
                  onClick={() => {
                    dispatch(
                      toggleBookmark({
                        id,
                        image,
                        text,
                        date,
                        title,
                        isFavorite,
                      })
                    )
                  }}
                >
                  <FontAwesomeIcon
                    icon={faBookmark}
                    style={{ fontSize: "25px" }}
                    cursor={"pointer"}
                  />
                </button>
                <FontAwesomeIcon
                  icon={faEllipsisH}
                  style={{ fontSize: "25px" }}
                  cursor={"pointer"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PopUp
