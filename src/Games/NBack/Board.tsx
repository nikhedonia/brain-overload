import { count, last } from "../../utils";

import * as fiIcons from "react-icons/fi";
import { NBackState } from ".";
import { useSound } from "../../Devices/sound";
import { Flash } from "../../Flash";
export const positions = count(9);

export const colors = [
  "#C0392B",
  "#9B59B6",
  "#5499C7",
  "#1ABC9C",
  "#F1C40F",
  "#BA4A00",
  "#2E4053"
];

export const icons = [
  "FiActivity",
  "FiAlertTriangle",
  "FiAnchor",
  "FiAperture",
  "FiAward",
  "FiBell",
  "FiCamera",
  "FiEye",
  "FiTool"
];

export const numbers = Array.from({ length: 12 }, (_, i) => i + 1);

export const modalities = {
  positions,
  colors,
  icons,
  numbers,
};

export function NBackBoard({ game }: { game: NBackState }) {
  const current = last(game.stack) || {};

  useSound(current["numbers"] ? current["numbers"].toString() : undefined, [game.time]);

  return (
    <div
      style={{
        flexGrow: 1,
        aspectRatio: "1/1",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gridTemplateRows: "1fr 1fr 1fr",
        gap: "1em",
      }}
    >
      {count(3).flatMap((x) =>
        count(3).map((y) => {
          const shouldHighlight = current["positions"] === x + 3 * y;

          const color = shouldHighlight
            ? (current["colors"]||"black" as string)
            : "#eee";

          
          const icon = current["icons"] as unknown as keyof typeof fiIcons;

          const Icon = shouldHighlight && fiIcons[icon]
            ? fiIcons[icon]
            : (props: object) => <div {...props} />;

          return (
            <div style={{background:'#eee'}} key={`${x}-${y}-${game.time}`}>
              <Flash time={2000} key={game.time} hide={shouldHighlight} >
                <Icon
                  key={`${x}-${y}-${game.time}`}
                  style={{
                    display:'block',
                    width: "100%",
                    height: "100%",
                    background: color,
                    color: "black",
                  }}
                />
              </Flash>
            </div>
          );
        })
      )}
    </div>
  );
}
