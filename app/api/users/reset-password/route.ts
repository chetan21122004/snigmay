import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { hashPassword, getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { userId, newPassword } = await req.json();
    if (!userId || !newPassword) {
      return NextResponse.json({ error: "Missing userId or newPassword" }, { status: 400 });
    }
    
    // Check requester is Super Admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    
    // Hash new password
    const passwordHash = await hashPassword(newPassword);
    
    // Update user
    const { error } = await supabase
      .from("users")
      .update({ password_hash: passwordHash })
      .eq("id", userId);
      
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
} 