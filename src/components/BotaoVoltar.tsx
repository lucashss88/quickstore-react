import {useNavigate} from "react-router-dom";

function BotaoVoltar() {
    const navigate = useNavigate();
    return (
        <a
            className="btn-link btn-lg link-dark text-decoration-none"
            onClick={() => navigate(-1)}
            style={{cursor: 'pointer', width: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <i className="bi bi-arrow-bar-left"></i>
        </a>
    );
}
export default BotaoVoltar;