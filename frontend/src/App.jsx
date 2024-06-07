import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import CommitStats from "./pages/CommitStats";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:name" element={<CommitStats />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
