import {   
    Alert,
} from 'react-native'
import { BleManager } from 'react-native-ble-plx';

export default class BleModule{
    constructor(){
	    this.isConnecting = false; 
        this.manager = new BleManager();
    }

    scan(){
        return new Promise( (resolve, reject) =>{
            this.manager.startDeviceScan(null, null, (error, device) => {                
                if (error) {
                    console.log('startDeviceScan error:',error)
                    if(error.errorCode == 102){
                        this.alert('Por favor, abra o seu telefone Bluetooth e procure novamente');
                    }
                    reject(error);            
                }else{
                    resolve(device);                        
                }              
            })

        });
    }

    stopScan(){
        //this.manager.stopDeviceScan();
        //console.log('stopDeviceScan');
    }

    destroy(){
        this.manager.destroy();
    }

    alert(text){
        Alert.alert('Prompt',text,[{ text:'Determinar',onPress:()=>{ } }]);
    }
}