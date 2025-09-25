import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ToolContainerProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function ToolContainer({ title, description, children }: ToolContainerProps) {
  return (
    <Card className="bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-headline text-4xl text-primary text-shadow-lg shadow-primary/20 animate-float">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
