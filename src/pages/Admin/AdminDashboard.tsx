import {useAuth, type Usuario} from "../../context/AuthContext.tsx";
import {Link} from "lucide-react";
import {useEffect, useState} from "react";
import {usePedido} from "../../context/PedidoContext.tsx";

export default function AdminDashboard() {
    const { usuario, buscarUsuarios } = useAuth();
    const { listarVendasTotais, listarPedidosAdmin } = usePedido();
    const [vendas, setVendas] = useState(0);
    const [pedidosTotais, setPedidosTotais] = useState(0);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [totalUsuarios, setTotalUsuarios] = useState(0);

    useEffect(()=> {
        const carregarVendas = async () => {
            try {
                const response = await listarVendasTotais();
                setVendas(response);
            } catch (e) {
                console.error("Erro ao carregar vendas: ", e);
            }
        };

        const carregarPedidos = async () => {
            try {
                const response = await listarPedidosAdmin();
                if (response !== undefined) {
                    setPedidosTotais(response.length);
                }
            } catch (e) {
                console.error("Erro ao carregar pedidos: ", e);
            }
        };

        const buscarUsuariosTotais = async () => {
            try {
                const usuarios = await buscarUsuarios();
                setTotalUsuarios(usuarios.length);
            } catch (e) {
                console.error("Erro ao carregar pedidos: ", e);
            }
        };

        const usuariosTotais = async () => {
            try {
                const usuarios = await buscarUsuarios();
                setUsuarios(usuarios);
            } catch (e) {
                console.error("Erro ao carregar pedidos: ", e);
            }
        };

        carregarVendas();
        carregarPedidos();
        buscarUsuariosTotais();
        usuariosTotais();
    }, []);

    // const formatarData = (data: string) => {
    //     return new Date(data).toLocaleDateString('pt-BR');
    // };

    return (
        <div className="container-fluid p-4">
            <div className="mb-4">
                <h1 className="fs-2">Bem-vindo(a), {usuario?.nome || 'Admin'}!</h1>
                <p className="text-muted">Aqui está um resumo da sua loja hoje, {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}.</p>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-md-6 col-xl-3">
                    <div className="card shadow-sm h-100">
                        <div className="card-body d-flex align-items-center">
                            <div className="p-3 bg-qs bg-opacity-10 rounded-3 me-3">
                                <i className="bi bi-currency-dollar fs-2 text-qs"></i>
                            </div>
                            <div>
                                <p className="card-text text-muted mb-1">Total de Vendas</p>
                                <h4 className="card-title mb-0">R$ {vendas.toFixed(2)}</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-xl-3">
                    <div className="card shadow-sm h-100">
                        <div className="card-body d-flex align-items-center">
                            <div className="p-3 bg-qs bg-opacity-10 rounded-3 me-3">
                                <i className="bi bi-box-seam fs-2 text-qs"></i>
                            </div>
                            <div>
                                <p className="card-text text-muted mb-1">Pedidos Recebidos</p>
                                <h4 className="card-title mb-0">{pedidosTotais}</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-xl-3">
                    <div className="card shadow-sm h-100">
                        <div className="card-body d-flex align-items-center">
                            <div className="p-3 bg-qs bg-opacity-10 rounded-3 me-3">
                                <i className="bi bi-receipt fs-2 text-qs"></i>
                            </div>
                            <div>
                                <p className="card-text text-muted mb-1">Média por Pedido</p>
                                <h4 className="card-title mb-0">R$ {(vendas / pedidosTotais).toFixed(2)}</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-xl-3">
                    <div className="card shadow-sm h-100">
                        <div className="card-body d-flex align-items-center">
                            <div className="p-3 bg-qs bg-opacity-10 rounded-3 me-3">
                                <i className="bi bi-person-plus fs-2 text-qs"></i>
                            </div>
                            <div>
                                <p className="card-text text-muted mb-1">Total de Clientes</p>
                                <h4 className="card-title mb-0">{totalUsuarios}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-xl-8">
                    <div className="card shadow-sm h-100">
                        <div className="card-header bg-transparent">
                            <h5 className="card-title mb-0">Desempenho de Vendas</h5>
                        </div>
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                                <p>Gráfico de vendas será implementado aqui.</p>
                                <svg width="100%" height="250" className="mt-3">
                                    <defs>
                                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" style={{ stopColor: '#6610f2', stopOpacity: 0.4 }} />
                                            <stop offset="100%" style={{ stopColor: '#6610f2', stopOpacity: 0.05 }} />
                                        </linearGradient>
                                    </defs>
                                    <polyline fill="none" stroke="#6610f2" strokeWidth="2" points="0,200 100,150 200,170 300,120 400,140 500,100 600,110 700,80 800,90" />
                                    <path fill="url(#gradient)" d="M0,200 100,150 200,170 300,120 400,140 500,100 600,110 700,80 800,90 L800,250 L0,250 Z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-header bg-transparent d-flex justify-content-between align-items-center">
                            <h5 className="card-title mb-0">Clientes Recentes</h5>
                            <Link to="/admin/clientes" className="btn btn-sm btn-outline-secondary">Ver Todos</Link>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <tbody>
                                    {usuarios.map(usuario => (
                                        <tr key={usuario.id}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="p-2 bg-secondary bg-opacity-10 rounded-circle me-3">
                                                        <i className="bi bi-person"></i>
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold">{usuario.nome}</div>
                                                        <small className="text-muted">{usuario.email}</small>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
