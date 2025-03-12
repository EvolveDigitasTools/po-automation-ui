export const skuFields = [
    { label: "SKU Code", key: "skuCode", required: true },
    { label: "Category", key: "category", required: true },
    { label: "Sub Category", key: "subCategory" },
    { label: "Product Title", key: "productTitle", required: true },
    { label: "SAP Code", key: "sapCode" },
    { label: "HSN", key: "hsn", type: "number" },
    { label: "EAN", key: "ean", type: "number" },
    { label: "Model Number", key: "modelNumber" },
    { label: "Size", key: "size" },
    { label: "Color", key: "colorFamilyColor" },
    { label: "Prdct L(cm)", key: "productLengthCm", type: "number" },
    { label: "Prdct B(cm)", key: "productBreadthCm", type: "number" },
    { label: "Prdct H(cm)", key: "productHeightCm", type: "number" },
    { label: "Wght(kg)", key: "productWeightKg", type: "number" },
    { label: "MSTRCTN Box Qty", key: "masterCartonQty", type: "number" },
    { label: "MSTRCTN L(cm)", key: "masterCartonLengthCm", type: "number" },
    { label: "MSTRCTN B(cm)", key: "masterCartonBreadthCm", type: "number" },
    { label: "MSTRCTN H(cm)", key: "masterCartonHeightCm", type: "number" },
    { label: "MSTRCTN Wght(kg)", key: "masterCartonWeightKg", type: "number" },
    { label: "MRP", key: "mrp", type: "number" },
    { label: "GST(%)", key: "gst", type: "number" },
];

export const boFields = [
    { label: "SKU Code*", key: "skuCode" },
    { label: "expected_qty*", key: "expectedQty" },
    { label: "unit_cost*", key: "unitCost" },
    { label: "GST_%*", key: "gst" },
];

export const reconcillationFields = [
    { label: "SR No", key: "index", formula: 'index'},
    { label: "SKU Code", key: "skuCode" },
    { label: "Product Title", key: "productTitle" },
    { label: "Category*", key: "category" },
    { label: "Brand", key: "brand" },
    { label: "Color", key: "colorFamilyColor" },
    { label: "Expected Quantity", key: "eQty", isNumeric: true },
    { label: "Recieved Quantity", key: "rQty", isNumeric: true },
    { label: "Short", key: "short", isNumeric: true },
    { label: "Damaged", key: "damaged", isNumeric: true },
    { label: "Excess", key: "excess", isNumeric: true },
    { label: "Unit Cost", key: "unitCost", isNumeric: true },
    { label: "GST per Unit", key: "totalGST", isNumeric: true },
    { label: "Amount", key: "amount", formula: '=IF(ISBLANK(H$), "",H$*(L$+M$))', isNumeric: true },
];

export const indianCurrencyFormatForWhole = '[>=10000000]##\\,##\\,##\\,##0;[>=100000]##\\,##\\,##0;##,##0';
export const indianCurrencyFormatForDecimal = '[>=10000000]##\\,##\\,##\\,##0.00;[>=100000]##\\,##\\,##0.00;##,##0.00';

export const currencyList = ["INR", "USD", "AED", "SAR", "TAKA"];
