"use client";

import { ToolContainer } from "@/components/tool-container";
import { useLanguage } from "@/hooks/use-language";
import { Heart } from "lucide-react";

export default function TqtoPage() {
  const { t } = useLanguage();

  return (
    <ToolContainer
      title={t('tool_tqto_label')}
      description={t('tool_tqto_description')}
    >
      <div className="flex flex-col items-center justify-center text-center gap-4 p-8">
        <Heart className="w-16 h-16 text-primary animate-pulse" />
        <p className="text-lg text-muted-foreground">
          {t('tqto_message_line1')}
        </p>
        <p className="text-2xl font-bold font-headline text-primary">
          Puruu Puruu
        </p>
         <p className="text-lg text-muted-foreground">
          {t('tqto_message_line2')}
        </p>
      </div>
    </ToolContainer>
  );
}
