import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import Link from "next/link";
import GroupList from "../components/group-list";
import CreateGroupButton from "../components/create-group-button";
import { SignedIn, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="w-full flex justify-between">
              <h1 className="text-2xl font-bold">PBL Hub</h1>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
            <nav className="flex ml-4 gap-4 mt-12">
              <CreateGroupButton />
              <Button variant="outline" asChild>
                <Link
                  href="/my-groups"
                  className="flex items-center justify-center"
                >
                  <User className="mr-2 h-4 w-4" />
                  My Groups
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">All Groups</h2>
        <GroupList />
      </main>

      <footer className="border-t">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-600">
          © 2025 PBL Hub. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
