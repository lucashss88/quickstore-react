import {useNavigate, useParams} from "react-router-dom";
import {type Pedido, usePedido} from "../../context/PedidoContext.tsx";
import {useEffect, useState} from "react";
import * as React from "react";
import BotaoVoltar from "../../components/BotaoVoltar.tsx";
import Toast from "../../components/Toast.tsx";

export function Pagamento() {
    const {pedidoId} = useParams<{ pedidoId: string }>();
    const navigate = useNavigate();
    const {pagarPedido, listarPedidoId} = usePedido();
    const [pedido, setPedido] = useState<Pedido>();
    const [numeroCartao, setNumeroCartao] = useState('');
    const [nomeCartao, setNomeCartao] = useState('');
    const [dataValidade, setDataValidade] = useState('');
    const [codigoSeguranca, setCodigoSeguranca] = useState('');
    const [processando, setProcessando] = useState(false);
    const [erro, setErro] = useState<String | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error' | 'warning' | 'info'>('success');

    useEffect(() => {
        if (!pedidoId) {
            alert('Pedido inválido!')
            navigate('/carrinho');
        }
        const carregarPedido = async () => {
            try {
                if (pedidoId != null) {
                    const pedidoNovo = await listarPedidoId(parseInt(pedidoId));
                    setPedido(pedidoNovo);
                }
            } catch (error) {
                console.error("Erro ao carregar pedido:", error);
            }
        };

        carregarPedido();
    }, [pedidoId, navigate]);

    const handlePagamento = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessando(true);
        try {
            const dadosCartao = {numeroCartao, nomeCartao, dataValidade, codigoSeguranca};
            if (pedidoId != null) {
                const ultimoDigito = numeroCartao.slice(-1);
                if (parseInt(ultimoDigito) % 2 != 0) {
                    setToastMessage("Pagamento foi recusado!");
                    setToastType("error");
                    setProcessando(false);
                    setShowToast(true);
                    setTimeout(() => {
                        navigate('/pedidos');
                    }, 1500);
                }

                if (parseInt(ultimoDigito) % 2 === 0) {
                    await pagarPedido(parseInt(pedidoId), dadosCartao);
                    setToastMessage("Pagamento realizado com sucesso!");
                    setToastType("success");
                    setProcessando(false);
                    setShowToast(true);
                    setTimeout(() => {
                        navigate('/pedidos');
                    }, 1500);
                }
            }
        } catch (error) {
            console.error("Erro ao fazer pagamento:", error);
            setErro("Erro ao fazer pagamento.");
            setProcessando(false);
        }
    }

    return (
        <>
            <BotaoVoltar/>
            <div className="container mt-4" style={{minHeight: '100vh'}}>
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card-pedido shadow-lg p-4 p-md-5" style={{borderRadius: '1rem'}}>
                            <div className="text-center mb-4 bg-qs text-light p-3 rounded-top">
                                <h3>Pagamento do pedido #{pedidoId}</h3>
                                <h5>Valor total: R$ {pedido?.valorTotal.toFixed(2)}</h5>
                            </div>
                            <div className="mt-4">
                                <form onSubmit={handlePagamento}>
                                    <div>
                                        <label htmlFor="numeroCartao" className="form-label visually-hidden">Número do
                                            cartão</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="numeroCartao"
                                            value={numeroCartao}
                                            onChange={(e) => setNumeroCartao(e.target.value)}
                                            placeholder="0000 0000 0000 0000"
                                            required
                                        />
                                        <div className="form-text">
                                            Simulação: Termine com nº <strong>par</strong> para
                                            aprovar, <strong>ímpar</strong> para recusar.
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="nomeCartao" className="form-label">Nome no Cartão</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="nomeCartao"
                                                value={nomeCartao}
                                                onChange={(e) => setNomeCartao(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="dataValidade" className="form-label">Data de
                                                    Validade</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="dataValidade"
                                                    value={dataValidade}
                                                    onChange={(e) => setDataValidade(e.target.value)}
                                                    placeholder="MM/AA"
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="codigoSeguranca" className="form-label">CVV</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="codigoSeguranca"
                                                    value={codigoSeguranca}
                                                    onChange={(e) => setCodigoSeguranca(e.target.value)}
                                                    placeholder="123"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        {erro && <div className="alert alert-danger">{erro}</div>}

                                        <div className="d-grid">
                                            <button type="submit" className="btn bg-qs btn-primary"
                                                    disabled={processando}>
                                                {processando ? 'Processando...' : 'Pagar Agora'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <Toast show={showToast}
                       message={toastMessage}
                       type={toastType}
                       onClose={() => setShowToast(false)}
                />
            </div>
        </>

    )
}