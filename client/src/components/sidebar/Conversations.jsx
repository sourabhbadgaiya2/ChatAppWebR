import useGetConversation from "../../hooks/useGetConversations";
import Conversation from "./Conversation";
import getRandomEmoji from "../../utils/emoji";

const Conversations = () => {
  const { loading, conversations } = useGetConversation();

  return (
    <div className='py-2 flex flex-col overflow-auto'>
      {conversations.map((conversation, idx) => (
        <Conversation
          key={conversation._id}
          conversation={conversation}
          emoji={getRandomEmoji()}
          lastIdx={idx === conversations.length - 1}
        />
      ))}
      {loading ? (
        <div className='flex justify-center items-center h-full'>
          <span className='loading loading-spinner'></span>
        </div>
      ) : null}
    </div>
  );
};
export default Conversations;
