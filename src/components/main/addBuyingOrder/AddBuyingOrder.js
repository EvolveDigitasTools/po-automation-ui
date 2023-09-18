import { Link, useParams } from "react-router-dom";
import ExcelJS from "exceljs";
import {
    Autocomplete,
    Button,
    Grid,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import "./ADDBuying.css";
import { ArrowBack } from "@mui/icons-material";
import Attachment from "../../attachment/Attachment";

function convertToIndianNumber(num) {
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

export default function AddBuyingOrder() {
    const params = useParams();
    const vendorCode = params.vendorCode;
    const [vendor, setVendor] = useState(null);
    const [vendors, setVendors] = useState([]);
    const [excelData, setExcelData] = useState([]);
    const [currency, setCurrency] = useState("INR");
    const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState("");
    const [paymentTerms, setPaymentTerms] = useState("");
    const [buyingAtt, setBuyingAtt] = useState(null);
    const [submit, setSubmit] = useState(false);
    const [poAtt, setPOAtt] = useState(null);
    const [poCode, setPOCode] = useState("");

    const [createdBy, setCreatedBy] = useState(null)
    const currencyList = ["INR", "USD", "AED", "SAR", "TAKA"];

    //ComponentDidMount
    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER_URL}vendor/all`)
            .then((response) => response.json())
            .then((res) => {
                setVendors(res.data.vendors);
            })
            .catch((error) => {
                console.error("API error:", error);
                // Handle the error
            });
        if (vendorCode != "new")
            fetch(`${process.env.REACT_APP_SERVER_URL}vendor/${vendorCode}`)
                .then((response) => response.json())
                .then((res) => {
                    setVendor(res.data.vendor);
                })
                .catch((error) => {
                    console.error("API error:", error);
                    // Handle the error
                });

        const poCodeUrl = `${process.env.REACT_APP_SERVER_URL}buying-order/`
        fetch(poCodeUrl)
            .then((response) => response.json())
            .then((res) => {
                setPOCode(res.data.poCode)
            })
        return () => {
            // This code will run when the component is unmounted
            // You can perform any cleanup tasks here, such as unsubscribing from subscriptions
            console.log("Component unmounted");
        };
    }, []);

    const updateVendor = async (newVendor) => {
        if (newVendor?.vendorCode)
            fetch(
                `${process.env.REACT_APP_SERVER_URL}vendor/${newVendor.vendorCode}`
            )
                .then((response) => response.json())
                .then((res) => {
                    setVendor(res.data.vendor);
                })
                .catch((error) => {
                    console.error("API error:", error);
                    // Handle the error
                });
        else setVendor(null);
    };

    const updateFile = async (file) => {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(file);

        const worksheet = workbook.getWorksheet(1);
        const parsedData = [];

        worksheet.eachRow((row) => {
            parsedData.push(row.values);
        });

        setExcelData(parsedData)
        setBuyingAtt(file)
    }

    const getPOAtt = async () => {
        if (poAtt)
            return poAtt

        const buyingExcel = new ExcelJS.Workbook();
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const day = String(currentDate.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;

        await buyingExcel.xlsx.load(buyingAtt);

        const parsedData = excelData

        const records = [];
        const buyingRecordsKey = ["skuCode", "expectedQty", "unitCost", "gst"];
        for (let i = 1; i < parsedData.length; i++) {
            const row = parsedData[i].slice(1);
            // Do something with the form data, like sending it to a server
            const record = {};

            for (let i = 0; i < row.length; i++) {
                const value = row[i];
                if (value) record[buyingRecordsKey[i]] = value;
            }
            records.push(record);
        }
        // Create a new workbook
        const poWorkbook = new ExcelJS.Workbook();
        const poSheet = poWorkbook.addWorksheet("Order Details");

        // Define the data
        const data = [
            [],
            ["", "Ansan Technologies Pvt Ltd"],
            [
                "",
                "Partner Name :",
                "",
                vendor.companyName,
                "",
                "",
                "",
                "BU :",
                "Pluugin E-Commerce",
            ],
            [
                "",
                "Partner Code :",
                "",
                vendor.vendorCode,
                "",
                "",
                "",
                "P.O No :",
                poCode,
            ],
            [
                "",
                "Partner Address :",
                "",
                `${vendor.address.addressLine1}, ${vendor.address?.addressLine2
                    ? vendor.address.addressLine2 + ", "
                    : ""
                }${vendor.address.city}, ${vendor.address.state}-${vendor.address.postalCode
                }`,
                "",
                "",
                "",
                "BM :",
                "Retail",
            ],
            [
                "",
                "Contact Person :",
                "",
                vendor.contactPerson.name,
                "",
                "",
                "",
                "Currency :",
                currency,
            ],
            [
                "",
                "Contact No :",
                "",
                Number(vendor.contactPerson.phoneNumber),
                "",
                "",
                "",
                "Date :",
                formattedDate,
            ],
            [
                "",
                "Payment Terms :",
                "",
                paymentTerms,
                "",
                "",
                "",
                "Buyer :",
                vendor.contactPerson.email,
            ],
            [
                "",
                "GST No:",
                "",
                vendor.gst,
                "",
                "",
                "",
                "GST No:",
                "09AAQCA1249N1Z4",
            ],
            [
                "",
                "State Name and Code:",
                "",
                vendor.address.state,
                "",
                "",
                "",
                "State Name and Code:",
                "Uttar Pradesh UP",
            ],
            [
                "",
                "Estimated Delivery Date :",
                "",
                estimatedDeliveryDate,
                "",
                "",
                "",
                "CIN:",
                "",
            ],
            [
                "",
                "Bill To :",
                "Ansan Technologies Pvt Ltd\nFC - 2 & 4, Film City Sector-16, Noida, UP-201301",
                "",
                "",
                "",
                "",
                "Ship To :",
                "Shree Maruti Courier Pvt. Ltd O/B Ansan Technology Pvt Ltd.\nPlot no. 25-5/2, Rao giriraj Singh  Retail Park Opp. Om logistics Near  Iffco chowk Sec. 18 Gurgaon, HR-122015",
            ],
            [
                "",
                "SR No",
                "SKU",
                "Product Title",
                "EAN",
                "Model Number",
                "Category",
                "Brand",
                "Size",
                "Color Family-Color",
                "Qty",
                "Unit Rate",
                "IGST Rate",
                "IGST Amount",
                "SGST Rate",
                "SGST Amount",
                "CGST Rate",
                "CGST Amount",
                "Amount (INR)",
            ],
        ];

        const skus = {};
        vendor.skus.forEach((sku) => {
            skus[sku.skuCode] = sku;
        });
        let totalQty = 0,
            totalIgst = 0,
            totalSgst = 0,
            totalAmount = 0;
        const isInterState = vendor.address.state != "Uttar Pradesh";
        for (let i = 0; i < records.length; i++) {
            let igst = 0,
                sgst = 0;
            if (!isInterState) {
                sgst =
                    (records[i].expectedQty *
                        records[i].unitCost *
                        records[i].gst) /
                    200;
                totalSgst += sgst;
            } else {
                igst =
                    (records[i].expectedQty *
                        records[i].unitCost *
                        records[i].gst) /
                    100;
                totalIgst += igst;
            }
            totalAmount += records[i].expectedQty * records[i].unitCost;
            totalQty += records[i].expectedQty;
            data.splice(13 + i, 0, [
                "",
                i + 1,
                records[i].skuCode,
                skus[records[i].skuCode].productTitle,
                Number(skus[records[i].skuCode].ean),
                skus[records[i].skuCode].modelNumber,
                skus[records[i].skuCode].category,
                skus[records[i].skuCode].brand,
                skus[records[i].skuCode].size,
                skus[records[i].skuCode].colorFamilyColor,
                records[i].expectedQty,
                records[i].unitCost,
                isInterState ? records[i].gst / 100 : 0,
                igst,
                isInterState ? 0 : records[i].gst / 200,
                sgst,
                isInterState ? 0 : records[i].gst / 200,
                sgst,
                records[i].expectedQty * records[i].unitCost,
            ]);
        }
        data.splice(
            13 + records.length,
            0,
            [
                "",
                `Sub Total (${currency})`,
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                totalQty,
                "",
                "",
                totalIgst,
                "",
                totalSgst,
                "",
                totalSgst,
                totalAmount,
            ],
            [
                "",
                `GST`,
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                totalIgst + totalSgst * 2,
            ],
            [
                "",
                `Grand Total (${currency}) - ${convertToIndianNumber(
                    totalIgst + totalSgst * 2 + totalAmount
                )}Only`,
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                totalIgst + totalSgst * 2 + totalAmount,
            ],
            [
                "",
                "This is a digital PO and doesn't require Authorised Signatory",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
            ],
            [
                "",
                "Requested by :",
                "",
                vendor.contactPerson.email,
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
            ],
            [
                "",
                "Terms & Conditions",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
            ],
            [
                "",
                "1. Please send a copy of invoice & PO along with stock.\n2. Please Mention the PO no. on invoice.\n3. Freight Charges are not included.\n4. Multiple invoices for a single PO will not be entertained.\n5. For Grocery Category items must have minimum 75% or 18 Months of Shelf life from the Delivery Date.",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
            ],
            [
                "",
                "In relation to products purchased under this PO, the seller agrees to be liable and indemnify Pluugin E-Commerce against any losses, damages and/or expenses arising out of or relating to: \na) any defects or damage to a product that occurred prior to acceptance of the product by Pluugin E-Commerce, or after acceptance with respect to latent deficiencies;\nb) any third party claims, including governmental and regulatory claims, investigations or similar, regarding use of the products; or c) a breach of any applicable law.",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
            ]
        );

        // Add data to the worksheet
        data.forEach((row) => {
            poSheet.addRow(row);
        });

        const columnWidths = [
            6.36, 16.82, 35.55, 14.91, 14.82, 9.09, 18.64, 7.09, 16.09, 6.55,
            8.36, 6.55, 7.18, 7.36, 7.64, 8.55, 8.55, 9.36,
        ];
        const rowStartHeights = [
            15.0, 26.3, 15.0, 15.0, 30, 17.3, 15.8, 18.0, 18.0, 19.5, 19.5, 30,
            27.8,
        ];
        const rowEndHeights = [13.0, 13.0, 13.0, 13.0, 14.2, 14.2, 80.0, 60.0];

        for (let i = 2; i <= columnWidths.length + 1; i++)
            poSheet.getColumn(i).width = columnWidths[i - 2] + 0.64;
        for (let i = 1; i <= rowStartHeights.length; i++)
            poSheet.getRow(i).height = rowStartHeights[i - 1] * 1.5;
        for (let i = 0; i <= records.length; i++)
            poSheet.getRow(14 + i).height = 16.5 * 1.5;
        for (let i = 0; i <= rowEndHeights.length; i++)
            poSheet.getRow(14 + records.length + i).height =
                rowEndHeights[i] * 1.5;

        poSheet.mergeCells("B2", "S2");

        let startCell = poSheet.getCell("B2");
        let endCell = poSheet.getCell("S2");

        for (let col = startCell.col; col <= endCell.col; col++) {
            const cell = poSheet.getCell(startCell.row, col);
            cell.style = {
                alignment: { horizontal: "center", vertical: "middle" },
                font: { bold: true, size: 13 },
                fill: {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFA500" },
                },
                border: {
                    top: { style: "medium" },
                    left: { style: "medium" },
                    bottom: { style: "medium" },
                    right: { style: "medium" },
                },
            };
        }

        startCell = poSheet.getCell("B3");
        endCell = poSheet.getCell("B11");

        for (let row = startCell.row; row <= endCell.row; row++) {
            const cell = poSheet.getCell(row, startCell.col);
            cell.style = {
                alignment: { vertical: "middle" },
                font: { bold: true },
                fill: {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "F9FB9B" },
                },
                border: {
                    left: { style: "medium" },
                },
            };
        }
        startCell = poSheet.getCell("D3");
        endCell = poSheet.getCell("D11");

        for (let row = startCell.row; row <= endCell.row; row++) {
            const cell = poSheet.getCell(row, startCell.col);
            cell.style = {
                alignment: {
                    vertical: "middle",
                    horizontal: "left",
                    wrapText: true,
                },
                fill: {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "F9FB9B" },
                },
            };
        }

        startCell = poSheet.getCell("H3");
        endCell = poSheet.getCell("H11");

        for (let row = startCell.row; row <= endCell.row; row++) {
            const cell = poSheet.getCell(row, startCell.col);
            cell.style = {
                alignment: { vertical: "middle" },
                font: { bold: true },
                fill: {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "F9FB9B" },
                },
                border: {
                    left: { style: "thin" },
                },
            };
        }
        startCell = poSheet.getCell("I3");
        endCell = poSheet.getCell("I11");

        for (let row = startCell.row; row <= endCell.row; row++) {
            const cell = poSheet.getCell(row, startCell.col);
            cell.style = {
                alignment: { vertical: "middle" },
                fill: {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "F9FB9B" },
                },
                border: {
                    right: { style: "medium" },
                },
            };
        }

        poSheet.getCell("B12").style = {
            alignment: { vertical: "middle" },
            font: { bold: true },
            fill: {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "F9FB9B" },
            },
            border: {
                top: { style: "thin" },
                left: { style: "medium" },
                right: { style: "thin" },
                bottom: { style: "thin" },
            },
        };

        startCell = poSheet.getCell("C12");
        endCell = poSheet.getCell("G12");

        for (let col = startCell.col; col <= endCell.col; col++) {
            const cell = poSheet.getCell(startCell.row, col);
            cell.style = {
                alignment: { vertical: "middle", wrapText: true },
                font: { color: { argb: "C00000 " } },
                fill: {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "F9FB9B" },
                },
                border: {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" },
                    bottom: { style: "thin" },
                },
            };
        }

        poSheet.getCell("H12").style = {
            alignment: { vertical: "middle", wrapText: true },
            font: { bold: true },
            fill: {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "F9FB9B" },
            },
            border: {
                top: { style: "thin" },
                left: { style: "thin" },
                right: { style: "thin" },
                bottom: { style: "thin" },
            },
        };

        startCell = poSheet.getCell("I12");
        endCell = poSheet.getCell("R12");

        for (let col = startCell.col; col <= endCell.col; col++) {
            const cell = poSheet.getCell(startCell.row, col);
            cell.style = {
                alignment: { vertical: "middle", wrapText: true },
                font: { color: { argb: "C00000 " } },
                fill: {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "F9FB9B" },
                },
                border: {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "medium" },
                    bottom: { style: "thin" },
                },
            };
        }

        poSheet.getCell("S12").style = {
            alignment: { vertical: "middle" },
            font: { color: { argb: "C00000 " } },
            fill: {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "F9FB9B" },
            },
            border: {
                top: { style: "thin" },
                left: { style: "thin" },
                right: { style: "medium" },
                bottom: { style: "thin" },
            },
        };

        startCell = poSheet.getCell("B13");
        endCell = poSheet.getCell("S13");

        for (let col = startCell.col; col <= endCell.col; col++) {
            const cell = poSheet.getCell(startCell.row, col);
            cell.style = {
                alignment: {
                    vertical: "middle",
                    horizontal: "center",
                    wrapText: true,
                },
                font: { bold: true },
                border: {
                    top: { style: "thin" },
                    left: { style: cell.col == 2 ? "medium" : "thin" },
                    right: { style: cell.col == 19 ? "medium" : "thin" },
                    bottom: { style: "thin" },
                },
            };
        }

        startCell = poSheet.getCell("B14");
        endCell = poSheet.getCell(`S${13 + records.length}`);

        for (let row = startCell.row; row <= endCell.row; row++) {
            for (let col = startCell.col; col <= endCell.col; col++) {
                const cell = poSheet.getCell(row, col);
                cell.style = {
                    alignment: { vertical: "middle", horizontal: "center" },
                    border: {
                        top: { style: "thin" },
                        left: { style: cell.col == 2 ? "medium" : "thin" },
                        right: { style: cell.col == 19 ? "medium" : "thin" },
                        bottom: {
                            style: cell.row == endCell.row ? "medium" : "thin",
                        },
                    },
                };
            }
        }

        if (!isInterState) {
            startCell = poSheet.getCell("O14");
            endCell = poSheet.getCell(`O${13 + records.length}`);

            for (let row = startCell.row; row <= endCell.row; row++) {
                const cell = poSheet.getCell(row, startCell.col);
                cell.numFmt = "0%";
            }

            startCell = poSheet.getCell("Q14");
            endCell = poSheet.getCell(`Q${13 + records.length}`);

            for (let row = startCell.row; row <= endCell.row; row++) {
                const cell = poSheet.getCell(row, startCell.col);
                cell.numFmt = "0%";
            }
        } else {
            startCell = poSheet.getCell("M14");
            endCell = poSheet.getCell(`M${13 + records.length}`);

            for (let row = startCell.row; row <= endCell.row; row++) {
                const cell = poSheet.getCell(row, startCell.col);
                cell.numFmt = "0%";
            }
        }

        startCell = poSheet.getCell(`B${14 + records.length}`);
        endCell = poSheet.getCell(`S${14 + records.length}`);

        for (let col = startCell.col; col <= endCell.col; col++) {
            const cell = poSheet.getCell(startCell.row, col);
            cell.style = {
                alignment: {
                    vertical: "middle",
                    horizontal: cell.col == 2 ? "left" : "center",
                },
                font: {
                    bold: true,
                    color: { argb: cell.col == 2 ? "C00000" : "000000" },
                },
                border: {
                    top: { style: "medium" },
                    left: { style: cell.col == 2 ? "medium" : "thin" },
                    right: { style: cell.col == 19 ? "medium" : "thin" },
                    bottom: { style: "thin" },
                },
            };
        }

        startCell = poSheet.getCell(`B${15 + records.length}`);
        endCell = poSheet.getCell(`S${16 + records.length}`);

        for (let row = startCell.row; row <= endCell.row; row++) {
            for (let col = startCell.col; col <= endCell.col; col++) {
                const cell = poSheet.getCell(row, col);
                cell.style = {
                    alignment: {
                        vertical: "middle",
                        horizontal: cell.col == 2 ? "left" : "center",
                    },
                    font: {
                        bold:
                            cell.col == 2 || cell.row == endCell.row
                                ? true
                                : false,
                    },
                    border: {
                        top: { style: "thin" },
                        left: { style: cell.col == 2 ? "medium" : "thin" },
                        right: { style: cell.col == 19 ? "medium" : "thin" },
                        bottom: { style: "thin" },
                    },
                };
            }
        }

        startCell = poSheet.getCell(`B${17 + records.length}`);
        endCell = poSheet.getCell(`S${18 + records.length}`);

        for (let row = startCell.row; row <= endCell.row; row++) {
            for (let col = startCell.col; col <= endCell.col; col++) {
                const cell = poSheet.getCell(row, col);
                cell.style = {
                    alignment: { vertical: "middle", horizontal: "left" },
                    fill: {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: "F2F2F2" },
                    },
                    border: {
                        top: { style: "thin" },
                        left: { style: cell.col == 2 ? "medium" : "thin" },
                        right: { style: cell.col == 19 ? "medium" : "thin" },
                        bottom: { style: "thin" },
                    },
                };
            }
        }

        startCell = poSheet.getCell(`B${19 + records.length}`);
        endCell = poSheet.getCell(`S${21 + records.length}`);

        for (let row = startCell.row; row <= endCell.row; row++) {
            for (let col = startCell.col; col <= endCell.col; col++) {
                const cell = poSheet.getCell(row, col);
                cell.style = {
                    alignment: {
                        vertical: "middle",
                        horizontal: "left",
                        wrapText: true,
                    },
                    font: { bold: row == startCell.row ? true : false },
                    fill: {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: "F2F2F2" },
                    },
                    border: {
                        top: { style: "thin" },
                        left: { style: cell.col == 2 ? "medium" : "thin" },
                        right: { style: cell.col == 19 ? "medium" : "thin" },
                        bottom: {
                            style: cell.col == endCell.col ? "medium" : "thin",
                        },
                    },
                };
            }
        }

        poSheet.mergeCells("B3", "C3");
        poSheet.mergeCells("B4", "C4");
        poSheet.mergeCells("B5", "C5");
        poSheet.mergeCells("B6", "C6");
        poSheet.mergeCells("B7", "C7");
        poSheet.mergeCells("B8", "C8");
        poSheet.mergeCells("B9", "C9");
        poSheet.mergeCells("B10", "C10");
        poSheet.mergeCells("B11", "C11");

        poSheet.mergeCells("D4", "G4");
        poSheet.mergeCells("D3", "G3");
        poSheet.mergeCells("D5", "G5");
        poSheet.mergeCells("D6", "G6");
        poSheet.mergeCells("D7", "G7");
        poSheet.mergeCells("D8", "G8");
        poSheet.mergeCells("D9", "G9");
        poSheet.mergeCells("D10", "G10");
        poSheet.mergeCells("D11", "G11");
        poSheet.mergeCells("C12", "G12");

        poSheet.mergeCells("I3", "S3");
        poSheet.mergeCells("I4", "S4");
        poSheet.mergeCells("I5", "S5");
        poSheet.mergeCells("I6", "S6");
        poSheet.mergeCells("I7", "S7");
        poSheet.mergeCells("I8", "S8");
        poSheet.mergeCells("I9", "S9");
        poSheet.mergeCells("I10", "S10");
        poSheet.mergeCells("I11", "S11");
        poSheet.mergeCells("I12", "S12");

        poSheet.mergeCells(
            `B${14 + records.length}`,
            `J${14 + records.length}`
        );
        poSheet.mergeCells(
            `B${15 + records.length}`,
            `R${15 + records.length}`
        );
        poSheet.mergeCells(
            `B${16 + records.length}`,
            `R${16 + records.length}`
        );
        poSheet.mergeCells(
            `B${17 + records.length}`,
            `S${17 + records.length}`
        );
        poSheet.mergeCells(
            `B${18 + records.length}`,
            `C${18 + records.length}`
        );
        poSheet.mergeCells(
            `D${18 + records.length}`,
            `S${18 + records.length}`
        );
        poSheet.mergeCells(
            `B${19 + records.length}`,
            `S${19 + records.length}`
        );
        poSheet.mergeCells(
            `B${20 + records.length}`,
            `S${20 + records.length}`
        );
        poSheet.mergeCells(
            `B${21 + records.length}`,
            `S${21 + records.length}`
        );

        const poBuffer = await poWorkbook.xlsx.writeBuffer();
        setPOAtt(poBuffer)
        return poBuffer;
    };

    const handleDownload = async () => {
        // Sample data for the Excel file
        const data = [
            ["SKU*", "expected_qty*", "unit_cost*", "GST_%*"],
            // Add more data here
        ];

        // Create a new workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Buying Sheet");

        // Populate the worksheet with data
        data.forEach((row) => {
            worksheet.addRow(row);
        });

        data[0].forEach((title, columnIndex) => {
            const column = worksheet.getColumn(columnIndex + 1);
            let maxTitleLength = title.length;
            column.width = maxTitleLength + 2; // You can adjust the additional width as needed
        });

        // Generate a Blob from the workbook
        const blob = await workbook.xlsx.writeBuffer();

        // Create a URL for the Blob and create a temporary anchor element to trigger download
        const url = URL.createObjectURL(new Blob([blob]));
        const a = document.createElement("a");
        a.href = url;
        a.download = "newBuyingSheet.xlsx";
        a.click();

        // Clean up by revoking the Blob URL
        URL.revokeObjectURL(url);
    };

    const submitPOForVerification = async (e) => {
        e.preventDefault();
        setSubmit(true)
        if (!buyingAtt)
            return

        const parsedData = excelData
        const records = [];
        const buyingRecordsKey = ["skuCode", "expectedQty", "unitCost", "gst"];
        const formData = new FormData();
        for (let i = 1; i < parsedData.length; i++) {
            const row = parsedData[i].slice(1);
            // Do something with the form data, like sending it to a server
            const record = {};

            for (let i = 0; i < row.length; i++) {
                const value = row[i];
                if (value) record[buyingRecordsKey[i]] = value;
            }
            records.push(record);
        }
        formData.append("currency", currency);
        if (paymentTerms) formData.append("paymentTerms", paymentTerms);
        if (estimatedDeliveryDate)
            formData.append("estimatedDeliveryDate", estimatedDeliveryDate);
        formData.append("records", JSON.stringify(records));
        formData.append("vendorCode", vendorCode);
        formData.append("createdBy", createdBy)
        const poBuffer = await getPOAtt();
        formData.append("poCode", poCode)
        const blob = new Blob([poBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        // Convert the Blob to a File
        const excelFile = new File([blob], 'po.xlsx', { type: blob.type });
        formData.append("poAttachment", excelFile)

        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}buying-order/new`, {
            method: "POST",
            body: formData,
        })
        const newBO = await response.json();
    };

    const previewPO = async (e) => {
        e.preventDefault();
        setSubmit(true)
        if (!buyingAtt)
            return
        const poAtt = await getPOAtt()
        // Create a URL for the Blob and create a temporary anchor element to trigger download
        const url = URL.createObjectURL(new Blob([poAtt]));
        const a = document.createElement("a");
        a.href = url;
        a.download = "po.xlsx";
        a.click();

        // Clean up by revoking the Blob URL
        URL.revokeObjectURL(url);
    }

    return (
        <div className="new-pos">
            <Link to="/admin">
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="back"
                // onClick={() => handleBack()}
                >
                    <ArrowBack />Back
                </IconButton>
            </Link>
            <form onSubmit={submitPOForVerification}>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={6}>
                        <h1>PO Creation</h1>
                    </Grid>
                    <Grid item xs={6} style={{ margin: "auto" }}>
                        <Attachment
                            label="Download Sample Buying Sheet Excel"
                            downloadFile={handleDownload}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <h2>Vendor Details</h2>
                    </Grid>
                    <Grid item xs={6}>
                        <Autocomplete
                            required
                            disablePortal
                            id="vendor-code"
                            options={vendors}
                            getOptionLabel={(option) => option.vendorCode}
                            renderInput={(params) => (
                                <TextField
                                    required
                                    {...params}
                                    inputProps={{
                                        ...params.inputProps,
                                        autoComplete: "new-password",
                                        style: { width: "auto" },
                                    }}
                                    label="Vendor Code"
                                />
                            )}
                            size="small"
                            value={vendor}
                            onChange={(e, newValue) => updateVendor(newValue)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Autocomplete
                            required
                            disablePortal
                            id="company-name"
                            options={vendors}
                            getOptionLabel={(option) => option.companyName}
                            renderInput={(params) => (
                                <TextField
                                    required
                                    {...params}
                                    inputProps={{
                                        ...params.inputProps,
                                        autoComplete: "new-password",
                                        style: { width: "auto" },
                                    }}
                                    label="Company Name"
                                />
                            )}
                            size="small"
                            value={vendor}
                            onChange={(e, newValue) => updateVendor(newValue)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id="product-category"
                            label="Product Category"
                            value={vendor ? vendor.productCategory : ""}
                            InputProps={{
                                readOnly: true,
                            }}
                            fullWidth
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id="country"
                            label="Country"
                            value={vendor ? vendor.address.country : ""}
                            InputProps={{
                                readOnly: true,
                            }}
                            fullWidth
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id="state"
                            label="State"
                            value={vendor ? vendor.address.state : ""}
                            InputProps={{
                                readOnly: true,
                            }}
                            fullWidth
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Autocomplete
                            required
                            disablePortal
                            id="currency"
                            options={currencyList}
                            renderInput={(params) => (
                                <TextField
                                    required
                                    {...params}
                                    inputProps={{
                                        ...params.inputProps,
                                        autoComplete: "new-password",
                                        style: { width: "auto" },
                                    }}
                                    label="Currency"
                                />
                            )}
                            value={currency}
                            size="small"
                            onChange={(e, newValue) =>
                                setCurrency(newValue)
                            }
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id="estimated-delivery-dates"
                            label="Estimated Delivery Dates"
                            value={estimatedDeliveryDate}
                            fullWidth
                            size="small"
                            onChange={(e) =>
                                setEstimatedDeliveryDate(e.target.value)
                            }
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            id="payment-terms"
                            label="Payment Terms"
                            value={paymentTerms}
                            fullWidth
                            size="small"
                            onChange={(e) =>
                                setPaymentTerms(e.target.value)
                            }
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            required
                            id="created-by"
                            label="Your Email"
                            value={createdBy}
                            fullWidth
                            size="small"
                            onChange={(e) =>
                                setCreatedBy(e.target.value)
                            }
                            type="email"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Attachment
                            label="Upload SKU Sheet"
                            file={buyingAtt}
                            updateFile={(file) => updateFile(file)}
                            required={true}
                            submit={submit}
                            fileType=".xlsx"
                        />
                    </Grid>
                    {excelData.length > 0 && <Grid item xs={12}>
                        <TableContainer component={Paper}>
                            <Table style={{ tableLayout: 'auto' }} size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        {excelData[0].slice(1).map((tableHead, i) => <TableCell key={i}>{tableHead}</TableCell>)}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {excelData.slice(1).map((row, i) => (
                                        <TableRow
                                            key={i}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            {row.map((value, i) => <TableCell style={{ whiteSpace: "nowrap" }} key={i}>{value}</TableCell>)}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>}
                    <Grid item xs={6}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            fullWidth
                            onClick={previewPO}
                        >
                            Preview PO
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            size="small"
                            fullWidth
                        >
                            Send PO For Verification
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
}
