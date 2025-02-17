import MyGroupList from "../../components/my-group-list";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function MyGroups() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center mb-4 text-primary hover:underline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-2xl font-bold">My Groups</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <MyGroupList />
      </main>

      <footer className="border-t">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-600">
          © 2025 Group Hub. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
