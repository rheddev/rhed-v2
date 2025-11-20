import { Link } from "@tanstack/react-router";
import { ExternalLink, PanelLeft } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { connectLinks } from "@/data/links";

// Custom Twitch icon component
function TwitchIcon({ className }: { className?: string }) {
  return <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className={className}><title>Twitch</title><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/></svg>
}

function XIcon({ className }: { className?: string }) {
  return <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className={className}><title>X</title><path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z"/></svg>
}

function GitHubIcon({ className }: { className?: string }) {
  return <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className={className}><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Twitch: TwitchIcon,
  GitHub: GitHubIcon,
  X: XIcon,
};

function SidebarContent() {
  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex-1">
        {/* Logo Section */}
        <Link to="/" className="block mb-8">
          <h2 className="text-4xl font-bold title hover:scale-105 transition-transform duration-200">
            <span>{"<"}</span>
            <span className="playwrite-us-trad text-[#aa0000] text-shadow-[0_0_0.25rem_#aa0000]">
              Rhed
            </span>
            <span>{" />"}</span>
          </h2>
        </Link>

        {/* Divider
        <div className="h-px bg-linear-to-r from-transparent via-white/10 dark:via-black/20 to-transparent mb-6" /> */}

        {/* Connect Section */}
        <div>
          <h3 className="subtitle text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="text-[#aa0000]">●</span> Connect
          </h3>
          <nav className="space-y-2">
            {connectLinks.map((link) => {
              const Icon = iconMap[link.text] || ExternalLink;
              return (
                <a
                  key={link.to}
                  href={link.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:translate-x-1"
                >
                  <Icon className="w-5 h-5" />
                  <span>
                    {link.text}
                  </span>
                  <ExternalLink className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-white/10 dark:border-black/20">
        <p className="text-xs opacity-60 text-center">
          &copy; 2025 Rhed. All rights reserved.
        </p>
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
