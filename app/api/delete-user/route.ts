import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://qaxdmxlmapjagtkeknaz.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFheGRteGxtYXBqYWd0a2VrbmF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDY0NTkyMSwiZXhwIjoyMDg2MjIxOTIxfQ.uNJJ1swUTmNcYQ5eetzuM8SXMPNatA2O4kGgUkjdSwE"
);

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    const { error: profileError } = await supabaseAdmin
      .from("users")
      .delete()
      .eq("id", userId);
    if (profileError) return NextResponse.json({ error: profileError.message }, { status: 400 });

    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (authError) return NextResponse.json({ error: authError.message }, { status: 400 });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}