"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Code, FileLock, Link as LinkIcon, Shuffle, TerminalSquare, Home, Book, Heart, PlaySquare, Lightbulb } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TranslationKeys } from "@/types/language";


type NavItem = {
    href: string;
    label: TranslationKeys;
    icon: React.ElementType;
    external?: boolean;
}

export const navItems: NavItem[] = [
  { href: "/", label: "sidebar_home", icon: Home },
  { href: "/notebook", label: "sidebar_notebook", icon: Book },
  { href: "/javascript-obfuscator", label: "sidebar_js_obfuscator", icon: FileLock },
  { href: "/html-formatter", label: "sidebar_html_formatter", icon: Code },
  { href: "/code-editor", label: "sidebar_code_editor", icon: PlaySquare },
  { href: "/url-encoder", label: "sidebar_url_encoder", icon: LinkIcon },
  { href: "/base64-converter", label: "sidebar_base64_converter", icon: Shuffle },
  { href: "/tqto", label: "sidebar_tqto", icon: Heart },
  { href: "https://wa.me/6283894391287", label: "sidebar_feature_request", icon: Lightbulb, external: true },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-card sm:flex">
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="/"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <TerminalSquare className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">DevToolbox</span>
          </Link>
          {navItems.map((item) => (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                    !item.external && pathname === item.href && "bg-accent text-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{t(item.label)}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{t(item.label)}</TooltipContent>
            </Tooltip>
          ))}
        </nav>
      </TooltipProvider>
    </aside>
  );
}
