import 'babel-polyfill';

import initGlobalContext from '../engine/globalContext';
import Scheduler from '../modules/scheduler';

export default function() {
    console.log("===== AGENDA FOCUS LIST");
    const globalContext = initGlobalContext();
    let app = new Scheduler(globalContext); 
    console.log("FOCUS LIST", app.getAgenda());
}