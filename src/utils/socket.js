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
    setComment:function comment(mess){
       
    },
    setConnectedUsers:()=>{},

    setChartOptions:()=>{},

    init:function init(){

        this.io = io(SERVER_URL, {
            transports: ['websocket']
          });

          this.pid = getProjectIdFromUrl(document.location.pathname)
          this.info = { roomId:this.pid , username:localStorage.getItem('userName') }
          this.io.emit('join-room', this.info);
          this.io.on("user-joined", (data)=>{
            this.setConnectedUsers(d=>[...d, {username:data.username, role:"editor"}])
                console.log(data);
                
          });

          this.io.on("room-users", d=>{
                this.setConnectedUsers(d.map(e=>({username:data.username, role:"editor"})))
          })    
          this.io.on("receive-message", (data)=>{
            let mess = data.message;
      
            
            switch(mess.type){
                case "POINT":
            
                    this.setSpreadsheetData(d => {
                        const updatedData = _.cloneDeep(d);
                        updatedData[parseInt(mess.y)][parseInt(mess.x)] = mess.value;
                        return updatedData;
                    
                    });
                    break;

                case "BULK":
                    this.setSpreadsheetData([...mess.data]);
                    break;
                
                case "COMMENT_TEXT":
                    this.setComment(e=>([...e, {text:mess.text, sender:mess.userName}]))
                    break;

                case "CHART_OPTION":
                    this.setChartOptions(mess.data);

                default:
                    break;
            }

          })

          

      
    }

    

}

