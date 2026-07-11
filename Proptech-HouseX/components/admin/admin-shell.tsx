"use client";

import type { ReactNode } from "react";
import { AdminHeader } from "@/components/admin/admin-header";

export function AdminShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="admin-chrome flex min-h-screen flex-col">
      <AdminHeader />

      <main className="admin-chrome__main">
        <div className="admin-chrome__main-inner">
          <header className="admin-chrome__page-head">
            <h1 className="admin-chrome__page-title">{title}</h1>
            {description ? (
              <p className="admin-chrome__page-desc">{description}</p>
            ) : null}
          </header>
          {children}
        </div>
      </main>
    </div>
  );
}
