import { ChevronLeft, ChevronRight } from "lucide-react";
import Icon from "@/components/ui/Icon";

const ChartTitle = ({
  date,
  formattedTotalTimeSpent,
  handleChevronLeftClick,
  handleChevronRightClick,
  offset,
}: {
  handleChevronLeftClick: () => void;
  handleChevronRightClick: () => void;
  formattedTotalTimeSpent: string;
  date: string;
  offset: number;
}) => (
  <h2 className="flex items-center justify-between gap-4 px-3 text-center text-2xl font-bold">
    <Icon Icon={ChevronLeft} onClick={handleChevronLeftClick} />
    <p>
      {formattedTotalTimeSpent} - {date}
    </p>
    <Icon
      Icon={ChevronRight}
      onClick={handleChevronRightClick}
      disabled={offset === 0}
    />
  </h2>
);

export default ChartTitle;
