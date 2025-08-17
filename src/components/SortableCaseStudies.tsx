import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Edit, Trash2 } from "lucide-react";

interface SortableItemProps {
  id: string;
  caseStudy: any;
  onEdit: (caseStudy: any) => void;
  onDelete: (id: string) => void;
}

function SortableItem({ id, caseStudy, onEdit, onDelete }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="mb-3">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="w-5 h-5 text-muted-foreground" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium">{caseStudy.title}</h4>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(caseStudy);
                }}
                className="flex items-center gap-1"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(caseStudy.id);
                }}
                className="flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface SortableCaseStudiesProps {
  caseStudies: any[];
  onReorder: (newOrder: any[]) => void;
  onEdit: (caseStudy: any) => void;
  onDelete: (id: string) => void;
}

export function SortableCaseStudies({ 
  caseStudies, 
  onReorder, 
  onEdit, 
  onDelete 
}: SortableCaseStudiesProps) {
  const [items, setItems] = useState(caseStudies);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over?.id);
      
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      onReorder(newItems);
    }
  }

  // Update local state when caseStudies prop changes
  useEffect(() => {
    setItems(caseStudies);
  }, [caseStudies]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Case Studies Order</h3>
          <p className="text-sm text-muted-foreground">
            Drag to reorder how they appear on the main page
          </p>
        </div>
      </div>
      
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
              {items.map((caseStudy) => (
                <SortableItem
                  key={caseStudy.id}
                  id={caseStudy.id}
                  caseStudy={caseStudy}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </SortableContext>
          </DndContext>
          
          {items.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No case studies to reorder. Upload some case studies first.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}