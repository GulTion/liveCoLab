// onChange handlesheep


import io from "socket.io-client";
import _ from 'lodash';

const SERVER_URL = "http://localhost:5000"
// onChange Emit
function getProjectIdFromUrl(url) {
    const parts = url.split('/');
    const projectIdIndex = parts.indexOf('project') + 1;
    return parts[projectIdIndex] || null; // Handle cases where the ID might be missing
  }
document.livecolab = {
    setSpreadsheetData:()=>{},

    sendMessage:function emit(message){
        this.io.emit("send-message", {...this.info, message});
    },

    init:function init(){

        this.io = io(SERVER_URL, {
            transports: ['websocket']
          });

          this.pid = getProjectIdFromUrl(document.location.pathname)
          this.info = { roomId:this.pid , username:Math.random() }
          this.io.emit('join-room', this.info);
          this.io.on("receive-message", (data)=>{
            let mess = data.message;
            console.log(mess);
            
            switch(mess.type){
                case "POINT":
                    console.log("HERE");
                    
                    this.setSpreadsheetData(d => {
                        const updatedData = _.cloneDeep(d);
                        updatedData[parseInt(mess.y)][parseInt(mess.x)] = mess.value;
                        return updatedData;
                    
                    });
                    break;

                default:
                    break;
            }

          })

          

      
    }

    

}

