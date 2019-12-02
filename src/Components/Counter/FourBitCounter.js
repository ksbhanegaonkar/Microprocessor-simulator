import React,{Component} from 'react';
import FourBitDisplay  from './../LedDisplay/FourBitDisplay';
import './FourBitCounter.css'
import Button from '../Basic/Button';
class FourBitCounter extends Component{

   

    render(){
       
        return (
                <div className="programCounter">
                Program Counter 
                <br></br>
                <FourBitDisplay displayValue={this.props.dec2binFourBit(this.props.currentCounterValue)}></FourBitDisplay>
                Counter Output : {this.props.currentCounterValue}
                <br></br>
                Count Enable : {this.props.isCounterEnable}
                <br></br>
                Counter Output Enable : {this.props.counterOutputEnable}
               
            <br></br>
        
              
               
                <Button onClick={this.props.toggleCountEnable}  
                 buttonState={this.props.isCounterEnable}
                 name={this.props.isCounterEnable === 1? "Dissable Count (CE)":"Enable Count (CE)"}></Button>

                <Button onClick={this.props.toggleCounterOutputEnable}  
                 buttonState={this.props.counterOutputEnable}
                 name={this.props.counterOutputEnable === 1? "Dissable Counter Output (CO)":"Enable Counter Output (CO)"}></Button>
   
                <Button onClick={this.props.jump}  
                 buttonState={this.props.jumpEnable}
                 name={this.props.jumpEnable === 1? "Dissable Jump (J)":"Enable Jump (J)"}></Button>



      
               

                </div>
        );
    }
};

export default FourBitCounter;

