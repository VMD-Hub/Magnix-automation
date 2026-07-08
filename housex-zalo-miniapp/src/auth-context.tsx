import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  fetchMe,
  logout as apiLogout,
  type HouseXUser,
} from "@/services/api";

type AuthState = {
  user: HouseXUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  setUser: (u: HouseXUser | null) => void;
  logout: () => void;
  canAgent: boolean;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<HouseXUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const me = await fetchMe();
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<AuthState>(
    () => ({
      user,
      loading,
      refresh,
      setUser,
      logout: () => {
        apiLogout();
        setUser(null);
      },
      canAgent: user?.role === "BROKER",
    }),
    [user, loading, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth outside AuthProvider");
  return ctx;
}
