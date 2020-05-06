import './App.css';
import '@ionic/react/css/core.css';
import { openExternalUrl } from './services/Chromely.Service.js'; 

//pages
import Home from './components/Home';
import About from './components/About';

//react
import React, { Component } from 'react';
//react-router
import { BrowserRouter as Router, Switch, Route, Link, Redirection, Redirect } from 'react-router-dom';

//ionic
import { IonReactRouter, } from '@ionic/react-router';
import { IonApp, IonPage, IonRouterOutlet } from '@ionic/react';
import { IonToolbar, IonTitle, IonContent, IonCard, IonHeader, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton } from '@ionic/react'


export default class App extends Component {
    constructor(props) {
    super(props);

    this.showDevTools = this.showDevTools.bind(this);
    }


    render() {
        return (
            <ion-header>
  <ion-toolbar>
    <ion-title>Tab 2</ion-title>
  </ion-toolbar>
</ion-header>
            // <IonApp>
            //     <IonReactRouter>
            //         <IonRouterOutlet>
            //             <Route path="/" exact component={Home} />
            //             <Route path="/about" exact component={About} />
            //             <Redirect exact from="/" to="/about" />
            //         </IonRouterOutlet>
            //     </IonReactRouter>
            // </IonApp>
        );
    }


    showDevTools(event) {
        event.preventDefault();
        openExternalUrl("http://command.com/democontroller/showdevtools");
    }
}
