
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

// code--2

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() { // Changed App to Landing
  const [padName, setPadName] = useState("");
  const navigate = useNavigate(); 

  const handleEnter = () => {
    if (padName.trim()) {
      console.log(`Navigating to: /${encodeURIComponent(padName.trim())}`);
      navigate(`/${encodeURIComponent(padName.trim())}`); // Uncomment this for actual navigation
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50 p-4 font-sans">
      <main className="flex flex-col items-center justify-center flex-grow w-full">
        <div className="bg-white p-8 sm:p-10 rounded-xl shadow-lg w-full max-w-md sm:max-w-lg">
          
          {/* Animated SVG Logo */}
          <div className="text-center mb-6">
            <svg
              className="mx-auto w-16 h-16 text-indigo-500" // Base color for SVG
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
            >
              <defs>
                {/* Gradient for the main ring */}
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" /> {/* indigo-600 */}
                  <stop offset="100%" stopColor="#a855f7" /> {/* purple-600 */}
                </linearGradient>
                {/* Subtle glow filter for the letter 'N' */}
                <filter id="subtleGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                  <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Pulsing background circle */}
              <circle cx="50" cy="50" r="45" fill="rgba(79, 70, 229, 0.1)" > {/* indigo-700 with low opacity */}
                  <animate attributeName="r" values="45;42;45" dur="4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.1;0.2;0.1" dur="4s" repeatCount="indefinite" />
              </circle>

              {/* Main static gradient ring */}
              <circle cx="50" cy="50" r="40" fill="none" stroke="url(#logoGradient)" strokeWidth="3.5" />

              {/* Letter N with subtle glow */}
              <text
                x="28"          // Positioned for balance
                y="62"          // Adjusted for vertical alignment
                fontFamily="system-ui, sans-serif"
                fontSize="38"
                fontWeight="bold"
                fill="#EDE9FE"  // violet-100 (light for contrast)
                filter="url(#subtleGlow)"
              >
                NP
              </text>

              {/* Animated Plus Sign */}
              <g transform="translate(67 44)"> {/* Adjusted for better vertical alignment with N */}
                <text
                  x="0"
                  y="0"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontFamily="system-ui, sans-serif"
                  fontSize="36"
                  fontWeight="bold"
                  fill="#C4B5FD" // violet-300
                >
                  +
                  {/* Continuous rotation */}
                  <animateTransform
                    attributeName="transform"
                    attributeType="XML"
                    type="rotate"
                    from="0 0 0"
                    to="360 0 0"
                    dur="6s" // Duration of one full rotation
                    repeatCount="indefinite"
                    calcMode="linear" // Ensures smooth, constant speed
                  />
                  {/* Color pulse */}
                  <animate
                    attributeName="fill"
                    values="#C4B5FD;#A78BFA;#C4B5FD" // violet-300 to violet-400 and back
                    dur="3s"
                    repeatCount="indefinite" />
                  {/* Scale pulse (breathing effect), additive to rotation */}
                  <animateTransform
                      attributeName="transform"
                      type="scale"
                      additive="sum" // Applies scaling on top of rotation
                      values="1; 1.15; 1" // Scale from 100% to 115% and back
                      dur="1.5s" // Faster pulse
                      repeatCount="indefinite"
                  />
                </text>
              </g>
            </svg>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-800 mb-2 text-center">
            Welcome to NotePad+
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mb-8 text-center">
            Your simple and quick collaborative notepad.
          </p>
          
          <div className="mb-6">
            <label htmlFor="padName" className="sr-only">
              Pad Name
            </label>
            <input
              id="padName"
              type="text"
              placeholder="Enter Pad Name (e.g., Project Alpha)"
              className="w-full p-3 sm:p-3.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition-shadow duration-150 ease-in-out shadow-sm hover:shadow-md"
              value={padName}
              onChange={(e) => setPadName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEnter()}
            />
          </div>
          
          <button
            onClick={handleEnter}
            className="w-full bg-slate-700 text-white py-3 sm:py-3.5 rounded-lg font-medium text-sm sm:text-base hover:bg-slate-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 active:bg-slate-900"
          >
            Go to Pad
          </button>
          
          <p className="text-xs sm:text-sm text-slate-500 mt-6 text-center">
            No account needed. Just type and go!
          </p>
        </div>
      </main>

      <footer className="w-full max-w-md sm:max-w-lg text-center py-8">
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} NotePad+. All rights reserved.
        </p>
        <p className="text-xs text-slate-500 mt-1">
          <a href="#" className="hover:underline text-indigo-600">Privacy Policy</a>
          <span className="mx-1">|</span>
          <a href="#" className="hover:underline text-indigo-600">Terms of Use</a>
        </p>
      </footer>
    </div>
  );
}



