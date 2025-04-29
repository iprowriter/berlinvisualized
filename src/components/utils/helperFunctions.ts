


//DBG: Function to format string to this format: "29A Alexanderplatz, Berlin, Deutschland"; -> "29A+Alexanderplatz+Berlin+Deutschland";
export function formatString(text:string) {
    return text.replace(/,/g, '').replace(/\s+/g, '+');
}

