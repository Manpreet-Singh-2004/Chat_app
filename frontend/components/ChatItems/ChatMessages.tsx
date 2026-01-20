export default function ChatMessages({ chatId }: { chatId: string }) {
  return (
    <div className="flex-1 p-4">
      Messages for chat {chatId}
    </div>
  );
}
