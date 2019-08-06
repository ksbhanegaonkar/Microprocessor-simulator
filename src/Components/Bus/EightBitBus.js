import React,{Component} from 'react';
import EightBitDisplay from '../LedDisplay/EightBitDisplay';
import './EightBitBus.css'

class Bus extends Component{
 
 
    render(){
        return(
               
                <div className="eightBitBus">
               Bus value: {this.props.currentValue}
                <EightBitDisplay displayValue={this.props.dec2bin(this.props.currentValue)}></EightBitDisplay>
                <EightBitDisplay displayValue={this.props.dec2bin(this.props.currentValue)}></EightBitDisplay>
                <EightBitDisplay displayValue={this.props.dec2bin(this.props.currentValue)}></EightBitDisplay>
                <EightBitDisplay displayValue={this.props.dec2bin(this.props.currentValue)}></EightBitDisplay>
                <EightBitDisplay displayValue={this.props.dec2bin(this.props.currentValue)}></EightBitDisplay>
                <EightBitDisplay displayValue={this.props.dec2bin(this.props.currentValue)}></EightBitDisplay>
                <EightBitDisplay displayValue={this.props.dec2bin(this.props.currentValue)}></EightBitDisplay>
                <EightBitDisplay displayValue={this.props.dec2bin(this.props.currentValue)}></EightBitDisplay>
                <EightBitDisplay displayValue={this.props.dec2bin(this.props.currentValue)}></EightBitDisplay>
                <EightBitDisplay displayValue={this.props.dec2bin(this.props.currentValue)}></EightBitDisplay>
                <EightBitDisplay displayValue={this.props.dec2bin(this.props.currentValue)}></EightBitDisplay>
                <EightBitDisplay displayValue={this.props.dec2bin(this.props.currentValue)}></EightBitDisplay>
                <EightBitDisplay displayValue={this.props.dec2bin(this.props.currentValue)}></EightBitDisplay>
                <EightBitDisplay displayValue={this.props.dec2bin(this.props.currentValue)}></EightBitDisplay>
                <EightBitDisplay displayValue={this.props.dec2bin(this.props.currentValue)}></EightBitDisplay>
                <EightBitDisplay displayValue={this.props.dec2bin(this.props.currentValue)}></EightBitDisplay>
                <EightBitDisplay displayValue={this.props.dec2bin(this.props.currentValue)}></EightBitDisplay>
                <EightBitDisplay displayValue={this.props.dec2bin(this.props.currentValue)}></EightBitDisplay>
                <EightBitDisplay displayValue={this.props.dec2bin(this.props.currentValue)}></EightBitDisplay>
                <EightBitDisplay displayValue={this.props.dec2bin(this.props.currentValue)}></EightBitDisplay>
                <EightBitDisplay displayValue={this.props.dec2bin(this.props.currentValue)}></EightBitDisplay>
                <EightBitDisplay displayValue={this.props.dec2bin(this.props.currentValue)}></EightBitDisplay>
                <EightBitDisplay displayValue={this.props.dec2bin(this.props.currentValue)}></EightBitDisplay>
                <EightBitDisplay displayValue={this.props.dec2bin(this.props.currentValue)}></EightBitDisplay>
                <EightBitDisplay displayValue={this.props.dec2bin(this.props.currentValue)}></EightBitDisplay>
                <EightBitDisplay displayValue={this.props.dec2bin(this.props.currentValue)}></EightBitDisplay>
                <EightBitDisplay displayValue={this.props.dec2bin(this.props.currentValue)}></EightBitDisplay>
                <EightBitDisplay displayValue={this.props.dec2bin(this.props.currentValue)}></EightBitDisplay>
                <EightBitDisplay displayValue={this.props.dec2bin(this.props.currentValue)}></EightBitDisplay>
                <EightBitDisplay displayValue={this.props.dec2bin(this.props.currentValue)}></EightBitDisplay>
                <EightBitDisplay displayValue={this.props.dec2bin(this.props.currentValue)}></EightBitDisplay>
               
                </div>
        );
    }
};

export default Bus;