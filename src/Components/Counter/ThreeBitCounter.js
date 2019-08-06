import React,{Component} from 'react';
import ThreeBitDisplay  from './../LedDisplay/ThreeBitDisplay';
import SingleBitDisplay  from './../LedDisplay/SingleBitDisplay';
import './FourBitCounter.css'
class ThreeBitCounter extends Component{

   

    render(){
       
        return (
                <div className="rectangle">
                T state Counter 
                <br></br>
                Counter Output : {this.props.currentCounterValue}
                <ThreeBitDisplay displayValue={this.props.dec2binFourBit(this.props.currentCounterValue)}></ThreeBitDisplay>
               
    
                T State position :
               
                <table border="2">
                    <tbody>
                        <tr>
                            <td>
                                T0
                            </td>
                            <td>
                                T1
                            </td>
                            <td>
                                T2
                            </td>
                            <td>
                                T3
                            </td>
                            <td>
                                T4
                            </td>
                            <td>
                                T5
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <SingleBitDisplay displayValue={this.props.currentCounterValue==0?1:0}></SingleBitDisplay>
                            </td>
                            <td>
                                <SingleBitDisplay displayValue={this.props.currentCounterValue==1?1:0}></SingleBitDisplay>
                            </td>
                            <td>
                                <SingleBitDisplay displayValue={this.props.currentCounterValue==2?1:0}></SingleBitDisplay>
                            </td>
                            <td>
                                <SingleBitDisplay displayValue={this.props.currentCounterValue==3?1:0}></SingleBitDisplay>
                            </td>
                            <td>
                                <SingleBitDisplay displayValue={this.props.currentCounterValue==4?1:0}></SingleBitDisplay>
                            </td>
                            <td>
                                <SingleBitDisplay displayValue={this.props.currentCounterValue==5?1:0}></SingleBitDisplay>
                            </td>
                        </tr>
                    </tbody>
                </table>
        
              
               


                </div>
        );
    }
};

export default ThreeBitCounter;

