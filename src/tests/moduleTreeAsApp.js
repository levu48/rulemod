import 'babel-polyfill';

import initGlobalContext from '../engine/globalContext';
import Scheduler from '../modules/scheduler';
import {getSampleScheduledItem, getSampleSegment} from './createFacts';

export default async function() {
    console.log("===== MODULE TREE AS APP");
    const testParams = {
        scheduledItem: {
            id: "123si",
            productType: ["Programming"],
            advertisingCategory: "HEALTHCARE",
            placement: {
                advertising: {
                    position: 'anti-podal'
                },
                programming: {
                    position: 'before'
                }
            }
        },
        segment: {id: "234seg"},
        areaNumber: 1
    }

    const globalContext = initGlobalContext();
    let app = new Scheduler(globalContext); 
    //app.setParams(testParams);
    app.setParams({
        scheduledItem: getSampleScheduledItem(),
        segment: getSampleSegment()
    });
    
    await app.start();
}