import React, { useState, useRef, PropsWithChildren, useEffect, forwardRef } from "react";
import "./draggable.styles.scss";

interface DraggableProps extends PropsWithChildren {
  ref?: React.Ref<HTMLDivElement>;
  scale?: number;
}

export const Draggable: React.FC<DraggableProps> = forwardRef(({ children, scale = 100 }, ref) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const requestRef = useRef<number>();

  function handleMouseDown(event: React.MouseEvent<HTMLDivElement>) {
    const { clientX, clientY } = event;
    if (!divRef.current) return;
    const { left, top } = divRef.current.getBoundingClientRect();

    offsetRef.current = { x: clientX - left, y: clientY - top };

    setIsDragging(true);
  }

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!isDragging) return;

    const { clientX, clientY } = event;

    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }

    requestRef.current = requestAnimationFrame(() => {
      setPosition({ x: clientX - offsetRef.current.x, y: clientY - offsetRef.current.y });
    });
  }

  function handleMouseUp() {
    setIsDragging(false);

    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
  }

  useEffect(() => {
    centerElement(divRef.current);
  }, []);

  useEffect(() => {
    if (ref) {
      if (typeof ref === "function") {
        ref(divRef.current);
      } else {
        if (!divRef.current) return;
        (ref as React.MutableRefObject<HTMLDivElement>).current = divRef.current;
      }
    }
  }, [ref]);

  return (
    <div
      ref={divRef}
      style={{ left: `${position.x}px`, top: `${position.y}px`, transform: `scale(${scale}%)` }}
      className="draggable"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {children}
    </div>
  );
});

export const centerElement = (element: HTMLElement | null) => {
  if (!element) return;

  const { width, height } = element.getBoundingClientRect();

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const elementWidth = (element.offsetWidth * width) / element.clientWidth;
  const elementHeight = (element.offsetHeight * height) / element.clientHeight;

  const newX = (windowWidth - elementWidth) / 2;
  const newY = (windowHeight - elementHeight) / 2;

  const handleTransitionEnd = () => {
    element.style.transition = "transform 0.3s ease-in-out";
    element.removeEventListener("transitionend", handleTransitionEnd);
  };

  requestAnimationFrame(() => {
    element.style.transition = "left 0.3s ease-in-out, top 0.3s ease-in-out";
    element.style.left = `${newX}px`;
    element.style.top = `${newY}px`;
  });

  element.addEventListener("transitionend", handleTransitionEnd);
};
