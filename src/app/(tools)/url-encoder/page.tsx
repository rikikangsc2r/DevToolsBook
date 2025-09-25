"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolContainer } from "@/components/tool-container";
import { useToast } from "@/hooks/use-toast";
import { ArrowRightLeft } from "lucide-react";

export default function UrlEncoderPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const { toast } = useToast();

  const handleEncode = () => {
    if (!input) return;
    try {
      setOutput(encodeURIComponent(input));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Encoding Error",
        description: "Could not encode the provided input.",
      });
    }
  };

  const handleDecode = () => {
    if (!input) return;
    try {
      setOutput(decodeURIComponent(input));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Decoding Error",
        description: "Invalid URL component. Please check your input.",
      });
    }
  };
  
  const handleSwap = () => {
    setInput(output);
    setOutput(input);
  };

  return (
    <ToolContainer
      title="URL Encoder / Decoder"
      description="Encode or decode strings to be URL-safe."
    >
      <div className="grid gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="input-textarea" className="font-medium">Input</label>
          <Textarea
            id="input-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter string to encode or decode... e.g. hello world!"
            className="min-h-[200px] font-code"
          />
        </div>
        <div className="flex items-center justify-center gap-2">
          <Button onClick={handleEncode}>Encode</Button>
          <Button variant="outline" onClick={handleSwap} size="icon" aria-label="Swap input and output">
            <ArrowRightLeft className="h-4 w-4" />
          </Button>
          <Button onClick={handleDecode}>Decode</Button>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="output-textarea" className="font-medium">Output</label>
          <Textarea
            id="output-textarea"
            value={output}
            readOnly
            placeholder="Result..."
            className="min-h-[200px] font-code bg-muted/50"
          />
        </div>
      </div>
    </ToolContainer>
  );
}
