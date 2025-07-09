import {useLocation, useNavigate} from "react-router-dom";
import UserNavbar from "../components/Usuario/UserNavbar.tsx";
import * as React from "react";
import {useAuth} from "../context/AuthContext.tsx";
import {useEffect, useState} from "react";
import Toast from "../components/Toast.tsx";
import AdminNavbar from "../components/Admin/AdminNavbar.tsx";


export default function Layout({children}: { children: React.ReactNode }) {
    const location = useLocation();
    const {usuario} = useAuth();
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error' | 'warning' | 'info'>('success');

    useEffect(() => {
        if (usuario && (location.pathname === '/' || location.pathname === '/login')) {
            const message = `Login realizado com sucesso, ${usuario.email}!`;
            setToastMessage(message);
            setToastType('success');
            setShowToast(true);

            if (usuario.role === 'admin') {
                navigate('/admin/produtos');
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
        <div>
            {renderBar()}
            <main>
                {children}
            </main>
            <Toast show={showToast}
                   message={toastMessage}
                   type={toastType}
                   onClose={() => setShowToast(false)}
            />
        </div>
    );
}