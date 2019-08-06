import React,{Component} from 'react';
import EightBitDisplay from '../LedDisplay/EightBitDisplay';
import FourBitDisplay from './../LedDisplay/FourBitDisplay';
import SixteenByteRAMDataDisplay from './SixteenByteRAMDataDisplay'
import Switch from './../Basic/Switch'
import './SixteenByteRAM.css'
import RAMFileUpload from '../FileUpload/RAMFileUpload';
import Button from '../Basic/Button'

class SixteenByteRAM extends Component{
 
    constructor() {
        super();
        this.state = {
          showPopup: false
        };
      }

      togglePopup() {
        this.setState({
          showPopup: !this.state.showPopup
        });
      }

      downloadFile() {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.props.ramData.map(this.props.dec2bin).join('\r\n')));
        element.setAttribute('download', 'ROM_Bytes.txt');
      
        element.style.display = 'none';
        document.body.appendChild(element);
      
        element.click();
      
        document.body.removeChild(element);
      }

    render(){

        return(
               
                <div className="sixteenBitRAM">
                 RAM
                  <br></br>
                  Mode : 
                  <select value={this.props.ramMode} onChange={this.props.onRAMModeSelect}>
                        <option value="Run">Run</option>
                        <option value="Program">Program</option>
                        <option value="File Upload">File Upload</option>
                    </select>
                  <table>
                    <tbody>
                    <tr>
                        <td>
                        Value : {this.props.ramData[this.props.ramAddress]}
                        </td>
                        <td>
                        <EightBitDisplay displayValue={this.props.dec2bin(this.props.ramData[this.props.ramAddress])}></EightBitDisplay>
                        </td>
                      </tr>
                      <tr>
                        <td>
                        Address :  {this.props.ramAddress}
                        </td>
                        <td>
                          <FourBitDisplay displayValue={this.props.dec2binFourBit(this.props.ramAddress)}></FourBitDisplay>
                        </td>
                      </tr>

                    </tbody>
                  </table>
                  {this.getModeBasedPanel(this.props.ramMode)}
                
                <br></br>

                </div>
        );
    }

    getModeBasedPanel(mode){
        if(mode === 'Program'){
          let ramAddressBinaryValue = this.props.dec2binFourBit(this.props.ramAddress);
          let ramDataBinaryValue = this.props.dec2bin(this.props.ramProgramData);
          return(
            <div>

            <table>
              <tbody>
                
              <tr>
                  <td>
                  Enter data : 
                  </td>
                  <td colSpan="2">
                  <Switch switchState={ramDataBinaryValue[0]} onClick={this.props.loadRAMDataInput} switchPosition="7"></Switch>
                  <Switch switchState={ramDataBinaryValue[1]} onClick={this.props.loadRAMDataInput} switchPosition="6"></Switch>
                  <Switch switchState={ramDataBinaryValue[2]} onClick={this.props.loadRAMDataInput} switchPosition="5"></Switch>
                  <Switch switchState={ramDataBinaryValue[3]} onClick={this.props.loadRAMDataInput} switchPosition="4"></Switch>
                  <Switch switchState={ramDataBinaryValue[4]} onClick={this.props.loadRAMDataInput} switchPosition="3"></Switch>
                  <Switch switchState={ramDataBinaryValue[5]} onClick={this.props.loadRAMDataInput} switchPosition="2"></Switch>
                  <Switch switchState={ramDataBinaryValue[6]} onClick={this.props.loadRAMDataInput} switchPosition="1"></Switch>
                  <Switch switchState={ramDataBinaryValue[7]} onClick={this.props.loadRAMDataInput} switchPosition="0"></Switch>

                  </td>

                </tr>
                <tr>
                  <td>
                  Select Address :
                  </td>
                  <td>
                  <Switch switchState={ramAddressBinaryValue[0]} onClick={this.props.loadRAMAddressInput} switchPosition="3"></Switch>
                 <Switch switchState={ramAddressBinaryValue[1]} onClick={this.props.loadRAMAddressInput} switchPosition="2"></Switch>
                <Switch switchState={ramAddressBinaryValue[2]} onClick={this.props.loadRAMAddressInput} switchPosition="1"></Switch>
                  <Switch switchState={ramAddressBinaryValue[3]} onClick={this.props.loadRAMAddressInput} switchPosition="0"></Switch>
                 
                 </td>
                  <td>
                  
                  </td>
                </tr>
                <tr>
                        <td>
                        <button onClick={this.props.clearRAMAddressInput}>Clear Address</button>
                        </td>
                        <td>
                        <button onClick={this.props.clearRAMInputData}>Clear Data</button>
                        </td>
                        <td>
                        <button onClick={this.props.downloadRamData}>Download Byte</button>
                        </td>
                </tr>
                <tr>
                         <td>
                        <button onClick={this.props.decrementRAMAddress}>Address--</button>
                        </td>
                        <td>
                        <button onClick={this.props.incrementRAMAddress}>Address++</button>
                        </td>
                        <td>
                        <button onClick={this.props.updateRamData}>Upoad Byte</button>
                        </td>
                      </tr>
              </tbody>
            </table>



               

            </div>
          );
        }
        else if(mode === 'Run') {
            return (
              <div>
                <br></br>
                <Button onClick={this.props.toggleRamAddressInputEnable}  
                 buttonState={this.props.ramAddressInputEnable}
                 name={this.props.ramAddressInputEnable === 1? "Disable RAM Address In (RAI)":"Enable RAM Address In (RAI)"}></Button>

                <Button onClick={this.props.toggleRamDataOutputEnable}  
                 buttonState={this.props.ramDataOutputEnable}
                 name={this.props.ramDataOutputEnable === 1? "Dissable RAM Data Out (RO)":"Enable RAM Data Out (RO)"}></Button>

         
              <br></br>
              <br></br>
                                <button onClick={this.togglePopup.bind(this)}>Show RAM Data</button>

                                {this.state.showPopup ? 
                                <SixteenByteRAMDataDisplay
                                dec2bin={this.props.dec2bin} 
                                dec2binFourBit={this.props.dec2binFourBit} 
                                ramData={this.props.ramData} 
                                    closePopup={this.togglePopup.bind(this)}
                                />
                                : null
                                }

                      </div>

            );
        }
        else if(mode === 'File Upload'){
          
         return(<div>

          <button onClick={this.downloadFile.bind(this)}>Download file</button>
           <RAMFileUpload uploadDataFromFile={this.props.uploadRAMDataFromFile} ></RAMFileUpload>
         </div>);

        }
    }
};

export default SixteenByteRAM;