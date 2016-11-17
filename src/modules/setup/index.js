import RuleModule from '../../engine/ruleModule';
import localContext from './config';

export default class Setup extends RuleModule {
    constructor(globalContext) {
        super(globalContext);
        this.setLocalContext(localContext);
    }
}
