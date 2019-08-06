import React,{Component} from 'react';
import Led from '../Basic/LED'
import './EightBitDisplay.css'
class EightBitDisplay extends Component{

    render(){

        return (
            <div className="LedPallet">
               <Led ledState={this.props.displayValue[0]}></Led>
               <Led ledState={this.props.displayValue[1]}></Led>
               <Led ledState={this.props.displayValue[2]}></Led>
               <Led ledState={this.props.displayValue[3]}></Led>
               <Led ledState={this.props.displayValue[4]}></Led>
               <Led ledState={this.props.displayValue[5]}></Led>
               <Led ledState={this.props.displayValue[6]}></Led>
               <Led ledState={this.props.displayValue[7]}></Led>
            </div>
        );      
    }
};

export default EightBitDisplay;

