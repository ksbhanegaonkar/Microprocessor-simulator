import React,{Component} from 'react';
import './SystemClock.css';

class ClockPannel extends Component{

    render(){
        if(this.props.pannelType === 'A')
        return (
           <div> Astable
            <div>
                Select clock period
            <select value = {this.props.astableClockPeriod} onChange={this.props.onAstableClockFrequencyChange}>
                <option value="1000">1 Second</option>
                <option value="500">0.5 Second</option>
                <option value="250">0.25 Second</option>
                <option value="125">0.125 Second</option>
                
            </select>
            </div>
           
               <button onClick = {this.props.triggerAstableClockPulse}>Start Clock</button>
               <button onClick = {this.props.stopAstableClockPulse}>Stop Clock (HLT)</button>

           </div>
        );
        else  if(this.props.pannelType === 'B'){
            this.props.stopAstableClockPulse();
            return (
                <div> Monostable 
                    <br></br>
                    <button onClick = {this.props.triggerMonostableClockPulse}>Trigger clock pulse</button>
                 </div>);
        }
        else  if(this.props.pannelType === 'C'){
            this.props.stopAstableClockPulse();
            return (
                <div> Bistable 
                    <br></br>
                <button onClick={this.props.changeClock}> change clock state </button>
                 </div>
             );
        }
       
    }

}

export default ClockPannel;