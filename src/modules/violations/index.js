import RuleModule from '../../engine/ruleModule';
import localContext from './config';

export default class Violations extends RuleModule {
    constructor(globalContext) {
        super(globalContext);
        this.setLocalContext(localContext);
    }
}
