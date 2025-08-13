import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import PromptPanel from "@/components/prompt-panel";
import ComparisonTools from "@/components/comparison-tools";

export default function PromptComparison() {
  const [promptA, setPromptA] = useState("");
  const [promptB, setPromptB] = useState("");
  const [showPreviewA, setShowPreviewA] = useState(false);
  const [showPreviewB, setShowPreviewB] = useState(false);

  const clearAll = useCallback(() => {
    setPromptA("");
    setPromptB("");
    setShowPreviewA(false);
    setShowPreviewB(false);
  }, []);

  const clearPromptA = useCallback(() => {
    setPromptA("");
    setShowPreviewA(false);
  }, []);

  const clearPromptB = useCallback(() => {
    setPromptB("");
    setShowPreviewB(false);
  }, []);

  const togglePreviewA = useCallback(() => {
    setShowPreviewA(prev => !prev);
  }, []);

  const togglePreviewB = useCallback(() => {
    setShowPreviewB(prev => !prev);
  }, []);

  const statsA = useMemo(() => {
    const chars = promptA.length;
    const words = promptA.trim() ? promptA.trim().split(/\s+/).length : 0;
    const lines = promptA.split('\n').length;
    return { chars, words, lines };
  }, [promptA]);

  const statsB = useMemo(() => {
    const chars = promptB.length;
    const words = promptB.trim() ? promptB.trim().split(/\s+/).length : 0;
    const lines = promptB.split('\n').length;
    return { chars, words, lines };
  }, [promptB]);

  const similarity = useMemo(() => {
    if (!promptA.trim() || !promptB.trim()) return 0;
    
    const wordsA = promptA.toLowerCase().split(/\s+/);
    const wordsB = promptB.toLowerCase().split(/\s+/);
    const setA = new Set(wordsA);
    const setB = new Set(wordsB);
    
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    
    return Math.round((intersection.size / union.size) * 100);
  }, [promptA, promptB]);

  const exportComparison = useCallback(() => {
    const data = {
      promptA: promptA,
      promptB: promptB,
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
  }, [promptA, promptB, statsA, statsB, similarity]);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Comparador de Prompts</h1>
              <p className="text-sm text-slate-600 mt-1">Compare e analise dois prompts lado a lado com suporte a Markdown e XML</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={clearAll}
                data-testid="button-clear-all"
              >
                Limpar Tudo
              </Button>
              <Button 
                onClick={exportComparison}
                data-testid="button-export"
              >
                Exportar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
          <PromptPanel
            title="Prompt A"
            color="blue"
            content={promptA}
            onContentChange={setPromptA}
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
            content={promptB}
            onContentChange={setPromptB}
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

        <ComparisonTools
          statsA={statsA}
          statsB={statsB}
          similarity={similarity}
        />
      </main>
    </div>
  );
}
