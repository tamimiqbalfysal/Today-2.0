import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@/lib/types";

interface ProfileCardProps {
  user: User;
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <Card>
      <CardHeader className="items-center text-center p-6">
        <Avatar className="h-24 w-24 mb-4 border-4 border-primary/50 shadow-lg">
            <AvatarImage src={user.photoURL ?? undefined} alt={user.name ?? "user"} />
            <AvatarFallback className="text-3xl bg-secondary text-secondary-foreground">{user.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <CardTitle className="text-2xl text-primary font-bold">{user.name}</CardTitle>
        <CardDescription className="text-accent">{user.email}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-sm text-muted-foreground">
            Welcome to Today! Share what you're up to.
        </div>
      </CardContent>
    </Card>
  );
}
