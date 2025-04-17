import { useState, useEffect } from "react";
import "./estoque.css";
import { ProdutoCompleto } from "../../types/global";
import ModalEditarProduto from "../../components/ModalEditarProduto";
import { useNavigate } from "react-router-dom";

const categorias = [
  "Todas as categorias",
  "Bebidas",
  "Alimentos",
  "Limpeza",
  "Higiene",
  "Outros"
];

const itensPorPagina = 10;

export default function EstoquePage() {
  const [produtos, setProdutos] = useState<ProdutoCompleto[]>([]);
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("Todas as categorias");
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Estados para edição
  const [modalAberto, setModalAberto] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<ProdutoCompleto | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function carregarProdutos() {
      const resp = await window.produtoAPI.listarProdutos();
      if (resp.sucesso) {
        setProdutos(resp.produtos ?? []);
      } else {
        alert('Erro ao carregar produtos: ' + resp.erro);
      }
    }
    carregarProdutos();
  }, []);

  const produtosFiltrados = produtos.filter(p =>
    (categoria === "Todas as categorias" || p.categoria === categoria) &&
    (busca === "" || p.nome.toLowerCase().includes(busca.toLowerCase()) || p.codigo_barras.includes(busca))
  );

  useEffect(() => {
    setTotalPaginas(Math.max(1, Math.ceil(produtosFiltrados.length / itensPorPagina)));
  }, [produtosFiltrados]);

  const produtosPaginados = produtosFiltrados.slice((pagina - 1) * itensPorPagina, pagina * itensPorPagina);

  // Função para deletar produto
  async function handleDeletarProduto(id: number) {
    if (!window.confirm('Tem certeza que deseja deletar este produto?')) return;
    const resp = await window.produtoAPI.deletarProduto(id);
    if (resp.sucesso) {
      setProdutos(produtos.filter(p => p.id !== id));
    } else {
      alert('Erro ao deletar produto: ' + resp.erro);
    }
  }

  // Abrir modal de edição
  function handleAbrirModalEditar(produto: ProdutoCompleto) {
    console.log('Produto selecionado:', produto);
    setProdutoEditando(produto);
    setModalAberto(true);
    console.log('Modal aberto: ' + modalAberto);
  }

  // Salvar edição
  async function handleSalvarEdicao(produtoEditado: ProdutoCompleto) {
    console.log('Produto editado:', produtoEditado);  
    const resp = await window.produtoAPI.atualizarProduto(produtoEditado);
    if (resp.sucesso) {
      setProdutos(produtos.map(p => p.id === produtoEditado.id ? produtoEditado : p));
      setModalAberto(false);
      setProdutoEditando(null);
    } else {
      alert('Erro ao editar produto: ' + resp.erro);
    }
  }

  return (
    <div className="estoque-wrapper">
      <h2 className="estoque-title">Estoque</h2>
      <div className="estoque-controls">
        <input
          type="text"
          className="estoque-busca"
          placeholder="Buscar produtos..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />
        <select className="estoque-categoria" value={categoria} onChange={e => setCategoria(e.target.value)}>
          {categorias.map(cat => <option key={cat}>{cat}</option>)}
        </select>
        <button className="estoque-btn-novo" onClick={() => navigate("/produtos")}>+ Novo Produto</button>
      </div>
      <table className="estoque-tabela">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Código</th>
            <th>Categoria</th>
            <th>Preço</th>
            <th>Estoque</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtosPaginados.length === 0 ? (
            <tr><td colSpan={6} className="estoque-vazio">Nenhum produto encontrado.</td></tr>
          ) : (
            produtosPaginados.map(produto => (
              <tr key={produto.id} className={produto.estoque_atual <= produto.quantidade_minima ? "estoque-baixo" : ""}>
                <td>
                  <div className="estoque-produto-nome">{produto.nome}</div>
                  <div className="estoque-produto-cat">{produto.categoria}</div>
                </td>
                <td>{produto.codigo_barras}</td>
                <td>{produto.categoria}</td>
                <td>R$ {produto.preco.toFixed(2).replace('.', ',')}</td>
                <td>
                  {produto.estoque_atual <= produto.quantidade_minima ? (
                    <span className="estoque-alerta"> {produto.estoque_atual} unid.</span>
                  ) : (
                    <span className="estoque-ok"> {produto.estoque_atual} unid.</span>
                  )}
                </td>
                <td>
                  <button className="estoque-acao editar" onClick={() => handleAbrirModalEditar(produto)}>✏️</button>
                  <button className="estoque-acao deletar" onClick={() => handleDeletarProduto(produto.id)}>🗑️</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="estoque-paginacao">
        <button disabled={pagina === 1} onClick={() => setPagina(pagina - 1)}>Anterior</button>
        <span>Mostrando página {pagina} de {totalPaginas} ({produtosFiltrados.length} produto(s))</span>
        <button disabled={pagina === totalPaginas} onClick={() => setPagina(pagina + 1)}>Próxima</button>
      </div>
      <ModalEditarProduto
        aberto={modalAberto}
        produto={produtoEditando}
        categorias={categorias}
        onSalvar={handleSalvarEdicao}
        onFechar={() => setModalAberto(false)}
      />
    </div>
  );
}
