import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@/lib/types";
import { Mail, User as UserIcon } from "lucide-react";

interface ProfileCardProps {
  user: User;
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <Card>
      <CardHeader className="items-center">
        <Avatar className="h-24 w-24 mb-2">
            <AvatarImage src={user.photoURL ?? undefined} alt={user.name} data-ai-hint="person portrait" />
            <AvatarFallback className="text-3xl">{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <CardTitle className="font-headline text-2xl">{user.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <UserIcon className="h-4 w-4"/>
            <p>{user.name}</p>
          </div>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4"/>
            <p>{user.email}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
