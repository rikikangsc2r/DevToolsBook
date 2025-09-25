"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolContainer } from "@/components/tool-container";
import { useToast } from "@/hooks/use-toast";
import { ArrowRightLeft } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export default function Base64ConverterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleEncode = () => {
    if (!input) return;
    try {
      setOutput(btoa(unescape(encodeURIComponent(input))));
    } catch {
      toast({
        variant: "destructive",
        title: t('base64_encode_error_title'),
        description: t('base64_encode_error_desc'),
      });
    }
  };

  const handleDecode = () => {
    if (!input) return;
    try {
      setOutput(decodeURIComponent(escape(atob(input))));
    } catch {
      toast({
        variant: "destructive",
        title: t('base64_decode_error_title'),
        description: t('base64_decode_error_desc'),
      });
    }
  };
  
  const handleSwap = () => {
    setInput(output);
    setOutput(input);
  };

  return (
    <ToolContainer
      title={t('tool_base64_converter_label')}
      description={t('tool_base64_converter_description')}
    >
      <div className="grid gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="input-textarea" className="font-medium">{t('common_input')}</label>
          <Textarea
            id="input-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('base64_input_placeholder')}
            className="min-h-[200px] font-code"
          />
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
          <Button onClick={handleEncode}>{t('common_encode')}</Button>
          <Button variant="outline" onClick={handleSwap} size="icon" aria-label={t('common_swap')}>
            <ArrowRightLeft className="h-4 w-4" />
          </Button>
          <Button onClick={handleDecode}>{t('common_decode')}</Button>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="output-textarea" className="font-medium">{t('common_output')}</label>
          <Textarea
            id="output-textarea"
            value={output}
            readOnly
            placeholder={t('common_result')}
            className="min-h-[200px] font-code bg-muted/50"
          />
        </div>
      </div>
    </ToolContainer>
  );
}
