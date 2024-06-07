import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import CommitStats from "./pages/CommitStats";
function App() {
  return (
    <>
    <nav className="p-4 text-lg bg-dark-charcoal">
      <h1 className="font-outfit mx-4">
        HackmanV7{" "}
        <span class="text-lg mx-4 bg-philippine-yellow text-pink-800  font-medium me-2 px-2.5 py-0.5 rounded dark:bg-pink-900 dark:text-pink-300">
          Live
        </span>
      </h1>
    </nav>
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
