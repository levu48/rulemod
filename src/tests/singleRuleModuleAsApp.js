import 'babel-polyfill';

import initGlobalContext from '../engine/globalContext';
import Core from '../modules/core';

export default async function() {
    console.log("===== SINGLE RULE MODULE AS APP");
    const testParams = {
        scheduledItem: {
            id: "123si",
            productType: ["Programming"],
            advertisingCategory: "HEALTHCARE"
        },
        segment: {id: "234seg"},
        areaNumber: 1
    }

    const globalContext = initGlobalContext();
    let app = new Core(globalContext); 
    app.setParams(testParams);
    await app.start();
}