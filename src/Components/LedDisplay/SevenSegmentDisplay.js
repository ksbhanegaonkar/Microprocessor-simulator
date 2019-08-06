import React,{Component} from 'react';
import './SevenSegmentDisplay.css'
import Button from '../Basic/Button';
class SevenSegmentDisplay extends Component{

    render(){

        return (
            <div className="sevenSegmentDisplay">

            <table>
                <tbody>
                    <tr>
                        <td>
                        <Button onClick={this.props.toggleOutputDisplayInputEnable}  
                        buttonState={this.props.outputDisplayInputEnable}
                        name={this.props.outputDisplayInputEnable === 1? "Dissable input buffer":"Enable input buffer"}></Button>


                        </td>
                        <td>
                             <div className="displayValue">
                             {this.props.displayValue}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>


 
               
               
            </div>
        );
    }
};

export default SevenSegmentDisplay;

