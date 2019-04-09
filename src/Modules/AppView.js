import React, { Component } from 'react';
import { Route } from "react-router-dom";
import ReleaseExercise from './ReleaseExercise';
import GoldSearch from './GoldSearch/GoldSearch';


class AppView extends Component {
    render() {
        return (
            <div style={{width:'100%',height:'100%'}}>
                <Route exact path="/" component={GoldSearch} />
                <Route path="/zysearch" component={ReleaseExercise} />
            </div>
        );
    }
}

export default AppView;