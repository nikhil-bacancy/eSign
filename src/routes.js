import React from 'react';
import { Route, Switch } from 'react-router-dom';
import FileUpload from "./creator/FileUpload";
import SetSign from "./creator/SetSign";
import DoSign from './recipient/DoSign';

const routes = (
    <>
        <Switch>
            <Route exact path="/" component={FileUpload} />
            <Route exact path="/sender/setsign" component={SetSign} />
            <Route exact path="/recipient/sign" component={DoSign} />
        </Switch>
    </>
);

export default routes;