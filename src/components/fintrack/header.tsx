"use client";

import { Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="bg-pink-500 p-4 flex items-center justify-between shadow-md shrink-0">
        <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold">🌈</span>
            <h1 className="text-white text-2xl font-extrabold tracking-tight">Kidbook</h1>
        </div>
        <div className="flex items-center space-x-3">
            <Button size="icon" className="p-2 bg-pink-400 rounded-full shadow-lg hover:bg-pink-300 transition duration-200 h-10 w-10">
                <Search className="text-white"/>
            </Button>
            <Button size="icon" className="p-2 bg-pink-400 rounded-full shadow-lg hover:bg-pink-300 transition duration-200 h-10 w-10">
                <Bell className="text-white"/>
            </Button>
        </div>
    </header>
  );
}
