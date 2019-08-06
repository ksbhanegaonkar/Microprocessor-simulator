import React from 'react';


const Switch = (prop) => {

    if(prop.switchState == '1'){
        return <button onClick={()=>prop.onClick(prop.switchPosition,0)}>1</button>
    }
    else {
        return <button onClick={()=>prop.onClick(prop.switchPosition,1)}>0</button>
    }


};

export default Switch;