import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.tsx";
import * as React from "react";
import {toast} from "react-toastify";

function AdminPerfil() {
    const {usuario, editProfile, carregando} = useAuth();
    const [formData, setFormData] = useState({
        nome: '',
        email: ''
    })

    useEffect(() => {
        if (usuario) {
            setFormData({
                nome: usuario.nome,
                email: usuario.email
            });
        }
    }, [usuario]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await editProfile(formData.nome, formData.email);
            toast.success('Perfil atualizado com sucesso!');
        } catch (error: any) {
            console.error('Erro ao editar perfil:', error);
            toast.error(error.message || 'Erro ao atualizar o perfil.');
        }
    }

    if (carregando && !usuario) return <h1 className="text-center">Carregando perfil...</h1>;

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card-pedido shadow-sm">
                        <div>
                            <h5 className="fs-3 mb-4">Editar Perfil</h5>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="nome" className="form-label">Nome</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nome"
                                        name="nome"
                                        value={formData.nome}
                                        onChange={handleInputChange}
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
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <button className="btn bg-qs btn-primary" type="submit" disabled={carregando}>
                                    {carregando ? 'Atualizando...' : 'Salvar Alterações'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminPerfil;