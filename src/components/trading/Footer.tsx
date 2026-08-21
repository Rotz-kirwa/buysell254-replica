import { Shield, Mail, MessageCircle, FileText } from "lucide-react";

const FOOTER_LINKS = [
  { label: "Terms of Service", icon: FileText },
  { label: "Privacy Policy", icon: Shield },
  { label: "Contact Support", icon: Mail },
  { label: "Live Chat", icon: MessageCircle },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-panel">
      <div className="mx-auto max-w-[1400px] px-4 py-4">
        <div className="flex flex-col items-center justify-between gap-3 lg:flex-row">
          {/* Brand / status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="text-[15px] font-bold tracking-tight text-foreground">BuySell254</span>
              <span className="text-[15px] font-bold leading-none text-purple">°</span>
            </div>
            <span className="hidden h-3 w-px bg-border sm:inline" />
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-green" />
              All systems operational
            </span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
            {FOOTER_LINKS.map((link) => (
              <button
                key={link.label}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
              >
                <link.icon className="h-3 w-3" />
                {link.label}
              </button>
            ))}
          </nav>

          {/* Disclaimer / copyright */}
          <div className="text-center lg:text-right">
            <p className="text-[10px] leading-tight text-muted-foreground">
              Trading involves risk. Only trade what you can afford to lose.
            </p>
            <p className="text-[10px] text-muted-foreground">
              © {new Date().getFullYear()} BuySell254. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
