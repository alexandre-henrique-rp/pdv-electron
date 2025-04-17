import { useEffect, useState } from "react";
import {
  MdPointOfSale,
  MdInventory2,
  MdWarehouse,
  MdPeople,
  MdAssessment
} from "react-icons/md";
import { FaTruck } from "react-icons/fa";

import "./Nav.css";
import { Link } from "react-router-dom";

export default function NavMenu() {
  // Modo compacto: abaixo de 800px só ícones
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsCompact(window.innerWidth <= 1024);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className={`nav${isCompact ? " nav-compact" : ""}`}>
      <h2 className="nav-logo">{isCompact ? "" : "PDV System"}</h2>
      <ul>
        <li>
          <Link to="/pdv">
            <MdPointOfSale />{isCompact ? null : " PDV"}
          </Link>
        </li>
        <li>
          <Link to="/produtos">
            <MdInventory2 />{isCompact ? null : " Produtos"}
          </Link>
        </li>
        <li>
          <Link to="/estoque">
            <MdWarehouse />{isCompact ? null : " Estoque"}
          </Link>
        </li>
        <li>
          <Link to="/fornecedores">
            <FaTruck />{isCompact ? null : " Fornecedores"}
          </Link>
        </li>
        <li>
          <Link to="/usuarios">
            <MdPeople />{isCompact ? null : " Usuários"}
          </Link>
        </li>
        <li>
          <Link to="/relatorios">
            <MdAssessment />{isCompact ? null : " Relatórios"}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
