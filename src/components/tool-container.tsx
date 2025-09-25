import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ToolContainerProps {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}

export function ToolContainer({ title, description, children, className }: ToolContainerProps) {
  return (
    <Card className={cn("bg-card/80 backdrop-blur-sm", className)}>
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
