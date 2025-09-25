"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getJsonBlob } from '@/lib/jsonblob';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';
import { ToolContainer } from '@/components/tool-container';
import { Loader, AlertTriangle, BookOpen, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Draft {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

export default function NotebookViewPage() {
  const params = useParams();
  const blobId = params.blobId as string;
  const { toast } = useToast();
  const { t } = useLanguage();

  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');

  useEffect(() => {
    if (!blobId) return;

    const fetchNotebook = async () => {
      setStatus('loading');
      try {
        const data = await getJsonBlob(blobId);
        if (data && Array.isArray(data.drafts)) {
          setDrafts(data.drafts);
          setStatus('success');
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error("Failed to fetch notebook:", error);
        setStatus('error');
        toast({
          variant: 'destructive',
          title: t('notebook_view_load_error_title'),
          description: t('notebook_view_load_error_desc'),
        });
      }
    };

    fetchNotebook();
  }, [blobId, t, toast]);

  return (
    <div className="flex min-h-screen w-full justify-center py-8">
      <div className="w-full max-w-4xl px-4">
        <ToolContainer
          title={t('notebook_view_title')}
          description={t('notebook_view_description')}
        >
          {status === 'loading' && (
            <div className="flex justify-center items-center py-20">
              <Loader className="h-12 w-12 animate-spin text-primary" />
            </div>
          )}
          {status === 'error' && (
            <div className="flex flex-col items-center justify-center py-20 text-destructive">
              <AlertTriangle className="h-12 w-12 mb-4" />
              <p>{t('notebook_view_load_error_desc')}</p>
            </div>
          )}
          {status === 'success' && (
            <div className="space-y-8">
               <div className="text-center">
                 <Link href="/(tools)/notebook" passHref>
                    <Button variant="outline">
                        <ArrowLeft className="mr-2" />
                        {t('notebook_view_back_button')}
                    </Button>
                </Link>
               </div>
              {drafts.length > 0 ? (
                drafts.sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).map((draft, index) => (
                  <article key={draft.id}>
                    <header className="mb-4">
                      <h2 className="text-3xl font-bold text-primary font-headline">{draft.title}</h2>
                      <p className="text-sm text-muted-foreground">
                        {t('common_last_updated')}: {format(new Date(draft.updatedAt), 'PPp')}
                      </p>
                    </header>
                    <div className="prose prose-invert max-w-none bg-muted/20 p-4 rounded-md">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {draft.content}
                      </ReactMarkdown>
                    </div>
                    {index < drafts.length - 1 && <Separator className="my-8" />}
                  </article>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mb-4" />
                  <p>{t('notebook_view_empty')}</p>
                </div>
              )}
            </div>
          )}
        </ToolContainer>
      </div>
    </div>
  );
}
