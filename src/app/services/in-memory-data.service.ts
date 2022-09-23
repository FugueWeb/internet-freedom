import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Injectable } from '@angular/core';
// declare let require: any;
import { InternetFreedom } from '../models/internet-freedom';
const INTERNET_FREEDOM = require('../../assets/data/internet-freedom.json');
//const ORGS = require('../../assets/data/orgs_sample.json');

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
    createDb() {
        //const orgs = ORGS;
        const internet_freedom : InternetFreedom = INTERNET_FREEDOM;
        return {internet_freedom};
        //return {orgs, internet_freedom};
      }

}
