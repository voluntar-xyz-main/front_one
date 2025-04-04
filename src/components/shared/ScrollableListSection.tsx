import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";

interface ScrollableListSectionProps {
  title: string;
  items: any[];
  Component: React.ComponentType<any>;
  className?: string;
}

export const ScrollableListSection: React.FC<ScrollableListSectionProps> = ({
  title,
  items,
  Component,
  className = "",
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = 320;
    const gap = 16;
    const scrollDistance = cardWidth + gap;

    const targetScroll =
      direction === "left"
        ? container.scrollLeft - scrollDistance
        : container.scrollLeft + scrollDistance;

    container.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setShowLeftArrow(container.scrollLeft > 0);
    setShowRightArrow(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      handleScroll();
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <div className={`relative ${className}`}>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>

      <div className="relative group">
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-4 pb-4 px-4 snap-x snap-mandatory scroll-smooth scrollbar-hide"
        >
          {items.map((item, index) => (
            <div key={item.id || index} className="snap-start">
              <Component data={item} />
            </div>
          ))}
        </div>

        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};
