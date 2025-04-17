import React, { useState } from "react";
import "./produtos.css";

const categorias = [
  "Bebidas",
  "Alimentos",
  "Limpeza",
  "Higiene",
  "Outros"
];

export default function ProdutosPage() {
  const [foto, setFoto] = useState<File | null>(null);
  const [categoria, setCategoria] = useState("");
  const [nome, setNome] = useState("");
  const [codigoBarras, setCodigoBarras] = useState("");
  const [tipoVenda, setTipoVenda] = useState("Unidade");
  const [preco, setPreco] = useState("");
  const [estoqueAtual, setEstoqueAtual] = useState("");
  const [quantidadeMinima, setQuantidadeMinima] = useState("");
  const [salvando, setSalvando] = useState(false);

  function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setFoto(e.target.files[0]);
    }
  }

  async function handleSalvarProduto(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    let fotoBuffer = null;
    if (foto) {
      fotoBuffer = await fileToArrayBuffer(foto);
      fotoBuffer = Array.from(fotoBuffer);
    }
    // Monta objeto só com tipos simples
    const dados = {
      nome: String(nome),
      codigo_barras: String(codigoBarras),
      categoria: String(categoria),
      tipo_venda: String(tipoVenda),
      preco: Number(preco.replace(',', '.')) || 0,
      estoque_atual: Number(estoqueAtual) || 0,
      quantidade_minima: Number(quantidadeMinima) || 0,
      foto: fotoBuffer ? fotoBuffer : null
    };
    // Teste de serialização para debug
    try {
      JSON.stringify(dados);
    } catch (err) {
      alert('Erro ao serializar dados para envio: ' + err);
      setSalvando(false);
      return;
    }
    try {
      const resp = await window.produtoAPI.salvarProduto(dados);
      if (resp.sucesso) {
        alert("Produto salvo com sucesso!");
        setNome(""); setCodigoBarras(""); setCategoria(""); setTipoVenda("Unidade"); setPreco(""); setEstoqueAtual(""); setQuantidadeMinima(""); setFoto(null);
      } else {
        alert("Erro ao salvar: " + resp.erro);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert("Erro inesperado ao salvar produto: " + err.message);
      } else {
        alert("Erro inesperado ao salvar produto.");
      }
    }
    setSalvando(false);
  }

  function fileToArrayBuffer(file: File): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(new Uint8Array(reader.result as ArrayBuffer));
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  function formatarPreco(valor: string) {
    // Remove tudo que não for número
    let v = valor.replace(/\D/g, "");
    // Adiciona zeros à esquerda se necessário
    v = v.padStart(3, "0");
    // Insere vírgula antes dos dois últimos dígitos
    v = v.replace(/(\d{2})$/, ",$1");
    // Insere ponto a cada 3 dígitos antes da vírgula
    v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    // Remove zeros à esquerda desnecessários
    v = v.replace(/^0+(?!,)/, "");
    return v;
  }

  return (
    <form className="produtos-wrapper" onSubmit={handleSalvarProduto}>
      <h2 className="produtos-title">Cadastro de Produto</h2>
      <span className="produtos-subtitle">Adicione um novo produto ao catálogo</span>
      <div className="produtos-card">
        <div className="produtos-form">
          <div className="produtos-field">
            <label>Nome do Produto</label>
            <input
              type="text"
              placeholder="Digite o nome do produto"
              className="produtos-input"
              value={nome}
              onChange={e => setNome(e.target.value)}
              required
            />
          </div>
          <div className="produtos-row">
            <div className="produtos-field">
              <label>Código de Barras</label>
              <input
                type="text"
                placeholder="Digite ou gere automaticamente"
                className="produtos-input"
                value={codigoBarras}
                onChange={e => setCodigoBarras(e.target.value)}
              />
            </div>
            <div className="produtos-field">
              <label>Categoria</label>
              <select
                className="produtos-select"
                value={categoria}
                onChange={e => setCategoria(e.target.value)}
                required
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="produtos-row">
            <div className="produtos-field">
              <label>Tipo de Venda</label>
              <select className="produtos-select" value={tipoVenda} onChange={e => setTipoVenda(e.target.value)}>
                <option>Unidade</option>
                <option>Peso</option>
                <option>Volume</option>
              </select>
            </div>
            <div className="produtos-field">
              <label>Preço Unitário</label>
              <input
                type="text"
                placeholder="R$0,00"
                className="produtos-input"
                value={preco}
                onChange={e => setPreco(formatarPreco(e.target.value))}
                required
              />
            </div>
          </div>
          <div className="produtos-row">
            <div className="produtos-field">
              <label>Estoque Atual</label>
              <input
                type="number"
                placeholder="Quantidade"
                className="produtos-input"
                value={estoqueAtual}
                onChange={e => setEstoqueAtual(e.target.value)}
                required
              />
            </div>
            <div className="produtos-field">
              <label>Quantidade Mínima</label>
              <input
                type="number"
                placeholder="Alerta de estoque baixo"
                className="produtos-input"
                value={quantidadeMinima}
                onChange={e => setQuantidadeMinima(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
        <div className="produtos-photo">
          <label className="produtos-photo-label">Foto do Produto</label>
          <div className="produtos-photo-area">
            {foto ? (
              <img
                src={URL.createObjectURL(foto)}
                alt="Preview"
                className="produtos-photo-preview"
              />
            ) : (
              <>
                <div className="produtos-photo-icon">📷</div>
                <div className="produtos-photo-hint">
                  Arraste uma imagem ou <label htmlFor="foto-upload" className="produtos-photo-link">selecione um arquivo</label>
                </div>
                <div className="produtos-photo-info">PNG, JPG até 5MB</div>
              </>
            )}
            <input
              id="foto-upload"
              type="file"
              accept="image/png, image/jpeg"
              className="produtos-photo-input"
              onChange={handleFotoChange}
            />
          </div>
        </div>
      </div>
      <div className="produtos-actions">
        <button className="produtos-btn-cancel" type="button" onClick={() => {
          setNome(""); setCodigoBarras(""); setCategoria(""); setTipoVenda("Unidade"); setPreco(""); setEstoqueAtual(""); setQuantidadeMinima(""); setFoto(null);
        }}>Cancelar</button>
        <button className="produtos-btn-save" type="submit" disabled={salvando}>{salvando ? "Salvando..." : "Salvar Produto"}</button>
      </div>
    </form>
  );
}
