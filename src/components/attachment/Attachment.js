import React from 'react';
import { TextField, IconButton, InputAdornment, FormControl, InputLabel, OutlinedInput } from '@mui/material';
import { FileDownload, FileUpload } from '@mui/icons-material';

export default function Attachment({ label, file, updateFile, required, submit }) {
    const uploadFile = () => {
        const input = document.createElement('input');
        input.type = 'file';

        input.onchange = (e) => {
            const selectedFile = e.target.files[0];
            updateFile(selectedFile);
        };

        input.click();
    }

    const viewFile = () => {
        const url = URL.createObjectURL(file);
        window.open(url, "_blank");

        // Clean up by revoking the Blob URL
        URL.revokeObjectURL(url);
    }

    return (
        <TextField
            required
            InputProps={{
                readOnly: true,
                endAdornment:
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="Upload a file"
                            onClick={uploadFile}
                        >
                            <FileUpload />
                        </IconButton>
                        {file && <IconButton
                            aria-label="Open File"
                            onClick={viewFile}
                        >
                            <FileDownload />
                        </IconButton>}
                    </InputAdornment>
            }}
            label={label}
            value={file?.name ? file.name : ""}
            fullWidth
            error = { (required && submit) ? (file ? false : true) : false}
        />
    );
};