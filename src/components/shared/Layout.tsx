export const LoadingMessage = () => (
  <div className="flex justify-center items-center min-h-[400px]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
  </div>
);

export const LoadingPlaceholder = () => {
  return (
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
  );
};

export const NotFoundMessage = ({ message }) => (
  <div className="text-center text-red-600 py-8">{message || "Not found"}</div>
);

const SectionTitle = ({ title, icon: Icon, count }) => (
  <div className="flex items-center">
    {Icon && <Icon className="w-5 h-5 mr-2" />}
    <h2>{title}</h2>
    {count !== undefined && (
      <span className="ml-2 text-gray-500">({count})</span>
    )}
  </div>
);

export const Section = ({
  children,
  className = "",
  title = "",
  titleClassName = "",
  titleExtra = null,
}) => {
  const titleElement = title && (
    <div className={`text-lg font-medium text-gray-900 mb-4 ${titleClassName}`}>
      <h2>{title}</h2>
      {titleExtra && <div className="text-sm text-gray-500">{titleExtra}</div>}
    </div>
  );

  return (
    <div className={`mt-8 first:mt-0 ${className}`}>
      {titleElement}
      <div className="space-y-4">{children}</div>
    </div>
  );
};

const SectionEmptyMessage = ({ msg }) => (
  <p className="text-center text-gray-500 py-4">{msg}</p>
);

export const SectionList = ({
  items = [],
  type,
  title,
  icon,
  variant = "grid",
  Component,
  emptyMessage,
  className = "",
  visible = true,
  hideWhenEmpty = true,
}) => {
  if (!visible) return null;
  if (items === null || items === undefined || (hideWhenEmpty && !items.length))
    return null;

  const content = !items.length ? (
    <p className="text-center text-gray-500 py-4">
      {emptyMessage || `No ${type} found`}
    </p>
  ) : (
    <div
      className={
        variant === "grid"
          ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          : "space-y-4"
      }
    >
      {items.map((item) => (
        <Component key={item.id} data={item} />
      ))}
    </div>
  );

  return (
    <Section
      className={className}
      title={title}
      titleElement={
        title && <SectionTitle title={title} icon={icon} count={items.length} />
      }
    >
      {content}
    </Section>
  );
};
