import {useContext} from "react";
import {AuthContext} from "../../context/AuthContext.tsx";
import {useNavigate} from "react-router-dom";

function Home() {
    const {logout} = useContext(AuthContext);
    const navigate  = useNavigate();

    const handleLogout = async () => {
        logout();
        console.log("Logout efetuado com sucesso!", localStorage.getItem("token"));
        navigate("/");
    }
    return (
        <div className="container mt-5">
            <h1>Bem-vindo à QuickStore</h1>
            <a href="/produtos" className="btn btn-dark m-2">Produtos</a>
            <button className="btn btn-dark m-2" onClick={handleLogout}>Sair</button>
        </div>
    );
}

export default Home;
