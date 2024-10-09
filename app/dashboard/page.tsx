import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import ProjectList from "@/components/ProjectList";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Dashboard() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="mb-4">
        <Link href="/projects/new">
          <Button>Create New Project</Button>
        </Link>
      </div>
      <ProjectList />
    </div>
  );
}