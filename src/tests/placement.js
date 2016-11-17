import 'babel-polyfill';

import initGlobalContext from '../engine/globalContext';
import Placement from '../modules/placement';

export default async function() {
    console.log("===== TEST PLACEMENT MODULE");
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
    let app = new Placement(globalContext); 
    app.setParams(testParams);
    await app.start();
}