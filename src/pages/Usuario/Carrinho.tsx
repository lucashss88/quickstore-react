import {useCarrinho} from "../../context/CarrinhoContext.tsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {usePedido} from "../../context/PedidoContext.tsx";
import type {Carrinho} from "../../context/CarrinhoContext.tsx";

export function Carrinho() {
    const navigate = useNavigate();
    const {
        carregando,
        erro,
        carregarCarrinhoUsuario,
        removerItemDoCarrinho,
        atualizarQuantidadeDoItemDoCarrinho,
        formatarValor = (valor: number) => valor.toFixed(2),
        calcularSubtotal = (quantidade: number, valorUnitario: number) => quantidade * valorUnitario
    } = useCarrinho();
    const [carrinho, setCarrinho] = useState<Carrinho>();
    const {finalizarCompra} = usePedido();

    useEffect(() => {
        const carregarCarrinho = async () => {
            try {
                const response = await carregarCarrinhoUsuario();
                if (response) {
                    setCarrinho(response);
                }
            } catch (error) {
                console.error('Erro ao carregar carrinho:', error);
            }
        }
        carregarCarrinho();
    }, []);

    const voltarParaProdutos = () => {
        navigate('/produtos');
    };

    const finalizar = async () => {
        const novoPedido = await finalizarCompra();
        try {
            if (novoPedido && novoPedido.id) {
                toast.success('Pedido finalizado com sucesso!');
                setTimeout(() => {
                    navigate('/pedidos');
                }, 1500);
            } else {
                toast.error('Erro ao finalizar pedido. Tente novamente.');
            }
        } catch (error) {
            toast.error('Erro ao finalizar pedido. Tente novamente.');
        }

    };

    const removerItem = async (produtoId: number) => {
        const confirmar = window.confirm("Tem certeza que deseja remover este produto do carrinho?");
        if (confirmar) {
            setCarrinho((prevCarrinho) => {
                if (!prevCarrinho) return prevCarrinho;
                return {
                    ...prevCarrinho,
                    itens: prevCarrinho?.itens.filter(
                        (item) => item.produtoId ! == produtoId
                    ),
                };
            });

            try {
                await removerItemDoCarrinho(produtoId);
                toast.success('Produto removido com sucesso!');
            } catch (error) {
                toast.error('Erro ao remover produto do carrinho. Tente novamente.');
            }
        }

    }

    const atualizarQuantidade = async (produtoId: number, quantidade: number) => {
        setCarrinho((prevCarrinho) => {
            if (!prevCarrinho) return prevCarrinho;
            return {
                ...prevCarrinho,
                itens: prevCarrinho.itens.map((item) =>
                    item.produtoId === produtoId
                        ? {
                            ...item,
                            quantidade,
                        }
                        : item
                ),
            };
        });

        try {
            await atualizarQuantidadeDoItemDoCarrinho(produtoId, quantidade);
            toast.success('Quantidade atualizada com sucesso!');
        } catch (error) {
            toast.error('Erro ao atualizar quantidade do produto. Tente novamente.');
        }
    }

    if (!useCarrinho()) {
        return (
            <div className="container mt-4">
                <h1>Erro: Contexto do carrinho não encontrado</h1>
                <a
                    className="link-dark"
                    onClick={voltarParaProdutos}
                >
                    Voltar para Produtos
                </a>
            </div>
        );
    }

    if (carregando) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
                <h2 className="mt-3">Carregando seu carrinho...</h2>
            </div>
        );
    }

    if (erro) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Erro ao carregar o carrinho</h4>
                    <p>{erro.message}</p>
                </div>
                <a
                    className="link-dark"
                    onClick={voltarParaProdutos}
                >
                    Voltar para Produtos
                </a>
            </div>
        );
    }

    // @ts-ignore
    return (
        <div className="container mt-4">
            <h1 className="title">Carrinho</h1>
            {carrinho?.itens.length === 0 && <p>Seu carrinho está vazio.</p>}
            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead>
                    <tr>
                        <th>Produto</th>
                        <th>Preço</th>
                        <th>Quantidade</th>
                        <th>Subtotal</th>
                        <th>Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {carrinho?.itens.map(item => (
                        <tr key={item.id}>
                            <td>
                                <div className="d-flex align-items-center">
                                    {item.produto.imagemUrl && (
                                        <img
                                            src={item.produto.imagemUrl}
                                            alt={item.produto.nome}
                                            style={{height: '50px'}}
                                        />
                                    )}
                                    {item.produto.nome}
                                </div>
                            </td>
                            <td>R$ {formatarValor(item.preco)}</td>
                            <td>
                                <input
                                    type="number"
                                    min="1"
                                    max={item.produto.estoque}
                                    className="form-control"
                                    name="quantidade"
                                    id="quantidade"
                                    required
                                    value={item.quantidade || 0}
                                    onChange={(e) => atualizarQuantidade(item.produto.id, parseInt(e.target.value))}
                                    style={{width: '80px'}}
                                />
                            </td>
                            <td>
                                {calcularSubtotal(item.quantidade, item.preco)}
                                {item.quantidade > item.produto.estoque && (
                                    <span className="badge bg-danger">
                                            Estoque insuficiente
                                    </span>
                                )}
                                {item.produto.estoque < item.quantidade && (
                                    <span className="badge bg-danger">
                                            Estoque insuficiente
                                        </span>
                                )}
                                {item.produto.estoque < item.quantidade && (
                                    <span className="badge bg-danger">
                                            Estoque insuficiente
                                        </span>
                                )}
                            </td>
                            <td>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => carrinho?.id && removerItem(item.produto.id)}
                                >
                                    Remover
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="d-flex justify-content-center">
                <div className="card" style={{width: '18rem'}}>
                    <div className="card-body">
                        <h3 className="card-title">Resumo do Pedido</h3>
                        <p className="card-text">
                            <strong>Subtotal:</strong> {formatarValor(carrinho?.valorTotal ?? 0)}
                        </p>
                        <button className="btn btn-dark" onClick={() => finalizar()}>Finalizar Compra</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

