import { Button, Dialog, DialogTitle, TextField } from '@material-ui/core';
import React, { useState } from "react";
import "./depw.css";

// Component that presents a dialog to collect credentials from the user
export default function Depw({
    open,
    onSubmit,
    onClose,
    title,
    submitText,
}) {
    let [usdi, setusdi] = useState(0);
    let [lbpi, setlbpi] = useState(0);
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <div className="dialog-container">
        <DialogTitle>{title}</DialogTitle>
        <div className="form-item">
            <TextField
                fullWidth
                label="Usd"
                type="number"
                value={usdi}
                onChange={({ target: { value } }) => setusdi(value)}
            />
        </div>
        <div className="form-item">
            <TextField
                fullWidth
                label="LBP"
                type="number"
                value={lbpi}
                onChange={({ target: { value } }) => setlbpi(value)}
            />
        </div>
        <Button
            color="primary"
            variant="contained"
            onClick={() => onSubmit(usdi, lbpi)}
        >{submitText}
        </Button>
        </div>
            </Dialog>
        );
    }
             