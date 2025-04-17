const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const productService = require('./services/productService');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadURL('http://localhost:3000');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handler IPC para salvar produto
ipcMain.handle('produto:salvar', async (event, dados) => {
  try {
    if (dados.foto && Array.isArray(dados.foto)) {
      dados.foto = Buffer.from(dados.foto);
    }
    const id = await productService.salvarProduto(dados);
    const retorno = { sucesso: true, id: id != null ? String(id) : null };
    // console.log('[produto:salvar] Retornando para renderer:', retorno);
    return retorno;
  } catch (e) {
    const erroMsg = e && e.message ? String(e.message) : String(e);
    const retorno = { sucesso: false, erro: erroMsg };
    // console.log('[produto:salvar] Retornando erro para renderer:', retorno);
    return retorno;
  }
});

ipcMain.handle('produto:listar', async () => {
  try {
    const produtos = await productService.listarProdutos();
    // Converta Buffer para null para evitar erro de clonagem
    const produtosSerializados = produtos.map(p => ({
      ...p,
      foto: null // ou: p.foto ? Array.from(p.foto) : null
    }));
    return { sucesso: true, produtos: produtosSerializados };
  } catch (e) {
    return { sucesso: false, erro: e && e.message ? String(e.message) : String(e) };
  }
});

// Handler IPC para deletar produto
ipcMain.handle('produto:deletar', async (event, id) => {
  try {
    await productService.deletarProduto(id);
    return { sucesso: true };
  } catch (erro) {
    return { sucesso: false, erro: erro.message || String(erro) };
  }
});

// Handler IPC para atualizar produto
ipcMain.handle('produto:atualizar', async (event, produto) => {
  try {
    await productService.atualizarProduto(produto);
    return { sucesso: true };
  } catch (erro) {
    return { sucesso: false, erro: erro.message || String(erro) };
  }
});
