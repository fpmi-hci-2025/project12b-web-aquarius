import style from "./Button.module.scss"

interface IProps {
  children: React.ReactNode
  isDisabled?: boolean
  btnType?: "primary" | "secondary"
  value: string
  clickAction: () => void
}
const Button = ({
  children,
  isDisabled = false,
  btnType = "primary",
  value,
  clickAction,
}: IProps) => {
  return (
    <button
      onClick={clickAction}
      className={
        btnType === "secondary" ? `${style.secondary}` : `${style.primary}`
      }
      disabled={isDisabled}
    >
      {children}
    </button>
  )
}
export default Button
