"use client";

import { useSearchParams } from "next/navigation";
import { CtvCaseDropForm } from "@/components/ctv/ctv-case-drop-form";

export function CtvDeclarePageClient() {
  const params = useSearchParams();
  const project = params.get("project")?.trim() ?? "";

  return (
    <CtvCaseDropForm
      initialProjectLabel={project}
      redirectOnSuccess
    />
  );
}
