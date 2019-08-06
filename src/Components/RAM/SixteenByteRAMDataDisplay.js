import React,{Component} from 'react';
import EightBitDisplay from '../LedDisplay/EightBitDisplay';
import FourBitDisplay from './../LedDisplay/FourBitDisplay'
import './SixteenByteRAMDataDisplay.css';

class SixteenByteRAMDataDisplay extends Component{
 
 
    render(){
        return(<div className='app'>
        
            <div className='popup'>
            <div className='popup_inner'>

            RAM Data
            <br></br>


            <table>
            <tbody>

                <tr>
                    <td>
                    Address : 0
                    </td>
                    <td>
                        <FourBitDisplay  displayValue={this.props.dec2binFourBit(0)}></FourBitDisplay>
                    </td>
                    <td>
                    Value : {this.props.ramData[0]} 
                    </td>
                    <td>
                    <EightBitDisplay displayValue={this.props.dec2bin(this.props.ramData[0])}></EightBitDisplay>
                    </td>
                </tr>

                <tr>
                    <td>
                    Address : 1
                    </td>
                    <td>
                        <FourBitDisplay  displayValue={this.props.dec2binFourBit(1)}></FourBitDisplay>
                    </td>
                    <td>
                    Value : {this.props.ramData[1]} 
                    </td>
                    <td>
                    <EightBitDisplay displayValue={this.props.dec2bin(this.props.ramData[1])}></EightBitDisplay>
                    </td>
                </tr>

                <tr>
                    <td>
                    Address : 2
                    </td>
                    <td>
                        <FourBitDisplay  displayValue={this.props.dec2binFourBit(2)}></FourBitDisplay>
                    </td>
                    <td>
                    Value : {this.props.ramData[2]} 
                    </td>
                    <td>
                    <EightBitDisplay displayValue={this.props.dec2bin(this.props.ramData[2])}></EightBitDisplay>
                    </td>
                </tr>

                <tr>
                    <td>
                    Address : 3
                    </td>
                    <td>
                        <FourBitDisplay  displayValue={this.props.dec2binFourBit(3)}></FourBitDisplay>
                    </td>
                    <td>
                    Value : {this.props.ramData[3]} 
                    </td>
                    <td>
                    <EightBitDisplay displayValue={this.props.dec2bin(this.props.ramData[3])}></EightBitDisplay>
                    </td>
                </tr>

                <tr>
                    <td>
                    Address : 4
                    </td>
                    <td>
                        <FourBitDisplay  displayValue={this.props.dec2binFourBit(4)}></FourBitDisplay>
                    </td>
                    <td>
                    Value : {this.props.ramData[4]} 
                    </td>
                    <td>
                    <EightBitDisplay displayValue={this.props.dec2bin(this.props.ramData[4])}></EightBitDisplay>
                    </td>
                </tr>

                <tr>
                    <td>
                    Address : 5
                    </td>
                    <td>
                        <FourBitDisplay  displayValue={this.props.dec2binFourBit(5)}></FourBitDisplay>
                    </td>
                    <td>
                    Value : {this.props.ramData[5]} 
                    </td>
                    <td>
                    <EightBitDisplay displayValue={this.props.dec2bin(this.props.ramData[5])}></EightBitDisplay>
                    </td>
                </tr>

                <tr>
                    <td>
                    Address : 6
                    </td>
                    <td>
                        <FourBitDisplay  displayValue={this.props.dec2binFourBit(6)}></FourBitDisplay>
                    </td>
                    <td>
                    Value : {this.props.ramData[6]} 
                    </td>
                    <td>
                    <EightBitDisplay displayValue={this.props.dec2bin(this.props.ramData[6])}></EightBitDisplay>
                    </td>
                </tr>

                <tr>
                    <td>
                    Address : 7
                    </td>
                    <td>
                        <FourBitDisplay  displayValue={this.props.dec2binFourBit(7)}></FourBitDisplay>
                    </td>
                    <td>
                    Value : {this.props.ramData[7]} 
                    </td>
                    <td>
                    <EightBitDisplay displayValue={this.props.dec2bin(this.props.ramData[7])}></EightBitDisplay>
                    </td>
                </tr>

                <tr>
                    <td>
                    Address : 8
                    </td>
                    <td>
                        <FourBitDisplay  displayValue={this.props.dec2binFourBit(8)}></FourBitDisplay>
                    </td>
                    <td>
                    Value : {this.props.ramData[8]} 
                    </td>
                    <td>
                    <EightBitDisplay displayValue={this.props.dec2bin(this.props.ramData[8])}></EightBitDisplay>
                    </td>
                </tr>

                <tr>
                    <td>
                    Address : 9
                    </td>
                    <td>
                        <FourBitDisplay  displayValue={this.props.dec2binFourBit(9)}></FourBitDisplay>
                    </td>
                    <td>
                    Value : {this.props.ramData[9]} 
                    </td>
                    <td>
                    <EightBitDisplay displayValue={this.props.dec2bin(this.props.ramData[9])}></EightBitDisplay>
                    </td>
                </tr>

                <tr>
                    <td>
                    Address : 10
                    </td>
                    <td>
                        <FourBitDisplay  displayValue={this.props.dec2binFourBit(10)}></FourBitDisplay>
                    </td>
                    <td>
                    Value : {this.props.ramData[10]} 
                    </td>
                    <td>
                    <EightBitDisplay displayValue={this.props.dec2bin(this.props.ramData[10])}></EightBitDisplay>
                    </td>
                </tr>

                <tr>
                    <td>
                    Address : 11
                    </td>
                    <td>
                        <FourBitDisplay  displayValue={this.props.dec2binFourBit(11)}></FourBitDisplay>
                    </td>
                    <td>
                    Value : {this.props.ramData[11]} 
                    </td>
                    <td>
                    <EightBitDisplay displayValue={this.props.dec2bin(this.props.ramData[11])}></EightBitDisplay>
                    </td>
                </tr>

                <tr>
                    <td>
                    Address : 12
                    </td>
                    <td>
                        <FourBitDisplay  displayValue={this.props.dec2binFourBit(12)}></FourBitDisplay>
                    </td>
                    <td>
                    Value : {this.props.ramData[12]} 
                    </td>
                    <td>
                    <EightBitDisplay displayValue={this.props.dec2bin(this.props.ramData[12])}></EightBitDisplay>
                    </td>
                </tr>

                <tr>
                    <td>
                    Address : 13
                    </td>
                    <td>
                        <FourBitDisplay  displayValue={this.props.dec2binFourBit(13)}></FourBitDisplay>
                    </td>
                    <td>
                    Value : {this.props.ramData[13]} 
                    </td>
                    <td>
                    <EightBitDisplay displayValue={this.props.dec2bin(this.props.ramData[13])}></EightBitDisplay>
                    </td>
                </tr>
                <tr>
                    <td>
                    Address : 14
                    </td>
                    <td>
                        <FourBitDisplay  displayValue={this.props.dec2binFourBit(14)}></FourBitDisplay>
                    </td>
                    <td>
                    Value : {this.props.ramData[14]} 
                    </td>
                    <td>
                    <EightBitDisplay displayValue={this.props.dec2bin(this.props.ramData[14])}></EightBitDisplay>
                    </td>
                </tr>

                <tr>
                    <td>
                    Address : 15
                    </td>
                    <td>
                        <FourBitDisplay  displayValue={this.props.dec2binFourBit(15)}></FourBitDisplay>
                    </td>
                    <td>
                    Value : {this.props.ramData[15]} 
                    </td>
                    <td>
                    <EightBitDisplay displayValue={this.props.dec2bin(this.props.ramData[15])}></EightBitDisplay>
                    </td>
                </tr>
            </tbody>

            </table>

                        
               

            <button onClick={this.props.closePopup}>Close</button>
            </div>
          </div>
          </div>
        );
    }
};

export default SixteenByteRAMDataDisplay;