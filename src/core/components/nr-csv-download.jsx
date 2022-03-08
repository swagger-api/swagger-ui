import React from "react"
import saveAs from "js-file-download"

export default class NrCsvDownload extends React.PureComponent {

  constructor(props){
    super(props);
    this.validateInput = this.validateInput.bind(this);
    this.csvInputField = React.createRef();
    this.state = {disable: true};
  }

  handleChange = (event) => {
    this.setState({disable: !this.validateInput()});
  }

  validateInput = function(){
    return this.props.data &&
           this.props.data.hasOwnProperty(this.csvInputField.current.value);
  }

  render(){
    const generateCsv = () => {
      var csvJsonProp = this.csvInputField.current.value

      var props ={};

      //extract properties from all entries in the array
      //it is required to do it because of @JsonInclude(Include. NON_NULL) from server side
      this.props.data[csvJsonProp].map((entry, index)=>{
        var objKeys = Object.keys(entry);
        objKeys.map((key, value)=>{
          props[key]=key;
        });
      });

      var csvProps = Object.keys(props);
      var csv ="";
      var row ="";
      //generate csv header
      csvProps.map((key,value)=>{
        row = row + key + ",";
      });
      csv = row.slice(0, -1) + "\r\n";

      //generate each row from json array
      this.props.data[this.csvInputField.current.value].map((entry, index)=>{
        row = "";
        csvProps.map((key, value)=>{
          var column = "";
          if(entry.hasOwnProperty(key) && entry[key] != null){
            column = entry[key];
          }
          row = row + '"' + column + '",';
        });
        csv = csv + row.slice(0, row.length -1) + "\r\n";
      });

      var fileName = csvJsonProp + "_" + new Date().toISOString().slice(0,10).replace(/-/g, "") + ".csv";

      saveAs(csv, fileName);
    }

    return (
      <div className="highlight-code">
        {
          <input type="text" placeholder="JSON property " ref={this.csvInputField} onChange= {this.handleChange}/>
        }
        {
          <button className="download-nr" disabled={this.state.disable} onClick={generateCsv}>
            Download CSV
          </button>
        }
      </div>
    );
  }
}
