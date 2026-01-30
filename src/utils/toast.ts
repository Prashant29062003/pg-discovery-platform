import { toast } from "sonner"

export const showToast = {
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
      duration: 5000, // 5 seconds for professional timing
      className: "border-emerald-500/20 dark:bg-zinc-950",
    })
  },
  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
      duration: 6000, // 6 seconds for errors (longer to read)
      className: "border-red-500/20 dark:bg-zinc-950",
    })
  },
  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
      duration: 4000, // 4 seconds for info
      className: "border-blue-500/20 dark:bg-zinc-950",
    })
  },
  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description,
      duration: 5000, // 5 seconds for warnings
      className: "border-amber-500/20 dark:bg-zinc-950",
    })
  },
  // Custom "Brand" Toast for your app
  brand: (message: string, description?: string) => {
    toast(message, {
      description,
      duration: 4500, // 4.5 seconds for brand messages
      className: "border-orange-500/20 bg-orange-50/50 dark:bg-orange-950/10",
    })
  }
}
