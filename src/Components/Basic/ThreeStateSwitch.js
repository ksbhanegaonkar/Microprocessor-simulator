import React from 'react';


const ThreeStateSwitch = (prop) => {

    if(prop.switchState == '1'){
        return <button onClick={()=>prop.onClick(prop.switchPosition,'*')}>1</button>
    }
    else if(prop.switchState == '*'){
        return <button onClick={()=>prop.onClick(prop.switchPosition,0)}>*</button>
    }
    else if(prop.switchState == '0'){
        return <button onClick={()=>prop.onClick(prop.switchPosition,1)}>0</button>
    }

};

export default ThreeStateSwitch;