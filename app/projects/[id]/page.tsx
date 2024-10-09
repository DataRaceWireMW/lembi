import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import ProjectDetails from "@/components/ProjectDetails";

export default function ProjectPage({ params }: { params: { id: string } }) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProjectDetails projectId={params.id} />
    </div>
  );
}