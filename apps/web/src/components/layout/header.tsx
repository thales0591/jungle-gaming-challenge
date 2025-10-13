import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NotificationPanel } from "@/components/notifications/notification-panel"
import { useNotifications } from "@/hooks/use-notifications"
import { useAuthStore } from "@/lib/store"
import { CheckCircle2, Search, Plus, LogOut, User, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface HeaderProps {
  onNewTask?: () => void
  onSearch?: (query: string) => void
  searchQuery?: string
}

export function Header({ onNewTask, onSearch, searchQuery = "" }: HeaderProps) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [localSearch, setLocalSearch] = useState(searchQuery)
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications()

  const handleLogout = () => {
    logout()
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    })
    navigate({ to: "/" })
  }

  const handleSearchChange = (value: string) => {
    setLocalSearch(value)
    onSearch?.(value)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate({ to: "/tasks" })} className="flex items-center gap-2 hover:opacity-80">
              <CheckCircle2 className="h-6 w-6 text-primary" />
              <span className="text-xl font-semibold">TaskFlow</span>
            </button>

            <div className="relative hidden md:block w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar tarefas..."
                className="pl-9"
                value={localSearch}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={onNewTask} className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Nova Tarefa</span>
            </Button>

            <NotificationPanel
              notifications={notifications}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              onDelete={deleteNotification}
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.username} />
                    <AvatarFallback>{user?.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="md:hidden mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar tarefas..."
              className="pl-9"
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
