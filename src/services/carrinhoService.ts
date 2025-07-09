import api from './api';

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

interface Carrinho {
  id: number;
  valorTotal: number;
  usuarioId: number;
  itens: ItemCarrinho[];
  createdAt: string;
  updatedAt: string;
}

const transformarCarrinho = (backendData: any): Carrinho => {
  if (!backendData || Object.keys(backendData).length === 0) {
      console.warn("Dados do carrinho estão ausentes. Retornando carrinho vazio.");
      return {
          id: 0,
          valorTotal: 0,
          usuarioId: 0,
          itens: [],
          createdAt: '',
          updatedAt: '',
      };
  }

  return {
    id: backendData.id || 0,
    valorTotal: backendData.valorTotal || 0,
    usuarioId: backendData.usuarioId || 0,
    itens: Array.isArray(backendData.items)
        ? backendData.items.map((item: any) => ({
            id: item.id || 0,
            produtoId: item.produtoId || 0,
            quantidade: item.quantidade || 0,
            preco: item.preco || 0,
            produto: {
                id: item.Produto?.id || 0,
                nome: item.Produto?.nome || '',
                descricao: item.Produto?.descricao || '',
                estoque: item.Produto?.estoque || 0,
                preco: item.Produto?.preco || 0,
                imagemUrl: item.Produto?.imagem_url || '',
            },
        }))
        : [],
      createdAt: backendData.createdAt || '',
      updatedAt: backendData.updatedAt || '',
  };
};

export const buscarCarrinhoUsuario = async (): Promise<Carrinho> => {
    const response = await api.get('/carrinhos/meu-carrinho');
    return transformarCarrinho(response.data);
}

export const adicionarItemAoCarrinho = async (
    produtoId: number,
    quantidade: number,
): Promise<Carrinho> => {
    const response = await api.post(`/carrinhos/meu-carrinho/items`, {
        produtoId,
        quantidade,
    });
    return transformarCarrinho(response.data);
};

export const removerItemDoCarrinho = async (
    produtoId: number,
): Promise<Carrinho> => {
    const response = await api.delete(`/carrinhos/meu-carrinho/items/${produtoId}`);
    return transformarCarrinho(response.data);
}

export const atualizarQuantidadeDoItemDoCarrinho = async (
    produtoId: number,
    quantidade: number,
): Promise<Carrinho> => {

    if (quantidade <= 0) {
        throw new Error('Quantidade deve ser maior que zero.');
    }

    const response = await api.put(`/carrinhos/meu-carrinho/items/${produtoId}`,  {
        quantidade,
    });
    return response.data;
};