import { ChatArea } from "@/components/ChatArea";
import { ChatSidebar } from "@/components/ChatSidebar";

const Index = () => {
  return (
    <div className="h-screen flex">
      <ChatSidebar />
      <ChatArea />
    </div>
  );
};

export default Index;