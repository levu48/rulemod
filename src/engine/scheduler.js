import EventEmitter from 'events';
import nools from 'nools';
import fs from 'fs';
import {ScheduledItemModel} from '../../../mongoose';
import config from '../../../../../config';

const logger = config.get('log4js').getLogger('handlers.rule-based.engine');

const RULES_FILE = __dirname + '/../rules/scheduler.txt';
const FLOW_NAME = 'scheduler';
    
class SchedulerEmitter extends EventEmitter {
    
    constructor() {
        super();
        this.scheduledItem = null;
        this.segment = null;
    }

    setupRuleEngine(rulesFile) {
        const data = fs.readFileSync(rulesFile, 'utf8');
        nools.deleteFlow(FLOW_NAME);
        this.flow = nools.compile(data, {name: FLOW_NAME});     

        this.ScheduledItem = this.flow.getDefined('ScheduledItem');
        this.Segment = this.flow.getDefined('Segment');
        this.AdArea = this.flow.getDefined('AdArea');
        this.Violation = this.flow.getDefined('Violation');
        this.Violations = this.flow.getDefined('Violations');
        this.Message = this.flow.getDefined('Message');
        this.SlotSelection = this.flow.getDefined('SlotSelection');  
        
        this.facts = [];
    }
    
    
    async runRuleEngine() {
        logger.info({
            short_message: 'Run the rule engine', 
            _misc: {facts: this.facts}, 
            _operation:'scheduler.SchedulerEmitter'
        }); 
        
        this.printoutLoopVariations();
        
        this.createAdAreaFacts();
        this.createFindResultMessageFact();
        let session = this.flow.getSession.apply(this.flow, this.facts);
        
        console.log("FACTS ====", session.getFacts());
        
        await session.focus('setup').match().then(function() {
            console.log("FACTS after focus SETUP", session.getFacts());
        });
        
        await session.focus('find-result').match().then(function() {
            console.log("FACTS after focus FIND-RESULT", session.getFacts());
        });
        
        session
            .focus('find-result')
            //.focus('slot-selection')
            //.focus('violation')
            .focus('setup')
            .match().then(function() {
                let results = session.getFacts().filter((fact) => fact.type === 'Result');
                     
                session.dispose();
                nools.deleteFlow(FLOW_NAME);
                
                if (results.length) {
                    logger.info({
                          short_message: 'Found Result, emit event "gotResult"', 
                          _misc: {segmentId: segment.id, scheduledItemId: scheduledItem.id, results: results[0]}, 
                          _operation:'scheduler.SchedulerEmitter'
                    });

                    let result = results[0];
                    result.scheduledItem = this.scheduledItem;
                    result.segment = this.segment;
                    return result;
                    
                } else {
                    logger.info({
                          short_message: 'Did not find Result, emit event "gotNoResult"', 
                          _misc: {segmentId: segment.id, scheduledItemId: scheduledItem.id}, 
                          _operation:'scheduler.SchedulerEmitter'
                    });

                    return null;
                }               
            }.bind(this), function(err) {
                console.error(err.stack);
            });       
    }
    
    createScheduledItemFact() {
        if (this.scheduledItem) {
            const scheduledItemFact = new this.ScheduledItem({
                    id: this.scheduledItem.id,
                    length: this.scheduledItem.productType ? this.scheduledItem.productType.length : 0,
                    category: this.scheduledItem.advertisingCategory ? this.scheduledItem.advertisingCategory.value : 'unknown'
                }); 
            this.facts.push(scheduledItemFact);           
        }  
    }
    
    createSegmentFact() {
        if (this.segment) {
            const segmentFact = new this.Segment({
                id: this.segment.id
            });
            this.facts.push(segmentFact);
        }
    }
    
    printoutLoopVariations() {
        let filledAreas = this.segment.areas.filter((area) => area.slots.length > 0 ? true: false); 
        filledAreas.forEach((area, index, arr) => {            
            console.log("AD AREA", index);
            area.slots[0].loopVariations.forEach((obj, index) => {
                console.log("LOOP VARIATION ", index, obj.scheduledItem._id);
            });
        });      
    }
    
