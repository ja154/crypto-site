import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUser } from "@/lib/supabase/getAuthenticatedUser";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export const metadata = { title: "Settings — Fynor" };

async function updateProfileAction(formData: FormData) {
  "use server";
  const { dbUser } = await getAuthenticatedUser();
  if (!dbUser) redirect("/login");

  const fullName = (formData.get("fullName") as string)?.trim();
  if (!fullName || fullName.length < 2) return;

  await prisma.user.update({
    where: { id: dbUser.id },
    data: { fullName },
  });

  revalidatePath("/settings");
}

export default async function SettingsPage() {
  const { supabaseUser, dbUser } = await getAuthenticatedUser();
  if (!dbUser || !supabaseUser) redirect("/login?redirectTo=/settings");

  const initials = dbUser.fullName
    ? dbUser.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : supabaseUser.email?.[0]?.toUpperCase() ?? "U";

  return (
    <div className="mx-auto max-w-screen-sm px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Manage your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={dbUser.avatarUrl ?? undefined} />
              <AvatarFallback className="bg-brand-yellow text-brand-dark text-lg font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{dbUser.fullName ?? "—"}</p>
              <p className="text-sm text-muted-foreground">{supabaseUser.email}</p>
            </div>
          </div>

          <Separator />

          {/* Edit form */}
          <form action={updateProfileAction} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                name="fullName"
                defaultValue={dbUser.fullName ?? ""}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input value={supabaseUser.email ?? ""} disabled className="opacity-60" />
              <p className="text-xs text-muted-foreground">Email changes are managed via Supabase Auth.</p>
            </div>
            <Button type="submit" className="bg-brand-yellow text-brand-dark hover:bg-brand-yellow/90 font-semibold">
              Save changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
