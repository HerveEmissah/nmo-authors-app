import React, { Component }  from "react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class NoIDnotification extends Component {
    constructor(props){
        super(props)
        this.state = {
             open: true
        }
    }

    handleClickOpen = () => {
        this.setState({ open:false });
    };

    handleClose = () => {
      this.setState({ open:false });

    };

    render(){
        return (
            <div align="left">
              <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Please enter a valid describing PMID or DOI.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleClose} color="primary">
                    OK
                  </Button>
                </DialogActions>
              </Dialog>
          </div>
        );
    }
}

export default NoIDnotification;
