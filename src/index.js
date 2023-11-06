import React from "react";
import ReactDOM from "react-dom";
import BibliometricApp from "./App";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import "./index.css";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      citations: [],
      desc_id: '',
      res1Message1: 'To the best of our knowledge, the NeuroMorpho.Org dataset described in this reference has not yet been cited or ',
      res1Message2: 'used in subsequent publications. If you are aware of evidence to the contrary, please contact ',
      res2Message1: 'This reference does not describe a NeuroMorpho.Org dataset.',
      res2Message2: 'If you think a correction is needed, please contact ',
      displayedPmids: new Set(),
      displayedDois: new Set(),
      displayedDownloads: new Set(),
      displayedAvgDownloads: new Set(),
      uniqueRecords: []
    }
  };

  handleUniqueRecords(item) {
    const newUniqueRecords = this.state.citations
      .map((c) => ({
        pmid: c.data && c.data.hasOwnProperty('pmid') ? c.data.pmid : !isNaN(c.id) ? c.id : null,
        doi: c.data && c.data.hasOwnProperty('doi') ? c.data.doi : (Number.isInteger(Number(c.id)) ? null : c.id),
        //Number_of_Downloads: c.data && c.data.hasOwnProperty('Number_of_Downloads') ? c.data.Number_of_Downloads : "N/A",
        Number_of_Downloads: c.data && c.data.hasOwnProperty('Number_of_Downloads') ? (c.data.Number_of_Downloads !== null ? c.data.Number_of_Downloads : 0) : "N/A",
        //Avg_Downloads_Per_Cell: c.data && c.data.hasOwnProperty('Avg_Downloads_Per_Cell') ? c.data.Avg_Downloads_Per_Cell : "N/A",
        Avg_Downloads_Per_Cell: c.data && c.data.hasOwnProperty('Avg_Downloads_Per_Cell') ? (c.data.Avg_Downloads_Per_Cell !== null ? c.data.Avg_Downloads_Per_Cell : 0) : "N/A",
      }));

    this.setState({
      uniqueRecords: newUniqueRecords,
    }, () => {
      console.log(this.state.uniqueRecords);
      console.log(this.state.citations);
    });
  }

  renderTable() {
    return (
      <div style={{
        maxWidth: '450px',
        overflow: 'auto',
        marginRight: '20px',
        marginTop: '100px',
        border: '2px solid black',
        maxHeight: '350px',
      }} align="right">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: '50%' }}><b><u>Describing</u></b></TableCell>
              <TableCell style={{ width: '25%' }}><b><u>Number of Downloads</u></b></TableCell>
              <TableCell style={{ width: '25%' }}><b><u>Average Downloads per Cell</u></b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.uniqueRecords.map((uniqueRecord, key) => (
              <TableRow key={key}>
                <TableCell component="th" scope="row">
                  <div style={{ wordBreak: 'break-all' }}>
                    {uniqueRecord.pmid && (<div>  <b>pmid:</b>{uniqueRecord.pmid} <br /> </div>)}
                    {uniqueRecord.doi && (<div> <b>doi:</b>{uniqueRecord.doi} </div>)}
                  </div>
                </TableCell>
                <TableCell>
                  <div style={{ wordBreak: 'break-all' }}>
                    {uniqueRecord.Number_of_Downloads}
                  </div>
                </TableCell>
                <TableCell>
                  <div style={{ wordBreak: 'break-all' }}>
                    {uniqueRecord.Avg_Downloads_Per_Cell}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }


  render() {
    const isUniqueRecordsEmpty = this.state.uniqueRecords.length === 0;

    return (
     <div className="App">
       <div style={{ width: '100%', justifyContent: 'space-between', display: 'flex', flexDirection: 'row' }}>
        <div style={{ flex: 1 }} align="right">
          <BibliometricApp
            onResult={results => {
              this.setState({ citations: [] })
              this.setState({ citations: results })

              this.setState({ citations: results }, () => {
                  this.handleUniqueRecords();
              });

              console.log(results)
              console.log(this.state.citations)
            }}
          />
        </div>

        <div>
            {this.state.citations.map((item, key) => {
                if (!this.state.displayedPmids.has(item.data.pmid) &&
                    !this.state.displayedDois.has(item.data.doi)) {
                  this.state.displayedPmids.add(item.data.pmid);
                  this.state.displayedDois.add(item.data.doi);
                  this.state.displayedDownloads.add(item.data.Number_of_Downloads);
                  this.state.displayedAvgDownloads.add(item.data.Avg_Downloads_Per_Cell);

                  this.handleUniqueRecords(item);
                }
              return null; // Don't render div if condition not met
            })}
            { !isUniqueRecordsEmpty && this.renderTable() }
          </div>
        </div>

        <div>
           {
            <div>
              <br></br>
              {this.state.citations.map((item, key) => {
                if (item.desc_flag === true) {
                if (item.data.length !== 0) {
                return (
                    <Paper className="container">
                      <br/><br/>
                      <div style={{ marginLeft: '5px' }} align="left"> <u><b>Describing</b></u> <b>pmid:</b>{item.data.pmid} / <b>doi:</b>{item.data.doi}</div>
                      <Table>
                        <TableHead>
                        <TableRow>
                            <TableCell style={{width: '15%'}}><b><u>Citing/Using id</u></b></TableCell>
                            <TableCell style={{width: '25%'}}><b><u>Authors</u></b></TableCell>
                            <TableCell style={{width: '30%'}}><b><u>Title</u></b></TableCell>
                            <TableCell style={{width: '10%'}}><b><u>Journal Reference</u></b></TableCell>
                            <TableCell style={{width: '20%'}}><b><u>PMID/DOI link</u></b></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {item.data.citedBy.map((citation, key) => {
                              return (
                                <TableRow key={key}>
                                  <TableCell component="th" scope="row" style={{width: '15%'}}>
                                    <b>pmid:</b>{citation.pmid}<br></br><b>doi:</b>{citation.doi}
                                  </TableCell>
                                  <TableCell style={{width: '25%'}}>{citation.authorString}</TableCell>
                                  <TableCell style={{width: '30%'}}>{citation.title}</TableCell>
                                  <TableCell style={{width: '10%'}}>{citation.journalAbbreviation}</TableCell>
                                  <TableCell style={{width: '20%'}}><a href={citation.pmid_link} target="popup" onClick="window.open({data.pmid_link}', 'name')">{citation.pmid_link}</a> <br></br> 
                                                                    <a href={citation.doi_link} target="popup" onClick="window.open({data.doi_link}', 'name')">{citation.doi_link}</a></TableCell>

                                </TableRow>
                              );
                          })}
                        </TableBody>
                      </Table>
                    </Paper>
                );
               }
               else {
                 return (
                  <Paper className="container">
                    <TableHead>
                   <TableRow>
                     <TableCell>
                   <div style={{ marginLeft: '1px', fontSize: '16px' }} align="left"> <u><b>Describing</b></u> <b> id: </b> {item.id}
                      <br/>
                      <div align="left"> <h4>{this.state.res1Message1} {this.state.res1Message2}  {<a href="mailto:nmadmin@gmu.edu">nmadmin@gmu.edu</a>} </h4> </div>
                   </div>
                   </TableCell>
                   </TableRow>
                   </TableHead>
                   </Paper>
                 )
               }
              }
              else {
                return (
                  <Paper className="container">
                    <TableHead>
                   <TableRow>
                     <TableCell>
                   <div style={{ marginLeft: '1px', fontSize: '16px' }} align="left"> <u><b>Describing </b></u>  <b> id: </b> {item.id}
                      <br/>
                      <div align="left"> <h4>{this.state.res2Message1} {this.state.res2Message2}  {<a href="mailto:nmadmin@gmu.edu">nmadmin@gmu.edu</a>} </h4> </div>
                   </div>
                   </TableCell>
                   </TableRow>
                   </TableHead>
                   </Paper>
                 )
              }
              })}
            </div>

           }
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
