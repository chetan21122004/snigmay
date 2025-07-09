import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, signUp } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { UserRole } from "@/lib/auth";

const roles = [
  { value: "super_admin", label: "Super Admin" },
  { value: "club_manager", label: "Club Manager" },
  { value: "head_coach", label: "Head Coach" },
  { value: "coach", label: "Coach" },
  { value: "center_manager", label: "Center Manager" },
];

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [centers, setCenters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showReset, setShowReset] = useState<{ open: boolean; user?: any }>({ open: false });
  const [form, setForm] = useState({ email: "", fullName: "", password: "", role: "coach", centerId: "" });
  const [resetPassword, setResetPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function checkAuthAndLoad() {
      const user = await getCurrentUser();
      if (!user || user.role !== "super_admin") {
        router.push("/unauthorized");
        return;
      }
      // Load users and centers
      const { data: usersData } = await supabase.from("users").select("id, full_name, email, role, center_id, centers(name)");
      setUsers(usersData || []);
      const { data: centersData } = await supabase.from("centers").select("id, name");
      setCenters(centersData || []);
      setLoading(false);
    }
    checkAuthAndLoad();
  }, [router]);

  const handleCreate = async () => {
    if (!form.email || !form.fullName || !form.password || !form.role) {
      toast({ title: "All fields are required", variant: "destructive" });
      return;
    }
    const { data, error } = await signUp(form.email, form.password, form.fullName, form.role, form.centerId || undefined);
    if (error) {
      toast({ title: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "User created successfully" });
    setShowCreate(false);
    setForm({ email: "", fullName: "", password: "", role: "coach", centerId: "" });
    // Reload users
    const { data: usersData } = await supabase.from("users").select("id, full_name, email, role, center_id, centers(name)");
    setUsers(usersData || []);
  };

  const handleResetPassword = async () => {
    if (!resetPassword || !showReset.user) return;
    // Call a backend API to reset password (to be implemented)
    const res = await fetch("/api/users/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: showReset.user.id, newPassword: resetPassword }),
    });
    const result = await res.json();
    if (result.error) {
      toast({ title: result.error, variant: "destructive" });
    } else {
      toast({ title: "Password reset successfully" });
      setShowReset({ open: false });
      setResetPassword("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-5xl shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>User Management</CardTitle>
          <Button onClick={() => setShowCreate(true)}>Create User</Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Center</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.full_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="capitalize">{user.role.replace("_", " ")}</TableCell>
                    <TableCell>{user.centers?.name || "-"}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => setShowReset({ open: true, user })}>
                        Reset Password
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      {/* Create User Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="email" placeholder="Email" />
            </div>
            <div>
              <Label>Full Name</Label>
              <Input value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} placeholder="Full Name" />
            </div>
            <div>
              <Label>Password</Label>
              <Input value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} type="password" placeholder="Password" />
            </div>
            <div>
              <Label>Role</Label>
              <Select value={form.role} onValueChange={val => setForm(f => ({ ...f, role: val as UserRole }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(r => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {(form.role === "coach" || form.role === "center_manager") && (
              <div>
                <Label>Center</Label>
                <Select value={form.centerId} onValueChange={val => setForm(f => ({ ...f, centerId: val }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select center" />
                  </SelectTrigger>
                  <SelectContent>
                    {centers.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleCreate}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Reset Password Dialog */}
      <Dialog open={showReset.open} onOpenChange={open => setShowReset({ open })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label>New Password</Label>
            <Input value={resetPassword} onChange={e => setResetPassword(e.target.value)} type="password" placeholder="New Password" />
          </div>
          <DialogFooter>
            <Button onClick={handleResetPassword}>Reset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 