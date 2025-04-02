import { useMap } from "@vis.gl/react-maplibre";
import { Card } from "./ui/card";
import { useIssues } from "@/lib/IssuesContext";
import { IssueWithImage } from "@/types/issue";

export const CardSlider = () => {
  const { issues } = useIssues();
  const { ecoMap } = useMap();

  if (issues === undefined || issues === null) {
    return null;
  }

  const handleClick = (issue: IssueWithImage) => {
    const clickedPoint = issue.location.coordinates;
    if (ecoMap) {
      const height = ecoMap.getContainer().clientHeight;
      ecoMap.flyTo({
        center: [clickedPoint[0], clickedPoint[1]],
        offset: [0, -height / 5],
        zoom: 12,
        speed: 2,
      });
    }
  };

  return (
    <div className="flex relative w-full overflow-x-scroll gap-2">
      {issues.map((issue) => (
        <Card
          key={issue.id}
          className="flex-shrink-0 w-[300px] p-4"
          onClick={() => handleClick(issue)} // Pass the issue to handleClick
        >
          <h3 className="font-bold">{issue.title}</h3>
          <p>Category: {issue.category}</p>
          <p>{issue.description}</p>
        </Card>
      ))}
    </div>
  );
};
