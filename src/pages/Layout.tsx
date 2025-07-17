import {useLocation, useNavigate} from "react-router-dom";
import UserNavbar from "../components/Usuario/UserNavbar.tsx";
import * as React from "react";
import {useAuth} from "../context/AuthContext.tsx";
import AdminNavbar from "../components/Admin/AdminNavbar.tsx";
import 'react-toastify/dist/ReactToastify.css';
import {toast, ToastContainer} from "react-toastify";
import {useEffect} from "react";

export default function Layout({children}: { children: React.ReactNode }) {
    const location = useLocation();
    const {usuario} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (usuario && (location.pathname == '/' || location.pathname == '/login')) {
            toast.success(`Bem vindo(a) de volta, ${usuario.nome}!`);

            if (usuario.role === 'admin'){
                navigate('/admin');
            } else {
                navigate('/produtos');
            }
        }
    }, [usuario, navigate, location.pathname]);

    const rotasSemNavbar = ['/', '/registro', '*'];
    const esconderNavbar = rotasSemNavbar.includes(location.pathname) || !usuario;

    const renderBar = () => {
        if (esconderNavbar) {
            return null;
        }
        if (usuario?.role == 'admin') {
            return <AdminNavbar />;
        } else {
            return <UserNavbar />;
        }
    };

    return (
        <div className="div-main">
            {renderBar()}
            <main>
                <ToastContainer
                    position="top-right"
                    autoClose={4000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
                {children}
            </main>
        </div>
    );
}