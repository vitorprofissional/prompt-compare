import { createContext, useContext, useState, ReactNode } from "react";

interface AppContextType {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  selectedProjectId?: string;
  setSelectedProjectId: (projectId: string | undefined) => void;
  selectedComparisonId?: string;
  setSelectedComparisonId: (comparisonId: string | undefined) => void;
  currentPromptA: string;
  setCurrentPromptA: (prompt: string) => void;
  currentPromptB: string;
  setCurrentPromptB: (prompt: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>();
  const [selectedComparisonId, setSelectedComparisonId] = useState<string | undefined>();
  const [currentPromptA, setCurrentPromptA] = useState("");
  const [currentPromptB, setCurrentPromptB] = useState("");

  return (
    <AppContext.Provider
      value={{
        sidebarCollapsed,
        setSidebarCollapsed,
        selectedProjectId,
        setSelectedProjectId,
        selectedComparisonId,
        setSelectedComparisonId,
        currentPromptA,
        setCurrentPromptA,
        currentPromptB,
        setCurrentPromptB,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}