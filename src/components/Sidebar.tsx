import { Link } from "@tanstack/react-router";
import { PanelLeft } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { connectLinks } from "@/data/links";



function SidebarContent() {
  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex-1">
        <Link to="/">
          <h2 className="text-4xl font-bold mb-6 title">
            <span>{"<"}</span>
            <span className="playwrite-us-trad text-[#aa0000] text-shadow-[0_0_0.25rem_#aa0000]">
              Rhed
            </span>
            <span>{" />"}</span>
          </h2>
        </Link>
        <h3 className="subtitle text-xl my-4">Connect</h3>
        <ul className="space-y-4 ml-4 text-lg">
          {connectLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className="hover:text-[#aa0000] transition-colors block"
              >
                {link.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-auto">
        <h3 className="text-sm">&copy; 2025 Rhed. All rights reserved.</h3>
      </div>
    </div>
  );
}

interface PanelButtonProps {
  onClick: () => void;
}

function PanelButton({ onClick }: PanelButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed top-4 left-4 z-40 p-3  glass-hover shadow-xl rounded-lg transition-colors"
      aria-label="Toggle sidebar"
    >
      <PanelLeft className="w-6 h-6" />
    </button>
  );
}

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Handle clicks outside the sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        closeSidebar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closeSidebar]);

  return (
    <>
      {/* Panel Button - only show when sidebar is closed */}
      <PanelButton onClick={toggleSidebar} />

      {/* Sidebar Panel */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-screen w-72 glass-strong shadow-2xl z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="relative">{children}</div>
    </>
  );
}
