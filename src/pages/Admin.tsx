import { useState } from "react";
import { useContent } from "@/contexts/ContentContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import DraggableCaseStudyList from "@/components/DraggableCaseStudyList";
import EditCaseStudyDialog from "@/components/EditCaseStudyDialog";

const AdminSimple = () => {
  const { toast } = useToast();
  const { caseStudies, updateCaseStudies } = useContent();
  const [editingCaseStudy, setEditingCaseStudy] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleReorder = (reorderedStudies: any[]) => {
    updateCaseStudies(reorderedStudies);
    toast({
      title: "Case studies reordered",
      description: "The order has been saved automatically.",
    });
  };

  const handleEdit = (caseStudy: any) => {
    setEditingCaseStudy(caseStudy);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = (updatedCaseStudy: any) => {
    const updatedCaseStudies = caseStudies.map(cs => 
      cs.id === updatedCaseStudy.id ? updatedCaseStudy : cs
    );
    updateCaseStudies(updatedCaseStudies);
    toast({
      title: "Case study updated",
      description: "Changes have been saved successfully.",
    });
  };

  const handleDelete = (id: string) => {
    const updatedCaseStudies = caseStudies.filter(cs => cs.id !== id);
    updateCaseStudies(updatedCaseStudies);
    toast({
      title: "Case study deleted",
      description: "Case study has been removed.",
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">BLEE Admin Panel</h1>
          <p className="text-muted-foreground">Manage your case studies order</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Case Studies (Drag to Reorder)</CardTitle>
          </CardHeader>
          <CardContent>
            <DraggableCaseStudyList
              caseStudies={caseStudies}
              onReorder={handleReorder}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </CardContent>
        </Card>

        <EditCaseStudyDialog
          caseStudy={editingCaseStudy}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSave={handleSaveEdit}
        />
      </div>
    </div>
  );
};

export default AdminSimple;