import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Reply,
  Copy,
  Forward,
  Download,
  Heart,
  Flag,
  Trash2,
  Link,
} from "lucide-react";
import { toast } from "sonner";

interface MessageContextMenuProps {
  children: React.ReactNode;
  messageId: string;
  canDelete?: boolean;
  messageType: "audio"|"text" | "image" | "video" | "document";
  mediaUrl?: string;
}

export const MessageContextMenu = ({
  children,
  messageId,
  canDelete = false,
  messageType,
  mediaUrl,
}: MessageContextMenuProps) => {
  const handleCopyText = () => {
    // Implementation would depend on how messages are stored
    toast.success("Message copied to clipboard");
  };

  const handleReply = () => {
    // Implementation would connect to reply functionality
    toast.success("Reply started");
  };

  const handleForward = () => {
    // Implementation would open forward dialog
    toast.success("Forward message");
  };

  const handleReact = () => {
    // Implementation would handle reactions
    toast.success("Reaction added");
  };

  const handleDelete = () => {
    // Implementation would handle message deletion
    toast.success("Message deleted");
  };

  const handleReport = () => {
    // Implementation would handle message reporting
    toast.success("Message reported");
  };

  const handleCopyLink = () => {
    // Implementation would copy message link
    toast.success("Message link copied");
  };

  const handleDownload = () => {
    if (mediaUrl) {
      // Implementation would handle media download
      window.open(mediaUrl, '_blank');
      toast.success("Download started");
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64 bg-gray-800 border-gray-700">
        <ContextMenuItem
          className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
          onClick={handleReply}
        >
          <Reply className="mr-2 h-4 w-4" />
          <span>Reply</span>
        </ContextMenuItem>
        
        {messageType === "text" && (
          <ContextMenuItem
            className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
            onClick={handleCopyText}
          >
            <Copy className="mr-2 h-4 w-4" />
            <span>Copy Text</span>
          </ContextMenuItem>
        )}

        <ContextMenuItem
          className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
          onClick={handleForward}
        >
          <Forward className="mr-2 h-4 w-4" />
          <span>Forward</span>
        </ContextMenuItem>

        {(messageType === "image" || messageType === "video" || messageType === "document") && (
          <ContextMenuItem
            className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
            onClick={handleDownload}
          >
            <Download className="mr-2 h-4 w-4" />
            <span>Download</span>
          </ContextMenuItem>
        )}

        <ContextMenuItem
          className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
          onClick={handleReact}
        >
          <Heart className="mr-2 h-4 w-4" />
          <span>React</span>
        </ContextMenuItem>

        <ContextMenuItem
          className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
          onClick={handleCopyLink}
        >
          <Link className="mr-2 h-4 w-4" />
          <span>Copy Link</span>
        </ContextMenuItem>

        <ContextMenuItem
          className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer text-yellow-500"
          onClick={handleReport}
        >
          <Flag className="mr-2 h-4 w-4" />
          <span>Report</span>
        </ContextMenuItem>

        {canDelete && (
          <ContextMenuItem
            className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer text-red-500"
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};