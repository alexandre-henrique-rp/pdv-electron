export { type ProdutoData, type ProdutoCompleto };

export interface ProdutoData {
  nome: string;
  categoria: string;
  preco: number;
  estoque_atual: number;
  quantidade_minima: number;
  codigo_barras: string;
  foto: string | null;
  tipo_venda: string;
}

export interface ProdutoCompleto extends ProdutoData {
  id: number;
}

interface ProdutoAPI {
  salvarProduto: (dados: ProdutoData) => Promise<{ sucesso: boolean; id?: number; erro?: string }>;
  listarProdutos: () => Promise<{ sucesso: boolean; produtos?: ProdutoCompleto[]; erro?: string }>;
  deletarProduto: (id: number) => Promise<{ sucesso: boolean; erro?: string }>;
  atualizarProduto: (produto: ProdutoCompleto) => Promise<{ sucesso: boolean; erro?: string }>;
}

declare global {
  interface Window {
    produtoAPI: ProdutoAPI;
  }
}
