import { DATE_LOCALE } from "./constants";

/**
 * Returns the current date in the locale format specified in {@link DATE_LOCALE}.
 * Always give a YYYY-MM-DD format
 */
const getTodaysLocalDate = () => {
  return new Date().toLocaleDateString(DATE_LOCALE);
};

export default getTodaysLocalDate;
