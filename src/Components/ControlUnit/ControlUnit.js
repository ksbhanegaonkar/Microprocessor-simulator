import React,{Component} from 'react';
import './ControlUnit.css';
import SingleBitDisplay from './../LedDisplay/SingleBitDisplay'
import Switch from './../Basic/Switch'
import ThreeStateSwitch from './../Basic/ThreeStateSwitch'
import EightBitDisplay from '../LedDisplay/EightBitDisplay';
import FourBitDisplay from './../LedDisplay/FourBitDisplay';
import TenBitDisplay from '../LedDisplay/TenBitDisplay';
import FifteenBitDisplay from './../LedDisplay/FifteenBitDisplay';
import ROMFileUpload from '../FileUpload/ROMFileUpload';

class ControlUnit extends Component{
 
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
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.props.romData.map(this.props.dec2binFifteenBit).join('\r\n')));
        element.setAttribute('download', 'ROM_Bytes.txt');
      
        element.style.display = 'none';
        document.body.appendChild(element);
      
        element.click();
      
        document.body.removeChild(element);
      }

      uploadFile(event){
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = function(event) {
          // The file's text will be printed here
          console.log(event.target.result)
        };
      
        reader.readAsText(file);
    

      }
    render(){

        return(
               
                <div className="controlUnit">
                 Control Unit
                  <br></br>
                  Mode : 
                  <select value={this.props.controlUnitMode} onChange={this.props.onControlUnitModeSelect}>
                        <option value="ManualControl">Manual Control</option>
                        <option value="AutoControl">Auto Control</option>
                        <option value="InstructionDesign">Instruction Design</option>
                    </select>
  
                    {this.getPanelBasedOnMode(this.props.controlUnitMode)}

            
                </div>
        );
    }


    getPanelBasedOnMode(mode){
            if(mode === "ManualControl"){
                return (
                    <div>
                         <br></br>
                    <table border="1">

                        <tbody>
                            <tr>
                                <td>
                                    <SingleBitDisplay displayValue={this.props.counterOutputEnable}></SingleBitDisplay>
                                </td>
                                <td>
                                <SingleBitDisplay displayValue={this.props.isCounterEnable}></SingleBitDisplay>
                                </td>       
                                <td>
                                    <SingleBitDisplay displayValue={this.props.jumpEnable}></SingleBitDisplay>
                                </td>
                                <td>
                                <SingleBitDisplay displayValue={this.props.registorAInputEnable}></SingleBitDisplay>
                                </td>
                                <td>
                                <SingleBitDisplay displayValue={this.props.registorAOutputEnable}></SingleBitDisplay>
                                </td>
                                <td>
                                <SingleBitDisplay displayValue={this.props.registorBInputEnable}></SingleBitDisplay>
                                </td>
                                <td>
                                <SingleBitDisplay displayValue={this.props.registorBOutputEnable}></SingleBitDisplay>
                                </td>     
                                <td>
                                <SingleBitDisplay displayValue={this.props.accumulatorOutputEnable}></SingleBitDisplay>
                                </td>       
                                <td>
                                <SingleBitDisplay displayValue={this.props.addSubtractFlag}></SingleBitDisplay>
                                </td> 
                                <td>
                                <SingleBitDisplay displayValue={this.props.outputDisplayInputEnable}></SingleBitDisplay>
                                </td>   
                                <td>
                                <SingleBitDisplay displayValue={this.props.ramAddressInputEnable}></SingleBitDisplay>
                                </td>  
                                <td>
                                <SingleBitDisplay displayValue={this.props.ramDataOutputEnable}></SingleBitDisplay>
                                </td>  
                                <td>
                                <SingleBitDisplay displayValue={this.props.instructionRegisterInputEnable}></SingleBitDisplay>
                                </td> 
                                <td>
                                <SingleBitDisplay displayValue={this.props.instructionRegisterOutputEnable}></SingleBitDisplay>
                                </td>    
                                <td>
                                <SingleBitDisplay displayValue={this.props.isHalt}></SingleBitDisplay>
                                </td> 

                            </tr>

                            <tr>
                                <td>
                                CO
                                </td>
                                <td>
                                CE
                                </td>
                                <td>
                                JP
                                </td>
                                <td>
                                AI
                                </td>
                                <td>
                                AO
                                </td>
                                <td>
                                BI
                                </td>
                                <td>
                                BO
                                </td>
                                <td>
                                AcO
                                </td>
                                <td>
                                S/A
                                </td>
                                <td>
                                OE
                                </td>
                                <td>
                                RAI
                                </td>
                                <td>
                                RO
                                </td>
                                <td>
                                II
                                </td>
                                <td>
                                IO
                                </td>
                                <td>
                                HLT
                                </td>

                            </tr>
                            <tr>
                                <td>
                                    <Switch onClick={this.props.updateManualControlSignal} switchState={this.props.counterOutputEnable} switchPosition="0"></Switch>
                                </td>
                                <td>
                                    <Switch onClick={this.props.updateManualControlSignal} switchState={this.props.isCounterEnable} switchPosition="1"></Switch>
                                </td>
                                <td>
                                    <Switch onClick={this.props.updateManualControlSignal} switchState={this.props.jumpEnable} switchPosition="2"></Switch>
                                </td>
                                <td>
                                    <Switch onClick={this.props.updateManualControlSignal} switchState={this.props.registorAInputEnable} switchPosition="3"></Switch>
                                </td>
                                <td>
                                <Switch onClick={this.props.updateManualControlSignal} switchState={this.props.registorAOutputEnable} switchPosition="4"></Switch>
                                </td>
                                <td>
                                    <Switch onClick={this.props.updateManualControlSignal} switchState={this.props.registorBInputEnable} switchPosition="5"></Switch>
                                </td>
                                <td>
                                    <Switch onClick={this.props.updateManualControlSignal} switchState={this.props.registorBOutputEnable} switchPosition="6"></Switch>
                                </td>
                                <td>
                                    <Switch onClick={this.props.updateManualControlSignal} switchState={this.props.accumulatorOutputEnable} switchPosition="7"></Switch>
                                </td>
                                <td>
                                    <Switch onClick={this.props.updateManualControlSignal} switchState={this.props.addSubtractFlag} switchPosition="8"></Switch>
                                </td>
                                <td>
                                    <Switch onClick={this.props.updateManualControlSignal} switchState={this.props.outputDisplayInputEnable} switchPosition="9"></Switch>
                                </td>
                                <td>
                                    <Switch onClick={this.props.updateManualControlSignal} switchState={this.props.ramAddressInputEnable} switchPosition="10"></Switch>
                                </td>
                                <td>
                                    <Switch onClick={this.props.updateManualControlSignal} switchState={this.props.ramDataOutputEnable} switchPosition="11"></Switch>
                                </td>
                                <td>
                                    <Switch onClick={this.props.updateManualControlSignal} switchState={this.props.instructionRegisterInputEnable} switchPosition="12"></Switch>
                                </td>
                                <td>
                                    <Switch onClick={this.props.updateManualControlSignal} switchState={this.props.instructionRegisterOutputEnable} switchPosition="13"></Switch>
                                </td>
                                <td>
                                    <Switch onClick={this.props.stopAstableClockPulse} switchState={this.props.isHalt} switchPosition="14"></Switch>
                                </td>
                            </tr>
                        </tbody>


                    </table>
                    </div>

                );
            }
            else if(mode === "InstructionDesign"){
                let romAddressBinaryValue = this.props.dec2binTenBit(this.props.romAddress);
                let romDataInputBinaryValue = this.props.dec2binFifteenBit(this.props.romProgramData);
                return(<div>

                                        <table>
                                        <tbody>
                                        <tr>
                                        <td>
                                        Value : {this.props.romProgramData}
                                        </td>
                                        <td>
                                        

                                        <table border="1">

                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <SingleBitDisplay displayValue={romDataInputBinaryValue[0]}></SingleBitDisplay>
                                                        </td>
                                                        <td>
                                                            <SingleBitDisplay displayValue={romDataInputBinaryValue[1]}></SingleBitDisplay>
                                                        </td>
                                                        <td>
                                                            <SingleBitDisplay displayValue={romDataInputBinaryValue[2]}></SingleBitDisplay>
                                                        </td>
                                                        <td>
                                                            <SingleBitDisplay displayValue={romDataInputBinaryValue[3]}></SingleBitDisplay>
                                                        </td>
                                                        <td>
                                                            <SingleBitDisplay displayValue={romDataInputBinaryValue[4]}></SingleBitDisplay>
                                                        </td>
                                                        <td>
                                                            <SingleBitDisplay displayValue={romDataInputBinaryValue[5]}></SingleBitDisplay>
                                                        </td>
                                                        <td>
                                                            <SingleBitDisplay displayValue={romDataInputBinaryValue[6]}></SingleBitDisplay>
                                                        </td>
                                                        <td>
                                                            <SingleBitDisplay displayValue={romDataInputBinaryValue[7]}></SingleBitDisplay>
                                                        </td>
                                                        <td>
                                                            <SingleBitDisplay displayValue={romDataInputBinaryValue[8]}></SingleBitDisplay>
                                                        </td>
                                                        <td>
                                                            <SingleBitDisplay displayValue={romDataInputBinaryValue[9]}></SingleBitDisplay>
                                                        </td>
                                                        <td>
                                                            <SingleBitDisplay displayValue={romDataInputBinaryValue[10]}></SingleBitDisplay>
                                                        </td>
                                                        <td>
                                                            <SingleBitDisplay displayValue={romDataInputBinaryValue[11]}></SingleBitDisplay>
                                                        </td>
                                                        <td>
                                                            <SingleBitDisplay displayValue={romDataInputBinaryValue[12]}></SingleBitDisplay>
                                                        </td>
                                                        <td>
                                                            <SingleBitDisplay displayValue={romDataInputBinaryValue[13]}></SingleBitDisplay>
                                                        </td>
                                                        <td>
                                                            <SingleBitDisplay displayValue={romDataInputBinaryValue[14]}></SingleBitDisplay>
                                                        </td>


                                                    </tr>

                                                    <tr>
                                                        <td>
                                                        CO
                                                        </td>
                                                        <td>
                                                        CE
                                                        </td>
                                                        <td>
                                                        JP
                                                        </td>
                                                        <td>
                                                        AI
                                                        </td>
                                                        <td>
                                                        AO
                                                        </td>
                                                        <td>
                                                        BI
                                                        </td>
                                                        <td>
                                                        BO
                                                        </td>
                                                        <td>
                                                        AcO
                                                        </td>
                                                        <td>
                                                        S/A
                                                        </td>
                                                        <td>
                                                        OE
                                                        </td>
                                                        <td>
                                                        RAI
                                                        </td>
                                                        <td>
                                                        RO
                                                        </td>
                                                        <td>
                                                        II
                                                        </td>
                                                        <td>
                                                        IO
                                                        </td>
                                                        <td>
                                                        HLT
                                                        </td>

                                                    </tr>
                                                    <tr>
                                                        <td>
                                                        <Switch switchState={romDataInputBinaryValue[0]} onClick={this.props.loadROMDataInput} switchPosition="14" ></Switch>
                                                        </td>
                                                        <td>
                                                        <Switch switchState={romDataInputBinaryValue[1]} onClick={this.props.loadROMDataInput} switchPosition="13" ></Switch>
                                                        </td>
                                                        <td>
                                                        <Switch switchState={romDataInputBinaryValue[2]} onClick={this.props.loadROMDataInput} switchPosition="12" ></Switch>
                                                        </td>
                                                        <td>
                                                        <Switch switchState={romDataInputBinaryValue[3]} onClick={this.props.loadROMDataInput} switchPosition="11" ></Switch>
                                                        </td>
                                                        <td>
                                                        <Switch switchState={romDataInputBinaryValue[4]} onClick={this.props.loadROMDataInput} switchPosition="10" ></Switch>
                                                        </td>
                                                        <td>
                                                        <Switch switchState={romDataInputBinaryValue[5]} onClick={this.props.loadROMDataInput} switchPosition="9" ></Switch>
                                                        </td>
                                                        <td>
                                                        <Switch switchState={romDataInputBinaryValue[6]} onClick={this.props.loadROMDataInput} switchPosition="8" ></Switch>
                                                        </td>
                                                        <td>
                                                        <Switch switchState={romDataInputBinaryValue[7]} onClick={this.props.loadROMDataInput} switchPosition="7" ></Switch>
                                                        </td>
                                                        <td>
                                                        <Switch switchState={romDataInputBinaryValue[8]} onClick={this.props.loadROMDataInput} switchPosition="6" ></Switch>
                                                        </td>
                                                        <td>
                                                        <Switch switchState={romDataInputBinaryValue[9]} onClick={this.props.loadROMDataInput} switchPosition="5" ></Switch>
                                                        </td>
                                                        <td>
                                                        <Switch switchState={romDataInputBinaryValue[10]} onClick={this.props.loadROMDataInput} switchPosition="4" ></Switch>
                                                        </td>
                                                        <td>
                                                        <Switch switchState={romDataInputBinaryValue[11]} onClick={this.props.loadROMDataInput} switchPosition="3" ></Switch>
                                                        </td>
                                                        <td>
                                                        <Switch switchState={romDataInputBinaryValue[12]} onClick={this.props.loadROMDataInput} switchPosition="2" ></Switch>
                                                        </td>
                                                        <td>
                                                        <Switch switchState={romDataInputBinaryValue[13]} onClick={this.props.loadROMDataInput} switchPosition="1" ></Switch>
                                                        </td>
                                                        <td>
                                                        <Switch switchState={romDataInputBinaryValue[14]} onClick={this.props.loadROMDataInput} switchPosition="0" ></Switch>
                                                        </td>
                                                    </tr>
                                                </tbody>


                                                </table>



                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                        Address :  {this.props.romAddress}
                                        </td>
                                        <td>
                                        <TenBitDisplay displayValue={this.props.romIndividualAddressBits}></TenBitDisplay>
                                        </td>
                                    </tr>

                                            <tr>
                                            <td>
                                            Select Address :
                                            </td>
                                            <td>
                                                                                <table border="1">

                                    <tbody>
                                        <tr>

                                            <td>
                                                    <ThreeStateSwitch switchState={this.props.romIndividualAddressBits[0]} onClick={this.props.loadROMAddressInput} switchPosition="9"></ThreeStateSwitch>
                                            </td>       
                                            <td>
                                                    <ThreeStateSwitch switchState={this.props.romIndividualAddressBits[1]} onClick={this.props.loadROMAddressInput} switchPosition="8"></ThreeStateSwitch>
                                            </td>
                                            <td>
                                                    <ThreeStateSwitch switchState={this.props.romIndividualAddressBits[2]} onClick={this.props.loadROMAddressInput} switchPosition="7"></ThreeStateSwitch>
                                            </td>
                                            <td>
                                                    <ThreeStateSwitch switchState={this.props.romIndividualAddressBits[3]} onClick={this.props.loadROMAddressInput} switchPosition="6"></ThreeStateSwitch>
                                            </td>
                                            <td>
                                                    <ThreeStateSwitch switchState={this.props.romIndividualAddressBits[4]} onClick={this.props.loadROMAddressInput} switchPosition="5"></ThreeStateSwitch>
                                            </td>
                                            <td>
                                                    <ThreeStateSwitch switchState={this.props.romIndividualAddressBits[5]} onClick={this.props.loadROMAddressInput} switchPosition="4"></ThreeStateSwitch>
                                            </td>     
                                            <td>
                                                    <ThreeStateSwitch switchState={this.props.romIndividualAddressBits[6]} onClick={this.props.loadROMAddressInput} switchPosition="3"></ThreeStateSwitch>
                                            </td>       
                                            <td>
                                                    <ThreeStateSwitch switchState={this.props.romIndividualAddressBits[7]} onClick={this.props.loadROMAddressInput} switchPosition="2"></ThreeStateSwitch>
                                            </td> 
                                            <td>
                                                    <ThreeStateSwitch switchState={this.props.romIndividualAddressBits[8]} onClick={this.props.loadROMAddressInput} switchPosition="1"></ThreeStateSwitch>
                                            </td>   
                                            <td>
                                                    <ThreeStateSwitch switchState={this.props.romIndividualAddressBits[9]} onClick={this.props.loadROMAddressInput} switchPosition="0"></ThreeStateSwitch>
                                            </td>   
                                        

                                        </tr>

                                        <tr>
                                            <td>
                                            -
                                            </td>
                                            <td>
                                            ZF
                                            </td>
                                            <td>
                                            CF
                                            </td>
                                            <td>
                                            t2
                                            </td>
                                            <td>
                                            t1
                                            </td>
                                            <td>
                                            t0
                                            </td>
                                            <td>
                                            IR7
                                            </td>
                                            <td>
                                            IR6
                                            </td>
                                            <td>
                                            IR5
                                            </td>
                                            <td>
                                            IR4
                                            </td>
                                        

                                        </tr>
                                    </tbody>


                                    </table>
                                            
                                            </td>
                                            <td>
                                            
                                            </td>
                                            </tr>
                                            <tr>
                                                    <td>
                                                    <button onClick={this.props.clearROMAddressInput}>Clear Address</button>
                                                    </td>
                                                    <td>
                                                    <button onClick={this.props.clearROMInputData}>Clear Data</button>
                                                    </td>
                                                    <td>
                                                    <button onClick={this.props.updateRomData}>Upoad</button>
                                                    </td>
                                                    
                                            </tr>
                                            <tr>
                                                <td>
                                                    Upload/Download ROM through file
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                <button onClick={this.downloadFile.bind(this)}>Download file</button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Select a File to Load:</td>
                                               
                                                <ROMFileUpload uploadDataFromFile={this.props.uploadROMDataFromFile}></ROMFileUpload>
                                                
                                            </tr>
                                        </tbody>
                                        </table>



                                        

                                       


                </div>);
            }
            else if(mode === "AutoControl"){
               let binaryRomAddress = this.props.dec2binTenBit(this.props.romAddress);
               let binaryRomData = this.props.dec2binFifteenBit(this.props.romData[this.props.romAddress]);
                return (
                   <div>
                       <br></br>


                    ROM Output :
                    <br></br>
                    <table border="1">

                        <tbody>
                            <tr>
                                <td>
                                    <SingleBitDisplay displayValue={binaryRomData[0]}></SingleBitDisplay>
                                </td>
                                <td>
                                    <SingleBitDisplay displayValue={binaryRomData[1]}></SingleBitDisplay>
                                </td>
                                <td>
                                    <SingleBitDisplay displayValue={binaryRomData[2]}></SingleBitDisplay>
                                </td>
                                <td>
                                    <SingleBitDisplay displayValue={binaryRomData[3]}></SingleBitDisplay>
                                </td>
                                <td>
                                    <SingleBitDisplay displayValue={binaryRomData[4]}></SingleBitDisplay>
                                </td>
                                <td>
                                    <SingleBitDisplay displayValue={binaryRomData[5]}></SingleBitDisplay>
                                </td>
                                <td>
                                    <SingleBitDisplay displayValue={binaryRomData[6]}></SingleBitDisplay>
                                </td>
                                <td>
                                    <SingleBitDisplay displayValue={binaryRomData[7]}></SingleBitDisplay>
                                </td>
                                <td>
                                    <SingleBitDisplay displayValue={binaryRomData[8]}></SingleBitDisplay>
                                </td>
                                <td>
                                    <SingleBitDisplay displayValue={binaryRomData[9]}></SingleBitDisplay>
                                </td>
                                <td>
                                    <SingleBitDisplay displayValue={binaryRomData[10]}></SingleBitDisplay>
                                </td>
                                <td>
                                    <SingleBitDisplay displayValue={binaryRomData[11]}></SingleBitDisplay>
                                </td>
                                <td>
                                    <SingleBitDisplay displayValue={binaryRomData[12]}></SingleBitDisplay>
                                </td>
                                <td>
                                    <SingleBitDisplay displayValue={binaryRomData[13]}></SingleBitDisplay>
                                </td>
                                <td>
                                    <SingleBitDisplay displayValue={binaryRomData[14]}></SingleBitDisplay>
                                </td>


                            </tr>

                            <tr>
                                <td>
                                CO
                                </td>
                                <td>
                                CE
                                </td>
                                <td>
                                JP
                                </td>
                                <td>
                                AI
                                </td>
                                <td>
                                AO
                                </td>
                                <td>
                                BI
                                </td>
                                <td>
                                BO
                                </td>
                                <td>
                                AcO
                                </td>
                                <td>
                                S/A
                                </td>
                                <td>
                                OE
                                </td>
                                <td>
                                RAI
                                </td>
                                <td>
                                RO
                                </td>
                                <td>
                                II
                                </td>
                                <td>
                                IO
                                </td>
                                <td>
                                HLT
                                </td>

                            </tr>
                        </tbody>


                    </table>


                    <br></br>


                        ROM Address :
                        <br></br>
                        <table border="1">

                            <tbody>
                                <tr>

                                    <td>
                                    <SingleBitDisplay displayValue={binaryRomAddress[1]}></SingleBitDisplay>
                                    </td>       
                                    <td>
                                        <SingleBitDisplay displayValue={binaryRomAddress[2]}></SingleBitDisplay>
                                    </td>
                                    <td>
                                    <SingleBitDisplay displayValue={binaryRomAddress[3]}></SingleBitDisplay>
                                    </td>
                                    <td>
                                    <SingleBitDisplay displayValue={binaryRomAddress[4]}></SingleBitDisplay>
                                    </td>
                                    <td>
                                    <SingleBitDisplay displayValue={binaryRomAddress[5]}></SingleBitDisplay>
                                    </td>
                                    <td>
                                    <SingleBitDisplay displayValue={binaryRomAddress[6]}></SingleBitDisplay>
                                    </td>     
                                    <td>
                                    <SingleBitDisplay displayValue={binaryRomAddress[7]}></SingleBitDisplay>
                                    </td>       
                                    <td>
                                    <SingleBitDisplay displayValue={binaryRomAddress[8]}></SingleBitDisplay>
                                    </td> 
                                    <td>
                                    <SingleBitDisplay displayValue={binaryRomAddress[9]}></SingleBitDisplay>
                                    </td>   
                                  

                                </tr>

                                <tr>

                                    <td>
                                    ZF
                                    </td>
                                    <td>
                                    CF
                                    </td>
                                    <td>
                                    t2
                                    </td>
                                    <td>
                                    t1
                                    </td>
                                    <td>
                                    t0
                                    </td>
                                    <td>
                                    IR7
                                    </td>
                                    <td>
                                    IR6
                                    </td>
                                    <td>
                                    IR5
                                    </td>
                                    <td>
                                    IR4
                                    </td>
                                 

                                </tr>
                            </tbody>


                        </table>

                    </div>
                );
            }
    }

  };

export default ControlUnit;