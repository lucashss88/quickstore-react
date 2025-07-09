import api from "./api.ts";

interface Produto {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    estoque: number;
    imagemUrl?: string;
}

export const listarProdutos = async () => {
    try{
        const response = await api.get('/produtos');
        return response.data || [];
    } catch (error: any) {
        console.error("Erro ao listar produtos:", error.response?.statusText || error.message);
        throw new Error('Falha ao listar produtos');
    }
}

export const criarProduto = (produto: Omit<Produto, "id">) => api.post('/produtos', produto);

export const deletarProduto = (id: number) => api.delete(`/produtos/${id}`);

export const atualizarProduto = (id: number, produto: unknown) => api.put(`/produtos/${id}`, produto);

export const buscarProdutoPorId = (id: number) => api.get(`/produtos/${id}`);

export const uploadImagem = async (file: File) => {
    const formData = new FormData();
    formData.append('imagem', file);

    try{
        const response = await api.post('/produtos/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        });
        console.log('Resposta do servidor ao enviar imagem:', response);
        console.log('Imagem enviada, URL recebida:', response.data);

        if (response.data && response.data.url) {
            return response.data.url.replace(/\\/g, "/");
        } else {
            throw new Error('Falha ao enviar imagem');
        }
    } catch (error: any) {
        console.error("Erro ao enviar imagem:", error.response?.data || error.message);
        throw new Error('Falha ao enviar imagem');
    }
};