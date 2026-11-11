"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthorizedAdmin } from "@/lib/admin-identity";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import AdminLoginView from "@/components/admin/AdminLoginView";

export default function AdminLoginPage() {
  const router = useRouter();

  useEffect(() => {
    let active = true;

    const redirectIfAuthenticated = async () => {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!active || !session) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (active && isAuthorizedAdmin(user)) {
        router.replace("/admin");
        router.refresh();
      }
    };

    redirectIfAuthenticated();
    return () => {
      active = false;
    };
  }, [router]);

  return <AdminLoginView />;
}
