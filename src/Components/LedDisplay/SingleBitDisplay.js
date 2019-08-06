import React,{Component} from 'react';
import Led from '../Basic/LED'
import './EightBitDisplay.css'
class SingleBitDisplay extends Component{

    render(){

        return (
            <div className="LedPallet">
               <Led ledState={this.props.displayValue}></Led>
            </div>
        );
    }
};

export default SingleBitDisplay;

