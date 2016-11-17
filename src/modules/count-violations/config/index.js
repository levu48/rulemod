import LocalContext from '../../../engine/localContext';

export default new LocalContext({
        name: 'count-violations',
        ruleFile: 'index.nools',
        agenda: ['count-violations'],
        dirname: __dirname
});