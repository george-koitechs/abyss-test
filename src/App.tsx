import React from "react";
import { Route, Routes } from "react-router-dom";

import { HomePage } from "@/pages/home/home.page";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;
