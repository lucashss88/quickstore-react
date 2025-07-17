import './App.css'
import './index.css'
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import Home from './pages/Usuario/Home.tsx';
import Produtos from './pages/Usuario/Produtos.tsx';
import CriarProduto from "./components/Admin/CriarProduto.tsx";
import {Carrinho} from "./pages/Usuario/Carrinho.tsx";
import {Login} from "./pages/Login.tsx";
import PrivateRoute from "./routes/PrivateRoute.tsx";
import Registro from "./pages/Registro.tsx";
import {ProdutoProvider} from "./context/ProdutoContext.tsx";
import {CarrinhoProvider} from "./context/CarrinhoContext.tsx";
import {AuthProvider} from "./context/AuthContext.tsx";
import Layout from "./pages/Layout.tsx";
import {PedidoProvider} from "./context/PedidoContext.tsx";
import Pedidos from "./pages/Usuario/Pedidos.tsx";
import {Pagamento} from "./pages/Usuario/Pagamento.tsx";
import {AdminRoute} from "./routes/AdminRoute.tsx";
import AdminProdutos from "./pages/Admin/AdminProdutos.tsx";
import {NotFoundAdmin, NotFoundUsuario} from "./pages/NotFound.tsx";
import AdminPedidos from "./pages/Admin/AdminPedidos.tsx";
import AdminPerfil from "./components/Admin/AdminPerfil.tsx";
import AdminCriar from "./components/Admin/AdminCriar.tsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.tsx";

export function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <CarrinhoProvider>
                    <PedidoProvider>
                        <ProdutoProvider>
                            <Layout>
                                <Routes>
                                    <Route path="/" element={<Login/>}/>
                                    <Route path="/registro" element={<Registro/>}/>

                                    <Route element={<PrivateRoute/>}>
                                        <Route path="/home" element={
                                            <Home/>
                                        }/>
                                        <Route path="/produtos" element={

                                            <Produtos/>

                                        }/>
                                        <Route path="/carrinho" element={

                                            <Carrinho/>

                                        }/>
                                        <Route path="/pedidos" element={

                                            <Pedidos/>

                                        }/>
                                        <Route path="/pagamento/:pedidoId" element={

                                            <Pagamento/>

                                        }/>
                                        <Route path="/perfil" element={

                                            <AdminPerfil/>

                                        }/>
                                        <Route path="*" element={<NotFoundUsuario/>}/>
                                        <Route element={<AdminRoute/>}>
                                            <Route path="/admin/produtos/criar" element={

                                                <CriarProduto/>

                                            }/>
                                            <Route path="/admin/produtos/editar/:id" element={

                                                <CriarProduto/>

                                            }/>
                                            <Route path="/admin/criar" element={

                                                <AdminCriar/>

                                            }/>
                                            <Route path="/admin/produtos" element={

                                                <AdminProdutos/>

                                            }/>
                                            <Route path="/admin/pedidos" element={

                                                <AdminPedidos/>

                                            }/>
                                            <Route path="/admin/perfil" element={

                                                <AdminPerfil/>

                                            }/>
                                            <Route path="/admin" element={

                                                <AdminDashboard/>

                                            }/>
                                        </Route>
                                        <Route path="*" element={<NotFoundAdmin/>}/>
                                    </Route>
                                </Routes>
                            </Layout>
                        </ProdutoProvider>
                    </PedidoProvider>
                </CarrinhoProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}


