import {useState} from "react";
import {useAuth} from "../../context/AuthContext.tsx";
import * as React from "react";
import {toast} from "react-toastify";

function AdminCriar() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const {criarAdmin, carregando} = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro("");
        try{
            await criarAdmin(nome, email, senha);
            toast.success('Administrador criado com sucesso!');
        } catch (e: any) {
            setErro(e.message || "Ocorreu um erro inesperado. Tente novamente.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card-pedido shadow-sm">
                        <div>
                            <h5 className="fs-3 mb-4">Criar Administrador</h5>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="nome" className="form-label">Nome</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nome"
                                        name="nome"
                                        placeholder="Seu nome"
                                        value={nome}
                                        onChange={e => setNome(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        placeholder="Seu e-mail"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Senha</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="senha"
                                        name="senha"
                                        value={senha}
                                        placeholder="Crie uma senha"
                                        onChange={e => setSenha(e.target.value)}
                                        required
                                    />
                                </div>
                                {erro && (
                                    <div className="alert alert-danger" role="alert">
                                        <strong>Ops!</strong> {erro}
                                    </div>
                                )}
                                <button className="btn bg-qs btn-primary" type="submit" disabled={carregando}>
                                    {carregando ? 'Criando...' : 'Criar Administrador'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminCriar;