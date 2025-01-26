const formatUTCDateToLocal = (utcDate) => {
    const date = new Date(utcDate);
    return date.toLocaleString('pl-PL');
};

export { formatUTCDateToLocal };