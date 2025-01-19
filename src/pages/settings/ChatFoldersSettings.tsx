import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ChatFolder {
  id: string;
  name: string;
}

export const ChatFoldersSettings = () => {
  const [folders, setFolders] = useState<ChatFolder[]>([
    { id: "1", name: "Work" },
    { id: "2", name: "Family" },
  ]);
  const [newFolderName, setNewFolderName] = useState("");

  const handleAddFolder = () => {
    if (!newFolderName.trim()) {
      toast.error("Please enter a folder name");
      return;
    }

    setFolders([...folders, { id: Date.now().toString(), name: newFolderName }]);
    setNewFolderName("");
    toast.success("Folder created successfully");
  };

  const handleDeleteFolder = (id: string) => {
    setFolders(folders.filter(folder => folder.id !== id));
    toast.success("Folder deleted successfully");
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Chat Folders</h3>
        
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="New folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
          <Button onClick={handleAddFolder}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        <div className="space-y-2">
          {folders.map((folder) => (
            <div
              key={folder.id}
              className="flex items-center justify-between p-3 bg-gray-100 rounded-md"
            >
              <span>{folder.name}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteFolder(folder.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};