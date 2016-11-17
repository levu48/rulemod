import LocalContext from '../../../engine/localContext';

export default new LocalContext({
        name: 'setup',
        ruleFile: 'index.nools',
        agenda: ['setup'],
        dirname: __dirname
});