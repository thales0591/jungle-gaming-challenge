import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store";
import { AuthModal } from "@/components/auth/auth-modal";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Users, Zap, Shield } from "lucide-react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/tasks" });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">JungleTask</span>
          </div>
          <Button onClick={() => setAuthModalOpen(true)}>Começar</Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight text-balance">
              Gestão de tarefas colaborativa e eficiente
            </h1>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Organize seu trabalho, colabore com sua equipe e acompanhe o
              progresso em tempo real.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button size="lg" onClick={() => setAuthModalOpen(true)}>
              Começar gratuitamente
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 pt-16">
            <div className="space-y-3 text-center">
              <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">
                Colaboração em tempo real
              </h3>
              <p className="text-sm text-muted-foreground">
                Trabalhe junto com sua equipe e receba atualizações instantâneas
              </p>
            </div>

            <div className="space-y-3 text-center">
              <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Produtividade aumentada</h3>
              <p className="text-sm text-muted-foreground">
                Organize tarefas por prioridade e status para máxima eficiência
              </p>
            </div>

            <div className="space-y-3 text-center">
              <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Seguro e confiável</h3>
              <p className="text-sm text-muted-foreground">
                Seus dados protegidos com as melhores práticas de segurança
              </p>
            </div>
          </div>
        </div>
      </main>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
}
