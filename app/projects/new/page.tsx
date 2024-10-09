import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import NewProjectForm from "@/components/NewProjectForm";

export default function NewProject() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Project</h1>
      <NewProjectForm />
    </div>
  );
}