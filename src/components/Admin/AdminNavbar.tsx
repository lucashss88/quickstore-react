import {useContext} from "react";
import {AuthContext} from "../../context/AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import useIsDesktop from "../../utils/useIsDesktop.ts";

export default function AdminNavbar() {
    const {logout, usuario} = useContext(AuthContext);
    const navigate = useNavigate();
    const isDesktop = useIsDesktop();

    const handleLogout = async () => {
        logout();
        toast.success('Logout realizado com sucesso!');
        console.log("Logout efetuado com sucesso!");
        navigate("/");
    }

    return (
        <div className="min-h-screen w-100">
            <nav className="bg-qs text-white shadow d-flex flex-row justify-content-between align-items-center py-2">
                <h2 className="text-xl font-bold pt-2 ps-2 "><a href="/admin" className="text-decoration-none text-white">QuickStore</a>
                </h2>
                {isDesktop && (
                    <div className="d-flex flex-row gap-2 justify-content-between text-end">
                        <button onClick={() => navigate('/admin/produtos')} className="btn text-white"><i
                            className="bi bi-shop me-1"></i>Produtos
                        </button>
                        <button onClick={() => navigate('/admin/pedidos')} className="btn text-white"><i
                            className="bi bi-bag-fill me-1"></i>Pedidos
                        </button>
                        <div className="dropdown pe-2">
                            <a href="#"
                               className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
                               data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="bi bi-person-circle fs-4 me-2"></i>
                                <strong>{usuario?.nome || 'Admin'}</strong>
                            </a>
                            <ul className="dropdown-menu dropdown-menu-dark text-small shadow"
                                style={{cursor: 'pointer'}}>
                                <li><a className="dropdown-item" onClick={() => navigate('/admin/perfil')}>Editar
                                    Perfil</a></li>
                                <li>
                                    <hr className="dropdown-divider bg-light mx-md-3 mx-0"/>
                                </li>
                                <li><a className="dropdown-item" onClick={() => navigate('/admin/criar')}>Criar
                                    Administrador</a></li>
                                <li>
                                    <hr className="dropdown-divider bg-light mx-md-3 mx-0"/>
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
                )}
                {!isDesktop && (
                    <div className="d-flex flex-row justify-content-between text-end">
                        <button onClick={() => navigate('/admin/produtos')} className="btn text-white"><i
                            className="bi bi-shop me-1"></i>
                        </button>
                        <button onClick={() => navigate('/admin/pedidos')} className="btn text-white"><i
                            className="bi bi-bag-fill me-1"></i>
                        </button>
                        <div className="dropdown pe-2">
                            <a href="#"
                               className="d-flex align-items-center text-white text-decoration-none"
                               data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="bi bi-list fs-1 me-2"></i>
                            </a>
                            <ul className="dropdown-menu dropdown-menu-dark text-small shadow"
                                style={{cursor: 'pointer'}}>
                                <li className="dropdown-item">
                                    <strong>{usuario?.nome || 'Admin'}</strong>
                                </li>
                                <li>
                                    <hr className="dropdown-divider bg-light mx-md-3 mx-0"/>
                                </li>
                                <li><a className="dropdown-item" onClick={() => navigate('/admin/perfil')}>Editar
                                    Perfil</a></li>
                                <li>
                                    <hr className="dropdown-divider bg-light mx-md-3 mx-0"/>
                                </li>
                                <li><a className="dropdown-item" onClick={() => navigate('/admin/criar')}>Criar
                                    Administrador</a></li>
                                <li>
                                    <hr className="dropdown-divider bg-light mx-md-3 mx-0"/>
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
                )}
            </nav>
        </div>
    );
}