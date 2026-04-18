import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex h-screen bg-[#FAFBFC] dark:bg-black overflow-hidden">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto pt-12 pb-24">
        {children}
      </main>
    </div>
  )
}
