"use client"

import DeleteUser from "./deleteUser"
import { Label } from "@/components/ui/label"


export default function AccountForm() {
  return (
    <div>
      <Label>Delete Account</Label>
      <div className="pt-5">
        <DeleteUser />
      </div>
    </div >
  )
}

