import * as d3 from "d3";
import { CircularPackingProps, Tree } from "@/types-schemas";
import { Fragment, useMemo } from "react";
import formatDuration from "@repo/utils/formatDuration";
import generateMidToneRandomColor from "@/utils/generateMidToneRandomColor";

export const CircularPacking = ({
  width,
  height,
  data,
}: CircularPackingProps) => {
  const hierarchy = d3
    .hierarchy(data)
    .sum((d) => d.value)
    .sort((a, b) => b.value! - a.value!);

  const packGenerator = d3.pack<Tree>().size([width, height]).padding(0);
  const root = packGenerator(hierarchy);

  const dataSet = root.descendants().slice(1);
  const fills = useMemo(
    () =>
      dataSet.map((node) =>
        generateMidToneRandomColor({
          maxComponentValue: node.x,
          minComponentValue: node.y,
        }),
      ),
    [],
  );

  const maxValue = Math.max(...dataSet.map((entry) => entry.data.value));

  return (
    <svg width={width} height={height} cx={width / 2}>
      {dataSet.map((node, index) => (
        <Fragment key={node.data.key}>
          <circle
            cx={node.x}
            cy={node.y}
            r={node.r}
            fill={fills[index]}
            className="w-full cursor-pointer"
          />
          <text
            x={node.x}
            y={node.y}
            fontSize={Math.max((node.data.value / maxValue) * 20, 5)}
            textAnchor="middle"
            dominantBaseline="middle"
            className="cursor-pointer"
          >
            <tspan x={node.x} className="font-bold">
              {node.data.name}
            </tspan>
            <tspan x={node.x} dy="1.2em">
              {formatDuration(node.data.value)}
            </tspan>
          </text>{" "}
        </Fragment>
      ))}
    </svg>
  );
};

export default CircularPacking;
