import React,{Component} from 'react';
import EightBitDisplay from './../LedDisplay/EightBitDisplay'
import Switch from './../Basic/Switch'
import Button from './../Basic/Button'
import './ExternalInputPort.css';

class ExternnalInputPort extends Component{

    render(){
        return (
            <div className="rectangle">
              External Input
              <br></br>
              <EightBitDisplay displayValue={this.props.externalInputValue}></EightBitDisplay>
              Current Value = {this.props.externalInputIntValue}
              <br></br>
              EnableOutputBuffer :  {this.props.externalInputBusBuffer === 1? "1":"0"}
            <br></br>
             
            <br></br>
           
                <div>
                    
                    
                    <Switch switchState={this.props.externalInputValue[0]} onClick={this.props.loadExtrnalInput} switchPosition="7"></Switch>
                    <Switch switchState={this.props.externalInputValue[1]} onClick={this.props.loadExtrnalInput} switchPosition="6"></Switch>
                    <Switch switchState={this.props.externalInputValue[2]} onClick={this.props.loadExtrnalInput} switchPosition="5"></Switch>
                    <Switch switchState={this.props.externalInputValue[3]} onClick={this.props.loadExtrnalInput} switchPosition="4"></Switch>
                    <Switch switchState={this.props.externalInputValue[4]} onClick={this.props.loadExtrnalInput} switchPosition="3"></Switch>
                    <Switch switchState={this.props.externalInputValue[5]} onClick={this.props.loadExtrnalInput} switchPosition="2"></Switch>
                    <Switch switchState={this.props.externalInputValue[6]} onClick={this.props.loadExtrnalInput} switchPosition="1"></Switch>
                    <Switch switchState={this.props.externalInputValue[7]} onClick={this.props.loadExtrnalInput} switchPosition="0"></Switch>


                </div>
               
                <button onClick={this.props.resetExternalInputValue}>Reset</button>
                <Button onClick={this.props.toggleExternalInputBusBufferState}  
                 buttonState={this.props.externalInputBusBuffer}
                 name={this.props.externalInputBusBuffer === 1? "Dissable output buffer":"Enable output buffer"}></Button>

            </div>);
    }
}

export default ExternnalInputPort;