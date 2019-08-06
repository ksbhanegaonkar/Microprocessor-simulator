import React from 'react';
import LedON from './../../Images/LedOn.png'
import LedOff from './../../Images/LedOff.png'
import LedDontCare from './../../Images/LedDontCare.png'

const LED = (prop) => {

    if(prop.ledState == '1'){
        return <img src={LedON}></img>
    }
    else if(prop.ledState == '0'){
        return <img src={LedOff}></img>
    }
    else if(prop.ledState == '*'){
        return <img src={LedDontCare}></img>
    }

};

export default LED;