import LocalContext from '../../../engine/localContext';

export default new LocalContext({
        name: 'find-result',
        ruleFile: 'index.nools',
        agenda: ['find-result'],
        dirname: __dirname
});