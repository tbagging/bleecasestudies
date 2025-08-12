import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Edit, Trash2 } from "lucide-react";

interface CaseStudy {
  id: string;
  title: string;
  company: string;
  industry: string;
  summary: string;
  tags: string[];
  fileName?: string;
}

interface DraggableCaseStudyListProps {
  caseStudies: CaseStudy[];
  onReorder: (reorderedStudies: CaseStudy[]) => void;
  onEdit: (caseStudy: CaseStudy) => void;
  onDelete: (id: string) => void;
}

const DraggableCaseStudyList: React.FC<DraggableCaseStudyListProps> = ({
  caseStudies,
  onReorder,
  onEdit,
  onDelete
}) => {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(caseStudies);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorder(items);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="case-studies">
        {(provided) => (
          <div 
            className="space-y-4" 
            {...provided.droppableProps} 
            ref={provided.innerRef}
          >
            {caseStudies.map((caseStudy, index) => (
              <Draggable key={caseStudy.id} draggableId={caseStudy.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`border rounded-lg ${
                      snapshot.isDragging ? 'shadow-lg bg-accent/50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2 p-4">
                      <div
                        {...provided.dragHandleProps}
                        className="cursor-grab active:cursor-grabbing p-1 hover:bg-accent rounded mt-1 flex-shrink-0"
                      >
                        <GripVertical className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="space-y-3">
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium truncate">{caseStudy.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {caseStudy.company} • {caseStudy.industry}
                                </p>
                                {caseStudy.fileName && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    File: {caseStudy.fileName}
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-2 flex-shrink-0">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onEdit(caseStudy)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onDelete(caseStudy.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            {caseStudy.summary && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {caseStudy.summary}
                              </p>
                            )}
                            {caseStudy.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {caseStudy.tags.map((tag, tagIndex) => (
                                  <Badge key={tagIndex} variant="secondary" className="text-xs">
                                    #{tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableCaseStudyList;