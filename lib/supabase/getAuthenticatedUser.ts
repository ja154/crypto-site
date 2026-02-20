import { createSupabaseServerClient } from "./server";
import prisma from "@/lib/prisma";

export async function getAuthenticatedUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { supabaseUser: null, dbUser: null };
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  return { supabaseUser: user, dbUser };
}
