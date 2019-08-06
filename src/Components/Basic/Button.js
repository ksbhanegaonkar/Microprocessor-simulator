import React from 'react';
import './Button.css';

const Button = (prop) => {

    if(prop.buttonState == '1'){
        return <button id="Off" onClick={prop.onClick}>{prop.name}</button>
    }
    else {
        return <button id="On" onClick={prop.onClick}>{prop.name}</button>
    }


};

export default Button;