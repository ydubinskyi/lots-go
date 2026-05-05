import { Separator } from "@lots-go/ui/components/separator"
import { SidebarTrigger } from "@lots-go/ui/components/sidebar"

interface AdminHeaderProps {
  actions?: React.ReactNode
}

export function AdminHeader({ actions }: AdminHeaderProps) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-full" />
      {actions ? <div className="ml-auto flex items-center gap-2">{actions}</div> : null}
    </header>
  )
}
