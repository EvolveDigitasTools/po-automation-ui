import { Paper, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./poRecords.css";
import { CiCalculator2 } from "react-icons/ci";
import { IoEye } from "react-icons/io5";
import { MdDownloadForOffline } from "react-icons/md";
import { DataGrid } from "@mui/x-data-grid";
import { ArrowBack } from "@mui/icons-material";
import { formatNumberIndianSystem } from "../../../utilities/utils";

const columns = [
    { field: "poCode", headerName: "PO Number", width: 100 },
    { field: "vendorCode", headerName: "Vendor Code", width: 100 },
    { field: "vendorName", headerName: "Name", width: 400 },
    { field: "units", headerName: "Units", width: 100 },
    { field: "amount", headerName: "Amount", width: 100 },
    { field: "status", headerName: "Status", width: 100 },
    {
        field: "grn",
        headerName: "Reconcile",
        width: 100,
        renderCell: (cellValues) => {
            return (
                <IconButton aria-label="Reconcile" className="po-icons">
                    <CiCalculator2 />
                </IconButton>
            );
        },
    },
    {
        field: "view-po",
        headerName: "View PO",
        width: 100,
        renderCell: (cellValues) => {
            return (
                <IconButton aria-label="View PO" className="po-icons">
                    <IoEye />
                </IconButton>
            );
        },
    },
    {
        field: "download-po",
        headerName: "Download PO",
        width: 120,
        renderCell: (cellValues) => {
            return (
                <IconButton aria-label="Download PO" className="po-icons">
                    <MdDownloadForOffline />
                </IconButton>
            );
        },
    },
];

export default function Main() {
    const [pos, setPOS] = useState([]);
    // const navigate = useNavigate();

    //ComponentDidMount
    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER_URL}reconcillation/approved-pos`)
            .then((response) => response.json())
            .then((res) => {
                res.data.pos.map(
                    (record) =>
                        (record.amount = formatNumberIndianSystem(
                            record.amount
                        ))
                );
                res.data.pos.map((record) => (record.grn = "Upload GRN"));
                setPOS(res.data.pos);
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

    // const onRowDoubleClick = (row) => {
    //     navigate(`/admin/po-records/${row.row.poCode}`);
    // };

    return (
        <div class="po-records">
            <Link to="/admin">
                <IconButton edge="start" color="inherit" aria-label="back">
                    <ArrowBack />
                    Back
                </IconButton>
            </Link>
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
                />
            </Paper>
        </div>
    );
}
