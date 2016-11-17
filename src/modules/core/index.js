import RuleModule from '../../engine/ruleModule';
import localContext from './config';

export default class CoreModule extends RuleModule {
    constructor(globalContext) {
        super(globalContext);
        this.setLocalContext(localContext);
    }  
    
    setOwnClasses() {
        this.globalContext.classes['ScheduledItem'] = this.globalContext.flow.getDefined('ScheduledItem');
        this.globalContext.classes['Segment'] = this.globalContext.flow.getDefined('Segment');
        this.globalContext.classes['AssertedAdArea'] = this.globalContext.flow.getDefined('AssertedAdArea');
        this.globalContext.classes['AdArea'] = this.globalContext.flow.getDefined('AdArea');
        this.globalContext.classes['Violation'] = this.globalContext.flow.getDefined('Violation');
        this.globalContext.classes['Violations'] = this.globalContext.flow.getDefined('Violations');
        this.globalContext.classes['Message'] = this.globalContext.flow.getDefined('Message');
        this.globalContext.classes['SlotSelection'] = this.globalContext.flow.getDefined('SlotSelection');  
    }
    
    setupOwnFacts() {
        let Message = this.globalContext.classes["Message"];
        let message = new Message({message: 'Test', segmentId: '123seg', scheduledItemId: '124si'});
        return [message];
    } 
}

