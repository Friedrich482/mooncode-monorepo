const getPrevDayDate = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);

export default getPrevDayDate;
