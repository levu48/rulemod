import RuleModule from '../../../engine/ruleModule';
import localContext from './config';


export default class Mod2Classes extends RuleModule {
    constructor(globalContext) {
        super(globalContext);
        this.setLocalContext(localContext);
    }
};