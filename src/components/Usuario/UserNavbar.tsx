import {AuthContext} from "../../context/AuthContext.tsx";
import {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useCarrinho} from "../../context/CarrinhoContext.tsx";
import Toast from "../Toast.tsx";

export default function UserNavbar() {
    const {logout} = useContext(AuthContext);
    const navigate = useNavigate();
    const {quantidadeTotal} = useCarrinho();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error' | 'warning' | 'info'>('success');

    const handleLogout = async () => {
        logout();
        setToastMessage("Logout realizado com sucesso! Volte sempre!");
        setToastType("success");
        setShowToast(true);
        console.log("Logout efetuado com sucesso!", localStorage.getItem("token"));
        navigate("/");
    }

    return (
        <div className="min-h-screen w-100">
            <nav className="bg-qs text-white shadow d-flex flex-row justify-content-between align-items-center py-2">
                <h2 className="text-xl font-bold pt-2 ps-2 ">QuickStore</h2>
                <div className="d-flex flex-row gap-2 justify-content-between text-end">
                    <button onClick={() => navigate('/produtos')} className="btn bg-nav text-white"><i className="bi bi-shop me-1"></i>Produtos</button>
                    <button onClick={() => navigate('/carrinho')} className="btn bg-nav text-white"><i className="bi bi-cart me-1"></i>Carrinho [{quantidadeTotal || 0}]</button>
                    <button onClick={() => navigate('/pedidos')} className="btn bg-nav text-white"><i className="bi bi-bag-fill me-1"></i>Pedidos</button>
                    <button onClick={handleLogout} className="btn text-white"><i className="bi bi-box-arrow-left me-1"></i>Sair</button>
                </div>
            </nav>
            <Toast show={showToast}
                   message={toastMessage}
                   type={toastType}
                   onClose={() => setShowToast(false)}
            />
        </div>
    );
}