import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser, hashPassword } from "@/lib/auth";
import * as bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { currentPassword, newPassword } = await req.json();
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Missing currentPassword or newPassword" }, { status: 400 });
    }
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }
    // Hash new password
    const passwordHash = await hashPassword(newPassword);
    // Update user
    const { error } = await supabase
      .from("users")
      .update({ password_hash: passwordHash })
      .eq("id", user.id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    // Optionally, sign out the user by deleting their session
    if (typeof window !== "undefined") {
      localStorage.removeItem("session_token");
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
} 