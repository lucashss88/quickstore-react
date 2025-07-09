import * as React from 'react';
import {createContext, useContext, useEffect, useState} from 'react';
import {
    atualizarProduto as atualizarProdutoApi,
    buscarProdutoPorId,
    criarProduto as criarProdutoApi,
    deletarProduto as deletarProdutoApi,
    listarProdutos,
    uploadImagem as uploadImagemApi,
} from "../services/produtoService.ts";
import axios from "axios";
import {useAuth} from "./AuthContext.tsx";

export interface Produto {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    estoque: number;
    imagemUrl?: string;
}

interface ProdutoContextData {
    produtos: Produto[];
    carregando: boolean;
    erro: Error | null;
    listarTodos: () => Promise<void>;
    criarProduto: (produto: Omit<Produto, "id">) => Promise<void>;
    buscarProdutosporId: (id: number) => Promise<Produto | undefined>;
    atualizarProduto: (id: number, produtoAtualizado: Produto) => Promise<void>;
    deletarProduto: (id: number) => Promise<void>;
    enviarImagem: (file: File) => Promise<string | undefined>;
}

const ProdutoContext = createContext<ProdutoContextData>({} as ProdutoContextData);

export const ProdutoProvider = ({children}: { children: React.ReactNode }) => {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<Error | null>(null);
    const {usuario} = useAuth();

    const listarTodos = async () => {
        try {
            const response = await listarProdutos();
            setProdutos(response);
        } catch (error) {
            setErro(error as Error);
        } finally {
            setCarregando(false);
        }
    }

    const enviarImagem = async (file: File): Promise<string | undefined> => {
        setCarregando(true);
        try {
            const response = await uploadImagemApi(file);
            setErro(null);
            return response;
        } catch (error) {
            setErro(error as Error);
            return undefined;
        } finally {
            setCarregando(false);
        }
    }

    const criarProduto = async (produto: Omit<Produto, 'id'>): Promise<void> => {
        setCarregando(true);
        try {
            const response = await criarProdutoApi(produto);
            setProdutos(prevState => [...prevState, response.data]);
            setErro(null);
        } catch (error) {
            setErro(error as Error);
        } finally {
            setCarregando(false);
        }
    }

    const buscarProdutosporId = async (id: number) => {
        setCarregando(true);
        try {
            const response = await buscarProdutoPorId(id);
            return response.data;
        } catch (error) {
            setErro(error as Error);
        } finally {
            setCarregando(false);
        }
    }

    const atualizarProduto = async (id: number, produtoAtualizado: Produto) => {
        setCarregando(true);
        try {
            const response = await atualizarProdutoApi(id, produtoAtualizado);
            setProdutos(prevState => prevState.map(produto => produto.id === id ? response.data : produto));
            setErro(null);
        } catch (error) {
            setErro(error as Error);
        } finally {
            setCarregando(false);
        }
    }

    const deletarProduto = async (id: number) => {
        setCarregando(true);
        try {
            await deletarProdutoApi(id);
            setProdutos(prevState => prevState.filter(produto => produto.id !== id));
            setErro(null);
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response?.status === 409) {
                alert("Este produto está vinculado a um pedido e não pode ser deletado.");
            }
            setErro(error as Error);
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        if (usuario) {
            listarTodos();
        }
    }, []);

    return (
        <ProdutoContext.Provider
            value={{
                produtos,
                carregando,
                erro,
                listarTodos,
                criarProduto,
                buscarProdutosporId,
                atualizarProduto,
                deletarProduto,
                enviarImagem,
            }}
        >
            {children}
        </ProdutoContext.Provider>
    );
};
export const useProduto = () => {
    const context = useContext(ProdutoContext);
    if (!context) {
        throw new Error('useProduto deve ser usado dentro de um ProdutoProvider');
    }
    return context;
};
