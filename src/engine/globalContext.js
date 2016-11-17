import categoryConflictCheck from '../utils/categoryConflictCheck';
import checkAfterAdvertismentPlacement from '../utils/checkAfterAdvertismentPlacement';
import checkSlotForCatViolation from '../utils/checkSlotForCatViolation';
import logger from '../utils/logger';



export default function() {
    return {
        flow: null,
        session: null,
        controller: null,
        classes: {},
        initialFacts: [],
        loadedRules: '',
        data: {},
        params: {},
        scope: {
            logger,
            categoryConflictCheck, 
            checkAfterAdvertismentPlacement, 
            checkSlotForCatViolation
        }
    }
}