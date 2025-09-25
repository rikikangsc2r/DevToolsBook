"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolContainer } from "@/components/tool-container";
import { useLanguage } from "@/hooks/use-language";
import { Play } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CodeEditorPage() {
  const { t } = useLanguage();
  const [htmlCode, setHtmlCode] = useState("<h1>Hello, World!</h1>\n<p>This is a live preview.</p>");
  const [cssCode, setCssCode] = useState("body {\n  background-color: #1a1a1a;\n  color: #f0f0f0;\n  font-family: sans-serif;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  text-align: center;\n}\nh1 {\n color: #8a2be2;\n}");
  const [jsCode, setJsCode] = useState("const h1 = document.querySelector('h1');\nh1.addEventListener('click', () => {\n  alert('You clicked the heading!');\n});");

  const handlePreview = () => {
    const previewWindow = window.open('about:blank', '_blank');
    if (previewWindow) {
      const fullHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>${cssCode}</style>
          </head>
          <body>
            ${htmlCode}
            <script>${jsCode}<\/script>
          </body>
        </html>
      `;
      previewWindow.document.write(fullHtml);
      previewWindow.document.close();
    }
  };

  return (
    <ToolContainer
      title={t('tool_code_editor_label')}
      description={t('tool_code_editor_description')}
    >
      <div className="flex flex-col gap-4">
        <Tabs defaultValue="html" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="css">CSS</TabsTrigger>
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            </TabsList>
            <TabsContent value="html">
                <Textarea
                    value={htmlCode}
                    onChange={(e) => setHtmlCode(e.target.value)}
                    placeholder="HTML"
                    className="min-h-[300px] font-code text-sm bg-muted/50"
                />
            </TabsContent>
            <TabsContent value="css">
                <Textarea
                    value={cssCode}
                    onChange={(e) => setCssCode(e.target.value)}
                    placeholder="CSS"
                    className="min-h-[300px] font-code text-sm bg-muted/50"
                />
            </TabsContent>
            <TabsContent value="javascript">
                <Textarea
                    value={jsCode}
                    onChange={(e) => setJsCode(e.target.value)}
                    placeholder="JavaScript"
                    className="min-h-[300px] font-code text-sm bg-muted/50"
                />
            </TabsContent>
        </Tabs>
        
        <div className="flex justify-center">
            <Button onClick={handlePreview} size="lg">
                <Play className="mr-2" />
                {t('code_editor_run_button')}
            </Button>
        </div>
      </div>
    </ToolContainer>
  );
}
