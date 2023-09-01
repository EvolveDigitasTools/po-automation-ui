import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const columns = [
    { id: "vendorCode", label: "Vendor Code", minWidth: 170 },
    { id: "companyName", label: "Company Name", minWidth: 170 },
    { id: "state", label: "State", minWidth: 170 },
    { id: "country", label: "Country", minWidth: 170 },
    { id: "productCategory", label: "Product Category", minWidth: 170}
    // { id: "beneficiary", label: "Beneficiary Name", minWidth: 170 },
    // { id: "accountNumber", label: "Account Number", minWidth: 170 },
    // { id: "ifsc", label: "IFSC", minWidth: 170 },
    // { id: "bankName", label: "Bank Name", minWidth: 170 },
    // { id: "branch", label: "Branch", minWidth: 170 },
    // { id: "coi", label: "COI", minWidth: 170 },
    // { id: "msme", label: "MSME", minWidth: 170 },
    // { id: "tradeMark", label: "Trade Mark", minWidth: 170 },
    // { id: "agreement", label: "Agreement", minWidth: 170 },
];

export default function Main() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [vendors, setVendors] = useState([]);
    const [selectedRow, setSelectedRow] = useState("");
    const navigate = useNavigate();

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

        return () => {
            // This code will run when the component is unmounted
            // You can perform any cleanup tasks here, such as unsubscribing from subscriptions
            console.log("Component unmounted");
        };
    }, []);

    function vendorRegistration() {
        navigate("/vendor-registration");
    }

    function showDetails() {
        navigate(`/vendor/${selectedRow}`)
    }

    function addSKUs() {
        navigate(`/new-skus/${selectedRow}`);
    }

    function addBuyingOrder() {
        navigate(`/new-buying-order/${selectedRow}`);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const changeRowSelection = (rowCode) => {
        if(selectedRow === rowCode)
        setSelectedRow("");
        else
        setSelectedRow(rowCode);
    }

    return (
        <div>
            <button onClick={vendorRegistration}>Vendor Registration</button>
            {selectedRow != "" && <button onClick={showDetails}>Show Details</button>}
            {selectedRow != "" && <button onClick={addSKUs}>Add SKUs</button>}
            {selectedRow != "" && <button onClick={addBuyingOrder}>Add Buying Order</button>}
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {vendors
                                .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                )
                                .map((row) => {
                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={row.vendorCode}
                                            selected={row.vendorCode === selectedRow}
                                            onClick={() => changeRowSelection(row.vendorCode)}
                                        >
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell
                                                        key={column.id}
                                                        align={column.align}
                                                    >
                                                        {column.format &&
                                                        typeof value ===
                                                            "number"
                                                            ? column.format(
                                                                  value
                                                              )
                                                            : value}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={vendors.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    );
}
