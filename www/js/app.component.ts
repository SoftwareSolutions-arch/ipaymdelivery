import { Component, ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Firebase } from '@ionic-native/firebase/ngx';

Component({
    // template: `<ion-nav #content [root]="rootPage"></ion-nav>`
})

export class MyApp {
    constructor(public platform: Platform, private firebase: Firebase) {
        platform.ready().then(() => {
            this.firebase.getToken()
                .then(token => console.log(`The token is ${token}`)) // save the token server-side and use it to push notifications to this device
                .catch(error => console.error('Error getting token', error));

            this.firebase.onNotificationOpen()
                .subscribe(data => console.log(`User opened a notification ${data}`));

            this.firebase.onTokenRefresh()
                .subscribe((token: string) => console.log(`Got a new token ${token}`));
        })
    }
}