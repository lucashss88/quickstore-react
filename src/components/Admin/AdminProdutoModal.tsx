import * as React from "react";
import {getImageUrl} from "../../utils/imageUrlHelper.ts";

interface AdminProdutoModalProps {
    produto: {
        id: number;
        nome: string;
        preco: number;
        estoque: number;
        descricao: string;
        imagemUrl?: string;
    } | null;

    onClosenModal: () => void;
}

const AdminProdutoModal: React.FC<AdminProdutoModalProps> = ({produto, onClosenModal}) => {
    if (!produto) return null;

    const getEstoqueBadge = () => {
        if (produto.estoque === 0) {
            return { color: 'bg-danger', text: 'Sem estoque' };
        }
        if (produto.estoque < 10) {
            return { color: 'bg-warning text-dark', text: `${produto.estoque} unidades (Baixo)` };
        }
        return { color: 'bg-success', text: `${produto.estoque} unidades` };
    };

    const estoqueInfo = getEstoqueBadge();

    return (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
            <div className="modal-dialog modal-lg modal-dialog-centered" >
                <div className="modal-content" style={{border: '4px solid #6610f2'}}>
                    <div className="modal-header border-bottom-0">
                        <h5 className="modal-title fs-4">{produto.nome}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"
                                onClick={onClosenModal}></button>
                    </div>
                    <div className="modal-body text-start">
                        <div className="row">
                            <div className="col-md-5 d-flex align-items-center justify-content-center">
                                <img
                                    src={getImageUrl(produto.imagemUrl)}
                                    alt={produto.nome}
                                    className="img-fluid rounded shadow-sm"
                                    style={{ maxHeight: '300px', objectFit: 'contain' }}
                                />
                            </div>

                            <div className="col-md-7">
                                <p className="text-muted">{produto.descricao}</p>
                                <hr />
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                                        Preço de Venda
                                        <span className="fw-bold fs-5 text-success">R$ {produto.preco.toFixed(2)}</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                                        Estoque Atual
                                        <span className={`badge ${estoqueInfo.color} rounded-pill`}>{estoqueInfo.text}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProdutoModal;