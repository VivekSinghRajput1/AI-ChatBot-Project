import { checkHeading, replaceHeadingStarts } from "../helper";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'; // Added missing import
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';

// Moved outside component to keep reference stable and prevent markdown re-render loops
const markdownComponents = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <SyntaxHighlighter
        {...props}
        children={String(children).replace(/\n$/, '')}
        language={match[1]}
        style={dark}
        PreTag="div" // Capitalised "PreTag"
      />
    ) : (
      <code {...props} className={className}>
        {children}
      </code>
    );
  },
};

const Answer = ({ ans, totalResult, index, type }) => {
  // Compute directly on render — avoids unnecessary useState & useEffect cycles
  const isHeading = checkHeading(ans);
  const formattedAnswer = isHeading ? replaceHeadingStarts(ans) : ans;

  return (
    <>
      {index === 0 && totalResult > 1 ? (
        <span className="pt-2 text-2xl block text-white">{formattedAnswer}</span>
      ) : isHeading ? (
        <span className="pt-2 text-lg block text-white">{formattedAnswer}</span>
      ) : (
        <span className={type === 'q' ? 'pl-1' : 'pl-5'}>
          <ReactMarkdown components={markdownComponents}>
            {formattedAnswer}
          </ReactMarkdown>
        </span>
      )}
    </>
  );
};

export default Answer;