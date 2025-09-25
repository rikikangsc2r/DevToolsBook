import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ToolContainerProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function ToolContainer({ title, description, children }: ToolContainerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-3xl text-primary">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
