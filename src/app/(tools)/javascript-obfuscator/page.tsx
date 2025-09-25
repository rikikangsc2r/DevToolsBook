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
} from "@/components/ui/accordion";
import { useLanguage } from "@/hooks/use-language";


export default function JavascriptObfuscatorPage() {
  const [input, setInput] = useState("function hello() {\n  console.log('Hello, World!');\n}");
  const [output, setOutput] = useState("");
  const { toast } = useToast();
  const { t } = useLanguage();
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
        title: t('obfuscator_success_title'),
        description: t('obfuscator_success_desc'),
      });
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: t('obfuscator_error_title'),
        description: e.message || t('obfuscator_error_desc'),
      });
    }
  };

  return (
    <ToolContainer
      title={t('tool_js_obfuscator_label')}
      description={t('tool_js_obfuscator_description')}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid gap-4">
            <div className="flex flex-col gap-2">
            <Label htmlFor="input-textarea">{t('obfuscator_input_label')}</Label>
            <Textarea
                id="input-textarea"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('obfuscator_input_placeholder')}
                className="min-h-[300px] lg:min-h-[400px] font-code text-sm"
            />
            </div>
             <div className="flex flex-col gap-2 relative">
                <Label htmlFor="output-textarea">{t('obfuscator_output_label')}</Label>
                <Textarea
                    id="output-textarea"
                    value={output}
                    readOnly
                    placeholder={t('obfuscator_output_placeholder')}
                    className="min-h-[300px] lg:min-h-[400px] font-code text-sm bg-muted/50"
                />
                {output && (
                    <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-8 right-2 h-8 w-8"
                    onClick={handleCopy}
                    aria-label={t('common_copy_output')}
                    >
                    {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                    </Button>
                )}
            </div>
        </div>
        <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">{t('obfuscator_options_title')}</h3>
            <Accordion type="single" collapsible defaultValue="item-1">
                 <AccordionItem value="item-1">
                    <AccordionTrigger>{t('obfuscator_options_general')}</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="compact-switch">{t('obfuscator_option_compact')}</Label>
                            <Switch id="compact-switch" checked={compact} onCheckedChange={setCompact} />
                        </div>
                         <div className="flex items-center justify-between">
                            <Label htmlFor="unicode-switch">{t('obfuscator_option_unicode')}</Label>
                            <Switch id="unicode-switch" checked={unicodeEscapeSequence} onCheckedChange={setUnicodeEscapeSequence} />
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>{t('obfuscator_options_string')}</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="string-array-switch">{t('obfuscator_option_string_array')}</Label>
                            <Switch id="string-array-switch" checked={stringArray} onCheckedChange={setStringArray} />
                        </div>
                        <div className="space-y-2">
                             <Label>{t('obfuscator_option_string_array_encoding')}</Label>
                             <Select
                                value={stringArrayEncoding[0] || 'none'}
                                onValueChange={(v) => setStringArrayEncoding(v === 'none' ? [] : [v])}
                                disabled={!stringArray}
                             >
                                <SelectTrigger>
                                    <SelectValue placeholder={t('obfuscator_select_encoding_placeholder')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">{t('common_none')}</SelectItem>
                                    <SelectItem value="base64">Base64</SelectItem>
                                    <SelectItem value="rc4">RC4</SelectItem>
                                </SelectContent>
                             </Select>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>{t('obfuscator_options_structure')}</AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                         <div className="flex items-center justify-between">
                            <Label htmlFor="flattening-switch">{t('obfuscator_option_flattening')}</Label>
                            <Switch id="flattening-switch" checked={controlFlowFlattening} onCheckedChange={setControlFlowFlattening} />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="dead-code-switch">{t('obfuscator_option_dead_code')}</Label>
                            <Switch id="dead-code-switch" checked={deadCodeInjection} onCheckedChange={setDeadCodeInjection} />
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            
            <Button onClick={obfuscate} size="lg">{t('obfuscator_button_obfuscate')}</Button>
        </div>
      </div>
    </ToolContainer>
  );
}
