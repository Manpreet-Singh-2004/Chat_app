export default function ChatMessages({ id }: { id: string }) {
  // console.log(`Chat Id: ${chatId}`)
  return (
    <div className="flex-1 p-4">
      Messages for chat {id}
    </div>
  );
}