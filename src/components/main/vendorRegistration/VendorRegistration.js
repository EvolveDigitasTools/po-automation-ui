import React, { useState } from "react";
import { TextField, Box, Button, Stack } from "@mui/material";

export default function VendorRegistration() {
  const [companyName, setCompanyName] = useState("");
  const [gst, setGst] = useState("");
  const [gstAttachment, setGstAttachment] = useState(null);
  const [address, setAddress] = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [bankName, setBankName] = useState("");
  const [branch, setBranch] = useState("");
  const [bankAttachment, setBankAttachment] = useState(null);
  const [coi, setCoi] = useState("");
  const [coiAttachment, setCoiAttachment] = useState(null);
  const [msme, setMsme] = useState("");
  const [msmeAttachment, setMsmeAttachment] = useState(null);
  const [tradeMark, setTradeMark] = useState("");
  const [tradeAttachment, setTradeAttachment] = useState(null);
  const [agreement, setAgreement] = useState("");
  const [agreementAttachment, setAgreementAttachment] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Do something with the form data, like sending it to a server
  };

  return (
    <div>
      <h1>Vendor Registration</h1>
      <Stack component="form" onSubmit={handleSubmit}>
        <TextField
          required
          id="company-name"
          label="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <Box>
          <TextField
            required
            id="gst"
            label="GST"
            value={gst}
            onChange={(e) => setGst(e.target.value)}
          />
          <TextField
            required
            id="gst-attch"
            type="file"
            onChange={(e) => setGstAttachment(e.target.files[0])}
          />
        </Box>
        <TextField
          required
          id="address"
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <Box>
          <TextField
            required
            id="beneficiary"
            label="Beneficiary Name"
            value={beneficiary}
            onChange={(e) => setBeneficiary(e.target.value)}
          />
          <TextField
            required
            id="ac-num"
            label="Account Number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
          <TextField
            required
            id="ifsc"
            label="IFSC"
            value={ifsc}
            onChange={(e) => setIfsc(e.target.value)}
          />
          <TextField
            required
            id="bank-name"
            label="Bank Name"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
          />
          <TextField
            required
            id="branch"
            label="Branch"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          />
          <TextField
            required
            type="file"
            id="bank-attch"
            onChange={(e) => setBankAttachment(e.target.files[0])}
          />
        </Box>
        <Box>
          <TextField
            required
            id="coi"
            label="COI"
            value={coi}
            onChange={(e) => setCoi(e.target.value)}
          />
          <TextField
            type="file"
            id="coi-attch"
            onChange={(e) => setCoiAttachment(e.target.files[0])}
          />
        </Box>
        <Box>
          <TextField
            required
            id="msme"
            label="MSME"
            value={msme}
            onChange={(e) => setMsme(e.target.value)}
          />
          <TextField
            type="file"
            id="msme-attch"
            onChange={(e) => setMsmeAttachment(e.target.files[0])}
          />
        </Box>
        <Box>
          <TextField
            required
            id="trade-mark"
            label="Trade Mark"
            value={tradeMark}
            onChange={(e) => setTradeMark(e.target.value)}
          />
          <TextField
            required
            type="file"
            id="trade-attch"
            onChange={(e) => setTradeAttachment(e.target.files[0])}
          />
        </Box>
        <Box>
          <TextField
            required
            id="agreement"
            label="Signed and Stamped Agreement by Both Parties"
            value={agreement}
            onChange={(e) => setAgreement(e.target.value)}
          />
          <TextField
            required
            type="file"
            id="msme-attch"
            onChange={(e) => setAgreementAttachment(e.target.files[0])}
          />
        </Box>
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </Stack>
    </div>
  );
}
