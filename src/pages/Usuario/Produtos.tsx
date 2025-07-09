import {useProduto} from "../../context/ProdutoContext.tsx";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import Toast from "../../components/Toast.tsx";
import {useCarrinho} from "../../context/CarrinhoContext.tsx";
import ProdutoModal from "../../components/Usuario/ProdutoModal.tsx";
import {getImageUrl} from "../../utils/imageUrlHelper.ts";


function Produtos() {
    const {produtos = [], erro, carregando} = useProduto();
    const {adicionarItemAoCarrinho} = useCarrinho();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error' | 'warning' | 'info'>('success');
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const produtosPorPagina = 9;
    const navigate = useNavigate();

    const indiceDoUltimoProduto = paginaAtual * produtosPorPagina;
    const indiceDoPrimeiroProduto = indiceDoUltimoProduto - produtosPorPagina;
    const produtosAtuais = produtos.slice(indiceDoPrimeiroProduto, indiceDoUltimoProduto);
    const totalDePaginas = Math.ceil(produtos.length / produtosPorPagina);

    const irCarrinho = () => {
        navigate('/carrinho');
    }

    const abrirModal = (produto: any) => {
        setProdutoSelecionado(produto);
    }

    const fecharModal = () => {
        setProdutoSelecionado(null);
    }

    const handleAdicionarAoCarrinho = async (produtoId: number) => {
        try {
            await adicionarItemAoCarrinho(produtoId, 1);
            setToastMessage("Produto adicionado ao carrinho com sucesso!");
            setToastType("success");
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
                irCarrinho();
            }, 2000);

        } catch (error) {
            console.error('Erro ao adicionar produto ao carrinho:', error);
            setToastMessage("Erro ao adicionar produto ao carrinho!");
            setToastType("error");
            setShowToast(true);
        }
    };

    if (carregando) return <h1>Carregando...</h1>;
    if (erro) return <h1>{erro.message || "Erro ao carregar produtos"}</h1>;

    return (
        <div className="container mt-4">
            <h1 className="mb-3 title">Produtos</h1>
            <div className="d-flex row flex-wrap justify-content-center container-produtos px-3">
                {produtosAtuais.length > 0 ? (
                    produtosAtuais.map(p => (
                        <div key={p.id} className="col-sm-6 col-md-4 mb-4">
                            <div
                                className="card text-center product-card shadow-sm h-100"
                                onClick={() => abrirModal(p)}
                                style={{ cursor: 'pointer' }}
                            >
                                <img
                                    src={getImageUrl(p.imagemUrl)}
                                    alt={p.nome}
                                    className="card-img-top p-3"
                                    style={{ maxHeight: '200px', objectFit: 'contain' }}
                                />
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{p.nome}</h5>
                                    <p className="card-text mt-auto fw-bold fs-5">R$ {p.preco.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-5">
                        <h2>Nenhum produto encontrado</h2>
                    </div>
                )}
            </div>

            {totalDePaginas > 1 && (
                <nav className="d-flex justify-content-center mt-4">
                    <ul className="pagination">
                        <li className={`page-item ${paginaAtual === 1 ? 'disabled' : ''}`}>
                            <button className=" page-link" onClick={() => setPaginaAtual(paginaAtual - 1)}>
                                Anterior
                            </button>
                        </li>

                        {Array.from({ length: totalDePaginas }, (_, index) => (
                            <li key={index + 1} className={`page-item ${paginaAtual === index + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => setPaginaAtual(index + 1)}>
                                    {index + 1}
                                </button>
                            </li>
                        ))}

                        <li className={`page-item ${paginaAtual === totalDePaginas ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPaginaAtual(paginaAtual + 1)}>
                                Próximo
                            </button>
                        </li>
                    </ul>
                </nav>
            )}

            {produtoSelecionado && (
                <ProdutoModal
                    produto={produtoSelecionado}
                    onClosenModal={fecharModal}
                    onAdicionarAoCarrinho={handleAdicionarAoCarrinho}
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

export default Produtos;
