import fs from 'fs';
import SchedulerApp from './src/app/scheduler';

const schedule = async function (results) {
    //simulate input data (reading it from a file). 
    //When run it in operation, comment out the next 3 lines.
    const RESULTS_FILE = __dirname + '/src/tests/data/sampleConvertedIO.json';
    const data = fs.readFileSync(RESULTS_FILE, 'utf8')
    results = JSON.parse(data);
      
    let scheduler = new SchedulerApp({results: results});
    try {
        scheduler.init().start();
    } catch(e) { console.log(e.stack);}
    
    console.log("SCHEDULER", scheduler);

    for( let scheduledItem of results.scheduledItems) {
        //check that this items primary has already been scheduled if the item has properties: after/anti-podal/intro of an intro cluster
        if(scheduledItem.relatedScheduleItem 
                && scheduledItem.placement 
                && scheduledItem.placement.advertisement 
                && (scheduledItem.placement.advertisement.position === 'after' 
                    || scheduledItem.placement.advertisement.position === 'anti-podal')) {
            let primaryScheduledItem = await ScheduledItemModel.findById(scheduledItem.relatedScheduleItem);
            if(!primaryScheduledItem.slotId) {
                schedulePrimaryItem = results.scheduledItems.find((item) => item.id === primaryScheduledItem.id);
                await processScheduledItem(schedulePrimaryItem, results.segments.find( (segment)=> segment.id === scheduledItem.segment ), scheduler);
            }
        }
        
        if(scheduledItem.type && scheduledItem.type === 'intro') {
            let introOutroCluster = scheduledItem.cluster.filter((item) => item.type === 'intro-outro');
            if(introOutroCluster.length) {
                let itemsInCluster = await getCluster('intro-outro', introOutroCluster);
                let mainClusterScheduledItem = itemsInCluster.find((item) => item.type !== 'intro');
                if(!mainClusterScheduledItem.slotId) {
                    await processScheduledItem(mainClusterScheduledItem, results.segments.find( (segment)=> segment.id === scheduledItem.segment ), scheduler);
                }
            }
        }
      
        //now schedule the item being iterated on
        await processScheduledItem(scheduledItem, results.segments.find( (segment)=> segment.id === scheduledItem.segment ), scheduler);
    }
    
    scheduler.clean();
}

export default schedule;

// comment the following line when in production
schedule();










