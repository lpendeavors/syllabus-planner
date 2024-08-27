import { format, parseISO, isValid } from 'date-fns';

export const formatDate = (date?: Date | string): string => {
  if (!date) return ''; // Return empty string for missing dates

  // Attempt to parse the date if it's a string
  let parsedDate: Date | string = date;
  if (typeof date === 'string') {
    const tempDate = parseISO(date);
    if (isValid(tempDate)) {
      parsedDate = tempDate;
    }
  }

  // If the date is valid, format it; otherwise, return the original string
  return parsedDate instanceof Date && isValid(parsedDate)
    ? format(parsedDate, 'EEE, M/d')
    : String(date);
};
