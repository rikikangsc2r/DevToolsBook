"use client";

import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { ToolContainer } from "@/components/tool-container";
import { Code, FileLock, Link as LinkIcon, Shuffle, Book, Heart, PlaySquare } from "lucide-react";
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { t, setLanguage, language } = useLanguage();

  const tools = [
    { href: "/notebook", label: t('tool_notebook_label'), description: t('tool_notebook_description'), icon: Book },
    { href: "/javascript-obfuscator", label: t('tool_js_obfuscator_label'), description: t('tool_js_obfuscator_description'), icon: FileLock },
    { href: "/html-formatter", label: t('tool_html_formatter_label'), description: t('tool_html_formatter_description'), icon: Code },
    { href: "/code-editor", label: t('tool_code_editor_label'), description: t('tool_code_editor_description'), icon: PlaySquare },
    { href: "/url-encoder", label: t('tool_url_encoder_label'), description: t('tool_url_encoder_description'), icon: LinkIcon },
    { href: "/base64-converter", label: t('tool_base64_converter_label'), description: t('tool_base64_converter_description'), icon: Shuffle },
    { href: "/tqto", label: t('tool_tqto_label'), description: t('tool_tqto_description'), icon: Heart },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppSidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <AppHeader />
        <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8">
          <ToolContainer
            title={t('home_welcome_title')}
            description={t('home_welcome_description')}
          >
            <div className="mb-8 flex justify-center gap-2">
              <Button variant={language === 'id' ? 'default' : 'outline'} onClick={() => setLanguage('id')}>Indonesia</Button>
              <Button variant={language === 'en' ? 'default' : 'outline'} onClick={() => setLanguage('en')}>English</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ perspective: '1000px' }}>
              {tools.map((tool) => (
                <Link href={tool.href} key={tool.href} className="block group transition-transform duration-300 ease-in-out hover:-translate-y-2">
                  <Card className="h-full group-hover:shadow-2xl group-hover:shadow-primary/20 transition-all duration-300 ease-in-out group-hover:rotate-x-6 group-hover:rotate-y-[-6deg] group-hover:scale-105">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg font-semibold text-primary">{tool.label}</CardTitle>
                      <tool.icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{tool.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </ToolContainer>
        </main>
      </div>
    </div>
  );
}
