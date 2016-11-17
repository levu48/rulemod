import RuleModule from '../../engine/ruleModule';
import localContext from './config';

export default class FindResult extends RuleModule {
    constructor(globalContext) {
        super(globalContext);
        this.setLocalContext(localContext);
    }
}
