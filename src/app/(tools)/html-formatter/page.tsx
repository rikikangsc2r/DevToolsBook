"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolContainer } from "@/components/tool-container";
import { useToast } from "@/hooks/use-toast";
import { Copy, Check, ShieldAlert, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLanguage } from "@/hooks/use-language";
import prettier from "prettier/standalone";
import htmlParser from "prettier/plugins/html";


type ValidationResult = {
  isValid: boolean;
  message: string;
} | null;

export default function HtmlFormatterPage() {
  const [input, setInput] = useState("<!DOCTYPE html><html><head><title>Test</title></head><body><h1>Hello</h1><p>World</p></body></html>");
  const [output, setOutput] = useState("");
  const { toast } = useToast();
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const formatHtml = useCallback(async () => {
    if (!input) return;
    try {
      const formatted = await prettier.format(input, {
        parser: "html",
        plugins: [htmlParser],
        printWidth: 80,
        tabWidth: 2,
      });
      setOutput(formatted);
    } catch(e: any) {
      toast({
        variant: "destructive",
        title: t('html_format_error_title'),
        description: e.message || t('html_format_error_desc'),
      });
    }
  }, [input, t, toast]);

  const validateHtml = useCallback(() => {
    if(typeof window === 'undefined' || !input) return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(input, "application/xml");
    const errorNode = doc.querySelector("parsererror");

    if (errorNode) {
      setValidationResult({
        isValid: false,
        message: t('html_validation_fail_message') + " " + errorNode.textContent?.split('\n')[1],
      });
    } else {
      setValidationResult({
        isValid: true,
        message: t('html_validation_success_message'),
      });
    }
  }, [input, t]);

  useEffect(() => {
    if (validationResult) {
      const timer = setTimeout(() => setValidationResult(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [validationResult]);

  return (
    <ToolContainer
      title={t('tool_html_formatter_label')}
      description={t('tool_html_formatter_description')}
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="input-textarea" className="font-medium">{t('html_input_label')}</label>
          <Textarea
            id="input-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('html_input_placeholder')}
            className="min-h-[300px] font-code text-sm"
          />
        </div>
        <div className="flex flex-col gap-2 relative">
          <label htmlFor="output-textarea" className="font-medium">{t('html_output_label')}</label>
          <Textarea
            id="output-textarea"
            value={output}
            readOnly
            placeholder={t('html_output_placeholder')}
            className="min-h-[300px] font-code text-sm bg-muted/50"
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
      <div className="flex items-center justify-center gap-4 mt-6">
        <Button onClick={formatHtml}>{t('common_format')}</Button>
        <Button onClick={validateHtml} variant="outline">{t('common_validate')}</Button>
      </div>
      {validationResult && (
        <Alert variant={validationResult.isValid ? 'default' : 'destructive'} className="mt-4">
            {validationResult.isValid ? <ShieldCheck className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
            <AlertTitle>{validationResult.isValid ? t('html_validation_success_title') : t('html_validation_fail_title')}</AlertTitle>
            <AlertDescription>{validationResult.message}</AlertDescription>
        </Alert>
      )}
    </ToolContainer>
  );
}

    