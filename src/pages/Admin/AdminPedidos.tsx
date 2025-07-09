import {useEffect, useState} from "react";
import {type Pedido, usePedido} from "../../context/PedidoContext.tsx";
import Toast from "../../components/Toast.tsx";
import AdminPedidoModal from "../../components/Admin/AdminPedidoModal.tsx";
import {StatusPedido} from "../../services/statusPedido.ts";

function AdminPedidos() {
    const {listarPedidosAdmin,
        aceitarPedido,
        enviarPedido,
        finalizarPedido,
        cancelarPedido,
        pedidos: todosOsPedidos,
        carregando,
        erro
    } = usePedido();
    const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null);
    // @ts-ignore
    const [pedidosAgrupados, setPedidosAgrupados] = useState<Record<StatusPedido, Pedido[]>>({});
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error' | 'warning' | 'info'>('success');

    useEffect(() => {
        listarPedidosAdmin();
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

    if (carregando) return <h1 className="text-center">Carregando pedidos...</h1>;
    if (erro) return <h1 className="text-center text-danger">{erro.message}</h1>;

    return (
        <div className="container-fluid mt-4">
            <h1 className="title mb-4">Gerenciamento de Pedidos</h1>

            <div className="row g-3">
                {colunasStatus.map(({ status, titulo }) => {
                    const pedidosDaColuna = pedidosAgrupados[status] || [];
                    return (
                        <div key={status} className="col-lg-4 col-md-6 col-sm-12 mb-0 mb-md-4">
                            <div className="p-3 rounded">
                                <h5 className="mb-3">{titulo} ({pedidosDaColuna.length})</h5>
                                {pedidosDaColuna.length > 0 ? (
                                    pedidosDaColuna.map(pedido => {
                                        const isCriado = pedido.status === StatusPedido.CRIADO; // Verifica o status do pedido
                                        return (
                                            <div
                                                key={pedido.id}
                                                className={`card shadow-sm mb-2 ${isCriado ? 'card-criado' : ''}`} // Aplica estilo para CRIADO
                                                onClick={() => abrirModal(pedido)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between">
                                                        <h6 className="card-title">Pedido #{pedido.id}</h6>
                                                        <span className="fw-bold">R$ {pedido.valorTotal.toFixed(2)}</span>
                                                    </div>
                                                    <p className="card-text text-muted mb-0">
                                                        Cliente: {pedido.usuario?.nome || "Nome do cliente não informado"}
                                                    </p>
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
                <AdminPedidoModal
                    pedido={pedidoSelecionado}
                    onCloseModal={fecharModal}
                    onAceitarPedido={() => handleAction(aceitarPedido, pedidoSelecionado.id, 'Pedido aceito!')}
                    onEnviarPedido={() => handleAction(enviarPedido, pedidoSelecionado.id, 'Pedido enviado!')}
                    onFinalizarPedido={() => handleAction(finalizarPedido, pedidoSelecionado.id, 'Pedido finalizado!')}
                    onCancelarPedido={() => handleAction(cancelarPedido, pedidoSelecionado.id, 'Pedido cancelado!')}
                />
            )}

            <Toast show={showToast} message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />
        </div>
    );
}

export default AdminPedidos;