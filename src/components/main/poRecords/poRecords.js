import { Paper, IconButton, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./poRecords.css";
import { CiCalculator2 } from "react-icons/ci";
import { MdDownloadForOffline } from "react-icons/md";
import { DataGrid } from "@mui/x-data-grid";
import { ArrowBack } from "@mui/icons-material";
import { formatNumberIndianSystem } from "../../../utilities/utils";
import { binaryStringToBlob, getMimeTypeFromFileName } from "../../../util";

export default function Main() {
    const [pos, setPOS] = useState([]);
    const [downloadPOLoadingId, setDownloadPOLoadingId] = useState(0);
    const navigate = useNavigate();

    //ComponentDidMount
    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER_URL}reconcillation/all-pos`)
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
                return cellValues.row.status === "Unverified" ? (
                    <div></div>
                ) : (
                    <IconButton
                        aria-label="Reconcile"
                        className="po-icons"
                        onClick={() => reconcile(cellValues.row.poCode)}
                    >
                        <CiCalculator2 />
                    </IconButton>
                );
            },
        },
        {
            field: "download-po",
            headerName: "Download PO",
            width: 120,
            renderCell: (cellValues) => {
                return cellValues.id === downloadPOLoadingId ? (
                    <div className="po-icons">
                        <CircularProgress size={30} />
                    </div>
                ) : (
                    <IconButton
                        aria-label="Download PO"
                        className="po-icons"
                        onClick={() => downloadPO(cellValues.id)}
                    >
                        <MdDownloadForOffline />
                    </IconButton>
                );
            },
        },
    ];

    const downloadPO = (poId) => {
        if (downloadPOLoadingId !== 0) {
            alert("Please wait one file to download");
            return;
        }
        setDownloadPOLoadingId(poId);
        const fileDetailsUrl = `${
            process.env.REACT_APP_SERVER_URL
        }file/${"buyingOrderId"}/${poId}`;
        fetch(fileDetailsUrl)
            .then((res) => res.json())
            .then((data) => {
                let file = data.data.file;
                let nFile = new File(
                    [
                        binaryStringToBlob(
                            file.fileContent,
                            getMimeTypeFromFileName(file.fileName)
                        ),
                    ],
                    file.fileName,
                    { type: getMimeTypeFromFileName(file.fileName) }
                );
                const url = URL.createObjectURL(nFile);
                const a = document.createElement("a");
                a.href = url;
                a.download = nFile.name;
                a.click();
                URL.revokeObjectURL(url);
                setDownloadPOLoadingId(0);
            });
    };

    const reconcile = (poCode) => {
        navigate(poCode);
    };

    return (
        <div className="po-records">
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
