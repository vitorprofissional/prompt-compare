import { useState, useCallback, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PromptPanel from "@/components/prompt-panel";
import ComparisonTools from "@/components/comparison-tools";
import Sidebar from "@/components/sidebar";
import { useTheme } from "@/contexts/theme-context";
import { useApp } from "@/contexts/app-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, Plus } from "lucide-react";

export default function PromptComparison() {
  const { themeDefinition } = useTheme();
  
  
  const { 
    sidebarCollapsed, 
    setSidebarCollapsed,
    selectedProjectId,
    setSelectedProjectId,
    selectedComparisonId,
    setSelectedComparisonId,
    currentPromptA,
    setCurrentPromptA,
    currentPromptB,
    setCurrentPromptB
  } = useApp();
  const queryClient = useQueryClient();

  const [showPreviewA, setShowPreviewA] = useState(false);
  const [showPreviewB, setShowPreviewB] = useState(false);
  const [comparisonTitle, setComparisonTitle] = useState("Nova Comparação");

  // Load selected comparison
  const { data: selectedComparison } = useQuery({
    queryKey: ["/api/prompt-comparisons", selectedComparisonId],
    queryFn: async () => {
      const response = await fetch(`/api/prompt-comparisons/${selectedComparisonId}`);
      if (!response.ok) throw new Error('Failed to fetch comparison');
      return response.json();
    },
    enabled: !!selectedComparisonId,
  });

  // Load comparison data when selection changes
  useEffect(() => {
    if (selectedComparison) {
      setCurrentPromptA(selectedComparison.prompt_a || "");
      setCurrentPromptB(selectedComparison.prompt_b || "");
      setComparisonTitle(selectedComparison.title || "Comparação");
    }
  }, [selectedComparison, setCurrentPromptA, setCurrentPromptB]);

  // Save comparison mutation
  const saveComparisonMutation = useMutation({
    mutationFn: async (data: {
      title: string;
      promptA: string;
      promptB: string;
      projectId?: string;
    }) => {
      const url = selectedComparisonId 
        ? `/api/prompt-comparisons/${selectedComparisonId}`
        : "/api/prompt-comparisons";
      
      const response = await fetch(url, {
        method: selectedComparisonId ? "PUT" : "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to save comparison');
      return response.json();
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["/api/prompt-comparisons"] });
      // Don't auto-select the comparison to avoid resetting fields
    },
  });

  const clearAll = useCallback(() => {
    setCurrentPromptA("");
    setCurrentPromptB("");
    setShowPreviewA(false);
    setShowPreviewB(false);
    setSelectedComparisonId(undefined);
    setComparisonTitle("Nova Comparação");
  }, [setCurrentPromptA, setCurrentPromptB, setSelectedComparisonId]);

  const clearPromptA = useCallback(() => {
    setCurrentPromptA("");
    setShowPreviewA(false);
  }, [setCurrentPromptA]);

  const clearPromptB = useCallback(() => {
    setCurrentPromptB("");
    setShowPreviewB(false);
  }, [setCurrentPromptB]);

  const togglePreviewA = useCallback(() => {
    setShowPreviewA(prev => !prev);
  }, []);

  const togglePreviewB = useCallback(() => {
    setShowPreviewB(prev => !prev);
  }, []);

  const saveComparison = useCallback(() => {
    if (!currentPromptA.trim() && !currentPromptB.trim()) return;
    
    saveComparisonMutation.mutate({
      title: comparisonTitle,
      promptA: currentPromptA,
      promptB: currentPromptB,
      projectId: selectedProjectId,
    });
  }, [comparisonTitle, currentPromptA, currentPromptB, selectedProjectId, saveComparisonMutation]);

  const statsA = useMemo(() => ({
    chars: currentPromptA.length,
    words: currentPromptA.trim() ? currentPromptA.trim().split(/\s+/).length : 0,
    lines: currentPromptA.split('\n').length
  }), [currentPromptA]);

  const statsB = useMemo(() => ({
    chars: currentPromptB.length,
    words: currentPromptB.trim() ? currentPromptB.trim().split(/\s+/).length : 0,
    lines: currentPromptB.split('\n').length
  }), [currentPromptB]);

  const similarity = useMemo(() => {
    if (!currentPromptA.trim() || !currentPromptB.trim()) return 0;
    
    const wordsA = currentPromptA.toLowerCase().split(/\s+/);
    const wordsB = currentPromptB.toLowerCase().split(/\s+/);
    const setA = new Set(wordsA);
    const setB = new Set(wordsB);
    
    const intersection = new Set(Array.from(setA).filter(x => setB.has(x)));
    const union = new Set([...Array.from(setA), ...Array.from(setB)]);
    
    return Math.round((intersection.size / union.size) * 100);
  }, [currentPromptA, currentPromptB]);

  const exportComparison = useCallback(() => {
    const data = {
      promptA: currentPromptA,
      promptB: currentPromptB,
      statsA: statsA,
      statsB: statsB,
      similarity: similarity,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prompt-comparison.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [currentPromptA, currentPromptB, statsA, statsB, similarity]);

  return (
    <div 
      className="min-h-screen flex"
      style={{ backgroundColor: themeDefinition.colors.backgroundSecondary }}
    >
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        selectedProjectId={selectedProjectId}
        onSelectProject={setSelectedProjectId}
        selectedComparisonId={selectedComparisonId}
        onSelectComparison={setSelectedComparisonId}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header 
          className="shadow-sm border-b flex-shrink-0"
          style={{ 
            backgroundColor: themeDefinition.colors.background,
            borderColor: themeDefinition.colors.border
          }}
        >
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <h1 
                    className="text-xl font-semibold"
                    style={{ color: themeDefinition.colors.foreground }}
                  >
                    Comparador de Prompts
                  </h1>
                  <p 
                    className="text-sm mt-1"
                    style={{ color: themeDefinition.colors.foregroundMuted }}
                  >
                    Compare e analise dois prompts lado a lado
                  </p>
                </div>
                
                {/* Title Input */}
                <div className="flex items-center space-x-3">
                  <Input
                    value={comparisonTitle}
                    onChange={(e) => setComparisonTitle(e.target.value)}
                    placeholder="Nome da comparação"
                    className="w-48"
                    data-testid="input-comparison-title"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  onClick={clearAll}
                  data-testid="button-clear-all"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Comparação
                </Button>
                <Button 
                  onClick={saveComparison}
                  disabled={saveComparisonMutation.isPending}
                  data-testid="button-save"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saveComparisonMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
                <Button 
                  variant="outline"
                  onClick={exportComparison}
                  data-testid="button-export"
                >
                  Exportar
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
            <PromptPanel
              title="Prompt A"
              color="blue"
              content={currentPromptA}
              onContentChange={setCurrentPromptA}
              showPreview={showPreviewA}
              onTogglePreview={togglePreviewA}
              onClear={clearPromptA}
              stats={statsA}
              placeholder="Cole seu primeiro prompt aqui...

Suporte completo para:
• Formatação Markdown
• Tags XML como <example>content</example>
• Múltiplas linhas
• Código e sintaxe"
            />
            
            <PromptPanel
              title="Prompt B"
              color="green"
              content={currentPromptB}
              onContentChange={setCurrentPromptB}
              showPreview={showPreviewB}
              onTogglePreview={togglePreviewB}
              onClear={clearPromptB}
              stats={statsB}
              placeholder="Cole seu segundo prompt aqui...

Compare facilmente:
• Diferenças de estrutura
• Variações de conteúdo  
• Efetividade das instruções
• Formatação e organização"
            />
          </div>

          <div className="mt-6">
            <ComparisonTools
              statsA={statsA}
              statsB={statsB}
              similarity={similarity}
            />
          </div>
        </div>
      </div>
    </div>
  );
}