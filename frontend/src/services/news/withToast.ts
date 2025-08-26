import { toast } from "sonner"

 export const withToast = async <T>(
  fn: () => Promise<T>,
  successMsg: string,
  errorMsg: string
): Promise<T | null> => {
  try {
    const result = await fn()
    toast(successMsg) // ✅ no variant, just message
    return result
  } catch (e: any) {
    toast(e?.message || errorMsg) // ✅ same here
    return null
  }
}