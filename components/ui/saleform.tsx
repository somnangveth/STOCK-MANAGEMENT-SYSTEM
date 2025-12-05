"use client";

import React from "react";
import { useFormContext, useController } from "react-hook-form";

export function Form({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function FormItem({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function FormLabel({ children }: { children: React.ReactNode }) {
  return <label className="block font-medium mb-1">{children}</label>;
}

export function FormControl({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function FormField({
  name,
  render,
}: {
  name: string;
  render: (props: { field: any; fieldState: any }) => React.ReactNode;
}) {
  const { control } = useFormContext();
  const { field, fieldState } = useController({ name, control });
  return <>{render({ field, fieldState })}</>;
}
