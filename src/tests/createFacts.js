import 'babel-polyfill';
import fs from 'fs';

const SI_FILE = __dirname + '/data/scheduledItem.json';
const SEG_FILE = __dirname + '/data/segment.json';

export default function() {
    console.log("===== TEST CREATE FACTS");
    let si_data = fs.readFileSync(SI_FILE, 'utf8');
    let si = JSON.parse(si_data);
    
    let seg_data = fs.readFileSync(SEG_FILE, 'utf8');
    let seg = JSON.parse(seg_data);

}

export function getSampleScheduledItem() {
    let data = fs.readFileSync(SI_FILE, 'utf8');
    let obj = JSON.parse(data);
    return obj;
}

export function getSampleSegment() {
    let data = fs.readFileSync(SEG_FILE, 'utf8');
    let obj = JSON.parse(data);
    return obj;
}