import React, { createRef, Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
//import { createMuiTheme } from '@material-ui/core/styles';
import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import logo from './NMObiblio.png';
import "./App.css";


class BibliometricApp extends Component {

  constructor(props) {
    super(props);
    this.textRef = createRef();

    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      value: 'pmid',
      value_num: null,
      value_radio: 'search',
      nonNull_pmids: [],
      nonNull_dois: [],
      nonNull_IDs: [],
      all_descs: [],
      found_desc_id: false,
      openSubscription: false,
      openNoID: false,
      open: false,
      emailError: '',
      email: '',
      submitted: false,
      checkedItems: new Map(),
      selected: [],
      results: []
    };

    this.handleSubmit =  this.handleSubmit.bind(this);
    //this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleChange = this.handleChange.bind(this)
  }

  handleSubmit(event) {
    event.preventDefault();

    var temp_id = this.state.value_num;
    var id = temp_id.replace(' *', '');
    this.setState({ found_desc_id: false })
    if (id !== '' && id !== null) {
      for (var i=0; i<this.state.all_descs.length; i++){
        if (this.state.all_descs[i].pmid === id && this.state.value === "pmid"){
          this.setState({ found_desc_id: true })
          break;
        }
        if (this.state.all_descs[i].doi === id && this.state.value === "doi"){
          this.setState({ found_desc_id: true })
          break;
        }
      }
    }

    if (id !== '' && id !== null) {
      let desc_id = {
        "id" : id
      }
      this.state.checkedItems.push(desc_id)
    }

    this.setState((state) => ({value_radio: state.value_radio }));
    if (this.value_radio === 'getAlert') {
      if (this.state.checkedItems.length !== 0) {
        this.setState({ openSubscription: true });
        this.setState({ open: true });
        this.setState({ openNoID: false })
      }
      else {
        this.setState({ openNoID: true })
      }
    }
    else {
      this.processArray(this.state.checkedItems)
        .then(() => {
          this.props.onResult(this.state.results)
         }
        )
   } //end else
  }

  async processArray(items) {

    this.setState({ results: [] })
    console.log(items.length)

    for (var i=0; i<items.length; i++) {
            var url = ''
            var found_id = false

            var temp_id = items[i].id
            var id = temp_id.replace(' *', '');

            if (isNaN(id)) {
              url = `/users/NMODescribing_Overall_CitedByNMO_ByID?doi=${id}&source=europepmc`
              for(var k=0; k<this.state.nonNull_IDs.length; k++) {
                if(this.state.nonNull_IDs[k].id.replace(' *', '') === id) {
                  found_id = true
                  break
                }
              }
            }
            else {
             url = `/users/NMODescribing_Overall_CitedByNMO_ByID?pmid=${id}&source=europepmc`
             for(var j=0; j<this.state.nonNull_IDs.length; j++) {
               if(this.state.nonNull_IDs[j].id.replace(' *', '') === id) {
                 found_id = true
                 break
               }
             }
           }

           let resp = await fetch(url)
           let data = await resp.json()
           let ids = {
            'id': id,
            'data': data,
            'desc_flag': found_id
          }
           this.setState({
            results: [...this.state.results, JSON.parse(JSON.stringify(ids))]
          })

    } //end for loop
    return (await Promise.all(this.state.results))

  }

  handleChange = (event, options) => {
      event.persist();
      //const lastAddedItem = options[options.length -1];
      this.setState({ checkedItems: JSON.parse(JSON.stringify(options)) })
  };

  //handleIdSelect = event => {
    //his.setState({ value_num: event.target.value });
  //};

  handleIdChange = event => {
    this.setState({ value_num: event.target.value });

  };

  handleRadioChange  = event => {
    event.preventDefault();
    this.setState({ value_radio: event.target.value });
    //this.setState((state) => ({value_radio: state.value_radio }));
    this.value_radio = event.target.value
  };

  handleClose = () => {
    this.setState({ open: false });
    this.setState({ email: "" });
    this.setState({ openNoID: false });
  };

  changeEmail = (event) => {
    this.setState({
        email: event.target.value
      });
  }

  handleSubscribe = () => {
    if(this.state.email === '' || this.state.email === null){
      this.setState({ emailError: "Email cannot be empty" });
    }
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(this.state.email) && this.state.email.length > 0) {
      this.setState({ emailError: "Enter a valid email" });
    }
    else{
      this.setState({ emailError: "" });
      let data = {};
      data.email = this.state.email;
      // this.props.registerUser(data);
      this.setState({ submitted: true }, () => {
        setTimeout(() => this.setState({ submitted: false }), 5000);
      });

      setTimeout(() => this.setState({ open: false }), 5000);
      setTimeout(() => this.setState({ email: "" }), 5000);

      console.log (data.email)
      console.log (this.state.checkedItems)

      var url = `/users/NMO_Emails?email=` + String(data.email)
      this.postData(url, this.state.checkedItems)
         .then(data => {
            console.log(data); // JSON data parsed by `data.json()` call
         });

    }
  };

  async postData(url, data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }


