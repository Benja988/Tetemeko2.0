// app/(management)/admin/(auth)/reset-password/page.tsx

import ResetPasswordForm from "@/components/admin/auth/ResetPasswordForm"

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  return <ResetPasswordForm token={token ?? ""} />
}
