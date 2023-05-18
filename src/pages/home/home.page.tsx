import React, { useRef, useState } from "react";
import { centerElement, Draggable } from "@/components/draggable/draggable.component";
import { Tree } from "@/components/tree/tree.component";
import { Header } from "@/components/header/header.component";
import "./home.page.styles.scss";

export const HomePage = () => {
  const [scale, setScale] = useState(100);
  const draggableRef = useRef<HTMLDivElement>(null);

  function handleCenterClick() {
    centerElement(draggableRef.current);
  }

  return (
    <div className="main">
      <Header centerTree={handleCenterClick} setScale={setScale} />

      <div className="board">
        <Draggable ref={draggableRef} scale={scale}>
          <Tree centerTree={handleCenterClick} />
        </Draggable>
      </div>
    </div>
  );
};
