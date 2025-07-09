import {useAuth} from "../context/AuthContext.tsx";
import {Navigate, Outlet} from "react-router-dom";

export function AdminRoute() {
    const {usuario} = useAuth();

    if (usuario && usuario.role == 'admin') {
        return <Outlet />;
    } else {
        return <Navigate to="/" replace={true} />;
    }
}