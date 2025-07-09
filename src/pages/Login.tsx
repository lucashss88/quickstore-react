import {useState} from "react";
import {useAuth} from "../context/AuthContext.tsx";
import * as React from "react";

export function Login() {
    const {login, carregando} = useAuth();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erroLocal, setErroLocal] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErroLocal("");
        try {
            await login(email, senha);
        } catch (error: any) {
            setErroLocal(error.message || 'Usuário ou senha inválidos.');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center bg-light py-5">
            <div className="card-login shadow-lg" style={{ maxWidth: '450px', width: '100%', borderRadius: '1rem' }}>
                <div className="text-center mb-4">
                    <img
                        src="https://placehold.co/64x64/6610f2/FFFFFF?text=QS"
                        alt="QuickStore Logo"
                        className="mb-3 rounded-circle shadow-sm"
                    />
                    <h1 className="h3 mb-1 fw-bold text-dark">Bem-vindo(a)!</h1>
                    <p className="text-muted">Faça login na QuickStore</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label visually-hidden">Email</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                            <input
                                id="email"
                                type="email"
                                placeholder="Seu e-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-control"
                                required
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label visually-hidden">Senha</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-lock"></i></span>
                            <input
                                id="password"
                                type="password"
                                placeholder="Sua senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                className="form-control"
                                required
                            />
                        </div>
                    </div>

                    {erroLocal && (
                        <div className="alert alert-danger" role="alert">
                            <strong>Ops!</strong> {erroLocal}
                        </div>
                    )}

                    <div className="d-grid gap-2 mb-3">
                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            disabled={carregando}
                        >
                            <i className="bi bi-box-arrow-in-right me-2"></i>
                            {carregando ? 'Entrando...' : 'Entrar'}
                        </button>
                    </div>
                </form>

                <div className="text-center mt-3">
                    <p className="text-muted mb-0">
                        Não tem uma conta?{' '}
                        <a href="/registro" className="text-decoration-none text-primary fw-semibold">
                            <i className="bi bi-person-plus me-1"></i>
                            Criar conta
                        </a>
                    </p>
                </div>

                <div className="d-flex align-items-center my-4">
                    <div className="flex-grow-1 border-top border-secondary"></div>
                    <span className="mx-3 text-muted small">OU</span>
                    <div className="flex-grow-1 border-top border-secondary"></div>
                </div>

                <div className="d-grid gap-3">
                    <button
                        type="button"
                        className="btn btn-outline-dark d-flex align-items-center justify-content-center"
                    >
                        {/* Ícone do Google em SVG */}
                        <svg className="me-2" width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M44.5 20H24V28.5H35.42C34.78 31.42 32.74 33.72 30.12 35.38V40.75H38.5C43.34 36.36 46 29.58 46 20H44.5Z" fill="#4285F4"/>
                            <path d="M24 46C30.34 46 35.74 43.96 39.81 40.75L30.12 35.38C27.91 36.87 25.13 37.75 24 37.75C19.74 37.75 16.03 34.98 14.77 31.06L4.5 31.06V36.31C6.9 41.22 14.15 46 24 46Z" fill="#34A853"/>
                            <path d="M14.77 31.06C14.17 29.35 13.84 27.64 13.84 24C13.84 20.36 14.17 18.65 14.77 16.94L14.77 11.69L4.5 11.69C2.06 16.63 2.06 29.37 4.5 34.31L14.77 31.06Z" fill="#FBBC05"/>
                            <path d="M24 10.25C26.54 10.25 28.84 11.11 30.72 12.87L38.79 4.75C35.74 1.76 30.34 0 24 0C14.15 0 6.9 4.78 4.5 9.78L14.77 16.94C16.03 13.02 19.74 10.25 24 10.25Z" fill="#EA4335"/>
                        </svg>
                        Continuar com Google
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-primary d-flex align-items-center justify-content-center"
                    >
                        <svg className="me-2" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.505 1.492-3.89 3.776-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V22C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                        </svg>
                        Continuar com Facebook
                    </button>
                </div>
            </div>

        </div>
    );
}