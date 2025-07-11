import api from './api';

export const login = async (email: string, senha: string) => {
    try {
        const response = await api.post('/auth/login', { email, senha });

        if (response.data.token && response.data.user) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('usuario', JSON.stringify(response.data.user));
            localStorage.setItem('role', response.data.user.role);
            console.log("Login realizado com sucesso:", response.data.user);
            return response.data;
        } else {
            console.error("Dados inválidos recebidos do backend:", response.data);
            throw new Error('Dados de login inválidos');
        }
    } catch (error: any) {
        const errorMessage = error.response?.data?.msg || 'Falha no login. Verifique o console do servidor.';
        console.error("Erro detalhado do Axios:", error.response?.data);
        throw new Error(errorMessage);
    }
};

export const register = async (nome: string, email: string, senha: string) => {
    try{
        const response = await api.post('/auth/registrar', { email, senha, nome});
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.msg || 'Falha no registro. Verifique o console do servidor.';
        console.error("Erro detalhado do Axios:", error.response?.data);
        throw new Error(errorMessage);
    }

}

export const criarAdmin = async (nome: string, email: string, senha: string) => {
    try{
        const response = await api.post('/users/admin/criar-admin', { nome, email, senha });
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.msg || 'Falha no registro. Verifique o console do servidor.';
        console.error("Erro detalhado do Axios:", error.response?.data);
        throw new Error(errorMessage);
    }

}

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('role');
};

export const getUsuarioLogado = () => {
    try {
        const usuarioString = localStorage.getItem('usuario');
        return usuarioString ? JSON.parse(usuarioString) : null;
    } catch (error) {
        console.error("Erro ao analisar o JSON do usuário:", error);
        return null;
    }
};

export const editProfile = async (nome: string, email: string) => {
    try {
        const response = await api.put('/users/me', {nome, email});
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.msg || "Erro ao atualizar perfil.";
        console.error("Erro detalhado ao editar perfil:", error.response?.data);
        throw new Error(errorMessage);
    }
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};