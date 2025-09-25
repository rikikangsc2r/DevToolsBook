"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolContainer } from "@/components/tool-container";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { createJsonBlob, getJsonBlob, updateJsonBlob } from "@/lib/jsonblob";
import { Save, Loader, Plus, Trash2, Download, FileText, X, Edit, Check, Share2, Play } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const JSONBLOB_URL_KEY = "jsonBlobUrl_v2_code_editor";

interface Draft {
  id: string;
  title: string;
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  updatedAt: string;
}

export default function CodeEditorPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "error">("loading");
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState("");
  
  const { toast } = useToast();
  const { t } = useLanguage();

  const getBlobId = useCallback((url: string | null): string | null => {
    if (!url) return null;
    try {
      const urlParts = new URL(url);
      const pathParts = urlParts.pathname.split('/');
      return pathParts[pathParts.length - 1] || null;
    } catch {
      return null;
    }
  }, []);

  const activeDraft = useMemo(() => drafts.find(d => d.id === activeDraftId), [drafts, activeDraftId]);

  const initialize = useCallback(async () => {
    setStatus("loading");
    let storedUrl = localStorage.getItem(JSONBLOB_URL_KEY);

    const createInitialDraft = (): Draft => ({
      id: crypto.randomUUID(),
      title: t('code_editor_initial_draft_title'),
      htmlCode: "<h1>Hello, World!</h1>\n<p>This is a live preview.</p>",
      cssCode: "body { background-color: #1a1a1a; color: #f0f0f0; font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; text-align: center; }\nh1 { color: #8a2be2; }",
      jsCode: "const h1 = document.querySelector('h1');\nh1.addEventListener('click', () => {\n  alert('You clicked the heading!');\n});",
      updatedAt: new Date().toISOString()
    });

    try {
      if (storedUrl) {
        const data = await getJsonBlob(getBlobId(storedUrl)!);
        const loadedDrafts = data.drafts || [];
        setDrafts(loadedDrafts);
        if (loadedDrafts.length > 0) {
          setActiveDraftId(loadedDrafts[0].id);
        } else {
           const initialDraft = createInitialDraft();
           setDrafts([initialDraft]);
           setActiveDraftId(initialDraft.id);
        }
        setBlobUrl(storedUrl);
      } else {
        const initialDraft = createInitialDraft();
        const newBlob = await createJsonBlob({ drafts: [initialDraft] });
        const newUrl = newBlob.headers.get("Location");
        if (newUrl) {
          localStorage.setItem(JSONBLOB_URL_KEY, newUrl);
          setBlobUrl(newUrl);
          setDrafts([initialDraft]);
          setActiveDraftId(initialDraft.id);
        } else {
           throw new Error(t('notebook_create_blob_error'));
        }
      }
    } catch (error) {
      console.error("Initialization failed:", error);
      toast({
          variant: "destructive",
          title: t('notebook_load_error_title'),
          description: t('notebook_load_error_desc'),
      });
      localStorage.removeItem(JSONBLOB_URL_KEY);
      const initialDraft = createInitialDraft();
      try {
        const newBlob = await createJsonBlob({ drafts: [initialDraft] });
        const newUrl = newBlob.headers.get("Location");
        if (newUrl) {
          localStorage.setItem(JSONBLOB_URL_KEY, newUrl);
          setBlobUrl(newUrl);
          setDrafts([initialDraft]);
          setActiveDraftId(initialDraft.id);
          toast({
            title: t('notebook_recreated_title'),
            description: t('notebook_recreated_desc'),
          });
        }
      } catch (createError) {
        console.error("Failed to create new blob after error:", createError);
        setStatus("error");
      }
    } finally {
      setStatus("idle");
    }
  }, [t, toast, getBlobId]);

  useEffect(() => {
    initialize();
  }, [initialize]);
  
  const handleSave = useCallback(async () => {
    if (!blobUrl || !activeDraft) return;
    setStatus("saving");
    try {
      const blobId = getBlobId(blobUrl);
      if(!blobId) throw new Error("Invalid Blob URL");
      await updateJsonBlob(blobId, { drafts });
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
  }, [blobUrl, activeDraft, drafts, t, toast, getBlobId]);
  
  const handlePreview = () => {
    if (!activeDraft) return;
    const previewWindow = window.open('about:blank', '_blank');
    if (previewWindow) {
      const fullHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>${activeDraft.cssCode}</style>
          </head>
          <body>
            ${activeDraft.htmlCode}
            <script>${activeDraft.jsCode}<\/script>
          </body>
        </html>
      `;
      previewWindow.document.write(fullHtml);
      previewWindow.document.close();
    }
  };

  const createNewDraft = () => {
    const newDraft: Draft = {
        id: crypto.randomUUID(),
        title: `${t('notebook_new_draft_title')} ${drafts.length + 1}`,
        htmlCode: "",
        cssCode: "",
        jsCode: "",
        updatedAt: new Date().toISOString()
    };
    const updatedDrafts = [...drafts, newDraft];
    setDrafts(updatedDrafts);
    setActiveDraftId(newDraft.id);
  };
  
  const deleteDraft = (draftId: string) => {
    const updatedDrafts = drafts.filter(d => d.id !== draftId);
    setDrafts(updatedDrafts);
    if (activeDraftId === draftId) {
        setActiveDraftId(updatedDrafts.length > 0 ? updatedDrafts.sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0].id : null);
    }
  };

  const downloadDraft = () => {
    if (!activeDraft) return;
    const fullHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>${activeDraft.title}</title>
            <style>${activeDraft.cssCode}</style>
          </head>
          <body>
            ${activeDraft.htmlCode}
            <script>${activeDraft.jsCode}<\/script>
          </body>
        </html>
      `;
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${activeDraft.title.replace(/ /g, "_")}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const shareDraft = useCallback(() => {
    if (!blobUrl || !activeDraftId) return;
    const blobId = getBlobId(blobUrl);
    if (!blobId) {
       toast({
        variant: 'destructive',
        title: t('notebook_share_error_title'),
        description: t('notebook_share_error_desc'),
      });
      return;
    }
    const shareableUrl = `${window.location.origin}/code-editor/view/${blobId}?draft=${activeDraftId}`;
    navigator.clipboard.writeText(shareableUrl);
    toast({
      title: t('notebook_share_success_title'),
      description: t('notebook_share_success_desc'),
    });
  }, [blobUrl, activeDraftId, getBlobId, t, toast]);

  const updateActiveDraftCode = (language: 'html' | 'css' | 'js', code: string) => {
    if (!activeDraftId) return;
    const key = `${language}Code` as const;
    const updatedDrafts = drafts.map(d =>
        d.id === activeDraftId ? { ...d, [key]: code, updatedAt: new Date().toISOString() } : d
    );
    setDrafts(updatedDrafts);
  };
  
  const startEditingTitle = (draft: Draft) => {
    setEditingTitleId(draft.id);
    setTempTitle(draft.title);
  };

  const cancelEditingTitle = () => {
    setEditingTitleId(null);
    setTempTitle("");
  };

  const saveTitle = (draftId: string) => {
    if (!tempTitle.trim()) {
        toast({ variant: 'destructive', title: t('notebook_title_empty_error') });
        return;
    }
    const updatedDrafts = drafts.map(d =>
        d.id === draftId ? { ...d, title: tempTitle, updatedAt: new Date().toISOString() } : d
    );
    setDrafts(updatedDrafts);
    cancelEditingTitle();
  };

  return (
    <ToolContainer
      title={t('tool_code_editor_label')}
      description={t('tool_code_editor_description')}
      className="flex-1 flex flex-col"
    >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-1 min-h-0">
            <div className="md:col-span-1 bg-muted/30 rounded-lg p-2 flex flex-col min-h-0">
                <Button onClick={createNewDraft} className="mb-4 shrink-0">
                    <Plus className="mr-2"/>
                    {t('notebook_new_draft_button')}
                </Button>
                <ScrollArea className="flex-grow pr-3">
                    {drafts.sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).map(draft => (
                        <div
                            key={draft.id}
                            className={`p-3 rounded-md cursor-pointer mb-2 transition-colors ${activeDraftId === draft.id ? 'bg-primary/20' : 'hover:bg-muted'}`}
                            onClick={() => setActiveDraftId(draft.id)}
                        >
                        <div className="flex justify-between items-start gap-2">
                                {editingTitleId === draft.id ? (
                                    <div className="flex-grow flex items-center gap-1">
                                        <Input value={tempTitle} onChange={e => setTempTitle(e.target.value)} className="h-8"/>
                                        <Button size="icon" variant="ghost" onClick={(e) => {e.stopPropagation(); saveTitle(draft.id);}}><Check className="h-4 w-4"/></Button>
                                        <Button size="icon" variant="ghost" onClick={(e) => {e.stopPropagation(); cancelEditingTitle();}}><X className="h-4 w-4"/></Button>
                                    </div>
                                ) : (
                                    <div className="flex-grow min-w-0">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-primary shrink-0"/>
                                            <p className="font-semibold truncate flex-shrink min-w-0">{draft.title}</p>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">{format(new Date(draft.updatedAt), 'PPp')}</p>
                                    </div>
                                )}
                                {editingTitleId !== draft.id && (
                                    <div className="flex-shrink-0">
                                        <Button size="icon" variant="ghost" onClick={(e) => {e.stopPropagation(); startEditingTitle(draft);}}><Edit className="h-4 w-4"/></Button>
                                    </div>
                                )}
                        </div>
                        </div>
                    ))}
                </ScrollArea>
            </div>

            <div className="md:col-span-3 flex flex-col gap-4 min-h-0">
            {activeDraft ? (
                <>
                 <Tabs defaultValue="html" className="w-full flex-grow flex flex-col min-h-0">
                    <TabsList className="grid w-full grid-cols-3 shrink-0">
                        <TabsTrigger value="html">HTML</TabsTrigger>
                        <TabsTrigger value="css">CSS</TabsTrigger>
                        <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                    </TabsList>
                    <TabsContent value="html" className="flex-grow min-h-0">
                        <Textarea
                            value={activeDraft.htmlCode}
                            onChange={(e) => updateActiveDraftCode('html', e.target.value)}
                            placeholder="HTML"
                            className="h-full font-code text-sm bg-muted/50"
                            disabled={status === 'loading'}
                        />
                    </TabsContent>
                    <TabsContent value="css" className="flex-grow min-h-0">
                        <Textarea
                             value={activeDraft.cssCode}
                             onChange={(e) => updateActiveDraftCode('css', e.target.value)}
                             placeholder="CSS"
                             className="h-full font-code text-sm bg-muted/50"
                             disabled={status === 'loading'}
                        />
                    </TabsContent>
                    <TabsContent value="javascript" className="flex-grow min-h-0">
                        <Textarea
                            value={activeDraft.jsCode}
                            onChange={(e) => updateActiveDraftCode('js', e.target.value)}
                            placeholder="JavaScript"
                            className="h-full font-code text-sm bg-muted/50"
                            disabled={status === 'loading'}
                        />
                    </TabsContent>
                </Tabs>
                <div className="flex justify-between items-center gap-2 flex-wrap">
                    <div>
                        <Button onClick={handlePreview} size="lg" disabled={!activeDraft || status !== 'idle'}>
                            <Play className="mr-2" />
                            {t('code_editor_run_button')}
                        </Button>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                        {status === "loading" && <span className="text-sm text-muted-foreground">{t('notebook_loading')}</span>}
                        {status === "error" && <span className="text-sm text-destructive">{t('notebook_error_state')}</span>}
                        
                        <Button variant="outline" onClick={shareDraft} disabled={!blobUrl || !activeDraftId || status !== 'idle'}>
                            <Share2/> {t('notebook_share_button')}
                        </Button>
                        <Button variant="outline" onClick={downloadDraft} disabled={!activeDraft || status !== 'idle'}>
                            <Download/> {t('notebook_download_button')}
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" disabled={!activeDraft || status !== 'idle'}>
                                    <Trash2/> {t('notebook_delete_button')}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>{t('notebook_delete_confirm_title')}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {t('notebook_delete_confirm_desc')}
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>{t('common_cancel')}</AlertDialogCancel>
                                <AlertDialogAction onClick={() => activeDraft && deleteDraft(activeDraft.id)}>{t('notebook_delete_button')}</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <Button onClick={handleSave} disabled={status !== 'idle'}>
                            {status === 'saving' ? <Loader className="animate-spin" /> : <Save />}
                            {t('notebook_save_button')}
                        </Button>
                    </div>
                </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full bg-muted/30 rounded-lg">
                    {status === 'loading' ? (
                        <Loader className="animate-spin h-8 w-8 text-primary" />
                    ) : (
                        <>
                            <FileText size={48} className="text-muted-foreground mb-4"/>
                            <p className="text-muted-foreground">{t('notebook_no_draft_selected')}</p>
                        </>
                    )}
                </div>
            )}
        </div>
      </div>
    </ToolContainer>
  );
}
