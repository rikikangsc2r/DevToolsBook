"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolContainer } from "@/components/tool-container";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { createJsonBlob, getJsonBlob, updateJsonBlob } from "@/lib/jsonblob";
import { Save, Loader, AlertTriangle } from "lucide-react";

const JSONBLOB_URL_KEY = "jsonBlobUrl";

export default function NotebookPage() {
  const [content, setContent] = useState("");
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "error">("loading");
  const { toast } = useToast();
  const { t } = useLanguage();

  const getBlobId = (url: string | null): string | null => {
    if (!url) return null;
    try {
      const urlParts = new URL(url);
      const pathParts = urlParts.pathname.split('/');
      // Path is usually /api/jsonBlob/{id}
      return pathParts[pathParts.length - 1] || null;
    } catch {
      return null;
    }
  };

  const initialize = useCallback(async () => {
    setStatus("loading");
    let storedUrl = localStorage.getItem(JSONBLOB_URL_KEY);

    try {
      if (storedUrl) {
        const data = await getJsonBlob(getBlobId(storedUrl)!);
        setContent(data.content || "");
        setBlobUrl(storedUrl);
        setStatus("idle");
      } else {
        const newBlob = await createJsonBlob({ content: t('notebook_initial_content') });
        const newUrl = newBlob.headers.get("Location");
        if (newUrl) {
          localStorage.setItem(JSONBLOB_URL_KEY, newUrl);
          setBlobUrl(newUrl);
          setContent(t('notebook_initial_content'));
          setStatus("idle");
        } else {
           throw new Error(t('notebook_create_blob_error'));
        }
      }
    } catch (error) {
      console.error("Initialization failed:", error);
       try {
        const newBlob = await createJsonBlob({ content: t('notebook_initial_content') });
        const newUrl = newBlob.headers.get("Location");
         if (newUrl) {
          localStorage.setItem(JSONBLOB_URL_KEY, newUrl);
          setBlobUrl(newUrl);
          setContent(t('notebook_initial_content'));
          setStatus("idle");
          toast({
            title: t('notebook_recreated_title'),
            description: t('notebook_recreated_desc'),
          });
        } else {
           throw new Error(t('notebook_create_blob_error'));
        }
      } catch (creationError) {
        console.error("Failed to create new blob:", creationError);
        setStatus("error");
        toast({
            variant: "destructive",
            title: t('notebook_load_error_title'),
            description: t('notebook_load_error_desc'),
        });
      }
    }
  }, [t, toast]);


  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleSave = async () => {
    if (!blobUrl) return;
    setStatus("saving");
    try {
      await updateJsonBlob(getBlobId(blobUrl)!, { content });
      toast({
        title: t('notebook_save_success_title'),
        description: t('notebook_save_success_desc'),
      });
      setTimeout(() => setStatus("idle"), 1000);
    } catch (error) {
      setStatus("error");
      toast({
        variant: "destructive",
        title: t('notebook_save_error_title'),
        description: t('notebook_save_error_desc'),
      });
    }
  };

  const renderStatus = () => {
    switch (status) {
      case 'saving':
        return <Loader className="animate-spin" />;
      case 'error':
        return <AlertTriangle className="text-destructive" />;
      default:
        return <Save />;
    }
  };

  return (
    <ToolContainer
      title={t('tool_notebook_label')}
      description={t('tool_notebook_description')}
    >
      <div className="flex flex-col gap-4">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t('notebook_placeholder')}
          className="min-h-[50vh] font-code bg-muted/50"
          disabled={status === 'loading'}
        />
        <div className="flex justify-end items-center gap-4">
            {status === "loading" && <span className="text-sm text-muted-foreground">{t('notebook_loading')}</span>}
             {status === "error" && <span className="text-sm text-destructive">{t('notebook_error_state')}</span>}
          <Button onClick={handleSave} disabled={status !== 'idle'}>
            {renderStatus()}
            {t('notebook_save_button')}
          </Button>
        </div>
      </div>
    </ToolContainer>
  );
}
