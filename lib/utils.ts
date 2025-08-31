import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { enqueueSnackbar } from "notistack"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Toast notification utilities
export const toast = {
  success: (message: string, options?: Record<string, unknown>) => {
    enqueueSnackbar(message, {
      variant: 'success',
      ...options,
    })
  },
  error: (message: string, options?: Record<string, unknown>) => {
    enqueueSnackbar(message, {
      variant: 'error',
      ...options,
    })
  },
  info: (message: string, options?: Record<string, unknown>) => {
    enqueueSnackbar(message, {
      variant: 'info',
      ...options,
    })
  },
  warning: (message: string, options?: Record<string, unknown>) => {
    enqueueSnackbar(message, {
      variant: 'warning',
      ...options,
    })
  },
}
