import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  loginSchema,
  registerSchema,
  type LoginFormData,
  type RegisterFormData,
} from "@/lib/validations";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { loginRequest, registerRequest, verifyTokenRequest } from "@/services/auth";
import type { AxiosError } from "axios";
import { useAuthStore } from "@/lib/store";
import { useMutation } from "@tanstack/react-query";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const { login } = useAuthStore();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: loginRequest,
    onError: (error) => {
      const axiosError = error as AxiosError;
      if (axiosError.status === 401) {
        toast({
          title: "Erro ao fazer login",
          description: "Credenciais inválidas. Tente novamente.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro ao fazer login",
          description:
            "Ocorreu um erro inesperado, por favor entre em contato com o suporte.",
          variant: "destructive",
        });
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerRequest,
    onError: (error) => {
      const axiosError = error as AxiosError;
      if (axiosError.status === 409) {
        toast({
          title: "Erro ao tentar criar conta",
          description: "Um usuário com o mesmo e-mail já existe, por favor, utilize outro.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro ao tentar criar conta",
          description:
            "Ocorreu um erro inesperado, por favor entre em contato com o suporte.",
          variant: "destructive",
        });
      }
    },
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    const { accessToken } = await loginMutation.mutateAsync(data);
    const user = await verifyTokenRequest({ token: accessToken });
    login(user, accessToken);
    onOpenChange(false);
  };

  const onRegisterSubmit = async (data: RegisterFormData) => {
      const user = await registerMutation.mutateAsync(data);
      const { accessToken } = await loginMutation.mutateAsync(data);
      login(user, accessToken);
      toast({
        title: "Conta criada com sucesso!",
        description: "Você já pode começar a usar o sistema.",
      });
      onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bem-vindo</DialogTitle>
          <DialogDescription>
            Entre na sua conta ou crie uma nova para começar.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "login" | "register")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Cadastro</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 pt-4">
            <form
              onSubmit={loginForm.handleSubmit(onLoginSubmit)}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="johndoe@email.com"
                  autoFocus
                  {...loginForm.register("email")}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Senha</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...loginForm.register("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loginForm.formState.isSubmitting}
              >
                {loginForm.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Entrar
              </Button>

              <div className="text-center space-y-2">
                <Button
                  variant="link"
                  className="text-sm text-muted-foreground"
                  disabled
                >
                  Esqueceu a senha?
                </Button>
                <p className="text-sm text-muted-foreground">
                  Não tem conta?{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto font-normal"
                    onClick={() => setActiveTab("register")}
                  >
                    Cadastre-se
                  </Button>
                </p>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <form
              onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
              className="space-y-6 pt-4"
            >
              <div className="space-y-2">
                <Label htmlFor="register-username">Nome de usuário</Label>
                <Input
                  id="register-username"
                  placeholder="johndoe"
                  autoFocus
                  {...registerForm.register("username")}
                />
                {registerForm.formState.errors.username && (
                  <p className="text-sm text-destructive">
                    {registerForm.formState.errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="seu@email.com"
                  {...registerForm.register("email")}
                />
                {registerForm.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {registerForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password">Senha</Label>
                <div className="relative">
                  <Input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...registerForm.register("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {registerForm.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {registerForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-confirm-password">
                  Confirmar senha
                </Label>
                <div className="relative">
                  <Input
                    id="register-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...registerForm.register("confirmPassword")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {registerForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {registerForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={registerForm.formState.isSubmitting}
              >
                {registerForm.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Criar conta
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Já tem conta?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto font-normal"
                  onClick={() => setActiveTab("login")}
                >
                  Faça login
                </Button>
              </p>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
