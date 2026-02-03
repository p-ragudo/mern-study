export function formatDate(date) {
    const dateObj = new Date(date);

    if(isNaN(dateObj.getTime())) {
        return "Invalid Date";
    }

    return dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}