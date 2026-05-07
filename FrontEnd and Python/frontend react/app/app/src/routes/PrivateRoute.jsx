import { Navigate } from "react-router-dom"
import { isLoggedIn } from "../localstorage"

const PrivateRoute = ({ children }) => {
  return isLoggedIn() ? children : <Navigate to="/login" replace />
}

export default PrivateRoute
