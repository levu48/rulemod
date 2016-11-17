import 'babel-polyfill';

import initGlobalContext from '../engine/globalContext';
import Scheduler from '../modules/scheduler';

export default function() {
    console.log("===== GET SUB-MODULE");
    const globalContext = initGlobalContext();
    let app = new Scheduler(globalContext); 
    console.log("SUB-MODULE", app.getModule('category'));
}