import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";


const ProtectedRoute = ({children}) => {     // prop destrutturata
    const auth = useSelector((state) => state.auth);

    if(!auth || !auth.accessToken) {
        return <Navigate to="/login"/>
    }

    return children
}

export default ProtectedRoute;