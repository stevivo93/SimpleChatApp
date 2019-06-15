import React, {Component} from 'react';
import './assets/style/App.sass';
import Routes from './router';
import {withRouter} from 'react-router-dom';

class App extends Component {

  componentWillMount(){
    if (localStorage.getItem('user') === null) {
      this.props.history.push('/login')
    } else {
      this.props.history.push('/chat')
    }
  }

  render() {

    return (
      <div className="App">
        <Routes/>
      </div>
    );
  }
}

export default withRouter(App);
