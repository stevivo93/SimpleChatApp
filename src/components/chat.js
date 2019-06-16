import React, {Component} from 'react';
import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyBFRKiOkBx6lZgWOYS6f7H9pHkhLgQLgMQ",
    authDomain: "simple-chat-e4208.firebaseapp.com",
    databaseURL: "https://simple-chat-e4208.firebaseio.com",
    projectId: "simple-chat-e4208",
    storageBucket: "simple-chat-e4208.appspot.com",
    messagingSenderId: "456147088568",
    appId: "1:456147088568:web:aae4d3251806efbf"
  };
  
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
messaging.requestPermission().then(function(){
    // console.log('have');
}).catch(function(err){
    // console.log('error');
})

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user : localStorage.getItem('user'),
            target : '',
            userList : ['Ramona', 'Dillon', 'Ligia'],
            targetList : [],
            message:'',
            messages:[],
            allMessage:[],
        }
    }

    componentDidMount() {
        let target = [];
        this.state.userList.map( (user) => {
            if(user !== this.state.user){
                target.push(user);
            }
            return target
        })
        this.setState({
            targetList:target,
            target:target[0],
        })
        this.getMessageFromDB(this.state.user, target[0]);
    }

    writeMessageToDB = () => {
        const {message,user,target} = this.state;
        firebase.database().ref("message/").push({
            text: message,
            to: target,
            from: user,
            date: new Date().toISOString(),
        })
        this.setState({
            message:'',
        })
    }

    getMessageFromDB = (user, target) => {
        var messageDB = firebase.database().ref("message/");
        messageDB.on("value", snapshot => {
            let newMessage = [];
            snapshot.forEach(child => {
                var message = child.val();
                newMessage.push({id: child.key, text: message.text, to: message.to, from:message.from, date:message.date})
            })
            this.setState({
                allMessage:newMessage,
            })
            this.filterMessage(newMessage,user,target)
        })
        
        firebase.database().ref("message/").on('child_added', function(data){
            if(data.val().to === user){
                new Notification('New message from '+data.val().from,{
                    'body':data.val().text,
                    'tag':data.getKey
                });
            }
        })
    }

    outChat = () => {
        localStorage.clear();
        this.props.history.push('/login')
    }

    onChange = (e) => {
        this.setState({
            message: e.target.value
        })
    }

    getTarget = (target) => {
        this.setState({
            target:target
        })
        this.filterMessage(this.state.allMessage,this.state.user, target);
    }

    filterMessage = (messages,user,target) => {
        let newMessage = [];
        messages.forEach(message => {
            if((message.to === target && message.from === user) || (message.from === target && message.to === user)){
                newMessage.push({id: message.id, text: message.text, to: message.to, form:message.from, date:message.date})
            }
        })
        this.setState({ 
            messages:newMessage
        })
    }

    getTime = (date) => {
        let datetime = new Date(date);
        let curHour = datetime.getHours() > 12 ? datetime.getHours() - 12 : (datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours()),
        curMinute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
        return curHour + '.' + curMinute;
    }

    getDate = (date) => {
        let datetime = new Date(date);
        let months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
	    curMonth = months[datetime.getMonth()],
        curYear = datetime.getFullYear(),
        curDate = ( datetime.getDate() < 10) ? '0' + datetime.getDate() : datetime.getDate();
        return curDate + ' ' + curMonth + ' ' + curYear;
    }

    renderMessage = () => {
        const {messages,user} = this.state;

        let date = '';
        return messages.map((mes)=>{
            if(date !== this.getDate(mes.date)){
                date = this.getDate(mes.date);
                if (mes.to === user){
                    return(
                        <div style={{textAlign:'left'}} key={mes.id}>
                            <div style={{textAlign:'center'}}><div style={{display:'inline-block',background:'#eee',padding:'4px 10px', margin:'5px',borderRadius:'15px'}}>{this.getDate(mes.date)}</div></div>
                            <div className='left-chat'>{mes.text} <span className="time-message">{this.getTime(mes.date)}</span></div>
                        </div>
                    )
                } else {
                    return(
                        <div style={{textAlign:'right'}} key={mes.id}>
                            <div style={{textAlign:'center'}}>{this.getDate(mes.date)}</div>
                            <div className='right-chat'>{mes.text} <span className="time-message">{this.getTime(mes.date)}</span></div>
                        </div>
                    )
                }
            } else {
                if (mes.to === user){
                    return(
                        <div style={{textAlign:'left'}} key={mes.id}>
                            <div className='left-chat'>{mes.text} <span className="time-message">{this.getTime(mes.date)}</span></div>
                        </div>
                    )
                } else {
                    return(
                        <div style={{textAlign:'right'}} key={mes.id}>
                            <div className='right-chat'>{mes.text} <span className="time-message">{this.getTime(mes.date)}</span></div>
                        </div>
                    )
                }
            }
        })
    }

    render() {
        return (
            <div className='chat'>
                <div className='chat-header'>
                    <div className='logo'>CHATAPP</div>
                    <div className='user'>Hallo, {this.state.user} </div>
                    <div className='logout'>
                        <span onClick={this.outChat}>Keluar</span>
                    </div>
                </div>

                <div className='chat-box'>
                    <div style={{position:'relative'}}>
                        <div className='chat-list'>
                            <div style={{marginBottom:'50px'}}>
                            {this.state.targetList.map((target,idx) =>{
                                if(target === this.state.target){
                                    return (
                                        <div className='chat-target' key={idx} onClick={() => {this.getTarget(target)}} style={{backgroundColor:'#eee'}}>
                                            {target}
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div className='chat-target' key={idx} onClick={() => {this.getTarget(target)}}>
                                            {target}
                                        </div>
                                    )
                                }
                            })}
                            </div>
                        </div>
                    </div>
                    <div style={{position:'relative'}}>
                        <div className='chat-content'>
                            <div style={{marginBottom:'120px', position: 'relative'}}>
                                {this.renderMessage()}
                            </div>
                            <footer className='chat-message'>
                                <input onChange={this.onChange} value={this.state.message}/>
                                <button onClick={this.writeMessageToDB}>Kirim</button>
                            </footer>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Chat;
