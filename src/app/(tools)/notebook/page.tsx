"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolContainer } from "@/components/tool-container";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { createJsonBlob, getJsonBlob, updateJsonBlob } from "@/lib/jsonblob";
import { Save, Loader, AlertTriangle, Plus, Trash2, Download, FileText, X, Edit, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { format } from 'date-fns';

const JSONBLOB_URL_KEY = "jsonBlobUrl_v2_drafts";

interface Draft {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

export default function NotebookPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "error">("loading");
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState("");
  
  const { toast } = useToast();
  const { t } = useLanguage();

  const getBlobId = (url: string | null): string | null => {
    if (!url) return null;
    try {
      const urlParts = new URL(url);
      const pathParts = urlParts.pathname.split('/');
      return pathParts[pathParts.length - 1] || null;
    } catch {
      return null;
    }
  };

  const activeDraft = useMemo(() => drafts.find(d => d.id === activeDraftId), [drafts, activeDraftId]);

  const initialize = useCallback(async () => {
    setStatus("loading");
    let storedUrl = localStorage.getItem(JSONBLOB_URL_KEY);

    try {
      if (storedUrl) {
        const data = await getJsonBlob(getBlobId(storedUrl)!);
        const loadedDrafts = data.drafts || [];
        setDrafts(loadedDrafts);
        if (loadedDrafts.length > 0) {
          setActiveDraftId(loadedDrafts[0].id);
        }
        setBlobUrl(storedUrl);
        setStatus("idle");
      } else {
        const initialDraft: Draft = { id: crypto.randomUUID(), title: t('notebook_initial_draft_title'), content: t('notebook_initial_content'), updatedAt: new Date().toISOString() };
        const newBlob = await createJsonBlob({ drafts: [initialDraft] });
        const newUrl = newBlob.headers.get("Location");
        if (newUrl) {
          localStorage.setItem(JSONBLOB_URL_KEY, newUrl);
          setBlobUrl(newUrl);
          setDrafts([initialDraft]);
          setActiveDraftId(initialDraft.id);
          setStatus("idle");
        } else {
           throw new Error(t('notebook_create_blob_error'));
        }
      }
    } catch (error) {
      console.error("Initialization failed:", error);
      setStatus("error");
      toast({
          variant: "destructive",
          title: t('notebook_load_error_title'),
          description: t('notebook_load_error_desc'),
      });
    }
  }, [t, toast]);


  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleSave = async () => {
    if (!blobUrl || !activeDraft) return;
    setStatus("saving");
    try {
      await updateJsonBlob(getBlobId(blobUrl)!, { drafts });
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

  const createNewDraft = () => {
    const newDraft: Draft = {
        id: crypto.randomUUID(),
        title: `${t('notebook_new_draft_title')} ${drafts.length + 1}`,
        content: "",
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
        setActiveDraftId(updatedDrafts.length > 0 ? updatedDrafts[0].id : null);
    }
  };

  const downloadDraft = () => {
    if (!activeDraft) return;
    const blob = new Blob([activeDraft.content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${activeDraft.title.replace(/ /g, "_")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const updateActiveDraftContent = (content: string) => {
    if (!activeDraftId) return;
    const updatedDrafts = drafts.map(d =>
        d.id === activeDraftId ? { ...d, content, updatedAt: new Date().toISOString() } : d
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
      title={t('tool_notebook_label')}
      description={t('tool_notebook_description')}
      className="flex-1 flex flex-col"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-1">
        <div className="md:col-span-1 bg-muted/30 rounded-lg p-2 flex flex-col">
            <Button onClick={createNewDraft} className="mb-4">
                <Plus className="mr-2"/>
                {t('notebook_new_draft_button')}
            </Button>
            <ScrollArea className="flex-grow">
                {drafts.sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).map(draft => (
                    <div
                        key={draft.id}
                        className={`p-3 rounded-md cursor-pointer mb-2 transition-colors ${activeDraftId === draft.id ? 'bg-primary/20' : 'hover:bg-muted'}`}
                        onClick={() => setActiveDraftId(draft.id)}
                    >
                       <div className="flex justify-between items-center">
                            {editingTitleId === draft.id ? (
                                <div className="flex-grow flex items-center gap-2">
                                    <Input value={tempTitle} onChange={e => setTempTitle(e.target.value)} className="h-8"/>
                                    <Button size="icon" variant="ghost" onClick={() => saveTitle(draft.id)}><Check className="h-4 w-4"/></Button>
                                    <Button size="icon" variant="ghost" onClick={cancelEditingTitle}><X className="h-4 w-4"/></Button>
                                </div>
                            ) : (
                                <div className="flex-grow flex items-center gap-2">
                                     <FileText className="h-4 w-4 text-primary shrink-0"/>
                                     <span className="font-semibold truncate flex-grow">{draft.title}</span>
                                     <Button size="icon" variant="ghost" onClick={() => startEditingTitle(draft)}><Edit className="h-4 w-4"/></Button>
                                </div>
                            )}
                       </div>
                       <p className="text-xs text-muted-foreground mt-1">{format(new Date(draft.updatedAt), 'PPp')}</p>
                    </div>
                ))}
            </ScrollArea>
        </div>

        <div className="md:col-span-3 flex flex-col gap-4">
            {activeDraft ? (
                <>
                <Textarea
                    value={activeDraft.content}
                    onChange={(e) => updateActiveDraftContent(e.target.value)}
                    placeholder={t('notebook_placeholder')}
                    className="flex-grow min-h-[400px] font-code bg-muted/50"
                    disabled={status === 'loading'}
                />
                <div className="flex justify-end items-center gap-2 flex-wrap">
                    {status === "loading" && <span className="text-sm text-muted-foreground">{t('notebook_loading')}</span>}
                    {status === "error" && <span className="text-sm text-destructive">{t('notebook_error_state')}</span>}
                    
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
                            <AlertDialogAction onClick={() => deleteDraft(activeDraft.id)}>{t('notebook_delete_button')}</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <Button onClick={handleSave} disabled={status !== 'idle'}>
                        {status === 'saving' ? <Loader className="animate-spin" /> : <Save />}
                        {t('notebook_save_button')}
                    </Button>
                </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full bg-muted/30 rounded-lg">
                    <FileText size={48} className="text-muted-foreground mb-4"/>
                    <p className="text-muted-foreground">{t('notebook_no_draft_selected')}</p>
                </div>
            )}
        </div>
      </div>
    </ToolContainer>
  );
}
