import { useEffect, useRef, useState, CSSProperties } from "react";

import PuffLoader from "react-spinners/PuffLoader";
import ChatActions from "./chat-actions";
import ChatMessage from "./chat-message";
import { ChatHandler } from "./chat.interface";

export default function ChatMessages(
  props: Pick<ChatHandler, "messages" | "isLoading" | "reload" | "stop">
) {
  const scrollableChatContainerRef = useRef<HTMLDivElement>(null);
  const messageLength = props.messages.length;
  const lastMessage = props.messages[messageLength - 1];

  const scrollToBottom = () => {
    if (scrollableChatContainerRef.current) {
      scrollableChatContainerRef.current.scrollTop =
        scrollableChatContainerRef.current.scrollHeight;
    }
  };

  const isLastMessageFromAssistant =
    messageLength > 0 && lastMessage?.role !== "user";
  const showReload =
    props.reload && !props.isLoading && isLastMessageFromAssistant;
  const showStop = props.stop && props.isLoading;

  useEffect(() => {
    scrollToBottom();
  }, [messageLength, lastMessage]);

  // State to manage the visibility of the ellipsis
  const [showEllipsis, setShowEllipsis] = useState(true);

  useEffect(() => {
    // Toggle the visibility of the ellipsis every second
    const interval = setInterval(() => {
      setShowEllipsis((prev) => !prev);
    }, 1000);

    return () => clearInterval(interval);
  }, []); // Empty dependency array to run only once on component mount

  return (
    <div className="w-full rounded-xl bg-white dark:bg-zinc-700/30 dark:from-inherit p-4 shadow-xl pb-0 relative">
      {props.isLoading && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-white dark:bg-zinc-700/30 z-10">
          <p className="text-gray-700 dark:text-gray-300 text-lg font-semibold">
            <PuffLoader size={150} color={"#ffffff"} speedMultiplier={2} />
          </p>
        </div>
      )}
      <div
        className="flex h-[50vh] flex-col gap-5 divide-y overflow-y-auto pb-4"
        ref={scrollableChatContainerRef}
      >
        {props.messages.map((m) => (
          <ChatMessage key={m.id} {...m} />
        ))}
      </div>
      <div className="flex justify-end py-4">
        <ChatActions
          reload={props.reload}
          stop={props.stop}
          showReload={showReload}
          showStop={showStop}
        />
      </div>
    </div>
  );
}

// import { useEffect, useRef } from "react";

// import ChatActions from "./chat-actions";
// import ChatMessage from "./chat-message";
// import { ChatHandler } from "./chat.interface";

// export default function ChatMessages(
//   props: Pick<ChatHandler, "messages" | "isLoading" | "reload" | "stop">,
// ) {
//   const scrollableChatContainerRef = useRef<HTMLDivElement>(null);
//   const messageLength = props.messages.length;
//   const lastMessage = props.messages[messageLength - 1];

//   const scrollToBottom = () => {
//     if (scrollableChatContainerRef.current) {
//       scrollableChatContainerRef.current.scrollTop =
//         scrollableChatContainerRef.current.scrollHeight;
//     }
//   };

//   const isLastMessageFromAssistant =
//     messageLength > 0 && lastMessage?.role !== "user";
//   const showReload =
//     props.reload && !props.isLoading && isLastMessageFromAssistant;
//   const showStop = props.stop && props.isLoading;

//   useEffect(() => {
//     scrollToBottom();
//   }, [messageLength, lastMessage]);

//   return (
//     <div className="w-full rounded-xl bg-white dark:bg-zinc-700/30 dark:from-inherit p-4 shadow-xl pb-0">
//       <div
//         className="flex h-[50vh] flex-col gap-5 divide-y overflow-y-auto pb-4"
//         ref={scrollableChatContainerRef}
//       >
//         {props.messages.map((m) => (
//           <ChatMessage key={m.id} {...m} />
//         ))}
//       </div>
//       <div className="flex justify-end py-4">
//         <ChatActions
//           reload={props.reload}
//           stop={props.stop}
//           showReload={showReload}
//           showStop={showStop}
//         />
//       </div>
//     </div>
//   );
// }
