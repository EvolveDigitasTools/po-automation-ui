import { binaryStringToBlob, getMimeTypeFromFileName } from "../util";

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
    // "audio/mpeg",
    // "audio/ogg",
    // "audio/wav",
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
    // "mp3",
    // "ogg",
    // "wav",
];

export const labelToKey = (label, fieldsData) => {
    const field = fieldsData.find((field) => field.label === label);
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
};

export const formatNumberIndianSystem = (num) => {
    return new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
        style: "decimal",
    }).format(num);
};

export const isDecimal = (num) => {
    return !!(num % 1);
};

export const getFile = async (idType, id) => {
    try {
        const fileDetailsUrl = `${process.env.REACT_APP_SERVER_URL}file/${idType}/${id}`;
        const fileResponse = await fetch(fileDetailsUrl);
        const fileJson = await fileResponse.json();
        const file = await fileJson?.data?.file;
        if (file)
            return new File(
                [
                    binaryStringToBlob(
                        file.fileContent,
                        getMimeTypeFromFileName(file.fileName)
                    ),
                ],
                file.fileName,
                { type: getMimeTypeFromFileName(file.fileName) }
            );
        return file;
    } catch {
        return null;
    }
};

export const convertToNumber = (value) => {
    if (typeof value === 'number' && !isNaN(value)) {
        return value; // Already a number
    }
    if (typeof value === 'string' && /^\d+$/.test(value)) {
        return Number(value); // Convert valid numeric string to number
    }
    return NaN; // Return NaN for invalid cases
}

export const downloadAttachment = async (attachmentDetails) => {
    const { id: attachmentId, name, mimeType, totalChunks } = attachmentDetails;
    const binaryChunks = [];

    // Fetch each chunk sequentially
    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const response = await fetch(
            `${process.env.REACT_APP_SERVER_URL}/attachment/chunk/${attachmentId}/${chunkIndex}`
        );
        if (!response.ok) {
            console.error(`Failed to fetch chunk ${chunkIndex}`);
            return;
        }
        const json = await response.json();
        if (!json.success) {
            console.error(`Error fetching chunk ${chunkIndex}: ${json.message}`);
            return;
        }
        binaryChunks.push(atob(json.data.chunk.chunkData));
    }

    // Combine all chunks into a full base64 string
    const fullBinary = binaryChunks.join("");
    // Decode base64 to binary string
    const len = fullBinary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = fullBinary.charCodeAt(i);
    }

    // Create a blob with the proper MIME type
    const blob = new Blob([bytes], { type: mimeType });
    const downloadUrl = window.URL.createObjectURL(blob);

    const extension = name.split(".").pop().toLowerCase();
    if (
        openInBrowserTypes.includes(mimeType) ||
        openInBrowserExtensions.includes(extension)
    ) {
        window.open(downloadUrl, "_blank");
    } else {
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    window.URL.revokeObjectURL(downloadUrl);
}