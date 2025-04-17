import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../layout";
import PdvPage from "../page/pdv";
import ProdutosPage from "../page/produtos";
import EstoquePage from "../page/estoque";


// Páginas placeholder (crie depois os arquivos reais)
const Fornecedores = () => <div style={{padding: 32}}>Fornecedores</div>;
const Usuarios = () => <div style={{padding: 32}}>Usuários</div>;
const Relatorios = () => <div style={{padding: 32}}>Relatórios</div>;

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/pdv" replace />} />
          <Route path="/pdv" element={<PdvPage />} />
          <Route path="/produtos" element={<ProdutosPage />} />
          <Route path="/estoque" element={<EstoquePage />} />
          <Route path="/fornecedores" element={<Fornecedores />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/relatorios" element={<Relatorios />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
