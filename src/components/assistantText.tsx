import ReactMarkdown from "react-markdown";

export const AssistantText = ({ message }: { message: string }) => {
  return (
    <div className="absolute bottom-0 left-0 mb-104  w-full">
      <div className="mx-auto w-full p-16">
        <div className="bg-white rounded-8">
          <div className="px-24 py-8 bg-secondary rounded-t-8 text-white font-bold tracking-wider">
            CHARACTER
          </div>
          <div className="px-24 py-16">
            <div className="text-secondary typography-16 font-bold">
              <ReactMarkdown>{message}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
