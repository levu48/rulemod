import LocalContext from '../../../engine/localContext';

export default new LocalContext({
        name: 'violations',
        ruleFile: 'index.nools',
        agenda: ['violations'],
        dirname: __dirname
});