import {StatusPedido} from "../services/statusPedido.ts";
import * as React from "react";
import {createContext, useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import * as pedidoService from "../services/pedidoService.ts";

export interface Produto {
    id: number;
    nome: string;
    descricao: string;
    estoque: number;
    preco: number;
    imagemUrl: string;
}

export interface Pedido {
    id: number;
    dataPedido: Date;
    usuario: Usuario;
    usuarioId: number;
    valorTotal: number;
    status: StatusPedido;
    itens: ItemPedido[];
    createdAt: string;
    updatedAt: string;
}

interface Usuario {
    id: number;
    nome: string;
    email: string;
    senha: string;
}

interface ItemPedido {
    id: number;
    valorUnitario: number;
    quantidade: number;
    pedidoId: number;
    produtoId: number;
    produto: Produto;
}

interface DadosCartao {
    numeroCartao: string;
    nomeCartao: string;
    dataValidade: string;
    codigoSeguranca: string;
}

interface PedidoContextData {
    pedido: Pedido | null;
    carregando: boolean;
    erro: Error | null;
    finalizarCompra: () => Promise<Pedido>;
    listarPedidos: () => Promise<Pedido[] | undefined>;
    pedidos: Pedido[] | null;
    vendasTotais: number | undefined;
    aceitarPedido: (pedidoId: number) => Promise<void>;
    pagarPedido: (pedidoId: number, dadosCartao: DadosCartao) => Promise<void>;
    finalizarPedido: (pedidoId: number) => Promise<void>;
    enviarPedido: (pedidoId: number) => Promise<void>;
    cancelarPedido: (pedidoId: number) => Promise<void>;
    listarPedidosAdmin: () => Promise<Pedido[] | undefined>;
    listarPedidoId: (pedidoId: number) => Promise<Pedido | undefined>;
    listarVendasTotais: () => Promise<number>;
}

export const PedidoContext = createContext<PedidoContextData | null>(null);

export const PedidoProvider = ({children}: { children: React.ReactNode }) => {
    const [pedido, setPedido] = useState<Pedido | null>(null);
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<Error | null>(null);
    const [vendasTotais, setVendasTotais] = useState<number>();
    const navigate = useNavigate();

    // @ts-ignore
    const finalizarCompra = async (): Promise<Pedido> => {
        try {
            const response = await pedidoService.finalizarCompra();
            setPedido(response);
            setErro(null);
            return response;
        } catch (e: any) {
            if (e.response?.status === 401) {
                console.warn("Token expirado. Redirecionando para login.")
                navigate('/');
            } else {
                console.error("Erro ao carregar carrinho:", e);
                setErro(e as Error);
            }
        } finally {
            setCarregando(false);
        }
    }

    const listarPedidos = async () => {
        try {
            const response = await pedidoService.listarPedidos();
            setPedidos(response);
            setErro(null);
            return response;
        } catch (e: any) {
            if (e.response?.status === 401) {
                console.warn("Token expirado. Redirecionando para login.")
                navigate('/');
            } else {
                console.error("Erro ao carregar carrinho:", e);
                setErro(e as Error);
            }
            return [];
        } finally {
            setCarregando(false);
        }
    }

    const listarPedidoId = async (pedidoId: number) => {
        try {
            const response = await pedidoService.listarPedidoPorId(pedidoId);
            setPedido(response);
            setErro(null);
            return response;
        } catch (e: any) {
            if (e.response?.status === 401) {
                console.warn("Token expirado. Redirecionando para login.")
                navigate('/');
            } else {
                console.error("Erro ao carregar carrinho:", e);
                setErro(e as Error);
            }
            return undefined;
        } finally {
            setCarregando(false);
        }
    }

    const listarPedidosAdmin = async () => {
        try {
            const response = await pedidoService.listarPedidosAdmin();
            setPedidos(response);
            setErro(null);
            return response;
        } catch (e: any) {
            if (e.response?.status === 401) {
                console.warn("Token expirado. Redirecionando para login.")
                navigate('/');
            } else {
                console.error("Erro ao carregar carrinho:", e);
                setErro(e as Error);
            }
            return [];
        } finally {
            setCarregando(false);
        }
    }

    const listarVendasTotais = async () => {
        try {
            const vendas = await pedidoService.listarVendasTotais();
            setVendasTotais(vendas);
            setErro(null);
            return vendas;
        } catch (e: any) {
            if (e.response?.status === 401) {
                console.warn("Token expirado. Redirecionando para login.")
                navigate('/');
            } else {
                console.error("Erro ao carregar carrinho:", e);
                setErro(e as Error);
            }
            return [];
        } finally {
            setCarregando(false);
        }
    }

    const aceitarPedido = async (pedidoId: number) => {
        try {
            const {pedido: pedidoAtualizado} = await pedidoService.aceitarPedido(pedidoId);
            setPedidos((prevPedidos) =>
                prevPedidos.map((p) =>
                    p.id === pedidoId ? pedidoAtualizado : p
                )
            );
            setErro(null);
            console.log("Pedido aceito:", pedidoAtualizado);
        } catch (e) {
            setErro(e as Error);
            throw e;
        } finally {
        }
    }

    const pagarPedido = async (pedidoId: number, dadosCartao: DadosCartao) => {
        try {
            const {pedido: pedidoAtualizado} = await pedidoService.pagarPedido(pedidoId, dadosCartao);
            setPedidos((prevPedidos) =>
                prevPedidos.map((p) =>
                    p.id === pedidoId ? pedidoAtualizado : p
                )
            );
            setErro(null);
        } catch (e) {
            setErro(e as Error);
            throw e;
        }
    }

    const finalizarPedido = async (pedidoId: number) => {
        try {
            const { pedido: pedidoAtualizado } = await pedidoService.finalizarPedido(pedidoId);
            setPedidos((prev) =>
                prev.map((p) => (p.id === pedidoId ? pedidoAtualizado : p))
            );
            setErro(null);
        } catch (e) {
            setErro(e as Error);
            throw e;
        }
    }

    const enviarPedido = async (pedidoId: number) => {
        try {
            const {pedido: pedidoAtualizado} = await pedidoService.enviarPedido(pedidoId);
            setPedidos((prev) =>
                prev.map((p) => (p.id === pedidoId ? pedidoAtualizado : p))
            );
            setErro(null);
        } catch (e) {
            setErro(e as Error);
            throw e;
        }
    };

    const cancelarPedido = async (pedidoId: number) => {
        try {
            const { pedido: pedidoAtualizado } = await pedidoService.cancelarPedido(pedidoId);
            setPedidos((prev) =>
                prev.map((p) => (p.id === pedidoId ? pedidoAtualizado : p))
            );
            setErro(null);
        } catch (e) {
            setErro(e as Error);
            throw e;
        }
    }

    // @ts-ignore
    return (
        <PedidoContext.Provider value={{
            pedido,
            carregando,
            erro,
            finalizarCompra,
            listarPedidos,
            pedidos,
            aceitarPedido,
            pagarPedido,
            finalizarPedido,
            enviarPedido,
            cancelarPedido,
            listarPedidosAdmin,
            listarPedidoId,
            listarVendasTotais,
            vendasTotais,
        }}>
            {children}
        </PedidoContext.Provider>
    );
};

export const usePedido = () => {
    const context = useContext(PedidoContext);
    if (!context) {
        throw new Error('usePedido deve ser usado dentro de um PedidoProvider');
    }
    return context;
};