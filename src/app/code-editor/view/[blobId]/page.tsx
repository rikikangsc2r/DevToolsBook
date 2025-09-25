"use client";

import { useEffect, useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { getJsonBlob } from '@/lib/jsonblob';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';
import { Loader, AlertTriangle, Code } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ToolContainer } from '@/components/tool-container';

interface Draft {
  id: string;
  title: string;
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  updatedAt: string;
}

export default function CodeEditorViewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const blobId = params.blobId as string;
  const draftId = searchParams.get('draft');
  
  const { toast } = useToast();
  const { t } = useLanguage();

  const [draft, setDraft] = useState<Draft | null>(null);
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');

  useEffect(() => {
    if (!blobId || !draftId) {
      setStatus('error');
      return;
    }

    const fetchPen = async () => {
      setStatus('loading');
      try {
        const data = await getJsonBlob(blobId);
        if (data && Array.isArray(data.drafts)) {
          const foundDraft = data.drafts.find((d: Draft) => d.id === draftId);
          if (foundDraft) {
            setDraft(foundDraft);
            setStatus('success');
          } else {
            throw new Error('Draft not found in blob');
          }
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error("Failed to fetch pen:", error);
        setStatus('error');
        toast({
          variant: 'destructive',
          title: t('code_editor_view_load_error_title'),
          description: t('code_editor_view_load_error_desc'),
        });
      }
    };

    fetchPen();
  }, [blobId, draftId, t, toast]);

  const srcDoc = useMemo(() => {
    if (!draft) return "";
    return `
      <html>
        <body>${draft.htmlCode}</body>
        <style>${draft.cssCode}</style>
        <script>${draft.jsCode}<\/script>
      </html>
    `;
  }, [draft]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (status === 'error') {
     return (
        <div className="flex min-h-screen w-full justify-center py-8">
            <div className="w-full max-w-4xl px-4">
                <ToolContainer title={t('code_editor_view_load_error_title')} description={t('code_editor_view_load_error_desc')}>
                     <div className="flex flex-col items-center justify-center py-20 text-destructive">
                          <AlertTriangle className="h-12 w-12 mb-4" />
                          <p>{t('code_editor_view_load_error_desc')}</p>
                          <Link href="/(tools)/code-editor" passHref className="mt-4">
                              <Button variant="outline">
                                  <ArrowLeft className="mr-2" />
                                  {t('code_editor_view_back_button')}
                              </Button>
                          </Link>
                    </div>
                </ToolContainer>
            </div>
        </div>
    );
  }

  if (status === 'success' && draft) {
    if (!draft.htmlCode && !draft.cssCode && !draft.jsCode) {
        return (
            <div className="flex min-h-screen w-full justify-center py-8">
                <div className="w-full max-w-4xl px-4">
                    <ToolContainer title={draft.title} description={t('code_editor_view_description')}>
                         <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                              <Code className="h-12 w-12 mb-4" />
                              <p>{t('code_editor_view_empty')}</p>
                              <Link href="/(tools)/code-editor" passHref className="mt-4">
                                <Button variant="outline">
                                    <ArrowLeft className="mr-2" />
                                    {t('code_editor_view_back_button')}
                                </Button>
                              </Link>
                        </div>
                    </ToolContainer>
                </div>
            </div>
        )
    }
    return (
      <iframe
        srcDoc={srcDoc}
        title={draft.title}
        sandbox="allow-scripts"
        frameBorder="0"
        width="100%"
        height="100%"
        className="w-full h-screen"
      />
    );
  }

  return null;
}

    