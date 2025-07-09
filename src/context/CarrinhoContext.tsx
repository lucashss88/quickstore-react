import * as React from "react";
import {createContext, useContext, useEffect, useState} from "react";
import * as carrinhoService from "../services/carrinhoService";
import {isAuthenticated} from "../services/authService.ts";
import {useNavigate} from "react-router-dom";
import {useAuth} from "./AuthContext.tsx";

interface Produto {
    id: number;
    nome: string;
    descricao: string;
    estoque: number;
    preco: number;
    imagemUrl: string;
}

interface ItemCarrinho {
    id: number;
    produtoId: number;
    quantidade: number;
    preco: number;
    produto: Produto;
}

export interface Carrinho {
    id: number;
    valorTotal: number;
    usuarioId: number;
    itens: ItemCarrinho[];
}

interface CarrinhoContextData {
    carrinho: Carrinho | null;
    carregando: boolean;
    erro: Error | null;
    carregarCarrinhoUsuario: () => Promise<Carrinho> | undefined;
    adicionarItemAoCarrinho: (produtoId: number, quantidade: number) => Promise<void>;
    removerItemDoCarrinho: (produtoId: number) => Promise<void>;
    atualizarQuantidadeDoItemDoCarrinho: (produtoId: number, quantidade: number) => Promise<void>;
    formatarValor: (valor: number | undefined) => string;
    calcularSubtotal: (quantidade: number, valorUnitario: number) => string;
    quantidadeTotal: number;
}

export const CarrinhoContext = createContext<CarrinhoContextData | null>(null);

export const CarrinhoProvider = ({ children }: { children: React.ReactNode }) => {
    const [carrinho, setCarrinho] = useState<Carrinho | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<Error | null>(null);
    const {usuario} = useAuth();
    const navigate = useNavigate();

    const quantidadeTotal = React.useMemo(
        () => carrinho?.itens?.reduce((total, item) => total + item.quantidade, 0) || 0,
        [carrinho]
    );

    const carregarCarrinhoUsuario = async (): Promise<Carrinho> => {
        if (usuario?.role == 'usuario') {
            const carrinhoVazio: Carrinho = {
                id: 0,
                valorTotal: 0,
                usuarioId: 0,
                itens: [],
            }
            if (!isAuthenticated()) {
                setCarrinho(carrinhoVazio);
                setCarregando(false);
                return carrinhoVazio;
            }

            setCarregando(true);
            try {
                const response = await carrinhoService.buscarCarrinhoUsuario();
                setCarrinho(response);
                setErro(null);
                return response;
            } catch (e: any) {
                if (e.response?.status === 401) {
                    console.warn("Token expirado. Redirecionando para login.")
                    navigate('/');
                    setCarrinho({
                        id: 0,
                        valorTotal: 0,
                        usuarioId: 0,
                        itens: [],
                    });
                } else {
                    console.error("Erro ao carregar carrinho:", e);
                    setErro(e as Error);
                }
                setCarrinho(carrinhoVazio);
                return carrinhoVazio;
            } finally {
                setCarregando(false);
            }
        } else {
            const carrinhoVazio: Carrinho = {
                id: 0,
                valorTotal: 0,
                usuarioId: 0,
                itens: [],
            }
            setCarrinho(carrinhoVazio);
            return carrinhoVazio;
        }

    }

    const adicionarItemAoCarrinho = async (produtoId: number, quantidade: number) => {
        if (!isAuthenticated()) {
            navigate('/');
            return;
        }
        setCarregando(true);
        try {
            const response = await carrinhoService.adicionarItemAoCarrinho(
                produtoId,
                quantidade,
            );
            setCarrinho({ ...response });
            setErro(null);
            console.log("Item adicionado ao carrinho:", response);
        } catch (e) {
            setErro(e as Error);
        } finally {
            setCarregando(false);
        }
    };

    const removerItemDoCarrinho = async (produtoId: number) => {
        if (!isAuthenticated()) {
            navigate('/');
            return;
        }
        setCarregando(true);
        try {
            const response = await carrinhoService.removerItemDoCarrinho(produtoId);
            setCarrinho(response);
            setErro(null);
            console.log("Item removido do carrinho:", response);
        } catch (e) {
            setErro(e as Error);
        } finally {
            setCarregando(false);
        }
    };

    const atualizarQuantidadeDoItemDoCarrinho = async (
        produtoId: number,
        quantidade: number,
    ) => {
        if (!isAuthenticated()) {
            navigate('/');
            return;
        }

        setCarregando(true);
        try {
            const response = await carrinhoService.atualizarQuantidadeDoItemDoCarrinho(
                produtoId,
                quantidade
            );
            setCarrinho(response);
            setErro(null);
            console.log("Item atualizado do carrinho:", response);
        } catch (e) {
            setErro(e as Error);
        } finally {
            setCarregando(false);
        }
    };

    const formatarValor = (valor: number | undefined) => {
        if (valor === undefined || isNaN(valor)) {
            return 'R$ 0,00';
        }
        return 'R$ ' + valor.toFixed(2);
    };

    const calcularSubtotal = (quantidade: number, valorUnitario: number) => {
        const subtotal = quantidade * valorUnitario;
        return formatarValor(subtotal);
    };

    useEffect(() => {
        carregarCarrinhoUsuario();
    }, []);

    return (
        <CarrinhoContext.Provider value={{
            carregarCarrinhoUsuario,
            carrinho,
            carregando,
            erro,
            adicionarItemAoCarrinho,
            removerItemDoCarrinho,
            atualizarQuantidadeDoItemDoCarrinho,
            formatarValor,
            calcularSubtotal,
            quantidadeTotal,
        }}>
            {children}
        </CarrinhoContext.Provider>
    );
};

export const useCarrinho = () => {
    const context = useContext(CarrinhoContext);
    if (!context) {
        throw new Error('useCarrinho deve ser usado dentro de um CarrinhoProvider');
    }
    return context;
};