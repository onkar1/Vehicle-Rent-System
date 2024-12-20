import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

const MessageModal = ({ open, message, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose}
            sx={{
                '& .MuiDialog-paper': {
                    position: 'absolute',
                    top: 0, // Aligns the modal to the top of the page
                    marginTop: '10px', // Adjust this value as needed to add space from the top
                }
            }}
        >
            <DialogTitle>Message</DialogTitle>
            <DialogContent>
                <p>{message}</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MessageModal;
