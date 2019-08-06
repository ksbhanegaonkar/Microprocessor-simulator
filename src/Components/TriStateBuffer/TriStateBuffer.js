import React, { Component } from 'react';
import closedSwitch from './../../Images/ClosedTriStateBuffer.png';
import openSwitch from './../../Images/OpenTriStateBuffer.png';

class TriStateBuffer extends Component {
    state =
    {
        switchState : 'Open',
        buttonLabel : 'Close Buffer'
    };

    getSwitchImage = () =>{
        if(this.state.switchState==='Closed')
        return closedSwitch;
        else 
        return openSwitch;
    };
    changeSwitchState = () =>{
        if(this.state.switchState==='Closed'){
            this.setState({switchState:'Open',buttonLabel:'Close Buffer'});
           
        }
        else{
            this.setState({switchState:'Closed',buttonLabel:'Open Buffer'});
           
        }
       
    };
  render() {
    return (
     <div>
          <img src={this.getSwitchImage()} />
          <button onClick={this.changeSwitchState.bind(this)}>{this.state.buttonLabel}</button>
          
     </div>
    );
  }
}

export default TriStateBuffer;
