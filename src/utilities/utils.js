export const openInBrowserTypes = [
    // Images
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/svg+xml",
    "image/webp",
    // PDF
    "application/pdf",
    // Text
    "text/plain",
    "text/html",
    "text/css",
    "application/javascript",
    // XML
    "application/xml",
    "text/xml",
    // Video
    "video/mp4",
    "video/webm",
    "video/ogg",
    // Audio
    "audio/mpeg",
    "audio/ogg",
    "audio/wav",
];

export const openInBrowserExtensions = [
    // Images
    "jpg",
    "jpeg",
    "png",
    "gif",
    "svg",
    "webp",
    // PDF
    "pdf",
    // Text
    "txt",
    "html",
    "htm",
    "css",
    "js",
    // XML
    "xml",
    // Video
    "mp4",
    "webm",
    "ogg",
    // Audio
    "mp3",
    "ogg",
    "wav",
];

export const labelToKey = (label, fieldsData) => {
    const field = fieldsData.find(field => field.label === label);
    return field ? field.key : null;
  };
export const convertToIndianNumber = (num) => {
    // Arrays for Indian numbering system
    const ones = [
        "",
        "One",
        "Two",
        "Three",
        "Four",
        "Five",
        "Six",
        "Seven",
        "Eight",
        "Nine",
        "Ten",
        "Eleven",
        "Twelve",
        "Thirteen",
        "Fourteen",
        "Fifteen",
        "Sixteen",
        "Seventeen",
        "Eighteen",
        "Nineteen",
    ];
    const tens = [
        "",
        "",
        "Twenty",
        "Thirty",
        "Forty",
        "Fifty",
        "Sixty",
        "Seventy",
        "Eighty",
        "Ninety",
    ];

    // Function to convert a number less than 100 to words
    function convertLessThanHundred(number) {
        if (number < 20) {
            return ones[number];
        } else {
            const ten = Math.floor(number / 10);
            const one = number % 10;
            return tens[ten] + " " + ones[one];
        }
    }

    // Function to convert a number to words
    function convertToWords(number) {
        if (number === 0) return "zero";

        const crore = Math.floor(number / 10000000);
        const lakh = Math.floor((number % 10000000) / 100000);
        const thousand = Math.floor((number % 100000) / 1000);
        const hundred = Math.floor((number % 1000) / 100);
        const remaining = number % 100;

        let result = "";

        if (crore > 0) {
            result += convertLessThanHundred(crore) + " Crore ";
        }

        if (lakh > 0) {
            result += convertLessThanHundred(lakh) + " Lakh ";
        }

        if (thousand > 0) {
            result += convertLessThanHundred(thousand) + " Thousand ";
        }

        if (hundred > 0) {
            result += convertLessThanHundred(hundred) + " Hundred ";
        }

        if (remaining > 0) {
            result += convertLessThanHundred(remaining);
        }

        return result.trim();
    }

    // Split the number into its integer and decimal parts
    const integerPart = Math.floor(num);
    const decimalPart = Math.round((num - integerPart) * 100);

    // Convert the integer part to words
    let integerWords = convertToWords(integerPart);

    // Convert the decimal part to words
    let decimalWords = "";
    if (decimalPart > 0) {
        decimalWords = "and " + convertLessThanHundred(decimalPart) + " Paise";
    }

    // Combine integer and decimal parts
    let result = integerWords + " Rupees ";
    if (decimalWords !== "") {
        result += decimalWords;
    }

    return result;
}