import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { Logo } from "./Logo";
import { navigationItems } from "../config/navigationItems";

interface MobileLayoutProps {
  children: ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="min-h-[100dvh] flex flex-col fixed inset-0 bg-gray-50">
      {/* Top Header - Fixed */}
      <header className="flex-shrink-0 bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <Logo />
      </header>

      {/* Main Content - Scrollable */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 mb-16 min-h-[100dvh]">
          {children}
        </div>
      </main>

      {/* Bottom Navigation - Fixed */}
      <nav
        className="flex-shrink-0 bg-white border-t border-gray-200 px-4 py-2"
        style={{ overflow: "auto" }}
      >
        <div className="flex  items-center">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center p-2 ${
                  isActive ? "text-indigo-600" : "text-gray-600"
                }`
              }
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
