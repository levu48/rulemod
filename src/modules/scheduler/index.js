import fs from 'fs';
import RuleModule from '../../engine/ruleModule';
import localContext from './config';
import Core from '../core';
import Setup from '../setup';
import FindResult from '../find-result';
import SlotSelection from '../slot-selection';
import CountViolations from '../count-violations';
import Violations from '../violations';

const RESULTS_FILE = __dirname + '/../../tests/data/sampleConvertedIO.json';
const SI_FILE = __dirname + '/../../tests/data/scheduledItem.json';
const SEG_FILE = __dirname + '/../../tests/data/segment.json';


const DATA = fs.readFileSync(RESULTS_FILE, 'utf8');
const RESULTS = JSON.parse(DATA);

export default class Scheduler extends RuleModule {
    constructor(globalContext) {
        super(globalContext);
        this.setLocalContext(localContext);

        this.registerModule(new Core(globalContext));
        this.registerModule(new Setup(globalContext));
        this.registerModule(new Violations(globalContext));
        this.registerModule(new CountViolations(globalContext));
        this.registerModule(new FindResult(globalContext));
    }
    
    async run(scheduledItem, segment, area) {
        this.init().start();
        let result = await this.runEngine(scheduledItem, segment);
        return result;
    }
    
    async runEngine(scheduledItem, segment) {
        return new Promise(async (resolve, reject) => {
          try {
            await this.globalContext.session.match();
            let results = this.globalContext.session.getFacts(this.globalContext.classes["Result"]);
            if (results.length) {
                logger.info({
                      short_message: 'Found Result',
                      _misc: {segmentId: segment._id, scheduledItemId: scheduledItem._id, results: results[0]},
                      _operation:'scheduler.runRuleEngine'
                });

                let result = results[0];
                result.scheduledItem = scheduledItem;
                result.segment = segment;
                resolve(result);

            } else {
                logger.info({
                      short_message: 'Did not find Result',
                      _misc: {segmentId: segment._id, scheduledItemId: scheduledItem._id},
                      _operation:'scheduler.runRuleEngine'
                });

                reject('Did not find a result');
            }
          } catch (err) {
            logger.info({
              short_message: 'Caught Exception!',
              long_message: err.stack || err,
              _misc: {segmentId: segment.id, scheduledItemId: scheduledItem.id},
              _operation:'scheduler.runRuleEngine'
            });

            reject(err);
          }
      });
    }
    

    setupOwnFacts() {
        let facts = [];
        
        let f = this.createAdAreaFacts(this.globalContext.params.segment);
        console.log("Area Facts", f);
        console.log("FLOW", this.globalContext.flow);
        
        facts = facts
                    .concat(this.createScheduledItemsFacts(this.globalContext.params.results))
                    .concat(this.createSegmentFact(this.globalContext.params.results.segment))
                    .concat(this.createAdAreaFacts(this.globalContext.params.results.segment))
                    .concat(this.createFindResultMessageFact());
        return facts;
    }
    
    createScheduledItemsFacts(results) {
        let facts = [];
        results.scheduledItems.forEach(item => {
            facts = facts.concat(this.createScheduledItemFact(item));
        });
        console.log("FACTS ARRAY", facts);
        return facts;
    }
        
    createScheduledItemFact(scheduledItem) {
        let facts = [];
        if (scheduledItem) {
            const fact = new this.globalContext.classes["ScheduledItem"](scheduledItem); 
            facts.push(fact);           
        }  
        return facts;
    }   
    
    createSegmentFact(segment) {
        let facts = [];
        if (segment) {
            const fact = new this.globalContext.classes["Segment"](segment);
            facts.push(fact);
        }
        return facts;
    }
    
    createAdAreaFacts(segment) {
        if (!segment || !segment.areas || !segment.areas.length === 0) {
            return [];
        }
        let arr =  segment.areas.map((area) => {
            let obj = area;
            obj["segmentId"] = segment._id;
            return new this.globalContext.classes["AdArea"](obj); 
        });
        
        return arr;
    }
    
    createFindResultMessageFact() {
        let facts = [];
        if (this.globalContext.params.scheduledItem && this.globalContext.params.segment) {
            let fact = new this.globalContext.classes["Message"]({
                message: 'findResult', 
                segmentId: this.globalContext.params.segment.id, 
                scheduledItemId: this.globalContext.params.scheduledItem.id
            });
            facts.push(fact); 
        }        
        return facts;
    }
    
}

