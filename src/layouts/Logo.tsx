import { useMemo, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const useRandomBorders = () => {
  const randomBorders = useMemo(() => {
    return {
      borderEndEndRadius: `${Math.random() * 3}rem`,
      borderEndStartRadius: `${Math.random() * 3}rem`,
      borderStartEndRadius: `${Math.random() * 3}rem`,
      borderStartStartRadius: `${Math.random() * 3}rem`,
    };
  }, []);
  return randomBorders;
};

export function Logo() {
  const [showFullText, setShowFullText] = useState(false);
  const randomBorders = useRandomBorders();
  const intervalRef = useRef<NodeJS.Timeout>();

  const startInterval = () => {
    intervalRef.current = setTimeout(() => {
      setShowFullText((prev) => !prev);
    }, 10000);
  };

  const stopInterval = () => {
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
    }
  };

  useEffect(() => {
    startInterval();
    return () => stopInterval();
  }, []);

  return (
    <div className="flex items-center h-10">
      <Link to="/" className="text-xl font-bold">
        <div
          className="flex items-center text-[3rem] font-bold text-green-600 group"
          onMouseEnter={() => {
            stopInterval();
            setShowFullText(!showFullText);
          }}
          onMouseLeave={() => {
            startInterval();
          }}
        >
          <div
            className={`flex items-center pr-6 transition-all duration-500 ease-in-out
            ${
              showFullText
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-full absolute"
            }`}
            id="mascot"
          >
            <span className="flex items-center">✓</span>
            <img
              src="/images/voxy_2.jpg"
              alt="Voxy"
              className={`h-10 w-10 object-contain border border-black`}
              style={randomBorders}
            />
          </div>

          <div
            className={`flex items-center text-xl transition-all duration-500 ease-in-out
            ${
              !showFullText
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-full absolute"
            }`}
            id="fulltext"
          >
            <span className="flex items-center text-green-600">V</span>
            <span className="text-black">oluntar</span>
          </div>
          <span className="flex items-center text-xl text-black">.xyz</span>
        </div>
      </Link>
    </div>
  );
}
