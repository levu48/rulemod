import 'babel-polyfill';

import initGlobalContext from '../engine/globalContext';
import SchedulingClasses from '../modules/classes';

export default function() {
    try {
        console.log("===== SCHEDULING CLASSES");
        const globalContext = initGlobalContext();
        let app = new SchedulingClasses(globalContext); 
        console.log("RULES", app.getRulesData());
    } catch(e) {
        console.log("TEST ERROR", e.stack);
    }
}