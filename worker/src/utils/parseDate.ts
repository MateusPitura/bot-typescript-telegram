export function parseDate(date: number): Date {
    return new Date(Number(`${date}000`));
}