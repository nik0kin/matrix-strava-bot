// https://stackoverflow.com/a/54127122/346485
export function convertTZ(date: string | Date, tzString: string) {
  return new Date(
    (typeof date === 'string' ? new Date(date) : date).toLocaleString('en-US', {
      timeZone: tzString,
    })
  );
}
