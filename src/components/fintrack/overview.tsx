import { Home, Gamepad2, BookOpen, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BottomNav() {
  return (
    <nav className="bg-indigo-500 p-3 flex justify-around items-center shadow-lg shrink-0">
        <Button variant="ghost" className="flex flex-col items-center text-white hover:text-indigo-200 transition duration-200 h-auto p-1">
            <Home />
            <span className="text-xs mt-1 font-semibold">Home</span>
        </Button>
        <Button variant="ghost" className="flex flex-col items-center text-white hover:text-indigo-200 transition duration-200 h-auto p-1">
            <Gamepad2 />
            <span className="text-xs mt-1 font-semibold">Games</span>
        </Button>
        <Button variant="ghost" className="flex flex-col items-center text-white hover:text-indigo-200 transition duration-200 h-auto p-1">
            <BookOpen />
            <span className="text-xs mt-1 font-semibold">Learn</span>
        </Button>
        <Button variant="ghost" className="flex flex-col items-center text-white hover:text-indigo-200 transition duration-200 h-auto p-1">
            <User />
            <span className="text-xs mt-1 font-semibold">Profile</span>
        </Button>
    </nav>
  );
}