//handleCheckboxChange(event) {
    //var isChecked = event.target.checked;
    //var item = event.target.value;
    //this.setState(prevState => ({ checkedItems: new Map(prevState.checkedItems.set(item, isChecked)) }));
//}

  componentDidMount() {
    this.getAllDescribing()

      fetch(`/users/NMODescribing_All_CitedBy_NMOs?source=europepmc`)
      .then(res => res.json())
      .then(
        result => {
          console.log("Fetch successful");
          this.setState({
            isLoaded: true,
            items: result
          });

        },
        error => {
          console.error("Fetch error:", error);
          this.setState({
            isLoaded: true,
            error: error
          });
        }
      )
  }

  sendValue = (event) => {
    this.setState({ value_num: this.textRef.value });
  }

  getAllDescribing () {
    var url_desc = `/users/NMODescribingCitedList?source=europepmc`
    fetch(url_desc)
    .then(res => res.json())
    .then(
      result => {
        console.log("Fetch successful");
        this.setState({
          all_descs: result
        });

        for (var i=0; i<this.state.all_descs.length; i++){
          if (this.state.all_descs[i].pmid !== null){
            let pmids = {
              "id" : this.state.all_descs[i].pmid
            }
            this.state.nonNull_pmids.push(pmids);
            this.state.nonNull_IDs.push(pmids);
          }
        }
        for (var j=0; j<this.state.all_descs.length; j++){
          if (this.state.all_descs[j].doi !== null){
            let dois = {
              "id" : this.state.all_descs[j].doi
            }
            this.state.nonNull_dois.push(dois);
            this.state.nonNull_IDs.push(dois);
          }
        }

      },
      error => {
        console.error("Fetch error:", error);
        this.setState({
          error: error
        });
      }
    );
  }

  render() {
    const { error, isLoaded } = this.state;
    const subscribeLabel = "Get alert for PMID/DOI"
    const searchLabel = "Search PMID/DOI"
    const txtLabel = "NeuroMorpho.Org"
    const theme = createTheme({
      palette: {
        primary: {
          main: '#1a237e',
        },
      },
    });
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      console.log(this.state.items);

     return (
        <ul>
          <div align="left">
             <img src={logo} width="400" height="50" alt="logo" />
          </div>
          <form onSubmit={this.handleSubmit}>
           <div align="left">
             <br/>
              <div align="left">
              <br/>
                 <RadioGroup width="100%" row aria-label="search_alert" name="search_alert" defaultValue="search" onChange={this.handleRadioChange}>
                    <FormControlLabel
                       value={"search"}
                       control={<Radio color="primary" />}
                       label={searchLabel}
                       labelPlacement="bottom"
                    />
                    <FormControlLabel
                       value={"getAlert"}
                       control={<Radio color="primary" />}
                       label={subscribeLabel}
                       labelPlacement="bottom"
                    />
                 </RadioGroup>
		          </div>

            </div>
            <table cellPadding="0" cellSpacing="0" width="100%" border="0">
             <tbody>
              <tr>
              <td width="40%">
              <Autocomplete
                  multiple
                  freeSolo
                  id="identifier"
                  clearOnEscape={true}
                  forcePopupIcon={true}
                  disableClearable={false}
                  disableCloseOnSelect
                  options={this.state.nonNull_IDs}
                  getOptionLabel={(option) => option.id}
                  onChange={(e, options)=>{this.handleChange(e, options)}}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={txtLabel}
                      margin="normal"
                      size="small"
                      variant="standard"
                      placeholder="Select ID"
                      value={this.state.value_num}
                      inputRef={element => (this.textRef = element)}
                      style={{ width: '450px' }}
                      //onSelect={this.handleIdSelect}
                      onChange={this.handleIdChange}
                    />
                  )}
                />
              </td>
              <td width="60%" align="left">
              <ThemeProvider theme={theme}>
                <br/>
                <Button type="submit" variant="contained" size="small" color="primary" style={{padding: '5px', margin: '8px'}} value="submit" onClick={this.sendValue}>
                  Submit
                </Button>
              </ThemeProvider>
              </td>
              </tr>
              <tr>
              <td>
                <br/>
                <div align="left">
                  <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                  <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Please enter your email address to get an alert every time this describing gets used or cited.
                    </DialogContentText>
                    <TextField
                       errorText={this.state.emailError}
                       floatingLabelText="Email"
                       hintText="Enter your email"
                       fullWidth
                       value={this.state.email}
                       helperText={this.state.emailError}
                       onChange={this.changeEmail}
                       name="email"
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={this.handleSubscribe} disabled={this.state.submitted} color="primary">
                      {
                        (this.state.submitted && 'Submitting...') || (!this.state.submitted && 'Subscribe')
                      }
                    </Button>
                    <Button onClick={this.handleClose} color="primary">
                      Cancel
                    </Button>
                  </DialogActions>
                </Dialog>
                </div>
                <div>
                {(this.state.openNoID)}
                </div>
              </td>
              </tr>
              </tbody>
              </table>

          </form>

        </ul>

      );
    }
  }
}

export default BibliometricApp;
