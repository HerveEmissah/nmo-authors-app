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
      res2Message2: 'If you think a correction is needed, please contact '
    }
  };

  render() {

    return (
      <div className="App">
        <BibliometricApp
          onResult={results => {
            this.setState({ citations: [] })
            this.setState({ citations: results })

            console.log(results)
            console.log(this.state.citations)

          }}
        />

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
                      <div align="left"> <u><b>NMO Describing</b></u> <b>pmid:</b>{item.data.pmid} / <b>doi:</b>{item.data.doi}</div>
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
                   <div align="left"> <u><b>NMO Describing id: </b></u> {item.id}
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
                   <div align="left"> <u><b>NMO Describing id: </b></u> {item.id}
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
