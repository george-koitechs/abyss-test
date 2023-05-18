import React, { useState } from "react";
import { TiLocationArrow, TiMinus, TiPlus } from "react-icons/all";
import { Select } from "@/components/select/select.component";
import "./header.styles.scss";

const options = [
  { value: 25, label: "25%" },
  { value: 50, label: "50%" },
  { value: 100, label: "100%" },
  { value: 150, label: "150%" },
];

interface HeaderProps {
  centerTree: () => void;
  setScale: React.Dispatch<React.SetStateAction<number>>;
}
export const Header: React.FC<HeaderProps> = ({ centerTree, setScale }) => {
  const [selectedValue, setSelectedValue] = useState(100);

  const handleChange = (value: number) => {
    setSelectedValue(value);
    setScale(value);
  };

  function decrease() {
    setScale((prev) => {
      const newValue = prev - 10;
      setSelectedValue(newValue);
      return newValue;
    });
  }
  function increase() {
    setScale((prev) => {
      const newValue = prev + 10;
      setSelectedValue(newValue);
      return newValue;
    });
  }

  return (
    <div className="header">
      <h2>Services</h2>
      <div className="header__actions">
        <button className="button button_square" onClick={centerTree}>
          <TiLocationArrow />
        </button>
        <div className="header__scale">
          <button className="button button_square" onClick={decrease}>
            <TiMinus />
          </button>
          <Select options={options} value={selectedValue} onChange={handleChange} />
          <button className="button button_square" onClick={increase}>
            <TiPlus />
          </button>
        </div>
      </div>
    </div>
  );
};
