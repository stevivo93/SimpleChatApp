import React, {Component} from 'react';
import logo from '../assets/img/logo.svg';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: 'Ramona',
        }
    }

    selectName = (e) => {
        this.setState({
            name: e.target.value
        })
    }

    enterChat = () => {
        const {name} = this.state;
        localStorage.setItem('user', name);
        this.props.history.push('/chat');
    }

    render() {
        return (
            <div>
                <div className='login-box'>
                    <img alt='logo' src={logo}/>
                    <p>Masuk sebagai</p>
                    <select value={this.state.name} className='login-select' onChange={this.selectName}>
                        <option>
                            Ramona
                        </option>
                        <option>
                            Dillon
                        </option>
                        <option>
                            Ligia
                        </option>
                    </select>
                    <br/>
                    <button className='login-button' onClick={this.enterChat}>Masuk</button>
                </div>
            </div>
        );
    }
}

export default Login;
