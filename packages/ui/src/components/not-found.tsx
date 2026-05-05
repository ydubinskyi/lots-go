import { Button } from "@lots-go/ui/components/button"
import { Link } from "@lots-go/ui/link"

interface NotFoundProps {
  title: string
  description: string
  homeLabel: string
  homeHref?: string
}

export function NotFound({ title, description, homeLabel, homeHref = "/" }: NotFoundProps) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-8 px-6 py-12 text-center">
      <div className="flex flex-col items-center gap-3">
        <p className="font-heading text-muted-foreground/40 text-7xl font-bold tracking-tight sm:text-8xl">
          404
        </p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        <p className="text-muted-foreground max-w-md text-sm">{description}</p>
      </div>
      <Button asChild>
        <Link href={homeHref}>{homeLabel}</Link>
      </Button>
    </main>
  )
}
