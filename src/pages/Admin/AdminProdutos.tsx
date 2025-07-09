import {useProduto} from "../../context/ProdutoContext.tsx";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import Toast from "../../components/Toast.tsx";
import AdminProdutoModal from "../../components/Admin/AdminProdutoModal.tsx";
import {getImageUrl} from "../../utils/imageUrlHelper.ts";


export default function AdminProdutos() {
    const {produtos = [], erro, carregando, deletarProduto} = useProduto();
    const navigate = useNavigate();
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error' | 'warning' | 'info'>('success');

    const irParaCriarProduto = () => {
        navigate('/produtos/criar');
    };

    const irParaEditarProduto = (id: number) => {
        navigate(`/admin/produtos/editar/${id}`);
    };

    const abrirModal = (produto: any) => {
        setProdutoSelecionado(produto);
    }

    const fecharModal = () => {
        setProdutoSelecionado(null);
    }

    const handleDeletar = async (id: number) => {
        if (window.confirm("Tem certeza que deseja deletar este produto?")) {
            try {
                await deletarProduto(id);
                setToastMessage("Produto deletado com sucesso!");
                setToastType("success");
            } catch (error: any) {
                setToastMessage(error.message || "Erro ao deletar produto.");
                setToastType("error");
            } finally {
                setShowToast(true);
            }
        }
    };

    if (carregando) return <h1 className="text-center">Carregando produtos...</h1>;
    if (erro) return <h1 className="text-center text-danger">{erro.message}</h1>;

    return (
        <div>
            <div className="w-100 d-flex justify-content-between align-items-center px-4 py-2">
                <div className="d-flex align-items-center">
                    <h1 className="title">Produtos</h1>
                </div>
                <button className="btn bg-qs btn-primary text-white" onClick={irParaCriarProduto}>
                    Adicionar Produto
                </button>
            </div>

            <div className="card-admin">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                            <tr>
                                <th scope="col">Nome</th>
                                <th scope="col">Estoque</th>
                                <th scope="col">Preço</th>
                                <th scope="col">Ações</th>
                            </tr>
                            </thead>
                            <tbody className="align-middle w-100 ">
                            {produtos.length > 0 ? (
                                produtos.map(p => (
                                    <tr key={p.id} onClick={() => abrirModal(p)} style={{ cursor: 'pointer' }}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <img
                                                    src={getImageUrl(p.imagemUrl)}
                                                    alt={p.nome}
                                                    className="me-3"
                                                    style={{
                                                        width: '50px',
                                                        height: '50px',
                                                        objectFit: 'cover',
                                                        borderRadius: '8px'
                                                    }}
                                                />
                                                <span>{p.nome}</span>
                                            </div>
                                        </td>
                                        <td>{p.estoque} unidades</td>
                                        <td>R$ {p.preco.toFixed(2)}</td>
                                        <td>
                                            <div className="d-flex gap-2 align-items-center">
                                                <button className="btn" onClick={() => irParaEditarProduto(p.id)}>
                                                    <i className="bi bi-pencil-square me-2"></i>Editar
                                                </button>
                                                <button className="btn text-danger"
                                                        onClick={() => handleDeletar(p.id)}>
                                                    <i className="bi bi-trash me-2"></i>Excluir
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-4">
                                        Nenhum produto encontrado.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {produtoSelecionado && (
                <AdminProdutoModal
                    produto={produtoSelecionado}
                    onClosenModal={fecharModal}
                />
            )}

            <Toast
                show={showToast}
                message={toastMessage}
                type={toastType}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
}