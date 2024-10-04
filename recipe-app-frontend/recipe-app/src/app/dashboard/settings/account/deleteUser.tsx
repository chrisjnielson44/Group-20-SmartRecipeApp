import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function DeleteUser() {
    const router = useRouter();
    const [password, setPassword] = useState("");

    const checkUserPassword = async () => {
        const response = await fetch("/api/auth/check-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ password }),
        });
        if (response.ok) {
            await deleteUser();
        } else {
            alert("Password incorrect!");
        }
    };

    const deleteUser = async () => {
        const response = await fetch("/api/auth/delete-user", {
            method: "DELETE",
        });
        if (response.ok) {
            signOut().then(() => router.push('/'));
        } else {
            alert("Failed to delete the account!");
        }
    };

    return (
        <Dialog>
            <DialogTrigger>
                <Button variant="destructive">Delete Account</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Account</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Are you sure you want to delete your account? This action is <b className="text-red-500">irreversible</b>.
                </DialogDescription>
                <Label>Password</Label>
                <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div>
                <Button type="submit" variant="destructive" onClick={checkUserPassword}>
                    Delete Account
                </Button>
                </div>
                <DialogClose asChild>
                        Cancel
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
}