export const isEmpty = (value: any): boolean => {
    return (
        value === undefined ||
        value === null ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0) ||
        (typeof value === "number" && value < 1)
    );
};

export const isValidDate = (value: string): boolean => {
    const dateValue: Date = new Date(value);

    return !isNaN(dateValue.getTime());
};

export const dateParse = (value: string) => {
    let result = {
        year: "",
        month: "",
        date: "",
        hour: "", 
        minute: "",
        second: "",
        dayname: "",
        monthname: ""
    };

    if (isValidDate(value)) {
        const dateValue = new Date(value);
        const [month, date, year] = dateValue.toLocaleDateString("default", {
            timeZone: "Asia/Jakarta",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).split("/");
        const [hour, minute, second] = dateValue.toLocaleTimeString("default", {
            timeZone: "Asia/Jakarta",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        }).split(":");
        const [monthname, dayname] = dateValue.toLocaleDateString("default", {
            weekday: "short",
            month: "short"
        }).split(" ");

        result = { year, month, date, hour, minute, second, monthname, dayname };
    }

    return result;
};

export const formatCurrency = (value: string | number): string => {
    let result: number = 0;

    switch (true) {
    case typeof value === "string":
        const text = value.replace(/[^0-9]/g, "");
        result = Number(text);
        break;
    case typeof value === "number" && value >= 0:
        result = value;
        break;
    }

    return result.toLocaleString("id-ID");
};