"use client";


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface StepCardProps {
  stepNumber: number;
  stepTitle: string;
  children: ReactNode;
}

export default function StepCard({
  stepNumber,
  stepTitle,
  children,
}: StepCardProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>
          Step {stepNumber}: {stepTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
