import React from 'react';
import {Route, Switch} from 'react-router-dom';
import FileUpload  from "./FileUpload";
import SetSign  from "./SetSign";

const routes = (
    <>
    <Switch>
        <Route exact path="/" component={FileUpload}/>
        <Route exact path="/setsign" component={SetSign}/>
    </Switch>
    </>
);

export default routes;