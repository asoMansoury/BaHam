

import { differenceInYears, format } from 'date-fns';
export function calculateAge(dob: Date) {

    return differenceInYears(new Date(), dob);

}





export function formatShortDateTime(date: Date) {
    return format(date, 'dd MMM yy h:mm:a')
}





export function truncateString(text?: string | null, num = 50) {
    if (!text) return null;

    if (text.length <= num) {
        return text;
    }
    
    return text.slice(0, num) + '...';

}