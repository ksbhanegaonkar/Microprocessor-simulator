import React,{Component} from 'react';
import Led from '../Basic/LED'
import './FourBitDisplay.css'
class ThreeBitDisplay extends Component{

    render(){
        return (
            <div className="LedPallet">
               <Led ledState={this.props.displayValue[1]}></Led>
               <Led ledState={this.props.displayValue[2]}></Led>
               <Led ledState={this.props.displayValue[3]}></Led>
            </div>
        );
    }
};

export default ThreeBitDisplay;

