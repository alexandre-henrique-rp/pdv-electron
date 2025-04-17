const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('produtoAPI', {
  salvarProduto: (dados) => {
    // Força serialização profunda para garantir só tipos simples
    const dadosSimples = JSON.parse(JSON.stringify(dados));
    return ipcRenderer.invoke('produto:salvar', dadosSimples);
  },
  listarProdutos: () => ipcRenderer.invoke('produto:listar'),
  deletarProduto: (id) => ipcRenderer.invoke('produto:deletar', id),
  atualizarProduto: (produto) => ipcRenderer.invoke('produto:atualizar', produto),
});
