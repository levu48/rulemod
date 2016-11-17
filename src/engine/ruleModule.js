import 'babel-polyfill';
import nools from 'nools';
import fs from 'fs';


//import config from '../../config';
//const logger = config.get('log4js').getLogger('handlers.rule-based.engine');
var logger = {};
logger.trace = function(options) { console.log("TRACE", options.short_message, options._operation); }
logger.debug = function(options) { console.log("DEBUG", options.short_message, options._operation, options.long_message); }

export default class RuleModule {
    
    constructor(globalContext) {
        this.globalContext = globalContext || {};
        this.localContext = {};
        this.modules = [];
        this.params = {};
        this.__initialized = false;
    }
    
    init() {
        this.loadRules();
        this.initEngine();
        this.setClasses();
        return this;
    }
    
    start() {
        this.loadFacts();
        this.assertInitialFacts();
        this.setFocus();
        return this;
    }
    
    clear() {
        this.globalContext.session.dispose();
        this.globalContext.session = this.globalContext.flow.getSession();
        return this;
    }
    
    clean() {
        this.globalContext.session.dispose();
        nools.deleteFlow(this.globalContext.flow);
        return this;
    }
    
    async run() {
        let result = await this.runEngine();
        return result;
    }
    
    async runEngine() {
        await this.globalContext.session.match().then(function() {
            console.log("FACTS", this.globalContext.session.getFacts());
            console.log("DONE RUN ENGINE");
        }.bind(this), function(e) {
            logger.debug({
                short_message: "Error running rules engine", 
                long_message: e.stack || e,
                _misc: {facts: this.globalContext.session.getFacts()}, 
                _operation:'RuleModule.runEngine'
            }); 
        });
    }
    async start2() {
        try{
            this.loadRules();
            this.initEngine();
            this.setClasses();
            this.loadFacts();
            this.assertInitialFacts();
            this.setFocus();
            await this.runEngine();
        } catch (e) {
            logger.debug({
                short_message: "Error starting rules engine", 
                long_message: e.stack || e,
                _misc: {facts: this.globalContext.session.getFacts()}, 
                _operation:'RuleModule.start'
            }); 
        }
    }
    
    initEngine() {
        this.globalContext.flow = nools.compile(this.globalContext.loadedRules, {
            name: this.localContext.name,
            scope: this.globalContext.scope
        }); 
        this.globalContext.session = this.globalContext.flow.getSession();
    }
    
    loadRules() {
        this.globalContext.loadedRules += "\n\n" +  this.getRulesData();
    }
    
    loadFacts() {
        this.loadOwnFacts();
        this.loadModulesFacts();
    } 
    

    
    postProcess() {
        console.log("POST PROCESSING");
    }
    

    setClasses() {
        this.setOwnClasses();
        this.setModulesClasses();
    }
    
    setFocus() {
        let arr = this.getAgenda(); 
        arr.forEach(async function(str) {
            await this.globalContext.session.focus(str);
        });
    }
    
    getOwnAgenda() {
        if (this.localContext.agenda) {
            return this.localContext.agenda;
        }
        return [this.localContext.name];
    }
    
    getModulesAgenda() {
       if (!this.modules || this.modules.length === 0) {
           return [];
       }
       return [...this.modules.map(module => module.getAgenda())];
    }
    
    getAgenda() {
        return this.getOwnAgenda().concat(...this.getModulesAgenda());
    }
    
    
    setOwnClasses() {}
    
    setModulesClasses() {
        this.modules.forEach(module => module.setClasses());
    }
    
    assertInitialFacts() {
        if (this.globalContext.initialFacts && this.globalContext.initialFacts.length > 0) {
            this.globalContext.initialFacts.forEach(fact => this.globalContext.session.assert(fact));
        }
    }
    
    getModule(moduleName) {
        if (this.localContext.name === moduleName) {
            return this;
        } else {
            for (let i=0; i<this.modules.length; i++) {
                let tmp = this.modules[i].getModule(moduleName);
                if (tmp) {
                    return tmp;
                }
            }
        }
    }
    
    
    setLocalContext(localContext) {
        this.localContext = localContext;        
    }
    
    getParentContext() {
        return super.localContext;
    }
    
    setParams(params) {
        this.globalContext.params = params;
    }
    
    registerModule(module) {
        this.modules.push(module);
    }
    
    getRulesData() {
        return this.getOwnRulesData() + "\n\n" + this.getModulesRulesData();
    }
    
    getOwnRulesData() {
        if (!this.localContext || !this.localContext.ruleFile) {
            return '';
        }
        let fullFileName = this._getFullRulesFileName(this.localContext.name, this.localContext.ruleFile);
        let data = '';
        try {
            data = fs.readFileSync(fullFileName, 'utf8');
        } catch (e) {
            logger.debug({
                short_message: "Error reading rules file", 
                long_message: e.stack || e,
                _misc: {fileName: fullFileName}, 
                _operation:'RuleModule.getOwnRulesData'
            }); 
        }
        return data;
    }
    
    getModulesRulesData() {
        let data = '';
        this.modules.forEach(module => {
            let moduleRulesData = module.getRulesData();
            data += '\n\n' + moduleRulesData;
        });
        return data;
    }
    
    
    loadOwnFacts() {
        this.globalContext.initialFacts = this.globalContext.initialFacts.concat(this.setupOwnFacts());
    }
    
    loadModulesFacts() {
        this.globalContext.initialFacts = this.globalContext.initialFacts.concat(this.setupModulesFacts());
    }
    
    
    setupFacts() {
        let ownFacts = this.setupOwnFacts();
        let moduleFacts = this.setupModulesFacts();
        let facts = ownFacts.concat(moduleFacts);
        return facts;
    }
    
    
    setupOwnFacts() {
        let facts = [];
        return facts;
    }
    
    setupModulesFacts() {
        let facts = [];
        this.modules.forEach(module => {
            let moduleFacts = module.setupFacts();
            facts = facts.concat(moduleFacts);
        });
        return facts;
    }
    
    _getFullRulesFileName(moduleName, ruleFile) {
        if (this.localContext.dirname) {
            return this.localContext.dirname + `/../rules/${ruleFile}`;
        }
        return __dirname + `/../modules/${this.localContext.name}/rules/${ruleFile}`;
    }
}
