import {useAuth} from "../context/AuthContext.tsx";
import {Navigate, Outlet} from "react-router-dom";

export default function PrivateRoute() {
    const {isAuthenticated, carregando} = useAuth();

    if (carregando) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
            </div>
        );
    }
    return isAuthenticated() ? <Outlet/> : <Navigate to="/" replace/>;
}