import {AuthContext} from "../../context/AuthContext.tsx";
import {useContext} from "react";
import {useNavigate} from "react-router-dom";
import {useCarrinho} from "../../context/CarrinhoContext.tsx";
import {toast} from "react-toastify";

export default function UserNavbar() {
    const {logout, usuario} = useContext(AuthContext);
    const navigate = useNavigate();
    const {quantidadeTotal} = useCarrinho();

    const handleLogout = async () => {
        logout();
        toast.success('Logout realizado com sucesso!');
        console.log("Logout efetuado com sucesso!");
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
                    <div className="dropdown pe-2">
                        <a href="#"
                           className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
                           data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="bi bi-person-circle fs-4 me-2"></i>
                            <strong>{usuario?.nome || 'Usuario'}</strong>
                        </a>
                        <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
                            <li><a className="dropdown-item" onClick={() => navigate('/perfil')}>Editar Perfil</a></li>
                            <li>
                                <hr className="dropdown-divider"/>
                            </li>
                            <li>
                                <button className="dropdown-item" onClick={handleLogout}>
                                    <i className="bi bi-box-arrow-left me-2"></i>
                                    Sair
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}