import {useContext, useState} from "react";
import {AuthContext} from "../context/AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import * as React from "react";
import {toast} from "react-toastify";

function Registro() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const {registrar} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro("");
        try{
            await registrar(nome, email, senha);
            toast.success('Cadastro realizado com sucesso!');
            navigate('/login');
        } catch (e: any) {
            setErro(e.message || "Ocorreu um erro inesperado. Tente novamente.");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light py-5 position-relative">
            <div className="card shadow-lg p-4 p-md-5" style={{ maxWidth: '450px', width: '100%', borderRadius: '1rem' }}>
                <div className="text-center mb-4">
                    <img
                        src="https://placehold.co/64x64/6610f2/FFFFFF?text=QS" // Cor ajustada para combinar com o tema do Bootstrap
                        alt="QuickStore Logo"
                        className="mb-3 rounded-circle shadow-sm"
                    />
                    <h1 className="h3 mb-1 fw-bold text-dark">Cadastre-se na QuickStore</h1>
                    <p className="text-muted">Crie sua conta rapidamente!</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="nome" className="form-label visually-hidden">Nome</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-person"></i></span>
                            <input
                                id="nome"
                                type="text"
                                placeholder="Seu nome completo"
                                className="form-control"
                                value={nome}
                                onChange={e => setNome(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label visually-hidden">Email</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                            <input
                                id="email"
                                type="email"
                                placeholder="Seu e-mail"
                                className="form-control"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="form-label visually-hidden">Senha</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-lock"></i></span>
                            <input
                                id="password"
                                type="password"
                                placeholder="Crie uma senha"
                                className="form-control"
                                value={senha}
                                onChange={e => setSenha(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {erro && (
                        <div className="alert alert-danger" role="alert">
                            <strong>Ops!</strong> {erro}
                        </div>
                    )}

                    <div className="d-grid gap-2">
                        <button type="submit" className="btn btn-primary btn-lg">
                            <i className="bi bi-person-plus me-2"></i>
                            Registrar
                        </button>
                    </div>
                </form>

                <div className="text-center mt-3">
                    <p className="text-muted mb-0">
                        Já tem uma conta?{' '}
                        <a href="/" className="text-decoration-none text-primary fw-semibold">
                            Entrar
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Registro;