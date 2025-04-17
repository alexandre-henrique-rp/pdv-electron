const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, '../data/pdv.sqlite');
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    codigo_barras TEXT,
    categoria TEXT,
    tipo_venda TEXT,
    preco REAL,
    estoque_atual INTEGER,
    quantidade_minima INTEGER,
    foto BLOB
  )`);
});

function salvarProduto(produto) {
  console.log('[salvarProduto] Produto recebido:', produto);
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`INSERT INTO produtos
      (nome, codigo_barras, categoria, tipo_venda, preco, estoque_atual, quantidade_minima, foto)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
    stmt.run(
      produto.nome,
      produto.codigo_barras,
      produto.categoria,
      produto.tipo_venda,
      produto.preco,
      produto.estoque_atual,
      produto.quantidade_minima,
      produto.foto,
      function (err) {
        if (err) {
          console.error('[salvarProduto] Erro ao inserir produto:', err);
          reject(err);
        } else {
          console.log('[salvarProduto] Produto inserido com sucesso. lastID:', this.lastID);
          resolve(this.lastID);
        }
      }
    );
    stmt.finalize((finalizeErr) => {
      if (finalizeErr) {
        console.error('[salvarProduto] Erro ao finalizar statement:', finalizeErr);
      } else {
        console.log('[salvarProduto] Statement finalizado com sucesso.');
      }
    });
  });
}

function listarProdutos() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM produtos", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// NOVA FUNÇÃO DELETAR PRODUTO
function deletarProduto(id) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('DELETE FROM produtos WHERE id = ?');
    stmt.run(id, function (err) {
      if (err) {
        console.error('[deletarProduto] Erro ao deletar produto:', err);
        reject(err);
      } else {
        console.log('[deletarProduto] Produto deletado com sucesso. id:', id);
        resolve(true);
      }
    });
    stmt.finalize();
  });
}

// Função para atualizar produto
function atualizarProduto(produto) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`UPDATE produtos SET
      nome = ?, codigo_barras = ?, categoria = ?, tipo_venda = ?, preco = ?, estoque_atual = ?, quantidade_minima = ?, foto = ?
      WHERE id = ?`);
    stmt.run(
      produto.nome,
      produto.codigo_barras,
      produto.categoria,
      produto.tipo_venda,
      produto.preco,
      produto.estoque_atual,
      produto.quantidade_minima,
      produto.foto,
      produto.id,
      function (err) {
        if (err) {
          console.error('[atualizarProduto] Erro ao atualizar produto:', err);
          reject(err);
        } else {
          console.log('[atualizarProduto] Produto atualizado com sucesso. id:', produto.id);
          resolve(true);
        }
      }
    );
    stmt.finalize();
  });
}

module.exports = {
  salvarProduto,
  listarProdutos,
  deletarProduto,
  atualizarProduto,
};