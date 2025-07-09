import {StatusPedido} from "../../services/statusPedido.ts";
import * as React from "react";
import {getImageUrl} from "../../utils/imageUrlHelper.ts";

interface Pedido {
    id: number;
    dataPedido: Date;
    usuarioId: number;
    valorTotal: number;
    status: StatusPedido;
    itens: ItemPedido[];
}

interface ItemPedido {
    id: number;
    valorUnitario: number;
    quantidade: number;
    pedidoId: number;
    produtoId: number;
    produto: Produto;
}

interface Produto {
    id: number;
    nome: string;
    descricao: string;
    estoque: number;
    preco: number;
    imagemUrl: string;
}

interface PedidoModalProps {
    pedido: Pedido | null;
    onCloseModal: () => void;
    onCancelarPedido: () => Promise<void>;
}


const PedidoModal: React.FC<PedidoModalProps> = ({pedido, onCloseModal, onCancelarPedido}: PedidoModalProps) => {
    if(!pedido) return null;

    const getStatusInfo = (status: StatusPedido) => {
        switch (status) {
            case 'PAGO': return { icon: 'bi-credit-card', color: 'text-success', text: 'Pagamento Aprovado' };
            case 'ENVIADO': return { icon: 'bi-truck', color: 'text-info', text: 'Pedido Enviado' };
            case 'ENTREGUE': return { icon: 'bi-box-seam', color: 'text-primary', text: 'Entregue' };
            case 'CANCELADO': return { icon: 'bi-x-circle', color: 'text-danger', text: 'Pedido Cancelado' };
            case 'ACEITO': return { icon: 'bi-patch-check', color: 'text-warning', text: 'Pedido Aceito' };
            default: return { icon: 'bi-clock-history', color: 'text-secondary', text: 'Pedido Criado' };
        }
    };

    const statusInfo = getStatusInfo(pedido.status);


    return (
        <div className="modal d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div className="modal-content" style={{ border: '4px solid #6610f2', borderRadius: '1rem' }}>
                    <div className="modal-header border-bottom-0">
                        <h5 className="modal-title fs-4">Pedido: #{pedido.id}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onCloseModal}></button>
                    </div>
                    <div className="modal-body text-start">
                        <div className="text-center p-4 mb-4" style={{ backgroundColor: '#f8f9fa', borderRadius: '0.5rem' }}>
                            <i className={`bi ${statusInfo.icon} fs-1 ${statusInfo.color}`}></i>
                            <h3 className={`mt-2 ${statusInfo.color}`}>{statusInfo.text}</h3>
                            <p className="text-muted mb-0">
                                Realizado em {new Date(pedido.dataPedido).toLocaleDateString('pt-BR')}
                            </p>
                        </div>
                        <ul className="list-group list-group-flush mb-3">
                            {pedido.itens.map(item => (
                                <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center px-0">
                                    <div className="d-flex align-items-center">
                                        <img
                                            src={getImageUrl(item.produto?.imagemUrl)}
                                            alt={item.produto?.nome}
                                            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', marginRight: '15px' }}
                                        />
                                        <div>
                                            <div>{item.produto?.nome || "Produto"}</div>
                                            <small className="text-muted">{item.quantidade} x R$ {item.valorUnitario.toFixed(2)}</small>
                                        </div>
                                    </div>
                                    <span className="fw-bold">R$ {(item.quantidade * item.valorUnitario).toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="d-flex justify-content-end align-items-center pt-3 border-top">
                            <span className="me-3 fs-5">Total do Pedido:</span>
                            <span className="fw-bold fs-4 text-qs">R$ {pedido.valorTotal.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="modal-footer border-top-0 justify-content-center">
                        {['CRIADO', 'ACEITO', 'PAGO'].includes(pedido.status) && (
                            <button type="button" className="btn btn-danger" onClick={onCancelarPedido}>
                                <i className="bi bi-x-circle me-2"></i>Cancelar Pedido
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PedidoModal;