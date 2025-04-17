import { FaMoneyBillWave, FaCreditCard } from "react-icons/fa";
import { SiPix } from "react-icons/si";
import { MdCardGiftcard } from "react-icons/md";
import "./pdv.css";

export default function PdvPage() {
  return (
    <div className="pdv-wrapper">
      <div className="pdv-header">
        <div>
          <h2>PDV - Caixa #1</h2>
          <span className="pdv-operator">Operador: João Silva</span>
        </div>
        <button className="pdv-close">⏻ Fechar Caixa</button>
      </div>

      <div className="pdv-main">
        {/* Área de busca */}
        <div className="pdv-search">
          <input
            type="text"
            placeholder="Código de barras ou busca"
            className="pdv-search-input"
          />
          <button className="pdv-search-btn">Buscar</button>
        </div>

        <div className="pdv-content-row">
          {/* Lista de itens */}
          <div className="pdv-sale-list">
            <div className="pdv-sale-list-header">
              <strong>Itens da Venda</strong>
            </div>
            <table className="pdv-table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Qtd</th>
                  <th>Preço</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Coca-Cola 2L</td>
                  <td>2</td>
                  <td>R$ 8,90</td>
                  <td>R$ 17,80</td>
                  <td>
                    <button className="pdv-remove">🗑️</button>
                  </td>
                </tr>
                <tr>
                  <td>Pão Francês</td>
                  <td>10</td>
                  <td>R$ 0,75</td>
                  <td>R$ 7,50</td>
                  <td>
                    <button className="pdv-remove">🗑️</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Resumo e pagamento */}
          <div className="pdv-summary">
            <div className="pdv-summary-total">
              <span>Total da Venda</span>
              <h1>R$ 25,30</h1>
            </div>
            <div className="pdv-summary-payments">
              <span>Forma de Pagamento</span>
              <div className="pdv-payment-options">
                <button className="pdv-payment"><FaMoneyBillWave /> Dinheiro</button>
                <button className="pdv-payment"><FaCreditCard /> Cartão</button>
                <button className="pdv-payment"><SiPix /> PIX</button>
                <button className="pdv-payment"><MdCardGiftcard /> Vale</button>
              </div>
            </div>
            <button className="pdv-finish">✔ Finalizar Venda (F5)</button>
            <button className="pdv-cancel">✖ Cancelar (ESC)</button>
          </div>
        </div>
      </div>
    </div>
  );
}
