import * as React from "react";
import type {Produto} from "../../context/ProdutoContext.tsx";
import {getImageUrl} from "../../utils/imageUrlHelper.ts";

interface ProdutoModalProps {
    produto: Produto | null;
    onClosenModal: () => void;
    onAdicionarAoCarrinho: (produtoId: number) => void;
}

const ProdutoModal: React.FC<ProdutoModalProps> = ({
                                                       produto,
                                                       onClosenModal,
                                                       onAdicionarAoCarrinho
                                                   }) => {
    if (!produto) return null;

    const getEstoqueBadge = () => {
        if (produto.estoque === 0) {
            return {color: 'bg-danger', text: 'Indisponível'};
        }
        if (produto.estoque < 10) {
            return {color: 'bg-warning text-dark', text: 'Últimas unidades!'};
        }
        return {color: 'bg-success', text: 'Em estoque'};
    };

    const estoqueInfo = getEstoqueBadge();

    return (
        <div className="modal d-block" tabIndex={-1} role="dialog" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div className="modal-content" style={{border: '4px solid #6610f2'}}>
                    <div className="modal-header border-bottom-0">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"
                                onClick={onClosenModal}></button>
                    </div>

                    <div className="modal-body text-start pt-0">
                        <div className="row">
                            <div className="col-md-6 mb-3 mb-md-0">
                                <img
                                    src={getImageUrl(produto.imagemUrl)}
                                    alt={produto.nome}
                                    className="img-fluid rounded shadow-sm w-100"
                                    style={{maxHeight: '400px', objectFit: 'contain'}}
                                />
                            </div>

                            <div className="col-md-6 d-flex flex-column">
                                <h2 className="fw-bold mb-2">{produto.nome}</h2>
                                <p className="text-muted mb-4">{produto.descricao}</p>

                                <div className="mb-4">
                                    <span
                                        className={`badge ${estoqueInfo.color} rounded-pill`}>{estoqueInfo.text}</span>
                                </div>

                                <div className="mt-auto">
                                    <p className="text-muted mb-1" style={{fontSize: '0.9rem'}}>PREÇO</p>
                                    <p className="display-5 fw-bold text-qs">R$ {produto.preco.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer border-top-0 p-3">
                        <button
                            className="btn btn-primary bg-qs w-100 btn-lg"
                            type="button"
                            onClick={() => onAdicionarAoCarrinho(produto.id)}
                            disabled={produto.estoque === 0}
                        >
                            <i className="bi bi-cart-plus me-2"></i>
                            Adicionar ao Carrinho
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProdutoModal;