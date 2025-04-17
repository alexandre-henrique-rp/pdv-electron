import { useState, useEffect, ChangeEvent } from "react";
import { ProdutoCompleto } from "../types/global";
import styles from "./ModalEditarProduto.module.css";
import { CurrencyMask } from "../masks/CurrencyMask";

interface ModalEditarProdutoProps {
  aberto: boolean;
  produto: ProdutoCompleto | null;
  categorias: string[];
  onSalvar: (produtoEditado: ProdutoCompleto) => void;
  onFechar: () => void;
}

export default function ModalEditarProduto({ aberto, produto, categorias, onSalvar, onFechar }: ModalEditarProdutoProps) {
  const [produtoEditado, setProdutoEditado] = useState<ProdutoCompleto | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [precoStr, setPrecoStr] = useState<string>("");

  useEffect(() => {
    if (aberto && produto) {
      setProdutoEditado({ ...produto });
      setPreview(produto.foto || null);
      setPrecoStr(produto.preco.toFixed(2).replace('.', ','));
    } else {
      setProdutoEditado(null);
      setPreview(null);
      setPrecoStr("");
    }
  }, [aberto, produto]);

  function handleImagemChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const base64 = ev.target?.result;
      if (typeof base64 === 'string') {
        setPreview(base64);
        if (produtoEditado) setProdutoEditado({ ...produtoEditado, foto: base64 });
      }
    };
    reader.readAsDataURL(file);
  }

  function handlePrecoMasked(masked: string, numeric: number) {
    setPrecoStr(masked);
    if (produtoEditado) {
      setProdutoEditado({ ...produtoEditado, preco: numeric });
    }
  }

  if (!aberto || !produtoEditado) return null;

  return (
    <div className={styles["modal-bg"]}>
      <div className={styles.modal} role="dialog" aria-modal="true" tabIndex={-1}>
        <h3>Editar Produto</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div>
            <label style={{ marginBottom: 8, fontWeight: 600 }}>Imagem atual:</label>
            <div style={{ width: 90, height: 90, border: '1px solid #ccc', borderRadius: 8, background: '#fafbfc', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {preview ? (
                <img src={preview} alt="Prévia" style={{ maxWidth: '100%', maxHeight: '100%' }} />
              ) : (
                <span style={{ color: '#888', fontSize: 12 }}>Sem imagem</span>
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleImagemChange} style={{ marginTop: 10 }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <label>Nome:<input value={produtoEditado.nome} onChange={e => setProdutoEditado({ ...produtoEditado, nome: e.target.value })} /></label>
            <label>Código de Barras:<input value={produtoEditado.codigo_barras} onChange={e => setProdutoEditado({ ...produtoEditado, codigo_barras: e.target.value })} /></label>
            <label>Categoria:
              <select value={produtoEditado.categoria} onChange={e => setProdutoEditado({ ...produtoEditado, categoria: e.target.value })}>
                {categorias.filter(cat => cat !== "Todas as categorias").map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </label>
            <label>Tipo de Venda:
              <select value={produtoEditado.tipo_venda} onChange={e => setProdutoEditado({ ...produtoEditado, tipo_venda: e.target.value })}>
                <option value="Unidade">Unidade</option>
                <option value="Peso">Peso</option>
              </select>
            </label>
            <label>Preço:
              <CurrencyMask value={precoStr} onChange={handlePrecoMasked} />
            </label>
            <label>Estoque Atual:<input type="number" min="0" value={produtoEditado.estoque_atual} onChange={e => setProdutoEditado({ ...produtoEditado, estoque_atual: parseInt(e.target.value) || 0 })} /></label>
            <label>Quantidade Mínima:<input type="number" min="0" value={produtoEditado.quantidade_minima} onChange={e => setProdutoEditado({ ...produtoEditado, quantidade_minima: parseInt(e.target.value) || 0 })} /></label>
          </div>
        </div>
        <div className={styles["modal-actions"]}>
          <button onClick={() => produtoEditado && onSalvar(produtoEditado)}>Salvar</button>
          <button onClick={onFechar}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
