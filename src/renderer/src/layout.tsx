import { ReactNode } from "react";
import "./layout.css";
import NavMenu from "./components/nav";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="container">
      <div className="BoxMenu">
        <NavMenu />
      </div>
      <div className="content">{children}</div>
    </div>
  );
}
