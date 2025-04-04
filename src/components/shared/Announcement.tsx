import { FC, useState, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { ChevronDown, ChevronUp } from "lucide-react";
import rehypeRaw from "rehype-raw";

interface AnnouncementProps {
  title: string;
  content: string;
  collapsedContent?: string | ReactNode;
  image?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  className?: string;
  components?: Record<string, React.ComponentType<any>>;
}
const defaultMarkdownComponents = {
  img: ({ src, width, ...props }) => (
    <img
      src={src}
      width={width}
      {...props}
      className="rounded-lg object-cover my-4"
      loading="lazy"
    />
  ),
  a: ({ href, children, className = "", ...props }) => {
    if (href?.startsWith("mailto:")) {
      return (
        <a
          href={href}
          className="text-green-600 font-bold hover:text-green-700"
          {...props}
        >
          {children}
        </a>
      );
    }
    return (
      <a
        href={href}
        className={`text-indigo-600 hover:text-indigo-800 underline ${className}`}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  },
  p: ({ children, className = "", ...props }) => (
    <p {...props} className={`mb-4 last:mb-0 ${className}`}>
      {children}
    </p>
  ),
  b: ({ children, ...props }) => (
    <b {...props} className="font-bold">
      {children}
    </b>
  ),
  calltoaction: ({ href, children }) => (
    <a
      href={href}
      className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
    >
      {children}
    </a>
  ),
};

export const Announcement: FC<AnnouncementProps> = ({
  title,
  content,
  collapsedContent,
  image,
  collapsible = false,
  defaultCollapsed = false,
  className = "",
  components = {},
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const toggleCollapse = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  const markdownComponents = {
    ...defaultMarkdownComponents,
    ...components,
  };

  const renderContent = () => {
    if (isCollapsed) {
      return collapsedContent;
    }

    return (
      <div className="mt-4 prose prose-indigo max-w-none">
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          components={markdownComponents}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  };

  const titleElement =
    collapsible && isCollapsed ? (
      <>
        {title} <i>(read more)</i>
      </>
    ) : (
      title
    );
  return (
    <div
      className={`bg-white rounded-xl shadow-sm overflow-hidden ${className}`}
    >
      {image && (
        <div className="aspect-w-3 aspect-h-1">
          <img src={image} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="p-8">
        <div
          className="flex justify-between items-start"
          onClick={toggleCollapse}
        >
          <h2 className="font-bold text-gray-900">{titleElement}</h2>
          {collapsible && (
            <button
              onClick={toggleCollapse}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              {isCollapsed ? (
                <ChevronDown className="w-6 h-6" />
              ) : (
                <ChevronUp className="w-6 h-6" />
              )}
            </button>
          )}
        </div>

        {renderContent()}
      </div>
    </div>
  );
};
