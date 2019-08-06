import React,{Component} from 'react';
import EightBitDisplay from '../LedDisplay/EightBitDisplay';
import Button from '../Basic/Button';
import './EightBitRegistor.css'

class EightBitRegistor extends Component{
 
 
    render(){
        return(
               
                <div className="rectangle">
                 {this.props.registorName}
                <EightBitDisplay displayValue={this.props.dec2bin(this.props.currentValue)}></EightBitDisplay>
                <div className="componentHeader">
                Registor value: {this.props.currentValue}
                <br></br>
                Input Enable : {this.props.registorInputEnable}
                <br></br>
                Output Enable : {this.props.registorOutputEnable}
                <br></br>

                <Button onClick={this.props.toggleRegistorInputEnableState}  
                 buttonState={this.props.registorInputEnable}
                 name={this.props.registorInputEnable === 1? "Dissable input buffer":"Enable input buffer"}></Button>

                <Button onClick={this.props.toggleRegistorOutputEnableState}  
                 buttonState={this.props.registorOutputEnable}
                 name={this.props.registorOutputEnable === 1? "Dissable output buffer":"Enable output buffer"}></Button>



         
                </div>
                </div>
        );
    }
};

export default EightBitRegistor;