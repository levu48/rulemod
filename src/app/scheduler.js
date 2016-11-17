import nools from 'nools';
import Scheduler from '../modules/scheduler';
import initGlobalContext from '../engine/globalContext';

export default class SchedulerApp {
    constructor(options) {
        this.globalContext = initGlobalContext();
        this.scheduler = new Scheduler(this.globalContext);
        this.results = options.results;
        this.scheduler.setParams(this.results);
    }
    
    init() { this.scheduler.init(); }
    start() { this.scheduler.start(); }
    
    async run(scheduledItem, tempSegment, area) {
        let result = await this.scheduler.run(scheduledItem, tempSegment, area);
        return result;
    }
    
    clean() {
        this.scheduler.clean();
    }
}

