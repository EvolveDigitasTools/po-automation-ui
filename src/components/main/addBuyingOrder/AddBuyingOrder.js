import ExcelJS from "exceljs";

export default function AddBuyingOrder() {
    const generateExcel = async () => {
        // Create a new workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Order Details");

        // Define the data
        const data = [
            [],
            [
                "",
                "Ansan Technologies Pvt Ltd"
            ],
            [
                "",
                "Partner Name :",
                "",
                "XYZ",
                "",
                "",
                "",
                "BU :",
                "Pluugin"
            ],
            [
                "",
                "Partner Code :",
                "",
                "PEXYZ",
                "",
                "",
                "",
                "P.O No :", 
                "PE123"
            ],
            [
                "",
                "Partner Address :",
                "",
                "XYZ",
                "",
                "",
                "",
                "BM :",
                "E-Commerce"
            ],
            [
                "",
                "Contact Person :",
                "",
                "XYZ",
                "",
                "",
                "",
                "Currency :",
                "INR"
            ],
            [
                "",
                "Contact No :",
                "",
                "XYZ",
                "",
                "",
                "",
                "Date :",
                "XYZ - Current Date"
            ],
            [
                "",
                "Payment Terms :",
                "",
                "XYZ",
                "",
                "",
                "",
                "Buyer :",
                "XYZ - Email"
            ],
            [
                "",
                "GST No:",
                "",
                "XYZ",
                "",
                "",
                "",
                "GST No:",
                "XYZ"
            ],
            [
                "",
                "State Name and Code:",
                "",
                "XYZ",
                "",
                "",
                "",
                "State Name and Code:",
                "XYZ"
            ],
            [
                "",
                "Estimated Delivery Date :",
                "",
                "XYZ",
                "",
                "",
                "",
                "CIN:",
                "XYZ",
            ],
            [
                "",
                "Bill To :",
                "XYZ",
                "",
                "",
                "",
                "",
                "Ship To :",
                "XYZ"
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
            [
                "",
                1,
                "WPC-TTHOL-250ML",
                "WPC Tea Tree Hair Oil 250 ML",
                8906064134656,
                "WPCTTHOIL",
                "Beauty",
                "WPC",
                "None",
                "Black - Black",
                5,
                5,
                "",
                "9%",
                2.25,
                "9%",
                2.25,
                25.0,
            ],
            [
                2,
                "WPC-TTHOL-250ML",
                "WPC Tea Tree Hair Oil 250 ML",
                8906064134656,
                "WPCTTHOIL",
                "Beauty",
                "WPC",
                "None",
                "Black - Black",
                10,
                5,
                "",
                "9%",
                4.5,
                "9%",
                4.5,
                50.0,
            ],
            [
                3,
                "WPC-TTHOL-250ML",
                "WPC Tea Tree Hair Oil 250 ML",
                8906064134656,
                "WPCTTHOIL",
                "Beauty",
                "WPC",
                "None",
                "Black - Black",
                15,
                5,
                "",
                "9%",
                6.75,
                "9%",
                6.75,
                75.0,
            ],
            [
                4,
                "WPC-TTHOL-250ML",
                "WPC Tea Tree Hair Oil 250 ML",
                8906064134656,
                "WPCTTHOIL",
                "Beauty",
                "WPC",
                "None",
                "Black - Black",
                20,
                5,
                "",
                "9%",
                9.0,
                "9%",
                9.0,
                100.0,
            ],
            [
                5,
                "WPC-TTHOL-250ML",
                "WPC Tea Tree Hair Oil 250 ML",
                8906064134656,
                "WPCTTHOIL",
                "Beauty",
                "WPC",
                "None",
                "Black - Black",
                25,
                5,
                "",
                "9%",
                11.25,
                "9%",
                11.25,
                125.0,
            ],
        ];

        // Add data to the worksheet
        data.forEach((row) => {
            worksheet.addRow(row);
        });

        worksheet.mergeCells('B2', 'S2');

        worksheet.mergeCells('B3', 'C3');
        worksheet.mergeCells('B4', 'C4');
        worksheet.mergeCells('B5', 'C5');
        worksheet.mergeCells('B6', 'C6');
        worksheet.mergeCells('B7', 'C7');
        worksheet.mergeCells('B8', 'C8');
        worksheet.mergeCells('B9', 'C9');
        worksheet.mergeCells('B10', 'C10');
        worksheet.mergeCells('B11', 'C11');

        worksheet.mergeCells('D4', 'G4');
        worksheet.mergeCells('D3', 'G3');
        worksheet.mergeCells('D5', 'G5');
        worksheet.mergeCells('D6', 'G6');
        worksheet.mergeCells('D7', 'G7');
        worksheet.mergeCells('D8', 'G8');
        worksheet.mergeCells('D9', 'G9');
        worksheet.mergeCells('D10', 'G10');
        worksheet.mergeCells('D11', 'G11');
        worksheet.mergeCells('C12', 'G12')

        worksheet.mergeCells('I3', 'S3');
        worksheet.mergeCells('I4', 'S4');
        worksheet.mergeCells('I5', 'S5');
        worksheet.mergeCells('I6', 'S6');
        worksheet.mergeCells('I7', 'S7');
        worksheet.mergeCells('I8', 'S8');
        worksheet.mergeCells('I9', 'S9');
        worksheet.mergeCells('I10', 'S10');
        worksheet.mergeCells('I11', 'S11');
        worksheet.mergeCells('12', 'S12');

        // Set the columns' widths
        worksheet.columns.forEach((column) => {
            column.width = 15;
        });

        const blob = await workbook.xlsx.writeBuffer();

        // Create a URL for the Blob and create a temporary anchor element to trigger download
        const url = URL.createObjectURL(new Blob([blob]));
        const a = document.createElement("a");
        a.href = url;
        a.download = "po.xlsx";
        a.click();

        // Clean up by revoking the Blob URL
        URL.revokeObjectURL(url);
    };

    return (
        <div>
            <button onClick={generateExcel}>Generate Excel</button>
        </div>
    );
}
