import { useHome } from "../data/hooks/HomeHook";
import { Job_Card_Variant2, Organization_Card_Variant2 } from "./shared/Cards";
import { ScrollableListSection } from "./shared/ScrollableListSection";
import { Announcement } from "./shared/Announcement";

export default function Home() {
  const { currentLayout, currentContent, loading, error } = useHome();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!currentLayout) return <div>Page not found</div>;

  const renderSection = (section) => {
    if (section.type === "announcement") {
      return <Announcement key={section.order} {...section.data} />;
    }

    if (section.type === "list") {
      const Component =
        section.data.listType === "organizations"
          ? Organization_Card_Variant2
          : Job_Card_Variant2;

      const items = section.data.items
        .map((id) =>
          currentContent[section.data.listType].find((item) => item.id === id)
        )
        .filter(Boolean);

      return (
        <ScrollableListSection
          key={section.order}
          title={section.data.title}
          items={items}
          Component={Component}
        />
      );
    }

    return null;
  };

  return (
    <div className="space-y-12 py-8">
      {currentLayout.structure.map(renderSection)}
    </div>
  );
}
