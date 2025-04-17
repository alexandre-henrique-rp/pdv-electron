import React from "react";

interface CurrencyMaskProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string;
  onChange: (value: string, numeric: number) => void;
  maxLength?: number;
}

function formatarPreco(valor: string) {
  let v = valor.replace(/\D/g, "");
  v = v.padStart(3, "0");
  v = v.replace(/(\d{2})$/, ",$1");
  v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  v = v.replace(/^0+(?!,)/, "");
  return v;
}

export const CurrencyMask: React.FC<CurrencyMaskProps> = ({ value, onChange, maxLength = 15, ...props }) => {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const valor = e.target.value;
    const masked = formatarPreco(valor);
    const numeric = Number(masked.replace(/\./g, '').replace(',', '.')) || 0;
    onChange(masked, numeric);
  }

  return (
    <input
      {...props}
      value={value}
      onChange={handleChange}
      maxLength={maxLength}
      inputMode="decimal"
      autoComplete="off"
    />
  );
};
