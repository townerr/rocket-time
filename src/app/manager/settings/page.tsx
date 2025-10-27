"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { toast } from "~/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Label } from "~/components/ui/label";
import { HexColorPicker } from "react-colorful";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedWorkType, setSelectedWorkType] = useState<any>(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    color: "#cccccc",
    borderColor: "#000000",
  });
  const [showColorPicker, setShowColorPicker] = useState<
    "color" | "border" | null
  >(null);

  const router = useRouter();

  const workTypesQuery = api.manager.getAllWorkTypes.useQuery();
  const createWorkType = api.manager.createWorkType.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Work type created successfully",
      });
      setIsOpen(false);
      void workTypesQuery.refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateWorkType = api.manager.updateWorkType.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Work type updated successfully",
      });
      setIsOpen(false);
      void workTypesQuery.refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteWorkType = api.manager.deleteWorkType.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Work type deleted successfully",
      });
      void workTypesQuery.refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (color: string) => {
    if (showColorPicker === "color") {
      setFormData((prev) => ({ ...prev, color }));
    } else if (showColorPicker === "border") {
      setFormData((prev) => ({ ...prev, borderColor: color }));
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      color: "#cccccc",
      borderColor: "#000000",
    });
    setIsEditMode(false);
    setSelectedWorkType(null);
  };

  const handleOpenDialog = (workType?: any) => {
    if (workType) {
      setFormData({
        id: workType.id,
        name: workType.name,
        color: workType.color,
        borderColor: workType.borderColor,
      });
      setIsEditMode(true);
      setSelectedWorkType(workType);
    } else {
      resetForm();
    }
    setIsOpen(true);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    resetForm();
    setShowColorPicker(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditMode) {
      updateWorkType.mutate({
        id: formData.id,
        name: formData.name,
        color: formData.color,
        borderColor: formData.borderColor,
      });
    } else {
      createWorkType.mutate({
        name: formData.name,
        color: formData.color,
        borderColor: formData.borderColor,
      });
    }
  };

  const handleDelete = (id: string) => {
    if (
      confirm(
        "Are you sure you want to delete this work type? This action cannot be undone.",
      )
    ) {
      deleteWorkType.mutate({ id });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Manager Settings</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Work Types</span>
            <Button onClick={() => handleOpenDialog()}>
              Add New Work Type
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {workTypesQuery.isLoading ? (
            <div className="py-4 text-center">Loading work types...</div>
          ) : workTypesQuery.data?.length === 0 ? (
            <div className="py-4 text-center">
              No work types found. Create one to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Border Color</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workTypesQuery.data?.map((workType) => (
                  <TableRow key={workType.id}>
                    <TableCell>{workType.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-6 w-6 rounded-md"
                          style={{ backgroundColor: workType.color }}
                        />
                        <span>{workType.color}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-6 w-6 rounded-md border"
                          style={{ borderColor: workType.borderColor }}
                        />
                        <span>{workType.borderColor}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(workType)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(workType.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Work Type" : "Add New Work Type"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter work type name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <div className="flex items-center gap-2">
                <div
                  className="h-8 w-8 cursor-pointer rounded-md"
                  style={{ backgroundColor: formData.color }}
                  onClick={() =>
                    setShowColorPicker(
                      showColorPicker === "color" ? null : "color",
                    )
                  }
                />
                <Input
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  placeholder="#RRGGBB"
                  required
                />
              </div>
              {showColorPicker === "color" && (
                <div className="mt-2">
                  <HexColorPicker
                    color={formData.color}
                    onChange={handleColorChange}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="borderColor">Border Color</Label>
              <div className="flex items-center gap-2">
                <div
                  className="h-8 w-8 cursor-pointer rounded-md border-2"
                  style={{ borderColor: formData.borderColor }}
                  onClick={() =>
                    setShowColorPicker(
                      showColorPicker === "border" ? null : "border",
                    )
                  }
                />
                <Input
                  id="borderColor"
                  name="borderColor"
                  value={formData.borderColor}
                  onChange={handleInputChange}
                  placeholder="#RRGGBB"
                  required
                />
              </div>
              {showColorPicker === "border" && (
                <div className="mt-2">
                  <HexColorPicker
                    color={formData.borderColor}
                    onChange={handleColorChange}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createWorkType.isPending || updateWorkType.isPending}
              >
                {isEditMode ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
