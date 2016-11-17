import 'babel-polyfill';

import initGlobalContext from '../engine/globalContext';
import Mod1 from './modules/mod1';
import Mod2 from './modules/mod2';

export default function() {
    console.log("===== TEST OVER WRITTEN CLASSES 2");

    try {
    const globalContext = initGlobalContext();
    let mod1 = new Mod1(globalContext); 
    //let mod2 = new Mod2(globalContext);
    //mod2.registerModule(mod1);
    
    //await mod2.start();
    mod1.start();
    
    //console.log("Session FLOW:", globalContext.flow);
    //console.log("Session TEST:", globalContext.flow.getDefined("ClassA"));
    //console.log("Session TEST:", globalContext.flow.__rules);
    console.log("Rule Hello:", globalContext.flow.__rules.find((rule) => rule.name==="Hello"));
    
    } catch (e) { console.log(e.stack); }
}