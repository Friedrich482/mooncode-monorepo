const MainStatsChart = () => {
  return (
    <div className="flex min-h-96 w-[45%] flex-col gap-y-3 rounded-md border border-neutral-600/50 p-3 text-2xl max-chart:w-full">
      <div className="text-center text-2xl font-bold">General stats</div>
      <div className="flex w-full flex-1 flex-col justify-center rounded-md border border-neutral-600/50 text-center">
        <p>Average time per day</p>
        <p className="font-bold">2h 33 mins</p>
      </div>
      <div className="flex flex-1 flex-row gap-x-4 max-sm:text-xl">
        <div className="flex w-1/2 flex-col justify-center gap-1 rounded-md border border-neutral-600/50 px-2 text-center">
          <p className="">Most active day</p>
          <p className="font-bold">Wednesday</p>
        </div>
        <div className="flex w-1/2 flex-col justify-center gap-1 rounded-md border border-neutral-600/50 px-2 text-center">
          <p className="">Most used language</p>
          <p className="font-bold">TypeScript</p>
        </div>
      </div>
    </div>
  );
};

export default MainStatsChart;
