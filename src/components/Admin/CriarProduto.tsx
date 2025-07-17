import {useEffect, useState} from 'react';
import {useProduto} from '../../context/ProdutoContext.tsx';
import {useNavigate, useParams} from "react-router-dom";
import BotaoVoltar from "../BotaoVoltar.tsx";
import * as React from "react";
import {toast} from "react-toastify";
import {getImageUrl} from "../../utils/imageUrlHelper.ts";

function CriarProduto() {
    const {criarProduto, enviarImagem, erro, atualizarProduto, buscarProdutosporId} = useProduto();
    const navigate = useNavigate()
    const {id} = useParams();

    const [produto, setProduto] = useState({
        nome: '',
        descricao: '',
        preco: 0,
        estoque: 0,
        imagemUrl: ''
    });

    useEffect(() => {
        if (id) {
            const buscarAlimento = async () => {
                try {
                    const produto = await buscarProdutosporId(parseInt(id));
                    setProduto(
                        {
                            nome: produto?.nome || '',
                            descricao: produto?.descricao || '',
                            preco: produto?.preco ?? 0,
                            estoque: produto?.estoque ?? 0,
                            imagemUrl: getImageUrl(produto?.imagemUrl) || ''
                        }
                    );
                    console.log("Produto buscado:", produto);
                } catch (error) {
                    console.error('Erro ao buscar produto:', error);
                }
            };
            buscarAlimento();
        }
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (id) {
                try {
                    await atualizarProduto(parseInt(id), produto);
                    toast.success('Produto atualizado com sucesso!');
                } catch (error: any) {
                    console.error('Erro ao atualizar produto:', error);
                    toast.error(error.message || 'Erro ao atualizar o produto.');
                }
            } else {
                console.log("Produto a ser enviado:", produto);
                await criarProduto(produto)
                setProduto({nome: '', descricao: '', preco: 0, estoque: 0, imagemUrl: ''});
                toast.success('Produto criado com sucesso!');
                console.log('Produto criado com sucesso!');
            }
            navigate('/admin/produtos');
        } catch (error: any) {
            console.error('Erro ao criar produto:', error);
            toast.error(error.message || 'Erro ao criar produto.');
        }
    };

    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setProduto(prev => ({
            ...prev,
            [name]: name === 'preco' || name === 'estoque' ? Number(value) : value
        }));
    };

    const handleTAChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setProduto(prev => ({
            ...prev,
            [name]: name === 'preco' || name === 'estoque' ? Number(value) : value
        }));
    };

    const handleImagemChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
            } catch (error: any) {
                console.error('Erro ao processar imagem:', error);
                toast.error(error.message || 'Erro ao processar imagem.');
            }
        }
    }

    return (
        <>
            <BotaoVoltar/>
            <div className="container mt-4 w-50">
                <h2>{id ? 'Editar Produto' : 'Criar Produto'}</h2>
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
                        <textarea
                                className='form-control'
                                id="descricao"
                                name="descricao"
                                value={produto.descricao}
                                onChange={(e) => handleTAChange(e)}
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
                            onChange={async (e) => handleImagemChange(e)}
                        />
                    </div>
                    <button type="submit" className="btn bg-qs btn-primary">Cadastrar</button>
                    {erro && <div className="alert alert-danger mt-3">{erro.message}</div>}
                </form>
            </div>
        </>
    );
}

export default CriarProduto;