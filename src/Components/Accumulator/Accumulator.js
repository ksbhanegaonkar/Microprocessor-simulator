import React,{Component} from 'react';
import EightBitDisplay from '../LedDisplay/EightBitDisplay';
import SingleBitDisplay from '../LedDisplay/SingleBitDisplay'
import './Accumulator.css'
import Button from '../Basic/Button';

class Accumulator extends Component{
 
 
    render(){
        return(
               
                <div className="rectangle">
                Accumulator
                <table>
                    <tbody> 
                        <tr>
                            <td>
                            Output : {this.props.currentValue}
                            </td>
                            <td>
                            <EightBitDisplay displayValue={this.props.dec2bin(this.props.currentValue)}></EightBitDisplay>
                            </td>
                            <td>
                            Carry : {this.props.carryValue}
                            </td>
                            <td>
                            <SingleBitDisplay displayValue={this.props.carryValue === 0?'0':'1'}></SingleBitDisplay>
                            </td>
                        </tr>
                        <tr>
                            <td>
                             Operand 1 :{this.props.firstOperandValue}
                            </td>
                            <td>
                            <EightBitDisplay displayValue={this.props.dec2bin(this.props.firstOperandValue)}></EightBitDisplay>
                            </td>
                            <td>
                            Zero : {this.props.zeroValue}
                            </td>
                            <td>
                            <SingleBitDisplay displayValue={this.props.zeroValue === 0?'0':'1'}></SingleBitDisplay>
                            </td>
                        </tr>

                        <tr>
                            <td>
                             Operand 2 :{this.props.secondOperandValue}
                            </td>
                            <td>
                            <EightBitDisplay displayValue={this.props.dec2bin(this.props.secondOperandValue)}></EightBitDisplay>
                            </td>
                        </tr>
                        <tr>
                            <td>
                            Add/Sub Flag : {this.props.addSubtractFlag}
                            </td>
                            <td>
                            Output Enable : {this.props.accumulatorOutputEnable}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <Button onClick={this.props.toggleAccumulatorOutputEnable}  
                 buttonState={this.props.accumulatorOutputEnable}
                 name={this.props.accumulatorOutputEnable === 1? "Dissable output buffer":"Enable output buffer"}></Button>

                <Button onClick={this.props.toggleAddSubtractFlag}  
                 buttonState={this.props.addSubtractFlag}
                 name={this.props.addSubtractFlag === 1? "Add":"Subtract"}></Button>

                </div>
        );
    }
};

export default Accumulator;