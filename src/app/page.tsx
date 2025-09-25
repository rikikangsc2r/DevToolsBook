import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { ToolContainer } from "@/components/tool-container";
import { Code, FileLock, Link as LinkIcon, Shuffle } from "lucide-react";
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const tools = [
  { href: "/javascript-obfuscator", label: "JS Obfuscator", description: "Lindungi dan kurangi ukuran kode JavaScript Anda.", icon: FileLock },
  { href: "/html-formatter", label: "HTML Formatter", description: "Rapikan dan validasi markup HTML Anda.", icon: Code },
  { href: "/url-encoder", label: "URL Encoder/Decoder", description: "Encode atau decode string agar aman untuk URL.", icon: LinkIcon },
  { href: "/base64-converter", label: "Base64 Converter", description: "Encode dan decode data menggunakan Base64, dengan dukungan UTF-8.", icon: Shuffle },
];

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppSidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <AppHeader />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <ToolContainer
            title="Selamat Datang di DevToolbox"
            description="Koleksi alat penting untuk pengembang web."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool) => (
                <Link href={tool.href} key={tool.href} className="block group">
                  <Card className="h-full hover:bg-accent/50 transition-colors">
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
