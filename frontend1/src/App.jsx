import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Pad from "./pages/Pad";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/:padId" element={<Pad />} />
    </Routes>
  );
}
