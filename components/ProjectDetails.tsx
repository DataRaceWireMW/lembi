"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Document {
  _id: string;
  name: string;
  url: string;
}

interface Project {
  _id: string;
  name: string;
  description: string;
  documents: Document[];
}

export default function ProjectDetails({ projectId }: { projectId: string }) {
  const { user } = useUser();
  const [project, setProject] = useState<Project | null>(null);
  const [newDocument, setNewDocument] = useState({ name: "", file: null });

  useEffect(() => {
    async function fetchProject() {
      const response = await fetch(`/api/projects/${projectId}`);
      const data = await response.json();
      setProject(data);
    }
    fetchProject();
  }, [projectId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewDocument({ ...newDocument, file: e.target.files[0] });
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocument.file) return;

    const formData = new FormData();
    formData.append("name", newDocument.name);
    formData.append("file", newDocument.file);

    const response = await fetch(`/api/projects/${projectId}/documents`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const uploadedDocument = await response.json();
      setProject((prev) => ({
        ...prev!,
        documents: [...prev!.documents, uploadedDocument],
      }));
      setNewDocument({ name: "", file: null });
    }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
      <p className="mb-8">{project.description}</p>

      <h2 className="text-2xl font-bold mb-4">Documents</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {project.documents.map((doc) => (
          <Card key={doc._id}>
            <CardHeader>
              <CardTitle>{doc.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                View Document
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      <h3 className="text-xl font-bold mb-4">Upload New Document</h3>
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <Label htmlFor="documentName">Document Name</Label>
          <Input
            id="documentName"
            type="text"
            value={newDocument.name}
            onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="documentFile">File</Label>
          <Input
            id="documentFile"
            type="file"
            onChange={handleFileChange}
            required
          />
        </div>
        <Button type="submit">Upload Document</Button>
      </form>
    </div>
  );
}