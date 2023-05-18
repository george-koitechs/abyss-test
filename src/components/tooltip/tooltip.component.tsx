import React, { useEffect, useRef, useState } from "react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import "./tooltip.styles.scss";

interface TooltipProps {
  title: string;
  children: React.ReactNode;
  buttons?: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ title, children, buttons }) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [isClicked, setIsClicked] = useState(false);

  useOutsideClick(tooltipRef, () => {
    setIsTooltipVisible(false);
  });

  useEffect(() => {
    if (isClicked) {
      setIsTooltipVisible(false);
      setIsClicked(false);
    }
  }, [isClicked]);

  return (
    <div className="tooltip" ref={tooltipRef} onClick={() => setIsTooltipVisible(true)}>
      {children}
      <div className={`tooltip__inner ${isTooltipVisible ? "tooltip__inner_show" : ""}`}>
        <div className="tooltip__content">
          <div className="tooltip__title">{title}</div>
          {buttons && (
            <div className="tooltip__buttons" onClick={() => setIsClicked(true)}>
              {buttons}
            </div>
          )}
        </div>
        <div className="tooltip__arrow" />
      </div>
    </div>
  );
};
