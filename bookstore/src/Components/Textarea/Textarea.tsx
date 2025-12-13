import { useState } from "react"
import style from "./Textarea.module.scss"

interface IProps {
  title: string
  placeholder?: string
  value: string
}

const Textarea = ({
  title,
  placeholder = "placeholder",
  value: any,
}: IProps) => {
  const [textArea, setTextArea] = useState("")
  return (
    <div className={style.textareaWrap}>
      <label className={style.textareaLabel}>{title}</label>
      <textarea
        className={style.textarea}
        placeholder={placeholder}
        value={textArea}
        onChange={(e) => setTextArea(e.target.value)}
      />
    </div>
  )
}

export default Textarea
