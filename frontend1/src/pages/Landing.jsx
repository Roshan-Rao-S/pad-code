
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const [padName, setPadName] = useState("");
  const navigate = useNavigate();

  const handleEnter = () => {
    if (padName.trim()) {
      navigate(`/${encodeURIComponent(padName.trim())}`);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Welcome to NotePad+</h1>
        <input
          type="text"
          placeholder="Enter Pad Name (e.g., Hello)"
          className="w-full p-3 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={padName}
          onChange={(e) => setPadName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleEnter()}
        />
        <button
          onClick={handleEnter}
          className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition"
        >
          Go to Pad
        </button>
      </div>
    </div>
  );
}




