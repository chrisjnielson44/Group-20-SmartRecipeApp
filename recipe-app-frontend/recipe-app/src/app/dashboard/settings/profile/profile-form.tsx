
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { getUserData } from "@/app/lib/data"

export default async function SettingsProfilePage() {
  const user = await getUserData();
  const initials = (`${user?.firstName.charAt(0)}${user?.lastName.charAt(0)}`)
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">Profile</h3>
          <div className="py-3">
          <Avatar className="h-20 w-20 text-2xl">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          </div>
        </CardHeader>
        <CardContent>
          <Separator />
          <div>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col pt-5 space-y-1.5">
                <Label>Name</Label>
                <p className="font-light">{user?.firstName + ' ' + user?.lastName}</p>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label>Email</Label>
                <p className="font-light">{user?.email}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div >
  )
}
