import { AppSidebar } from "@/components/app-sidebar";
import { ToolContainer } from "@/components/tool-container";
import Link from 'next/link';

const tools = [
  { href: "/javascript-obfuscator", label: "JS Obfuscator", description: "Protect and reduce the size of your JavaScript code." },
  { href: "/html-formatter", label: "HTML Formatter", description: "Tidy up and validate your HTML markup." },
  { href: "/url-encoder", label: "URL Encoder/Decoder", description: "Encode or decode strings to be URL-safe." },
  { href: "/base64-converter", label: "Base64 Converter", description: "Encode and decode data using Base64, with UTF-8 support." },
];

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppSidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <ToolContainer
            title="Selamat Datang di DevToolbox"
            description="Koleksi alat penting untuk pengembang web."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tools.map((tool) => (
                <Link href={tool.href} key={tool.href} className="block p-4 border rounded-lg hover:bg-accent">
                  <h3 className="font-semibold text-primary">{tool.label}</h3>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </Link>
              ))}
            </div>
          </ToolContainer>
        </main>
      </div>
    </div>
  );
}
