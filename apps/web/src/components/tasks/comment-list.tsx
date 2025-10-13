import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { useAuthStore } from "@/lib/store"
import { commentSchema, type CommentFormData } from "@/lib/validations"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Loader2, Send } from "lucide-react"
import type { Comment } from "@/types"

interface CommentListProps {
  taskId: string
  comments: Comment[]
  isLoading?: boolean
  onAddComment?: (content: string) => Promise<void>
}

export function CommentList({ comments, isLoading, onAddComment }: CommentListProps) {
  const { user } = useAuthStore()
  const { toast } = useToast()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  })

  useEffect(() => {
    // Auto-scroll to bottom when new comments are added
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [comments.length])

  const onSubmit = async (data: CommentFormData) => {
    if (!onAddComment) return

    setIsSubmitting(true)
    try {
      await onAddComment(data.content)
      form.reset()
      toast({
        title: "Comentário adicionado",
        description: "Seu comentário foi publicado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o comentário.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <ScrollArea className="h-[400px] pr-4" ref={scrollRef}>
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhum comentário ainda. Seja o primeiro a comentar!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 group">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={comment.user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{comment.user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{comment.user.username}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(comment.createdAt), "dd MMM 'às' HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="border-t pt-4">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.avatar || "/placeholder.svg"} />
              <AvatarFallback>{user?.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Textarea
                placeholder="Escreva um comentário..."
                rows={3}
                maxLength={1000}
                {...form.register("content")}
                disabled={isSubmitting}
              />
              {form.formState.errors.content && (
                <p className="text-sm text-destructive">{form.formState.errors.content.message}</p>
              )}
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{form.watch("content")?.length || 0}/1000 caracteres</p>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting || !form.watch("content")?.trim()}
                  className="gap-2"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Comentar
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
