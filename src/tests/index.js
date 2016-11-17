import 'babel-polyfill';
import singleRuleModuleAsApp from './singleRuleModuleAsApp';
import moduleTreeAsApp from './moduleTreeAsApp';
import agendaFocusList from './agendaFocusList';
import getSubModule from './getSubModule';
import testSchedulingClasses from './schedulingClasses';
import testPlacement from './placement';
import overWrittenClasses from './overWrittenClasses';
import createFacts from './createFacts';

let testSuite_1 = async function() {
    await singleRuleModuleAsApp();
    await moduleTreeAsApp();    
    await agendaFocusList();
    await getSubModule();    
}

/*
let testSuite_2 = async function() {
    await testSchedulingClasses();
}

let testSuite_3 = async function() {
    await testPlacement();
}
*/


const testSuite_4 = function() {
    //overWrittenClasses();
    /*
    const asyncProc = overWrittenClasses,
    run() { this.asyncProc(); }
    */
}


(async function() {
    try {
    await testSuite_1();
    //await testSuite_2();
    //await testSuite_3();    
   await testSuite_4();
    //await createFacts();
    //await moduleTreeAsApp();
    console.log("END RUN");
    } catch (e) { console.log(e.stack); }
}());













