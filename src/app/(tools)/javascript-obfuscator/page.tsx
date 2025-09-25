"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolContainer } from "@/components/tool-container";
import { useToast } from "@/hooks/use-toast";
import { Copy, Check } from "lucide-react";
import JavaScriptObfuscator from "javascript-obfuscator";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


export default function JavascriptObfuscatorPage() {
  const [input, setInput] = useState("function hello() {\n  console.log('Hello, World!');\n}");
  const [output, setOutput] = useState("");
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  // Options
  const [compact, setCompact] = useState(true);
  const [controlFlowFlattening, setControlFlowFlattening] = useState(false);
  const [deadCodeInjection, setDeadCodeInjection] = useState(false);
  const [stringArray, setStringArray] = useState(true);
  const [stringArrayEncoding, setStringArrayEncoding] = useState<any[]>(['base64']);
  const [unicodeEscapeSequence, setUnicodeEscapeSequence] = useState(false);


  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const obfuscate = () => {
    try {
      const obfuscationResult = JavaScriptObfuscator.obfuscate(input, {
        compact: compact,
        controlFlowFlattening: controlFlowFlattening,
        deadCodeInjection: deadCodeInjection,
        numbersToExpressions: deadCodeInjection,
        simplify: deadCodeInjection,
        stringArray: stringArray,
        stringArrayEncoding: stringArrayEncoding,
        unicodeEscapeSequence: unicodeEscapeSequence,
      });
      setOutput(obfuscationResult.getObfuscatedCode());
       toast({
        title: "Obfuscation Successful",
        description: "Your JavaScript code has been obfuscated.",
      });
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Obfuscation Error",
        description: e.message || "An error occurred while obfuscating the code.",
      });
    }
  };

  return (
    <ToolContainer
      title="JavaScript Obfuscator"
      description="Protect your JavaScript code from theft and reverse-engineering."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid gap-4">
            <div className="flex flex-col gap-2">
            <Label htmlFor="input-textarea">Input Code</Label>
            <Textarea
                id="input-textarea"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter JavaScript code here..."
                className="min-h-[300px] lg:min-h-[400px] font-code text-sm"
            />
            </div>
             <div className="flex flex-col gap-2 relative">
                <Label htmlFor="output-textarea">Output Code</Label>
                <Textarea
                    id="output-textarea"
                    value={output}
                    readOnly
                    placeholder="Obfuscated code will appear here..."
                    className="min-h-[300px] lg:min-h-[400px] font-code text-sm bg-muted/50"
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
        <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Options</h3>
            <Accordion type="single" collapsible defaultValue="item-1">
                 <AccordionItem value="item-1">
                    <AccordionTrigger>General</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="compact-switch">Compact Code</Label>
                            <Switch id="compact-switch" checked={compact} onCheckedChange={setCompact} />
                        </div>
                         <div className="flex items-center justify-between">
                            <Label htmlFor="unicode-switch">Unicode Escape Sequence</Label>
                            <Switch id="unicode-switch" checked={unicodeEscapeSequence} onCheckedChange={setUnicodeEscapeSequence} />
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>String Manipulation</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="string-array-switch">String Array</Label>
                            <Switch id="string-array-switch" checked={stringArray} onCheckedChange={setStringArray} />
                        </div>
                        <div className="space-y-2">
                             <Label>String Array Encoding</Label>
                             <Select
                                value={stringArrayEncoding[0] || 'none'}
                                onValueChange={(v) => setStringArrayEncoding(v === 'none' ? [] : [v])}
                                disabled={!stringArray}
                             >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select encoding" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    <SelectItem value="base64">Base64</SelectItem>
                                    <SelectItem value="rc4">RC4</SelectItem>
                                </SelectContent>
                             </Select>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>Code Structure</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                         <div className="flex items-center justify-between">
                            <Label htmlFor="flattening-switch">Control Flow Flattening</Label>
                            <Switch id="flattening-switch" checked={controlFlowFlattening} onCheckedChange={setControlFlowFlattening} />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="dead-code-switch">Dead Code Injection</Label>
                            <Switch id="dead-code-switch" checked={deadCodeInjection} onCheckedChange={setDeadCodeInjection} />
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            
            <Button onClick={obfuscate} size="lg">Obfuscate</Button>
        </div>
      </div>
    </ToolContainer>
  );
}
