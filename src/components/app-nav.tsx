"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Code, FileLock, Link as LinkIcon, Shuffle, TerminalSquare, Home, Book, Heart, PlaySquare, Lightbulb } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";
import { TranslationKeys } from "@/types/language";
import { SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarContent, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

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

export function AppNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { isMobile } = useSidebar();
  
  return (
    <>
      <SidebarHeader className="flex items-center justify-between">
          <Link
            href="/"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <TerminalSquare className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">DevToolbox</span>
          </Link>
          <div className={cn("flex items-center", isMobile ? "hidden" : "group-data-[collapsible=icon]:hidden")}>
             <span className="text-sm font-semibold">DevToolbox</span>
          </div>
          <SidebarTrigger className="sm:hidden"/>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
             <SidebarMenuItem key={item.href}>
                 <Link href={item.href} legacyBehavior passHref>
                    <SidebarMenuButton
                        asChild
                        isActive={!item.external && pathname === item.href}
                        tooltip={{
                            children: t(item.label),
                            side: "right",
                            align: "center",
                        }}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                    >
                        <a>
                            <item.icon />
                            <span>{t(item.label)}</span>
                        </a>
                    </SidebarMenuButton>
                 </Link>
             </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
