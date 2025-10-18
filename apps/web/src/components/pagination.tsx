import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './ui/button'

export interface PaginationProps {
  pageIndex: number
  hasNextPage: boolean
  onPageChange: (pageIndex: number) => Promise<void> | void
}

export function Pagination({
  pageIndex,
  hasNextPage,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-end">
      <div className="flex items-center gap-8">
        <div className="flex text-sm font-medium">
          Página {pageIndex}
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onPageChange(pageIndex - 1)}
            variant="outline"
            className="h-8 w-8 p-0"
            disabled={pageIndex === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Página anterior</span>
          </Button>
          <Button
            onClick={() => onPageChange(pageIndex + 1)}
            variant="outline"
            className="h-8 w-8 p-0"
            disabled={!hasNextPage}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Próxima página</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
