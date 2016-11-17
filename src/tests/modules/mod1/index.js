import RuleModule from '../../../engine/ruleModule';
import localContext from './config';


export default class Mod1Classes extends RuleModule {
    constructor(globalContext) {
        super(globalContext);
        this.setLocalContext(localContext);
    }
};