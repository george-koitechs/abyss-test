import React, { useState, useEffect, useRef } from "react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import "./select.styles.scss";

interface Option {
  value: number;
  label: string;
}

interface SelectProps {
  options: Option[];
  value: number;
  onChange: (value: number) => void;
}

export const Select: React.FC<SelectProps> = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const selectRef = useRef<HTMLDivElement>(null);

  useOutsideClick(selectRef, () => {
    setIsOpen(false);
  });

  useEffect(() => {
    const option = options.find((opt) => opt.value === value) || null;
    setSelectedOption(option);
  }, [options, value]);

  function toggleOpen() {
    setIsOpen((prev) => !prev);
  }

  function handleSelect(option: Option, event: React.MouseEvent<HTMLLIElement>) {
    event.stopPropagation();
    setSelectedOption(option);
    onChange(option.value);
    setIsOpen(false);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter") {
      setIsOpen(!isOpen);
    } else if (event.key === "Escape") {
      setIsOpen(false);
    } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      const currentIndex = selectedOption ? options.findIndex((opt) => opt.value === selectedOption.value) : -1;
      if (currentIndex !== -1) {
        const nextIndex = event.key === "ArrowUp" ? currentIndex - 1 : currentIndex + 1;
        if (nextIndex >= 0 && nextIndex < options.length) {
          setSelectedOption(options[nextIndex]);
        }
      } else if (options.length > 0) {
        setSelectedOption(options[event.key === "ArrowUp" ? options.length - 1 : 0]);
      }
    }
  }

  return (
    <div className="select" ref={selectRef}>
      <div
        tabIndex={0}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onKeyDown={handleKeyDown}
        onClick={toggleOpen}
        className={`select__trigger ${isOpen ? "select__trigger_open" : ""}`}
      >
        {selectedOption ? selectedOption.label : value ? `${value}%` : "Select an option"}
      </div>
      <ul role="listbox" className={`select__dropdown ${isOpen ? "select__dropdown_open" : ""}`}>
        {options.map((option) => (
          <li
            key={option.value}
            role="option"
            aria-selected={selectedOption?.value === option.value}
            onClick={(e) => handleSelect(option, e)}
            className={`select__option ${selectedOption?.value === option.value ? "select__option_selected" : ""}`}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};
