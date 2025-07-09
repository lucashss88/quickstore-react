import * as React from "react";
import {StatusPedido} from "../../services/statusPedido.ts";
import {getImageUrl} from "../../utils/imageUrlHelper.ts";

interface Pedido {
    id: number;
    dataPedido: Date;
    usuarioId: number;
    valorTotal: number;
    status: StatusPedido;
    itens: ItemPedido[];
    usuario: Usuario;
}

interface Usuario {
    id: number;
    nome: string;
    email: string;
}

interface ItemPedido {
    id: number;
    valorUnitario: number;
    quantidade: number;
    produto: {
        id: number;
        nome: string;
        imagemUrl: string;
    };
}

interface AdminPedidoModalProps {
    pedido: Pedido | null;
    onCloseModal: () => void;
    onAceitarPedido: () => Promise<void>;
    onCancelarPedido: () => Promise<void>;
    onEnviarPedido: () => Promise<void>;
    onFinalizarPedido: () => Promise<void>;
}

const AdminPedidoModal: React.FC<AdminPedidoModalProps> = ({
                                                               pedido,
                                                               onCloseModal,
                                                               onAceitarPedido,
                                                               onCancelarPedido,
                                                               onEnviarPedido,
                                                               onFinalizarPedido
                                                           }) => {
    if (!pedido) return null;

    const formatarData = (data: Date) => {
        return new Date(data).toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    };

    const getStatusBadge = (status: StatusPedido) => {
        switch (status) {
            case 'PAGO':
                return {color: 'bg-success', text: 'Pago'};
            case 'ENVIADO':
                return {color: 'bg-info', text: 'Enviado'};
            case 'ENTREGUE':
                return {color: 'bg-primary', text: 'Entregue'};
            case 'CANCELADO':
                return {color: 'bg-danger', text: 'Cancelado'};
            case 'ACEITO':
                return {color: 'bg-warning text-dark', text: 'Aceito'};
            default:
                return {color: 'bg-secondary', text: 'Criado'};
        }
    };

    const statusInfo = getStatusBadge(pedido.status);

    return (
        <div className="modal fade show d-block" tabIndex={-1} style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content" style={{border: '4px solid #6610f2', borderRadius: '1rem'}}>
                    <div className="modal-header border-bottom-0">
                        <h5 className="modal-title fs-4">Detalhes do Pedido #{pedido.id}</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={onCloseModal}></button>
                    </div>

                    <div className="modal-body text-start">
                        <div className="card-pedido mb-4">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <p className="mb-1">
                                            <strong>Cliente:</strong> {pedido.usuario?.nome || 'Não informado'}</p>
                                        <p className="mb-0 text-muted">{pedido.usuario?.email || ''}</p>
                                    </div>
                                    <div className="col-md-6 text-md-end">
                                        <p className="mb-1"><strong>Data:</strong> {formatarData(pedido.dataPedido)}</p>
                                        <p className="mb-0"><strong>Status:</strong> <span
                                            className={`badge ${statusInfo.color}`}>{statusInfo.text}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h6 className="mb-3">Itens do Pedido</h6>
                        <ul className="list-group list-group-flush">
                            {pedido.itens.map(item => (
                                <li key={item.id}
                                    className="list-group-item d-flex justify-content-between align-items-center px-0">
                                    <div className="d-flex align-items-center">
                                        <img
                                            src={getImageUrl(item.produto?.imagemUrl)}
                                            alt={item.produto?.nome}
                                            style={{
                                                width: '60px',
                                                height: '60px',
                                                objectFit: 'cover',
                                                borderRadius: '8px',
                                                marginRight: '15px'
                                            }}
                                        />
                                        <div>
                                            <div>{item.produto?.nome || "Produto não disponível"}</div>
                                            <small className="text-muted">{item.quantidade} x
                                                R$ {item.valorUnitario.toFixed(2)}</small>
                                        </div>
                                    </div>
                                    <span
                                        className="fw-bold">R$ {(item.quantidade * item.valorUnitario).toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="d-flex justify-content-end align-items-center mt-3 pt-3 border-top">
                            <span className="me-3 fs-5">Valor Total:</span>
                            <span className="fw-bold fs-4 text-success">R$ {pedido.valorTotal.toFixed(2)}</span>
                        </div>
                    </div>
                    <div>
                        {pedido.status === 'ACEITO' && (
                            <span className="badge bg-danger-subtle text-dark">Esperando pagamento...</span>
                        )}
                    </div>
                    <div className="modal-footer border-top-0 justify-content-center">
                        {pedido.status === 'CRIADO' && (
                            <button type="button" className="btn btn-success"
                                    onClick={onAceitarPedido}>
                                <i className="bi bi-check-circle me-2"></i>Aceitar Pedido
                            </button>
                        )}
                        {pedido.status === 'PAGO' && (
                            <button type="button" className="btn btn-info m-1" onClick={onEnviarPedido}>
                                <i className="bi bi-truck me-2"></i>Marcar como Enviado
                            </button>
                        )}

                        {pedido.status === 'ENVIADO' && (
                            <button type="button" className="btn btn-primary m-1" onClick={onFinalizarPedido}>
                                <i className="bi bi-box-seam me-2"></i>Finalizar Entrega
                            </button>
                        )}

                        {['CRIADO', 'ACEITO', 'PAGO'].includes(pedido.status) && (
                            <button type="button" className="btn btn-danger m-1" onClick={onCancelarPedido}>
                                <i className="bi bi-x-circle me-2"></i>Cancelar Pedido
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPedidoModal;