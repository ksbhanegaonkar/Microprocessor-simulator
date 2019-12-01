import React,{Component} from 'react';
import EightBitRegistor from './../Register/EightBitRegistor';
import FourBitCounter from './../Counter/FourBitCounter';
import SystemClock from './../SystemClock/SystemClock';
import ExternalInputPort from './../ExternalInputPort/ExternalInputPort'
import Accumulator from './../Accumulator/Accumulator'
import EightBitBus from '../Bus/EightBitBus';
import SixteenByteRAM from '../RAM/SixteenByteRAM';
import SevenSegmentDisplay from '../LedDisplay/SevenSegmentDisplay'
import ControlUnit from '../ControlUnit/ControlUnit'
import ThreeBitCounter from './../Counter/ThreeBitCounter';

class MainFrontPanel extends Component{
    intervalId = 0;
    busSignalContributer = {};

    constructor(props){
        super(props);

        this.state.romData.fill(0);
        this.state.romIndividualAddressBits.fill(0);



    }
    state = {
        ClockType : 'A',
        CurrentClockState : 0,
        astableClockPeriod : 1000,
        isHalt:0,
        currentCounterValue : 0,
        isCounterEnable : 0,
        counterOutputEnable : 0,
        jumpEnable:0,

        externalInputValue : 0,
        externalInputBusBuffer : 0,

        registorAvalue : 0,
        registorAInputEnable : 0,
        registorAOutputEnable : 0,

        registorBvalue : 0,
        registorBInputEnable : 0,
        registorBOutputEnable : 0,

        instructionRegisterValue : 0,
        instructionRegisterInputEnable : 0,
        instructionRegisterOutputEnable : 0,

        accumulatorValue : 0,
        carryValue :1,
        zeroValue :1,
        addSubtractFlag:0,
        accumulatorOutputEnable:0,

        ramAddress : 0,
        ramData : [30,47,224,30,40,50,60,70,80,90,100,110,120,130,28,14],
        ramMode : 'Run',
        ramProgramData :0,
        ramAddressInputEnable:0,
        ramDataOutputEnable:0,

        outputDisplayValue:0,
        outputDisplayInputEnable:0,

        dataOnBus:255,

        controlUnitMode : "AutoControl",
        controlWord:0,
        romAddress : 0,
        romData : new Array(1024),
        romProgramData:0,
        romIndividualAddressBits:new Array(10),
        tStateCounterValue:0
     };
     onClockModeSelect(event){
         this.setState({ClockType : event.target.value,CurrentClockState : 0})
     }
     triggerMonostableClockPulse(){
        setTimeout(this.changeClockState.bind(this), 1000);
        this.changeClockState();

    }

    triggerAstableClockPulse(){
        if(this.intervalId == 0){
            this.setState({isHalt:0});
           this.intervalId = setInterval(this.changeClockState.bind(this), this.state.astableClockPeriod);
        }
        

    }
    stopAstableClockPulse(){
        if(this.intervalId !== 0){
            this.setState({isHalt:1,currentCounterValue:0});
            clearInterval(this.intervalId);
            this.intervalId = 0;
         }
       
    }
    onAstableClockFrequencyChange(event){
        this.setState({astableClockPeriod : parseInt(event.target.value)});
        this.stopAstableClockPulse();
        
    }
     onRAMModeSelect(event){
        this.setState({ramMode : event.target.value})
    }

    onControlUnitModeSelect(event){
        this.setState({controlUnitMode : event.target.value});
       /* if(event.target.value === 'AutoControl'){
            this.setState({CurrentClockState : 1});
            this.changeClockState();
            console.log(this.state.counterOutputEnable);
        }*/
 
    }

     changeClockState(){
        let newState;
         if(this.state.CurrentClockState == 0){
            
            newState = {...this.state,CurrentClockState:1};
                if(newState.isCounterEnable==1){
                    if(this.state.currentCounterValue==15){
                        newState ={...newState, currentCounterValue : 0};
                    }else{
                        const newCount = this.state.currentCounterValue +1;
                        newState ={...newState, currentCounterValue : newCount};
                    }
                }

                if(newState.registorAInputEnable == 1){
                    newState ={...newState, registorAvalue : this.state.dataOnBus};
                 }
                 if(newState.registorBInputEnable == 1){
                    newState ={...newState, registorBvalue : this.state.dataOnBus};
                 }
                 if(newState.instructionRegisterInputEnable == 1){
                    newState ={...newState, instructionRegisterValue : this.state.dataOnBus};

                    let binaryInstructionRegisterValue = this.dec2bin(newState.instructionRegisterValue);
                    let binaryTStateCounterValue = this.dec2binFourBit(newState.tStateCounterValue);
                    let newRomAddress =    
                                    binaryInstructionRegisterValue[3]*Math.pow(2,0) + 
                                    binaryInstructionRegisterValue[2]*Math.pow(2,1) + 
                                    binaryInstructionRegisterValue[1]*Math.pow(2,2) + 
                                    binaryInstructionRegisterValue[0]*Math.pow(2,3) +
                                    binaryTStateCounterValue[3]*Math.pow(2,4) +
                                    binaryTStateCounterValue[2]*Math.pow(2,5) +
                                    binaryTStateCounterValue[1]*Math.pow(2,6) +
                                    this.state.carryValue*Math.pow(2,7) +
                                    this.state.zeroValue*Math.pow(2,8) 
                                    ;
                                    
                    newState ={...newState, romAddress : newRomAddress  };
                 }
                 if(newState.outputDisplayInputEnable == 1){
                    newState ={...newState, outputDisplayValue : this.state.dataOnBus};
                 }
                 if(newState.ramAddressInputEnable == 1){
                     let currentDataByte=this.binaryAnd(this.state.dataOnBus,15);
                    newState ={...newState, ramAddress : currentDataByte};
                 }
                 if(newState.jumpEnable == 1){
                    newState ={...newState, currentCounterValue : this.binaryAnd(this.state.dataOnBus,15)};
                 }

                if(newState.addSubtractFlag == 0){
                    const sum = newState.registorAvalue + newState.registorBvalue;
                    if(sum>255){
                        newState ={...newState, carryValue : 1,zeroValue : 0};
                        newState ={...newState, accumulatorValue : (sum-255)};
                    }else{
                        newState ={...newState, carryValue : 0,zeroValue : 0};
                        newState ={...newState, accumulatorValue : sum};
                    }
              
                }else{
                    const diff = newState.registorAvalue - newState.registorBvalue;
                    if(diff<0){
                        newState ={...newState, carryValue : 1,zeroValue : 0};
                        newState ={...newState, accumulatorValue : (diff+255)};
                    }else if(diff===0){
                        newState ={...newState, carryValue : 0,zeroValue : 1};
                        newState ={...newState, accumulatorValue : diff};
                    }
                    else{
                        newState ={...newState, carryValue : 0,zeroValue : 0};
                        newState ={...newState, accumulatorValue : diff};
                    }
                 }



                

               
                
               
 
            this.setState(newState);
         }else{
            newState = {...this.state,CurrentClockState:0};
            let newTStateCounterValue = newState.tStateCounterValue;
            if(newTStateCounterValue == 5){
               newTStateCounterValue=0;
            }
            else{
                newTStateCounterValue++;
            }

            let binaryInstructionRegisterValue = this.dec2bin(newState.instructionRegisterValue);
            let binaryTStateCounterValue = this.dec2binFourBit(newTStateCounterValue);
            let newRomAddress =    
                            binaryInstructionRegisterValue[3]*Math.pow(2,0) + 
                            binaryInstructionRegisterValue[2]*Math.pow(2,1) + 
                            binaryInstructionRegisterValue[1]*Math.pow(2,2) + 
                            binaryInstructionRegisterValue[0]*Math.pow(2,3) +
                            binaryTStateCounterValue[3]*Math.pow(2,4) +
                            binaryTStateCounterValue[2]*Math.pow(2,5) +
                            binaryTStateCounterValue[1]*Math.pow(2,6) +
                            this.state.carryValue*Math.pow(2,7) +
                            this.state.zeroValue*Math.pow(2,8) 
                            ;

                            newState ={...newState,tStateCounterValue:newTStateCounterValue, romAddress : newRomAddress  };
                            this.setState(newState);

                            if(this.state.controlUnitMode == 'AutoControl'){
                                this.applyControlWord(this.state.romData[this.state.romAddress]);  
                             }
             
                            

         
         }
         
    }

    getBusValue(){
        if(this.isEmpty(this.busSignalContributer)){
            return 255;
        }
        let val =255;
        for(let key in this.busSignalContributer) {
                val = this.binaryAnd(val,this.busSignalContributer[key]);
        }
        return val;
    }
    binaryAnd(a,b){
        let val = 0;
        let aBin = this.dec2bin(a);
        let bBin = this.dec2bin(b);
        for(let i=0;i<8;i++){
            val += aBin[7-i]*bBin[7-i]<<i;
        }
        return val;
    }
    isEmpty(obj) {
        for(let key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    enableCounter(){
        this.setState({isCounterEnable:1});
    }
    dissableCounter(){
        this.setState({isCounterEnable:0})
    }

    dec2hex(dec){
        return (parseInt(dec, 10).toString(16)).padStart(2, 0);
       
    }

    dec2bin(dec){
        return (parseInt(dec, 10).toString(2)).padStart(8, 0);
       
    }

    dec2binFourBit(dec){
        return (parseInt(dec, 10).toString(2)).padStart(4, 0);
       
    }
    dec2binTenBit(dec){
        return (parseInt(dec, 10).toString(2)).padStart(10, 0);
       
    }
    dec2binFifteenBit(dec){
        return (parseInt(dec, 10).toString(2)).padStart(15, 0);
       
    }
    dec2binSixteenBit(dec){
        return (parseInt(dec, 10).toString(2)).padStart(16, 0);
       
    }
    setExternalInputValue(inputValue){
        this.setState({externalInputValue : inputValue});
    }
    loadExtrnalInput(bitPosition,bitValue){
       let newValue;
     
        if(bitValue == 1){
             newValue = this.state.externalInputValue + Math.pow(2,bitPosition);
            
        }
        else{
             newValue = this.state.externalInputValue - Math.pow(2,bitPosition);
             
        }
        if(this.state.externalInputBusBuffer == 1){
            this.busSignalContributer = {...this.busSignalContributer,externalInputValue:newValue};
            this.setState({externalInputValue : newValue,dataOnBus : this.getBusValue()});
        }
        this.setState({externalInputValue : newValue});
       
    }

    loadRAMDataInput(bitPosition,bitValue){
        let newValue;
         if(bitValue == 1){
              newValue = this.state.ramProgramData+ Math.pow(2,bitPosition);
             
         }
         else{
              newValue = this.state.ramProgramData - Math.pow(2,bitPosition);
              
         }
         
         this.setState({ramProgramData : newValue});
        
     }
     clearRAMInputData(){
        this.setState({ramProgramData : 0});
     }
     updateRamData(){
         let newRamData = this.state.ramData;
         newRamData[this.state.ramAddress] = this.state.ramProgramData;
         this.setState({ramData : newRamData});
     }
     downloadRamData(){
        let newRamProgramData = this.state.ramData[this.state.ramAddress];
        this.setState({ramProgramData : newRamProgramData});
    }
     loadRAMAddressInput(bitPosition,bitValue){
        let newValue;
         if(bitValue == 1){
              newValue = this.state.ramAddress + Math.pow(2,bitPosition);
             
         }
         else{
              newValue = this.state.ramAddress - Math.pow(2,bitPosition);
              
         }
         
         this.setState({ramAddress : newValue});
        
     }
     clearRAMAddressInput(){
        this.setState({ramAddress : 0});
     }
     incrementRAMAddress(){
         let newAddress = this.state.ramAddress;
         if(newAddress<15){
             newAddress++;
             this.setState({ramAddress : newAddress});
         }
        
     }
     decrementRAMAddress(){
        let newAddress = this.state.ramAddress;
        if(newAddress>0){
            newAddress--;
            this.setState({ramAddress : newAddress});
        }
       
    }
    toggleRamAddressInputEnable(){
        const currentState = this.state.ramAddressInputEnable;
        if(currentState == 1){
            this.setState({ramAddressInputEnable : 0});
        }else{
            this.setState({ramAddressInputEnable : 1});
        }
    }
    toggleRamDataOutputEnable(){
        let currentState = this.state.ramDataOutputEnable;
        if(currentState == 1){
            delete this.busSignalContributer.currentRamDataByte;
            this.setState({ramDataOutputEnable : 0,dataOnBus : this.getBusValue()});
        }else{
            this.busSignalContributer = {...this.busSignalContributer,currentRamDataByte:this.state.ramData[this.state.ramAddress]};
            this.setState({ramDataOutputEnable : 1,dataOnBus : this.getBusValue()});
            
        }
    }



        loadExtrnalInput(bitPosition,bitValue){
       let newValue;
     
        if(bitValue == 1){
             newValue = this.state.externalInputValue + Math.pow(2,bitPosition);
            
        }
        else{
             newValue = this.state.externalInputValue - Math.pow(2,bitPosition);
             
        }
        if(this.state.externalInputBusBuffer == 1){
            this.busSignalContributer = {...this.busSignalContributer,externalInputValue:newValue};
            this.setState({externalInputValue : newValue,dataOnBus : this.getBusValue()});
        }
        this.setState({externalInputValue : newValue});
       
    }

    loadRAMDataInput(bitPosition,bitValue){
        let newValue;
         if(bitValue == 1){
              newValue = this.state.ramProgramData+ Math.pow(2,bitPosition);
             
         }
         else{
              newValue = this.state.ramProgramData - Math.pow(2,bitPosition);
              
         }
         
         this.setState({ramProgramData : newValue});
        
     }
     clearRAMInputData(){
        this.setState({ramProgramData : 0});
     }
     updateRamData(){
         let newRamData = this.state.ramData;
         newRamData[this.state.ramAddress] = this.state.ramProgramData;
         this.setState({ramData : newRamData});
     }
     uploadRAMDataFromFile(newRamData){
        this.setState({ramData:newRamData});
    }
     downloadRamData(){
        let newRamProgramData = this.state.ramData[this.state.ramAddress];
        this.setState({ramProgramData : newRamProgramData});
    }
     loadRAMAddressInput(bitPosition,bitValue){
        let newValue;
         if(bitValue == 1){
              newValue = this.state.ramAddress + Math.pow(2,bitPosition);
             
         }
         else{
              newValue = this.state.ramAddress - Math.pow(2,bitPosition);
              
         }
         
         this.setState({ramAddress : newValue});
        
     }
     clearRAMAddressInput(){
        this.setState({ramAddress : 0});
     }
     incrementRAMAddress(){
         let newAddress = this.state.ramAddress;
         if(newAddress<15){
             newAddress++;
             this.setState({ramAddress : newAddress});
         }
        
     }
     decrementRAMAddress(){
        let newAddress = this.state.ramAddress;
        if(newAddress>0){
            newAddress--;
            this.setState({ramAddress : newAddress});
        }
       
    }
    resetExternalInputValue(){
        this.setState({externalInputValue : 0});
    }
    toggleExternalInputBusBufferState(){
        let currentState = this.state.externalInputBusBuffer;
        if(currentState == 1){
            delete this.busSignalContributer.externalInputValue;
            this.setState({externalInputBusBuffer : 0,dataOnBus : this.getBusValue()});
        }else{
            this.busSignalContributer = {...this.busSignalContributer,externalInputValue:this.state.externalInputValue};
            this.setState({externalInputBusBuffer : 1,dataOnBus : this.getBusValue()});
            
        }
    }

    toggleCounterOutputEnable(){
        let currentState = this.state.counterOutputEnable;
        if(currentState == 1){
            delete this.busSignalContributer.currentCounterValue;
            this.setState({counterOutputEnable : 0,dataOnBus : this.getBusValue()});
        }else{
            this.busSignalContributer = {...this.busSignalContributer,currentCounterValue:this.state.currentCounterValue};
            this.setState({counterOutputEnable : 1,dataOnBus : this.getBusValue()});
        }
    }
    toggleRegistorAInputEnableState(){
        const currentState = this.state.registorAInputEnable;
        if(currentState == 1){
            this.setState({registorAInputEnable : 0});
        }else{
            this.setState({registorAInputEnable : 1});
        }
    }

    toggleRegistorAOutputEnableState(){
        const currentState = this.state.registorAOutputEnable;
        if(currentState == 1){
            delete this.busSignalContributer.registorAvalue;
            this.setState({registorAOutputEnable : 0,dataOnBus : this.getBusValue()});
        }else{
            this.busSignalContributer = {...this.busSignalContributer,registorAvalue:this.state.registorAvalue};
            this.setState({registorAOutputEnable : 1,dataOnBus : this.getBusValue()});
        }
    }

    toggleRegistorBInputEnableState(){
        const currentState = this.state.registorBInputEnable;
        if(currentState == 1){
            this.setState({registorBInputEnable : 0});
        }else{
            this.setState({registorBInputEnable : 1});
        }
    }

    toggleRegistorBOutputEnableState(){
        const currentState = this.state.registorBOutputEnable;
        if(currentState == 1){
            delete this.busSignalContributer.registorBvalue;
            this.setState({registorBOutputEnable : 0,dataOnBus : this.getBusValue()});
        }else{
            this.busSignalContributer = {...this.busSignalContributer,registorBvalue:this.state.registorBvalue};
            this.setState({registorBOutputEnable : 1,dataOnBus : this.getBusValue()});
        }
    }

    toggleInstructionRegistorInputEnable(){
        const currentState = this.state.instructionRegisterInputEnable;
        if(currentState == 1){
            this.setState({instructionRegisterInputEnable : 0});
        }else{
            this.setState({instructionRegisterInputEnable : 1});
        }
    }

    toggleInstructionRegistorOutputEnable(){
        const currentState = this.state.instructionRegisterOutputEnable;
        if(currentState == 1){
            delete this.busSignalContributer.instructionRegisterValue;
            this.setState({instructionRegisterOutputEnable : 0,dataOnBus : this.getBusValue()});
        }else{
            let newInstructionRegistorValue = this.binaryAnd(this.state.instructionRegisterValue,15);
            this.busSignalContributer = {...this.busSignalContributer,instructionRegisterValue:newInstructionRegistorValue};
            this.setState({instructionRegisterOutputEnable : 1,dataOnBus : this.getBusValue()});
        }
    }


    toggleAccumulatorOutputEnable(){
        const currentState = this.state.accumulatorOutputEnable;
        if(currentState == 1){
            delete this.busSignalContributer.accumulatorValue;
            this.setState({accumulatorOutputEnable : 0,dataOnBus : this.getBusValue()});
        }else{
            this.busSignalContributer = {...this.busSignalContributer,accumulatorValue:this.state.accumulatorValue};
            this.setState({accumulatorOutputEnable : 1,dataOnBus : this.getBusValue()});
        }
    }
    toggleAddSubtractFlag(){
        const currentState = this.state.addSubtractFlag;
        if(currentState == 1){
            this.setState({addSubtractFlag : 0});
        }else{
            this.setState({addSubtractFlag : 1});
        }
    }
    toggleCountEnable(){
        const currentState = this.state.isCounterEnable;
        if(currentState == 1){
            this.setState({isCounterEnable : 0});
        }else{
            this.setState({isCounterEnable : 1});
        }
    }
    jump(){
        const currentState = this.state.jumpEnable;
        if(currentState == 1){
            this.setState({jumpEnable : 0});
        }else{
            this.setState({jumpEnable : 1});
        }
    }
    toggleOutputDisplayInputEnable(){
        const currentState = this.state.outputDisplayInputEnable;
        if(currentState == 1){
            this.setState({outputDisplayInputEnable : 0});
        }else{
            this.setState({outputDisplayInputEnable : 1});
        }
    }


    loadROMDataInput(bitPosition,bitValue){
        let newValue;
         if(bitValue == 1){
              newValue = this.state.romProgramData+ Math.pow(2,bitPosition);
             
         }
         else{
              newValue = this.state.romProgramData - Math.pow(2,bitPosition);
              
         }
         
         this.setState({romProgramData : newValue});
        
     }
     clearROMInputData(){
        this.setState({romProgramData : 0});
     }
     updateRomData(){
        let newRomData = this.state.romData;
        for(let i=0;i<this.state.romData.length;i++){
           if(this.validateAddress(i,this.state.romIndividualAddressBits)){
                newRomData[i] = this.state.romProgramData;
           }
        }

        let newState = {...this.state,romData : newRomData};
        this.setState(newState);
        this.applyControlWord(this.state.romData[0]);





         
     }
      
     uploadROMDataFromFile(newRomData){
         this.setState({romData:newRomData});
         this.applyControlWord(this.state.romData[0]);
     }

     applyControlWord(word){
        let binaryControlWord = this.dec2binFifteenBit(word);
        if(binaryControlWord[0]==1 && this.state.counterOutputEnable==0){
            this.toggleCounterOutputEnable();
        }
        else if(binaryControlWord[0]==0 && this.state.counterOutputEnable==1){
            this.toggleCounterOutputEnable();
        }
        
        if(binaryControlWord[1]==1 && this.state.isCounterEnable==0){
            this.toggleCountEnable();
        }
        else if(binaryControlWord[1]==0 && this.state.isCounterEnable==1){
            this.toggleCountEnable();
        }

        if(binaryControlWord[2]==1 && this.state.jumpEnable==0){
            this.jump();
        }
        else if(binaryControlWord[2]==0 && this.state.jumpEnable==1){
            this.jump();
        }

        if(binaryControlWord[3]==1 && this.state.registorAInputEnable==0){
            this.toggleRegistorAInputEnableState();
        }
        else if(binaryControlWord[3]==0 && this.state.registorAInputEnable==1){
            this.toggleRegistorAInputEnableState();
        }

        if(binaryControlWord[4]==1 && this.state.registorAOutputEnable==0){
            this.toggleRegistorAOutputEnableState();
        }
        else if(binaryControlWord[4]==0 && this.state.registorAOutputEnable==1){
            this.toggleRegistorAOutputEnableState();
        }


        if(binaryControlWord[5]==1 && this.state.registorBInputEnable==0){
            this.toggleRegistorBInputEnableState();
        }
        else if(binaryControlWord[5]==0 && this.state.registorBInputEnable==1){
            this.toggleRegistorBInputEnableState();
        }

        if(binaryControlWord[6]==1 && this.state.registorBOutputEnable==0){
            this.toggleRegistorBOutputEnableState();
        }
        else if(binaryControlWord[6]==0 && this.state.registorBOutputEnable==1){
            this.toggleRegistorBOutputEnableState();
        }


        if(binaryControlWord[7]==1 && this.state.accumulatorOutputEnable==0){
            this.toggleAccumulatorOutputEnable();
        }
        else if(binaryControlWord[7]==0 && this.state.accumulatorOutputEnable==1){
            this.toggleAccumulatorOutputEnable();
        }

        if(binaryControlWord[8]==1 && this.state.addSubtractFlag==0){
            this.toggleAddSubtractFlag();
        }
        else if(binaryControlWord[8]==0 && this.state.addSubtractFlag==1){
            this.toggleAddSubtractFlag();
        }


        if(binaryControlWord[9]==1 && this.state.outputDisplayInputEnable==0){
            this.toggleOutputDisplayInputEnable();
        } 
        else if(binaryControlWord[9]==0 && this.state.outputDisplayInputEnable==1){
            this.toggleOutputDisplayInputEnable();
        }

        if(binaryControlWord[10]==1 && this.state.ramAddressInputEnable==0){
            this.toggleRamAddressInputEnable();
        }
        else if(binaryControlWord[10]==0 && this.state.ramAddressInputEnable==1){
            this.toggleRamAddressInputEnable();
        }


        if(binaryControlWord[11]==1 && this.state.ramDataOutputEnable==0){
            this.toggleRamDataOutputEnable();
        }
        else if(binaryControlWord[11]==0 && this.state.ramDataOutputEnable==1){
            this.toggleRamDataOutputEnable();
        }

        if(binaryControlWord[12]==1 && this.state.instructionRegisterInputEnable==0){
            this.toggleInstructionRegistorInputEnable();
        }
        else if(binaryControlWord[12]==0 && this.state.instructionRegisterInputEnable==1){
            this.toggleInstructionRegistorInputEnable();
        }

        if(binaryControlWord[13]==1 && this.state.instructionRegisterOutputEnable==0){
            this.toggleInstructionRegistorOutputEnable();
        }
        else if(binaryControlWord[13]==0 && this.state.instructionRegisterOutputEnable==1){
            this.toggleInstructionRegistorOutputEnable();
        }

        if(binaryControlWord[14]==1){
            this.stopAstableClockPulse();
        }

     }
     initiateRomData(){
        let newRomData = this.state.romData;
        for(let i=0;i<this.state.romData.length;i++){
           if(this.validateAddress(i,this.state.romIndividualAddressBits)){
                newRomData[i] = this.state.romProgramData;
           }
        }
        return newRomData;
     }
     validateAddress(address,userEnteredAddress){
        let binaryAddress = this.dec2binTenBit(address);
        if( (userEnteredAddress[0] == '*' ||binaryAddress[0]==userEnteredAddress[0]) &&
            (userEnteredAddress[1] == '*' ||binaryAddress[1]==userEnteredAddress[1]) &&
            (userEnteredAddress[2] == '*' ||binaryAddress[2]==userEnteredAddress[2]) &&
            (userEnteredAddress[3] == '*' ||binaryAddress[3]==userEnteredAddress[3]) &&
            (userEnteredAddress[4] == '*' ||binaryAddress[4]==userEnteredAddress[4]) &&
            (userEnteredAddress[5] == '*' ||binaryAddress[5]==userEnteredAddress[5]) &&
            (userEnteredAddress[6] == '*' ||binaryAddress[6]==userEnteredAddress[6]) &&
            (userEnteredAddress[7] == '*' ||binaryAddress[7]==userEnteredAddress[7]) &&
            (userEnteredAddress[8] == '*' ||binaryAddress[8]==userEnteredAddress[8]) &&
            (userEnteredAddress[9] == '*' ||binaryAddress[9]==userEnteredAddress[9]) 
        ) {
            return true;
        }
        return false;
     }
     downloadRomData(){
        let newRomProgramData = this.state.romData[this.state.romAddress];
        this.setState({romProgramData : newRomProgramData});
    }
     loadROMAddressInput(bitPosition,bitValue){
        
        let newRomIndividualAddressBits = this.state.romIndividualAddressBits;
        newRomIndividualAddressBits[9-bitPosition] = bitValue;
         this.setState({romIndividualAddressBits : newRomIndividualAddressBits});
        
     }
     clearROMAddressInput(){
         let newRomIndividualAddressBits = this.state.romIndividualAddressBits;
         newRomIndividualAddressBits.fill(0);

        this.setState({romIndividualAddressBits : newRomIndividualAddressBits});
     }
     incrementROMAddress(){
         let newAddress = this.state.romAddress;
         if(newAddress<15){
             newAddress++;
             this.setState({romAddress : newAddress});
         }
        
     }
     decrementROMAddress(){
        let newAddress = this.state.romAddress;
        if(newAddress>0){
            newAddress--;
            this.setState({romAddress : newAddress});
        }
       
    }


    updateManualControlSignal(bitPosition,bitValue){
           switch(bitPosition){
               case "0":
               this.toggleCounterOutputEnable();
               break;

               case "1":
               this.toggleCountEnable();
               break;

               case "2":
               this.jump();
               break;

               case "3":
               this.toggleRegistorAInputEnableState();
               break;

               case "4":
               this.toggleRegistorAOutputEnableState();
               break;

               case "5":
               this.toggleRegistorBInputEnableState();
               break;

               case "6":
               this.toggleRegistorBOutputEnableState();
               break;

               case "7":
               this.toggleAccumulatorOutputEnable();
               break;

               case "8":
               this.toggleAddSubtractFlag();
               break;

               case "9":
               this.toggleOutputDisplayInputEnable();
               break;

               case "10":
               this.toggleRamAddressInputEnable();
               break;

               case "11":
               this.toggleRamDataOutputEnable();
               break;
    
               case "12":
               this.toggleInstructionRegistorInputEnable();
               break;
               
               case "13":
               this.toggleInstructionRegistorOutputEnable();
               break;

               case "14":
               this.stopAstableClockPulse();
               break;
           }
                
            
     }

    render(){
        return (

            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>
                            <table>
                    <tbody>
                <tr>
                    <td>
                    <SystemClock ClockType={this.state.ClockType} CurrentClockState={this.state.CurrentClockState} 
                    onClockModeSelect={this.onClockModeSelect.bind(this)}
                    changeClockState={this.changeClockState.bind(this)} 
                    triggerMonostableClockPulse={this.triggerMonostableClockPulse.bind(this)} 
                    triggerAstableClockPulse={this.triggerAstableClockPulse.bind(this)} 
                    stopAstableClockPulse={this.stopAstableClockPulse.bind(this)} 
                    onAstableClockFrequencyChange={this.onAstableClockFrequencyChange.bind(this)} 
                    astableClockPeriod={this.state.astableClockPeriod}
                     ></SystemClock>
                   
                    </td>
                </tr>
                <tr>
                    <td>
                    <SixteenByteRAM 
                        currentValue={this.state.registorAvalue} 
                        dec2bin={this.dec2bin}
                        dec2binFourBit={this.dec2binFourBit.bind(this)} 
                        ramData={this.state.ramData} 
                        ramAddress={this.state.ramAddress} 
                        loadRAMDataInput={this.loadRAMDataInput.bind(this)} 
                        loadRAMAddressInput={this.loadRAMAddressInput.bind(this)} 
                        ramMode={this.state.ramMode} 
                        onRAMModeSelect={this.onRAMModeSelect.bind(this)} 
                        updateRamData={this.updateRamData.bind(this)} 
                        ramProgramData={this.state.ramProgramData} 
                        clearRAMInputData={this.clearRAMInputData.bind(this)} 
                        clearRAMAddressInput={this.clearRAMAddressInput.bind(this)} 
                        incrementRAMAddress={this.incrementRAMAddress.bind(this)} 
                        decrementRAMAddress={this.decrementRAMAddress.bind(this)} 
                        downloadRamData={this.downloadRamData.bind(this)} 
                        ramAddressInputEnable={this.state.ramAddressInputEnable} 
                        ramDataOutputEnable={this.state.ramDataOutputEnable} 
                        toggleRamAddressInputEnable={this.toggleRamAddressInputEnable.bind(this)} 
                        toggleRamDataOutputEnable={this.toggleRamDataOutputEnable.bind(this)} 
                        uploadRAMDataFromFile={this.uploadRAMDataFromFile.bind(this)} 
                        ></SixteenByteRAM>
                    </td>
                      
                        
                </tr>
                <tr>
                    <td>
                    <EightBitRegistor currentValue={this.state.instructionRegisterValue}
                        dec2bin={this.dec2bin} 
                        registorName="Instruction Register" 
                        registorvalue={this.state.instructionRegisterValue}
                        registorInputEnable={this.state.instructionRegisterInputEnable} 
                        registorOutputEnable={this.state.instructionRegisterOutputEnable} 
                        toggleRegistorInputEnableState={this.toggleInstructionRegistorInputEnable.bind(this)} 
                        toggleRegistorOutputEnableState={this.toggleInstructionRegistorOutputEnable.bind(this)}
                        ></EightBitRegistor>
                    </td>
                </tr>
                <tr>
                    <td>
                    <ExternalInputPort
                    externalInputValue={this.dec2bin(this.state.externalInputValue)} 
                    externalInputIntValue={this.state.externalInputValue} 
                    setExternalInputValue={this.setExternalInputValue.bind(this)} 
                    loadExtrnalInput={this.loadExtrnalInput.bind(this)} 
                    resetExternalInputValue={this.resetExternalInputValue.bind(this)} 
                    externalInputBusBuffer={this.state.externalInputBusBuffer} 
                    toggleExternalInputBusBufferState={this.toggleExternalInputBusBufferState.bind(this)}
                    ></ExternalInputPort>
                    </td>
                </tr>
                <tr>
                    <td>
                        <ThreeBitCounter currentCounterValue={this.state.tStateCounterValue} 
                        dec2binFourBit={this.dec2binFourBit}
                        ></ThreeBitCounter>
                    </td>
                </tr>

                </tbody>
                </table>
                            </td>
                            <td>
                    <EightBitBus currentValue = {this.state.dataOnBus} 
                     dec2bin={this.dec2bin} 
                     ></EightBitBus>
                    </td>
                            <td>
                            <table>
                    <tbody>
                <tr>

                    <td>
                        <FourBitCounter currentCounterValue={this.state.currentCounterValue}
                        isCounterEnable={this.state.isCounterEnable}  
                        enableCounter={this.enableCounter.bind(this)} 
                        dissableCounter={this.dissableCounter.bind(this)} 
                        dec2binFourBit={this.dec2binFourBit} 
                        counterOutputEnable={this.state.counterOutputEnable} 
                        toggleCounterOutputEnable={this.toggleCounterOutputEnable.bind(this)} 
                        toggleCountEnable={this.toggleCountEnable.bind(this)} 
                        jump={this.jump.bind(this)} 
                        jumpEnable={this.state.jumpEnable}
                         ></FourBitCounter>
                    </td>
                </tr>

                <tr>

                    <td>
                        <EightBitRegistor currentValue={this.state.registorAvalue}
                        dec2bin={this.dec2bin} 
                        registorName="Register A" 
                        registorvalue={this.state.registorAvalue}
                        registorInputEnable={this.state.registorAInputEnable} 
                        registorOutputEnable={this.state.registorAOutputEnable} 
                        toggleRegistorInputEnableState={this.toggleRegistorAInputEnableState.bind(this)} 
                        toggleRegistorOutputEnableState={this.toggleRegistorAOutputEnableState.bind(this)}
                        ></EightBitRegistor>
                    </td>
                </tr>
                <tr>

                    <td>
                    <Accumulator
                    currentValue={this.state.accumulatorValue} 
                     dec2bin={this.dec2bin} 
                     firstOperandValue={this.state.registorAvalue} 
                     secondOperandValue={this.state.registorBvalue} 
                     addSubtractFlag={this.state.addSubtractFlag} 
                     accumulatorOutputEnable={this.state.accumulatorOutputEnable} 
                     toggleAccumulatorOutputEnable={this.toggleAccumulatorOutputEnable.bind(this)} 
                     toggleAddSubtractFlag={this.toggleAddSubtractFlag.bind(this)} 
                     carryValue={this.state.carryValue}
                     zeroValue={this.state.zeroValue}
                    >   </Accumulator>
                    </td>
                </tr>
                <tr>

                    <td>
                    <EightBitRegistor currentValue={this.state.registorBvalue}
                        dec2bin={this.dec2bin} 
                        registorName="Register B" 
                        registorvalue={this.state.registorBvalue}
                        registorInputEnable={this.state.registorBInputEnable} 
                        registorOutputEnable={this.state.registorBOutputEnable} 
                        toggleRegistorInputEnableState={this.toggleRegistorBInputEnableState.bind(this)} 
                        toggleRegistorOutputEnableState={this.toggleRegistorBOutputEnableState.bind(this)}
                        ></EightBitRegistor>
                    </td>
                </tr>
                <tr>
                    <td>
                        <SevenSegmentDisplay
                        displayValue={this.state.outputDisplayValue} 
                        toggleOutputDisplayInputEnable={this.toggleOutputDisplayInputEnable.bind(this)}
                        outputDisplayInputEnable={this.state.outputDisplayInputEnable}
                        ></SevenSegmentDisplay>
                    </td>
                </tr>
                </tbody>
                </table>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="3">
                                <ControlUnit
                                onControlUnitModeSelect={this.onControlUnitModeSelect.bind(this)} 
                                controlUnitMode={this.state.controlUnitMode} 
                                updateManualControlSignal={this.updateManualControlSignal.bind(this)} 
                                counterOutputEnable={this.state.counterOutputEnable} 
                                isCounterEnable={this.state.isCounterEnable} 
                                jumpEnable={this.state.jumpEnable} 
                                registorAInputEnable={this.state.registorAInputEnable} 
                                registorAOutputEnable={this.state.registorAOutputEnable} 
                                registorBInputEnable={this.state.registorBInputEnable} 
                                registorBOutputEnable={this.state.registorBOutputEnable} 
                                addSubtractFlag={this.state.addSubtractFlag} 
                                accumulatorOutputEnable={this.state.accumulatorOutputEnable} 
                                outputDisplayInputEnable={this.state.outputDisplayInputEnable} 
                                ramAddressInputEnable={this.state.ramAddressInputEnable} 
                                ramDataOutputEnable={this.state.ramDataOutputEnable} 
                                instructionRegisterInputEnable={this.state.instructionRegisterInputEnable} 
                                instructionRegisterOutputEnable={this.state.instructionRegisterOutputEnable} 
                                stopAstableClockPulse={this.stopAstableClockPulse.bind(this)} 
                                isHalt={this.intervalId==0?1:0} 
                                romAddress={this.state.romAddress} 
                                romIndividualAddressBits={this.state.romIndividualAddressBits} 
                                romData={this.state.romData} 
                                dec2bin={this.dec2bin} 
                                dec2binFourBit={this.dec2binFourBit.bind(this)}  
                                dec2binTenBit={this.dec2binTenBit.bind(this)}  
                                dec2binFifteenBit={this.dec2binFifteenBit.bind(this)}  
                                loadROMAddressInput={this.loadROMAddressInput.bind(this)}
                                clearROMAddressInput={this.clearROMAddressInput.bind(this)} 
                                incrementROMAddress={this.incrementROMAddress.bind(this)} 
                                decrementROMAddress={this.decrementROMAddress.bind(this)} 
                                loadROMDataInput={this.loadROMDataInput.bind(this)}
                                clearROMInputData={this.clearROMInputData.bind(this)}
                                updateRomData={this.updateRomData.bind(this)}
                                downloadRomData={this.downloadRomData.bind(this)} 
                                romProgramData={this.state.romProgramData} 
                                uploadROMDataFromFile={this.uploadROMDataFromFile.bind(this)} 
                                ></ControlUnit>
                            </td>
                        </tr>
                    </tbody>
                </table>
 
       
      
      

            </div>

        );
    }

}

export default MainFrontPanel;