import { UserCircle } from "lucide-react";
import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { useCurrentProfile } from "../data/hooks/CurrentProfileHook";
import { Logo } from "./Logo";
import { navigationItems } from "../config/navigationItems";

interface DesktopLayoutProps {
  children: ReactNode;
}

export default function DesktopLayout({ children }: DesktopLayoutProps) {
  const { profile } = useCurrentProfile();

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-screen flex flex-col">
        {/* Logo */}
        <div className="flex-shrink-0 border-b border-gray-200 h-16 px-6 items-center flex">
          <Logo />
        </div>

        {/* Navigation - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <nav className="px-4 py-6 space-y-1">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="text-sm font-medium">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom section - Fixed */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <UserCircle className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {profile?.fullName || "Guest User"}
              </p>
              <p className="text-xs text-gray-500">
                {profile?.email || "Sign in to get started"}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64" style={{ overflow: "auto" }}>
        <div className="container mx-auto px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
