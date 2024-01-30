import {
    Button,
    ButtonGroup,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Snackbar,
    Alert
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./poRecords.css";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
    { field: 'poCode', headerName: 'PO Code', width: 150 },
    { field: 'updatedAt', headerName: 'Last Updated At', width: 150 }
];

const buttonStyle = {
    textTransform: "none",
};

export default function Main() {
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [pos, setPOS] = useState([]);
    const [selectedRow, setSelectedRow] = useState("");
    const navigate = useNavigate();

    //ComponentDidMount
    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER_URL}buying-order/approved-pos`)
            .then((response) => response.json())
            .then((res) => {
                setPOS(res.data.pos)
            })
            .catch((error) => {
                console.error("API error:", error);
            });

        return () => {
            // This code will run when the component is unmounted
            // You can perform any cleanup tasks here, such as unsubscribing from subscriptions
            console.log("Component unmounted");
        };
    }, []);

    const handleClick = () => {
        // Your validation or action
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    function vendorRegistration() {
        navigate("/admin/vendor-registration");
    }

    function showDetails(vendorRow) {
        navigate(`/admin/vendor/${vendorRow}`);
    }

    function showPORecords() {
        navigate('/admin/po-records');
    }

    function addSKUs() {
        if (selectedRow) navigate(`/admin/new-skus/${selectedRow}`);
        else navigate(`/admin/new-skus/new`);
    }

    function addBuyingOrder() {
        if (selectedRow) navigate(`/admin/new-buying-order/${selectedRow}`);
        else navigate(`/admin/new-buying-order/new`);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const changeRowSelection = (rowCode) => {
        if (selectedRow === rowCode) setSelectedRow("");
        else setSelectedRow(rowCode);
    };

    return (
        <div>
            <ButtonGroup
                variant="contained"
                aria-label="outlined primary button group"
                style={{ float: 'right', padding: '10px' }}
            >
                <Button onClick={handleClick} style={buttonStyle}>View PO</Button>
                <Button onClick={handleClick} style={buttonStyle}>Download Reconcillation Sheet</Button>
                <Button onClick={handleClick} style={buttonStyle}>Upload Reconcillation Sheet</Button>
            </ButtonGroup>

            <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <DataGrid
                    rows={pos}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    rowSelectionModel={[]}
                    sele
                />
            </Paper>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                seve
                onClose={handleClose}
            >
                <Alert severity="info">Please select one PO Record</Alert>
            </Snackbar>
        </div>
    );
}
