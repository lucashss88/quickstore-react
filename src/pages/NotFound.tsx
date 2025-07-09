import {useNavigate} from "react-router-dom";

export function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="d-flex flex-column justify-content-center align-items-center text-center vh-100">
            <h1 className="display-1 fw-bold">404</h1>
            <p className="fs-3">
                <span className="text-danger">Oops!</span> Página não encontrada.
            </p>
            <p className="lead">
                A página que você está procurando não existe ou foi movida.
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/produtos')}>
                Voltar para Produtos
            </button>
        </div>
    );
}