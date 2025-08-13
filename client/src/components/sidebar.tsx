import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Folder, 
  Plus, 
  MessageSquare, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight,
  Search,
  Settings,
  Trash2,
  Edit2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "@/contexts/theme-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Project, PromptComparison } from "@shared/schema";

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  selectedProjectId?: string;
  onSelectProject: (projectId: string | undefined) => void;
  selectedComparisonId?: string;
  onSelectComparison: (comparisonId: string | undefined) => void;
}

// Mock user ID for demo - in a real app this would come from auth
const MOCK_USER_ID = "demo-user";

export default function Sidebar({
  isCollapsed,
  onToggleCollapse,
  selectedProjectId,
  onSelectProject,
  selectedComparisonId,
  onSelectComparison,
}: SidebarProps) {
  const { themeDefinition } = useTheme();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  // Fetch projects
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
    queryFn: async () => {
      const response = await fetch("/api/projects", {
        headers: { "x-user-id": MOCK_USER_ID }
      });
      if (!response.ok) throw new Error('Failed to fetch projects');
      return response.json();
    },
  });

  // Fetch comparisons for selected project
  const { data: comparisons = [], isLoading: comparisonsLoading } = useQuery({
    queryKey: ["/api/prompt-comparisons", selectedProjectId],
    queryFn: async () => {
      const url = selectedProjectId 
        ? `/api/prompt-comparisons?projectId=${selectedProjectId}`
        : "/api/prompt-comparisons";
      const response = await fetch(url, {
        headers: { "x-user-id": MOCK_USER_ID }
      });
      if (!response.ok) throw new Error('Failed to fetch comparisons');
      return response.json();
    },
    enabled: !!selectedProjectId,
  });

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-user-id": MOCK_USER_ID 
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create project');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setNewProjectName("");
      setNewProjectDescription("");
      setIsCreateProjectOpen(false);
    },
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId: string) => {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
        headers: { "x-user-id": MOCK_USER_ID },
      });
      if (!response.ok) throw new Error('Failed to delete project');
      return response.text();
    },
    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      if (selectedProjectId === projectId) {
        onSelectProject(undefined);
      }
    },
  });

  // Delete comparison mutation
  const deleteComparisonMutation = useMutation({
    mutationFn: async (comparisonId: string) => {
      const response = await fetch(`/api/prompt-comparisons/${comparisonId}`, {
        method: "DELETE",
        headers: { "x-user-id": MOCK_USER_ID },
      });
      if (!response.ok) throw new Error('Failed to delete comparison');
      return response.text();
    },
    onSuccess: (_, comparisonId) => {
      queryClient.invalidateQueries({ queryKey: ["/api/prompt-comparisons", selectedProjectId] });
      if (selectedComparisonId === comparisonId) {
        onSelectComparison(undefined);
      }
    },
  });

  const filteredProjects = Array.isArray(projects) ? projects.filter((project: Project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const filteredComparisons = Array.isArray(comparisons) ? comparisons.filter((comparison: PromptComparison) =>
    comparison.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  if (isCollapsed) {
    return (
      <div 
        className="w-12 h-full border-r flex flex-col"
        style={{
          backgroundColor: themeDefinition.colors.background,
          borderColor: themeDefinition.colors.border
        }}
      >
        <div className="p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="w-8 h-8"
            data-testid="button-expand-sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 flex flex-col items-center space-y-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8"
            data-testid="button-add-project-collapsed"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8"
            data-testid="button-search-collapsed"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-80 h-full border-r flex flex-col"
      style={{
        backgroundColor: themeDefinition.colors.background,
        borderColor: themeDefinition.colors.border
      }}
    >
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: themeDefinition.colors.border }}>
        <div className="flex items-center justify-between mb-4">
          <h2 
            className="text-lg font-semibold"
            style={{ color: themeDefinition.colors.foreground }}
          >
            Projetos
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="w-8 h-8"
            data-testid="button-collapse-sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar projetos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
            data-testid="input-search-projects"
          />
        </div>

        {/* Create Project Button */}
        <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
          <DialogTrigger asChild>
            <Button 
              className="w-full mt-3" 
              size="sm"
              data-testid="button-create-project"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Projeto
            </Button>
          </DialogTrigger>
          <DialogContent 
            style={{
              backgroundColor: themeDefinition.colors.background,
              borderColor: themeDefinition.colors.border
            }}
          >
            <DialogHeader>
              <DialogTitle style={{ color: themeDefinition.colors.foreground }}>
                Criar Novo Projeto
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="project-name">Nome do Projeto</Label>
                <Input
                  id="project-name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Digite o nome do projeto"
                  data-testid="input-project-name"
                />
              </div>
              <div>
                <Label htmlFor="project-description">Descrição (opcional)</Label>
                <Textarea
                  id="project-description"
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  placeholder="Descreva seu projeto"
                  data-testid="textarea-project-description"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateProjectOpen(false)}
                  data-testid="button-cancel-project"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => createProjectMutation.mutate({
                    name: newProjectName,
                    description: newProjectDescription || undefined
                  })}
                  disabled={!newProjectName.trim() || createProjectMutation.isPending}
                  data-testid="button-save-project"
                >
                  {createProjectMutation.isPending ? "Criando..." : "Criar"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects List */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-2">
            {/* All Comparisons */}
            <div className="mb-4">
              <Button
                variant={!selectedProjectId ? "secondary" : "ghost"}
                className="w-full justify-start text-sm"
                onClick={() => onSelectProject(undefined)}
                data-testid="button-all-comparisons"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Todas as Comparações
              </Button>
            </div>

            {/* Projects */}
            {projectsLoading ? (
              <div className="text-sm text-muted-foreground p-2">Carregando projetos...</div>
            ) : filteredProjects.length === 0 ? (
              <div 
                className="text-sm p-2"
                style={{ color: themeDefinition.colors.foregroundMuted }}
              >
                {searchTerm ? "Nenhum projeto encontrado" : "Nenhum projeto ainda"}
              </div>
            ) : (
              filteredProjects.map((project: Project) => (
                <div key={project.id} className="mb-1">
                  <div className="flex items-center">
                    <Button
                      variant={selectedProjectId === project.id ? "secondary" : "ghost"}
                      className="flex-1 justify-start text-sm"
                      onClick={() => onSelectProject(project.id)}
                      data-testid={`button-project-${project.id}`}
                    >
                      <Folder className="h-4 w-4 mr-2" />
                      <span className="truncate">{project.name}</span>
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 shrink-0"
                          data-testid={`button-project-menu-${project.id}`}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit2 className="h-4 w-4 mr-2" />
                          Renomear
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => deleteProjectMutation.mutate(project.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Comparisons for this project */}
                  {selectedProjectId === project.id && (
                    <div className="ml-6 mt-2 space-y-1">
                      {comparisonsLoading ? (
                        <div 
                          className="text-xs p-1"
                          style={{ color: themeDefinition.colors.foregroundMuted }}
                        >
                          Carregando...
                        </div>
                      ) : filteredComparisons.length === 0 ? (
                        <div 
                          className="text-xs p-1"
                          style={{ color: themeDefinition.colors.foregroundMuted }}
                        >
                          Nenhuma comparação
                        </div>
                      ) : (
                        filteredComparisons.map((comparison: PromptComparison) => (
                          <div key={comparison.id} className="flex items-center">
                            <Button
                              variant={selectedComparisonId === comparison.id ? "secondary" : "ghost"}
                              className="flex-1 justify-start text-xs h-7"
                              onClick={() => onSelectComparison(comparison.id)}
                              data-testid={`button-comparison-${comparison.id}`}
                            >
                              <MessageSquare className="h-3 w-3 mr-2" />
                              <span className="truncate">{comparison.title}</span>
                            </Button>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 shrink-0"
                                  data-testid={`button-comparison-menu-${comparison.id}`}
                                >
                                  <MoreHorizontal className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => deleteComparisonMutation.mutate(comparison.id)}
                                >
                                  <Trash2 className="h-3 w-3 mr-2" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Footer */}
      <div 
        className="p-4 border-t"
        style={{ borderColor: themeDefinition.colors.border }}
      >
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          data-testid="button-settings"
        >
          <Settings className="h-4 w-4 mr-2" />
          Configurações
        </Button>
      </div>
    </div>
  );
}