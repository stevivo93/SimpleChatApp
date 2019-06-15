import React from 'react';
import {Route, Switch} from 'react-router-dom';
import chat from "./components/chat";
import login from "./components/login";

const Routes = () => (
        <Switch>
            <Route path="/chat" component={chat}/>
            <Route path="/login" component={login}/>
        </Switch>
);

export default Routes;
