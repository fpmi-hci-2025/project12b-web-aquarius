import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import { checkValidToken } from "../../store/signInSlice"

interface ISignIn {
  signIn: { auth: boolean; isLoading: boolean; error: null | string }
}

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(checkValidToken())
  }, [])
  const { auth } = useSelector((state: ISignIn) => state.signIn)
  if (!auth) {
    return <Navigate to="/sign-in" />
  }
  return children
}
export default ProtectedRoute
