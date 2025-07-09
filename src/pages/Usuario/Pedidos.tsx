import {useState, useEffect} from "react";
import {usePedido} from "../../context/PedidoContext.tsx";
import type {Pedido} from "../../context/PedidoContext.tsx";
import PedidoModal from "../../components/Usuario/PedidoModal.tsx";
import Toast from "../../components/Toast.tsx";
import {useNavigate} from "react-router-dom";
import {StatusPedido} from "../../services/statusPedido.ts";

function Pedidos() {
    const {
        listarPedidos,
        cancelarPedido,
        pedidos: todosOsPedidos
    } = usePedido();
    const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null);
    // @ts-ignore
    const [pedidosAgrupados, setPedidosAgrupados] = useState<Record<StatusPedido, Pedido[]>>({});
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error' | 'warning' | 'info'>('success');
    const navigate = useNavigate();

    useEffect(() => {
        listarPedidos();
    }, []);

    useEffect(() => {
        if (todosOsPedidos && todosOsPedidos.length > 0) {
            const agrupados = todosOsPedidos.reduce((acc, pedido) => {
                const status = pedido.status;
                if (!acc[status]) {
                    acc[status] = [];
                }
                acc[status].push(pedido);
                return acc;
            }, {} as Record<StatusPedido, Pedido[]>);
            setPedidosAgrupados(agrupados);
        } else {
            // @ts-ignore
            setPedidosAgrupados({});
        }
    }, [todosOsPedidos]);

    const abrirModal = (pedido: Pedido) => {
        setPedidoSelecionado(pedido);
    }

    const fecharModal = () => {
        setPedidoSelecionado(null);
    }

    const handlePagarPedido = (novoPedido: Pedido) => {
        setToastMessage("Redirecionando para o pagamento do pedido...");
        setToastType("info");
        navigate(`/pagamento/${novoPedido.id}`);
    }

    const handleAction = async (action: (id: number) => Promise<void>, pedidoId: number, successMessage: string) => {
        try {
            await action(pedidoId);
            setToastMessage(successMessage);
            setToastType("success");
            fecharModal();
        } catch (error: any) {
            setToastMessage(error.message || 'Ocorreu um erro.');
            setToastType("error");
        } finally {
            setShowToast(true);
        }
    };

    const colunasStatus: { status: StatusPedido, titulo: string }[] = [
        { status: StatusPedido.CRIADO, titulo: "Novos Pedidos" },
        { status: StatusPedido.ACEITO, titulo: "Pedidos Aceitos" },
        { status: StatusPedido.PAGO, titulo: "Aguardando Envio" },
        { status: StatusPedido.ENVIADO, titulo: "Pedidos Enviados" },
        { status: StatusPedido.ENTREGUE, titulo: "Entregues" },
        { status: StatusPedido.CANCELADO, titulo: "Cancelados" },
    ];

    return (
        <div className="container mt-4">
            <h1 className="title">Meus Pedidos</h1>

            <div className="row g-3">
                {colunasStatus.map(({ status, titulo }) => {
                    const pedidosDaColuna = pedidosAgrupados[status] || [];
                    return (
                        <div key={status} className="col-lg-4 col-md-6 col-sm-12 mb-0 mb-md-4">
                            <div className="p-3 rounded">
                                <h5 className="mb-3">{titulo} ({pedidosDaColuna.length})</h5>
                                {pedidosDaColuna.length > 0 ? (
                                    pedidosDaColuna.map(pedido => {
                                        const isCriado = pedido.status === StatusPedido.ACEITO;
                                        return (
                                            <div
                                                key={pedido.id}
                                                className={`card shadow-sm mb-2 ${isCriado ? 'card-criado' : ''}`}
                                                onClick={() => abrirModal(pedido)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between">
                                                        <h6 className="card-title">Pedido #{pedido.id}</h6>
                                                        <span className="fw-bold">R$ {pedido.valorTotal.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                                <div className="card-footer d-flex justify-content-center">
                                                    {pedido.status === 'ACEITO' && (
                                                        <button className="btn bg-qs btn-primary"
                                                                onClick={() => handlePagarPedido(pedido)}>Pagar</button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-muted fst-italic">Nenhum pedido neste status.</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {pedidoSelecionado && (
                <PedidoModal
                    pedido={pedidoSelecionado}
                    onCancelarPedido={() => handleAction(cancelarPedido, pedidoSelecionado.id, 'Pedido cancelado!')}
                    onCloseModal={fecharModal}
                />
            )}
            <Toast show={showToast}
                   message={toastMessage}
                   type={toastType}
                   onClose={() => setShowToast(false)}
            />
        </div>
    );
}

export default Pedidos;