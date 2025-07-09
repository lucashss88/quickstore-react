import {useState} from 'react';
import {useProduto} from '../../context/ProdutoContext.tsx';
import {useNavigate} from "react-router-dom";
import Toast from "../Toast.tsx";
import BotaoVoltar from "../BotaoVoltar.tsx";
import * as React from "react";


function CriarProduto() {
    const {criarProduto, enviarImagem, erro} = useProduto();
    const navigate  = useNavigate()
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error' | 'warning' | 'info'>('success');

    const [produto, setProduto] = useState({
        nome: '',
        descricao: '',
        preco: 0,
        estoque: 0,
        imagemUrl: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log("Produto a ser enviado:", produto);
            await criarProduto(produto)
            setProduto({nome: '', descricao: '', preco: 0, estoque: 0, imagemUrl: ''});
            setToastMessage('Produto criado com sucesso!');
            setToastType('success');
            setShowToast(true);
            navigate('/produtos');
            console.log(
                'Produto criado com sucesso!',
            )
        } catch (error) {
            console.error('Erro ao criar produto:', error);
            setToastMessage('Erro ao criar produto!');
            setToastType('error');
            setShowToast(true);
        }
    };

    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setProduto(prev => ({...prev, [name]: name === 'preco' || name === 'estoque' ? Number(value) : value}));
    };

    return (
        <>
            <BotaoVoltar />
            <div className="container mt-4 w-50">
                <h2>Cadastrar Novo Produto</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="nome" className="form-label">Nome</label>
                        <input
                            type="text"
                            className="form-control"
                            id="nome"
                            name="nome"
                            value={produto.nome}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="descricao" className="form-label">Descrição</label>
                        <input
                            type="text"
                            className="form-control"
                            id="descricao"
                            name="descricao"
                            value={produto.descricao}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="preco" className="form-label">Preço</label>
                        <input
                            type="number"
                            className="form-control"
                            id="preco"
                            name="preco"
                            value={produto.preco}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="estoque" className="form-label">Estoque</label>
                        <input
                            type="number"
                            className="form-control"
                            id="estoque"
                            name="estoque"
                            value={produto.estoque}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="imagem" className="form-label">Imagem</label>
                        <input
                            type="file"
                            className="form-control"
                            id="imagem"
                            name="imagem"
                            accept="image/*"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    try {
                                        const imagemUrl = await enviarImagem(file);
                                        if (imagemUrl) {
                                            setProduto(prev => ({...prev, imagemUrl}));
                                            console.log("Imagem salva em:", imagemUrl);
                                        } else {
                                            throw new Error('Erro ao enviar imagem!');
                                        }
                                    } catch (error) {
                                        console.error('Erro ao processar imagem:', error);
                                        setToastMessage('Erro ao processar imagem!');
                                        setToastType('error');
                                        setShowToast(true);
                                    }
                                }
                            }}
                        />
                    </div>
                    <button type="submit" className="btn bg-qs btn-primary">Cadastrar</button>
                    {erro && <div className="alert alert-danger mt-3">{erro.message}</div>}
                </form>
                <Toast show={showToast}
                       message={erro?.message || toastMessage}
                       type={toastType}
                       onClose={() => setShowToast(false)}
                />
            </div>
        </>
    );
}

export default CriarProduto;