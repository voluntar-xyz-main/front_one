import { ReactNode } from "react";
import DesktopLayout from "./DesktopLayout";
import MobileLayout from "./MobileLayout";

interface ResponsiveLayoutProps {
  children: ReactNode;
}

export default function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  return (
    <>
      {/* Mobile Layout */}
      <div className="md:hidden">
        <MobileLayout>{children}</MobileLayout>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        <DesktopLayout>{children}</DesktopLayout>
      </div>
    </>
  );
}
