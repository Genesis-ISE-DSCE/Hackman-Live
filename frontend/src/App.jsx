
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import CountdownTimer from "./components/CountdownTimer";
import CommitStats from "./pages/CommitStats";
const startTime = new Date('2024-06-08T05:30:00.000Z').getTime(); // Replace with your start epoch time
const endTime = new Date('2024-06-09T05:30:00.000Z').getTime(); // Replace with your end epoch time

function App() {
  return (
    <>
    <nav className="p-4 text-lg bg-dark-charcoal flex justify-between">
      <h1 className="font-outfit mx-4">
        HackmanV7{" "}
        <span class="text-lg mx-4 bg-philippine-yellow text-pink-800  font-medium me-2 px-2.5 py-0.5 rounded dark:bg-pink-900 dark:text-pink-300">
          Live
        </span>
      </h1>
      <CountdownTimer startTime={startTime} endTime={endTime}/>
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
