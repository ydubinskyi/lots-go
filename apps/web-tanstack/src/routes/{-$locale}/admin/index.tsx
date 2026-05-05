import { createFileRoute } from "@tanstack/react-router"
import { useTranslations } from "use-intl"

import { Card, CardContent, CardHeader, CardTitle } from "@lots-go/ui/components/card"

export const Route = createFileRoute("/{-$locale}/admin/")({
  component: AdminDashboard,
})

function AdminDashboard() {
  const t = useTranslations("admin.dashboard")

  return (
    <div className="flex items-center justify-center py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </CardContent>
      </Card>
    </div>
  )
}
