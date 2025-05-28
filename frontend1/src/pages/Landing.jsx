
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Landing() {
//   const [padName, setPadName] = useState("");
//   const navigate = useNavigate();

//   const handleEnter = () => {
//     if (padName.trim()) {
//       navigate(`/${encodeURIComponent(padName.trim())}`);
//     }
//   };

//   return (
//     <div className="flex h-screen items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
//         <h1 className="text-3xl font-bold mb-6 text-center">Welcome to NotePad+</h1>
//         <input
//           type="text"
//           placeholder="Enter Pad Name (e.g., Hello)"
//           className="w-full p-3 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
//           value={padName}
//           onChange={(e) => setPadName(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && handleEnter()}
//         />
//         <button
//           onClick={handleEnter}
//           className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition"
//         >
//           Go to Pad
//         </button>
//       </div>
//     </div>
//   );
// }



// code2



import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Access the backend URL from Vite environment variables
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function Landing() {
  const [padName, setPadName] = useState("");
  const navigate = useNavigate();

  // You can log the backend URL to verify it's loaded (optional)
  // console.log("Backend URL:", VITE_BACKEND_URL);

  const handleEnter = () => {
    if (padName.trim()) {
      // Here you might use VITE_BACKEND_URL if you were making an API call, e.g.:
      fetch(`${VITE_BACKEND_URL}/api/pads`, { method: 'POST', body: JSON.stringify({ name: padName.trim() }) })
        .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
          navigate(`/${encodeURIComponent(padName.trim())}`);
        })
        .catch((error) => {
          console.error('Error:', error);
        });

      // Current navigation logic (client-side only)
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
