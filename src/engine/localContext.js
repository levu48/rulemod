export default class LocalContext {
    constructor(options) {
        this.name = options.name;
        this.ruleFile = options.ruleFile;
        this.agenda = options.agenda;
        this.dirname = options.dirname;
    }
    
    getName() {
        if (this.name) return this.name;
        return '';
    }
    
    getRuleFile() {
        if (this.ruleFile) return this.ruleFile;
        return 'index.nools';
    }
    
    getAgenda() {
        if (this.agenda) return this.agenda;
        if (this.name) return [this.name];
        return [];
    }
    
    getDirName() {
        if (this.dirname) return this.dirname;
        return __dirname;
    }
}