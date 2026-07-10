"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { AdminRole } from "@/lib/admin/roles";

const AdminRoleContext = createContext<AdminRole>("super");

export function AdminRoleProvider({
  role,
  children,
}: {
  role: AdminRole;
  children: ReactNode;
}) {
  return (
    <AdminRoleContext.Provider value={role}>{children}</AdminRoleContext.Provider>
  );
}

export function useAdminRole(): AdminRole {
  return useContext(AdminRoleContext);
}
