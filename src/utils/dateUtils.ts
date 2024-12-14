export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate(); // Get the day of the month
    const month = date.getMonth() + 1; // Get the month (0-based, so we add 1)
    const year = date.getFullYear(); // Get the full year
    const hours = date.getHours(); // Get the hours
    const minutes = date.getMinutes(); // Get the minutes

    // Pad single digit minutes with a leading zero
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    // Return the formatted date string
    return `${hours}:${formattedMinutes} ngày ${day} tháng ${month} năm ${year}`;
};
