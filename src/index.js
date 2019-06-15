import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import './assets/style/index.sass';

ReactDOM.render((
        <BrowserRouter>
            <App/>
        </BrowserRouter>
), document.getElementById('root'));

serviceWorker.unregister();