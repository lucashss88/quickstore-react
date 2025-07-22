import api from './api';
import {StatusPedido} from "./statusPedido.ts";

interface Produto {
    id: number;
    nome: string;
    descricao: string;
    estoque: number;
    preco: number;
    imagemUrl: string;
}

interface Pedido {
    id: number;
    dataPedido: Date;
    usuarioId: number;
    valorTotal: number;
    status: StatusPedido;
    itens: ItemPedido[];
    usuario: Usuario;
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

export const finalizarCompra = async ():Promise<Pedido> =>  {
    try {
        const response = await api.post('/pedidos');
        console.log("Pedido criado:", response.data);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar pedido:", error);
        throw new Error('Falha ao criar pedido');
    }
}

export const listarPedidos = async ():Promise<Pedido[]> =>  {
    try {
        const response = await api.get('/pedidos');
        return response.data;
    } catch (error) {
        console.error("Erro ao listar pedidos:", error);
        throw new Error('Falha ao listar pedidos');
    }
}

export const listarPedidoPorId = async (pedidoId: number):Promise<Pedido> =>  {
    try {
        const response = await api.get(`/pedidos/${pedidoId}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao listar pedidos:", error);
        throw new Error('Falha ao listar pedidos');
    }
}

export async function listarPedidosAdmin() {
    try {
        const response = await api.get('/pedidos/admin');
        return response.data;
    } catch (error) {
        console.error("Erro ao listar pedidos:", error);
        throw new Error('Falha ao listar pedidos');
    }
}

export async function listarVendasTotais() {
    try {
        const response = await api.get('/pedidos/admin/vendas');
        return response.data;
    } catch (error) {
        console.error("Erro ao listar pedidos:", error);
        throw new Error('Falha ao listar pedidos');
    }
}

export const aceitarPedido = async (pedidoId: number) =>  {
    try {
        const response = await api.post(`/pedidos/${pedidoId}/aceitar`);
        return response.data;
    } catch (error: any) {
        if (error.response?.data?.error) {
            console.error("Erro ao aceitar pedido:", error.response.data.error);
            throw new Error(error.response.data.error);
        }
        throw new Error('Falha ao aceitar pedido');

    }
}

export const pagarPedido = async (pedidoId: number, dadosCartao: DadosCartao) =>  {
    try {
        const response = await api.post(`/pedidos/${pedidoId}/pagar`, {
            numeroCartao: dadosCartao.numeroCartao,
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao aceitar pedido:", error);
        throw new Error('Falha ao aceitar pedido');
    }
}

export const finalizarPedido = async (pedidoId: number) =>  {
    try {
        const response = await api.post(`/pedidos/${pedidoId}/finalizar`);
        return response.data;
    } catch (error) {
        console.error("Erro ao aceitar pedido:", error);
        throw new Error('Falha ao aceitar pedido');
    }
}

export const enviarPedido = async (pedidoId: number) =>  {
    try {
        const response = await api.post(`/pedidos/${pedidoId}/enviar`);
        return response.data;
    } catch (error) {
        console.error("Erro ao aceitar pedido:", error);
        throw new Error('Falha ao aceitar pedido');
    }
}

export const cancelarPedido = async (pedidoId: number) =>  {
    try {
        const response = await api.post(`/pedidos/${pedidoId}/cancelar`);
        return response.data;
    } catch (error) {
        console.error("Erro ao aceitar pedido:", error);
        throw new Error('Falha ao aceitar pedido');
    }
}