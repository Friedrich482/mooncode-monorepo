const ChartGroupWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-between max-chart:flex-col max-chart:gap-20">
      {children}
    </div>
  );
};

export default ChartGroupWrapper;
