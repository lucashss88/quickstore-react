import {createContext, useContext, useEffect, useState} from "react";
import * as authService from "../services/authService";
import * as React from "react";
import {useNavigate} from "react-router-dom";

interface Usuario {
    id: number;
    password: string;
    email: string;
    nome: string;
    role: 'admin' | 'usuario';
}

interface AuthContextData {
    usuario: Usuario | null;
    carregando: boolean;
    erro: Error | null;
    login: (email: string, senha: string) => Promise<void>;
    logout: () => void;
    registrar: (nome: string, email: string, senha: string) => Promise<Usuario>;
    criarAdmin: (nome: string, email: string, senha: string) => Promise<Usuario>;
    editProfile: (nome: string, email: string) => Promise<void>;
    isAuthenticated: () => boolean;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [usuario, setUsuario] = useState<Usuario | null>(() => {
        const usuarioLogado = authService.getUsuarioLogado();
        return usuarioLogado ? usuarioLogado : null;
    });
    const navigate = useNavigate();
    // @ts-ignore
    const [carregando, setCarregando] = useState(true);
    // @ts-ignore
    const [erro, setErro] = useState<Error | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authService.isAuthenticated());

    const login = async (email: string, senha: string) => {
        setCarregando(true);
        try {
            const { user: usuarioLogado } = await authService.login(email, senha);
            setUsuario(usuarioLogado);
            setIsAuthenticated(true);
            setErro(null);
        } catch (error) {
            setErro(error as Error);
            throw error;
        } finally {
            setCarregando(false);
        }
    };

    const registrar = async (nome: string, email: string, senha: string) => {
        setCarregando(true);
        try {
            const data = await authService.register(nome, email, senha);
            console.log("Dados registrados:", data);
            setErro(null);
            return data;
        } catch (error) {
            setErro(error as Error);
            throw error;
        } finally {
            setCarregando(false);
        }
    }

    const criarAdmin = async (nome: string, email: string, senha: string) => {
        setCarregando(true);
        try {
            const data = await authService.criarAdmin(nome, email, senha);
            console.log("Dados registrados:", data);
            setErro(null);
            return data;
        } catch (error) {
            setErro(error as Error);
            throw error;
        } finally {
            setCarregando(false);
        }
    }

    const logout = () => {
        authService.logout();
        setUsuario(null);
        setIsAuthenticated(false);
    };

    const editProfile = async (nome: string, email: string) => {
        setCarregando(true);
        try {
            const response = await authService.editProfile(nome, email);

            if (response && response.user) {
                const usuarioAtualizado = response.user;
                setUsuario(usuarioAtualizado);
                localStorage.setItem('usuario', JSON.stringify(usuarioAtualizado));
                setErro(null);
                console.log("Usuario editado:", usuarioAtualizado);
                navigate('/admin/produtos', { replace: true });
            } else {
                throw new Error("Erro ao editar perfil");
            }
        } catch (error) {
            setErro(error as Error);
            throw error;
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        try {
            const user = authService.getUsuarioLogado();
            setUsuario(user);
            setIsAuthenticated(authService.isAuthenticated());
        } catch (error) {
            console.error("Erro ao inicializar AuthContext:", error);
            logout();
        } finally {
            setCarregando(false);
        }
    }, []);

    return (
        <AuthContext.Provider value={{
            usuario,
            login,
            registrar,
            criarAdmin,
            logout,
            isAuthenticated: () => isAuthenticated,
            editProfile,
            carregando,
            erro
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
};