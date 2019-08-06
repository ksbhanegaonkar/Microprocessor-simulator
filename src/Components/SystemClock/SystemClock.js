import React,{Component} from 'react';
import ClockPannel from './ClockPannel';
import SingleBitDisplay from './../LedDisplay/SingleBitDisplay'
import './SystemClock.css';

class SystemClock extends Component{


    

    render(){
        return (
            <div className="rectangle">
            Clock
            <br></br>
            <SingleBitDisplay displayValue={this.props.CurrentClockState === 0?'0':'1'}></SingleBitDisplay>
           Select clock mode : 
           <select value={this.props.ClockType} onChange={this.props.onClockModeSelect}>
                <option value="A">Astable Clock</option>
                 <option value="B">Monostable Clock</option>
                 <option value="C">Bistable Clock</option>
            </select>
            <br></br>
             <ClockPannel pannelType={this.props.ClockType} changeClock={this.props.changeClockState}
            triggerMonostableClockPulse={this.props.triggerMonostableClockPulse} 
            triggerAstableClockPulse={this.props.triggerAstableClockPulse} 
            stopAstableClockPulse={this.props.stopAstableClockPulse} 
            onAstableClockFrequencyChange={this.props.onAstableClockFrequencyChange} 
            astableClockPeriod={this.props.astableClockPeriod}
             ></ClockPannel>
          
           Current Clock State = {this.props.CurrentClockState === 0?'0':'1'}

            </div>
        );
    }

}

export default SystemClock;