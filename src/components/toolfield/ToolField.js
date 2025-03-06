import { TextField } from "@mui/material";

export default function ToolField(props) {
    return <TextField
        InputProps={{
            readOnly: props.readOnly ? true : false
        }}
        id={props.id}
        label={props.label}
        value={props.value}
        fullWidth
        required={props.isRequired}
        size="small"
        onChange={(e) => props.onFieldChange(e.target.value)}
     />
}