    createAdAreaFacts() {              
        let filledAreas = this.segment.areas.filter((area) => area.slots.length > 0 ? true: false); 
        filledAreas.forEach((area, index, arr) => {            
            let si = area.slots[0].loopVariations[0].scheduledItem;
            let cat = si.advertisingCategory.value;            
            const adAreaFact = new this.AdArea({
                    segmentId: this.segment.id,
                    id: area.areaNumber,
                    scheduledItemId: si._id,
                    category: cat                            
                })
            this.facts.push(adAreaFact);
        });
    }
    
    getDataFromDatabase() {          
        let category = null;
        let adAreaFact = null;
        let itemsProcessed = 0;
        
        let filledAreas = this.segment.areas.filter((area) => area.slots.length > 0 ? true: false); 
            
        logger.trace({
            short_message: 'Does Segment contain Ad Areas with slots at least partially filled?', 
            _misc: {filledAreas}, 
            _operation:'scheduler.SchedulerEmitter'
        }); 
          
        filledAreas.forEach((area, index, arr) => {                
            let id = area.slots[0].loopVariations[0].scheduledItem;
            
            let query = ScheduledItemModel.findById(id, (error, obj) => {
                itemsProcessed++;
                if (error) {
                    console.log(err);
                    return;
                }
                category = obj.advertisingCategory.value;
                const adAreaFact = new this.AdArea({
                    segmentId: this.segment.id,
                    id: area.areaNumber,
                    scheduledItemId: area.slots[0].loopVariations[0].scheduledItem,
                    category: category                            
                })
                this.emit('addAdAreaFact', adAreaFact);
                
                if (itemsProcessed === arr.length) {
                    this.emit("doneProcessingAdAreaFacts");
                }
            }.bind(this));
        });  
    }
    
    createAdAreasFacts(adAreasFacts) {
        this.facts.concat(adAreasFacts);
    }

    createFindResultMessageFact() {
        if (this.scheduledItem && this.segment) {
            this.facts.push(new this.Message({
                message: 'findResult', 
                segmentId: this.segment.id, 
                scheduledItemId: this.scheduledItem.id
            }));
        }        
    }
    
    async run(scheduledItem, segment) {
        logger.info({
            short_message: 'Start Scheduler', 
            _misc: {facts: this.facts}, 
            _operation:'scheduler.SchedulerEmitter'
        }); 
        this.scheduledItem = scheduledItem;
        this.segment = segment;        
        this.setupRuleEngine(RULES_FILE);
        this.createScheduledItemFact();
        this.createSegmentFact();
        let result = await this.runRuleEngine();
        return result;
    }
}


const EmitterSingleton = (function() {
    var instance;
    
    function createInstance(options) {
        var schedulerEmitter = new SchedulerEmitter();
        
        schedulerEmitter.on('addAdAreaFact', function(fact) {
            this.facts.push(fact);
        });
        
        schedulerEmitter.on('doneProcessingAdAreaFacts', function() {
            this.runRuleEngine();
            logger.trace({
                short_message: 'Done Processing Ad Areas Facts', 
                _misc: {facts: this.facts}, 
                _operation:'scheduler.EmitterSingleton'
            });
        });
        
        schedulerEmitter.on("gotResult", (scheduledItem, segment, result) => {
            logger.trace({
                short_message: 'Handle gotResult event', 
                _misc: {scheduledItemId: scheduledItem.id, segmentId: segment.id, result: result}, 
                _operation:'scheduler.EmitterSingleton'
            });
        });
        
        schedulerEmitter.on("gotNoResult", (scheduledItem, segment) => {
            logger.trace({
                short_message: 'Handle gotNoResult event', 
                _misc: {scheduledItemId: scheduledItem.id, segmentId: segment.id}, 
                _operation:'scheduler.EmitterSingleton'
            });
        });
        
        
        return schedulerEmitter;
    }
    
    return {
        getInstance: function() {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();




const ruleBasedScheduler = async function (scheduledItem, segment) {
    const scheduler = EmitterSingleton.getInstance();
    return await scheduler.run(scheduledItem, segment);
}

export default ruleBasedScheduler;