import * as React from "react"
import { Box } from "lucide-react"

import { cn } from "@/lib/utils"

const Empty = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    icon?: React.ReactNode
    title: string
    description?: string
    children?: React.ReactNode
  }
>(({ icon, title, description, children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50",
      className
    )}
    {...props}
  >
    {icon || <Box className="h-16 w-16 text-muted-foreground" />}
    <h3 className="mt-4 text-lg font-semibold">{title}</h3>
    {description && (
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    )}
    {children && <div className="mt-6">{children}</div>}
  </div>
))
Empty.displayName = "Empty"

export { Empty }