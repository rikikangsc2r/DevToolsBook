"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolContainer } from "@/components/tool-container";
import { useToast } from "@/hooks/use-toast";
import { Copy, Check } from "lucide-react";

export default function JavascriptObfuscatorPage() {
  const [input, setInput] = useState("function hello() {\n  // This is a comment\n  const unused = true;\n  console.log('Hello, World!');\n}");
  const [output, setOutput] = useState("");
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const minify = () => {
    try {
      const minifiedCode = input
        .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "")
        .replace(/\s+/g, " ")
        .replace(/\s*([;:{},=()])\s*/g, "$1")
        .trim();
      setOutput(minifiedCode);
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Minification Error",
        description: "An error occurred while minifying the code.",
      });
    }
  };

  const obfuscate = () => {
    try {
      let hex = "";
      for (let i = 0; i < input.length; i++) {
        hex += ("00" + input.charCodeAt(i).toString(16)).slice(-2);
      }
      const obfuscatedCode = `eval(String.fromCharCode.apply(String, ("${hex}".replace(/../g, '0x$&,').slice(0,-1)).split(',')))`;
      setOutput(obfuscatedCode);
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Obfuscation Error",
        description: "An error occurred while obfuscating the code.",
      });
    }
  };

  return (
    <ToolContainer
      title="JavaScript Obfuscator / Minifier"
      description="Protect and reduce the size of your JavaScript code."
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="input-textarea" className="font-medium">Input Code</label>
          <Textarea
            id="input-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter JavaScript code here..."
            className="min-h-[300px] font-code text-sm"
          />
        </div>
        <div className="flex flex-col gap-2 relative">
          <label htmlFor="output-textarea" className="font-medium">Output Code</label>
          <Textarea
            id="output-textarea"
            value={output}
            readOnly
            placeholder="Result will appear here..."
            className="min-h-[300px] font-code text-sm bg-muted/50"
          />
          {output && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-8 right-2 h-8 w-8"
              onClick={handleCopy}
              aria-label="Copy output"
            >
              {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </div>
      <div className="flex items-center justify-center gap-4 mt-6">
        <Button onClick={minify}>Minify</Button>
        <Button onClick={obfuscate} variant="outline">Obfuscate</Button>
      </div>
    </ToolContainer>
  );
}
