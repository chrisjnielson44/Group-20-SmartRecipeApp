import { getUserData } from "@/app/lib/data"
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export async function MobileProfile() {
    const user = await getUserData();
    if (!user) {
        return (<div>user not found</div>)
    }
    // Users initials by getting the first letter of the first and last name
    const initials = (`${user?.firstName.charAt(0)}${user?.lastName.charAt(0)}`)
    return (
        <div className="flex">
            <div className="flex-shrink-0">
                <Avatar className="h-10 w-10">
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
            </div>
            <div className="ml-3">
                <div className="text-base font-medium">{user?.firstName + ' ' + user?.lastName}</div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-300">{user?.email}</div>
            </div>
        </div>
    )
}