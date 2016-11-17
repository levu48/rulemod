import checkSlotForCatViolation from './checkSlotForCatViolation';

export default function categoryConflictCheck(scheduledItem, assertedAdArea, adArea) {
  //if comparing to areas that are more than 2 apart then return false

  if(Math.abs(assertedAdArea.id - adArea.id) > 2) {
    return false;
  }

  let loopObj;
  let assertedSlotNumber;
  let assertedLoopVariations = [];
  assertedAdArea.slots.forEach((slot) => {
    slot.loopVariations.forEach((loop) => {
      if(loop.scheduledItem && loop.scheduledItem._id == scheduledItem.id) {
        assertedSlotNumber = slot.slotNumber;
        assertedLoopVariations.push(loop.loopVariationNumber);
      }
    });
  });


  let beforeAssertedSlot;
  let afterAssertedSlot;

  if(assertedAdArea.id === adArea.id) {
    if(assertedAdArea.slots.length === 1) {
      return false;
    }
    else {
      if(assertedAdArea.slots.length === 2) {
        if(assertedSlotNumber === 1) {
          afterAssertedSlot = assertedAdArea.slots.find((slot) => slot.slotNumber === 2);
        }
        else if(assertedSlotNumber === 2) {
          beforeAssertedSlot = assertedAdArea.slots.find((slot) => slot.slotNumber === 1);
        }
      }
      else { //assertedArea has 3+ slots so check before/after internally
        beforeAssertedSlot = assertedAdArea.slots.find((slot) => slot.slotNumber === (assertedSlotNumber-1));
        afterAssertedSlot = assertedAdArea.slots.find((slot) => slot.slotNumber === (assertedSlotNumber+1));
      }
    }
  }

  if(adArea.id < assertedAdArea.id) {
    if(adArea.slots.length) {
      beforeAssertedSlot = adArea.slots.sort((a,b) => b.slotNumber - a.slotNumber)[0];
    }
    else {
      return false;
    }
  }

  if(adArea.id > assertedAdArea.id) {
    if(adArea.slots.length) {
      afterAssertedSlot = adArea.slots.find((slot) => slot.slotNumber === 1);
    }
    else {
      return false;
    }
  }


  let beforeConflict = false;
  let afterConflict = false;
  if(beforeAssertedSlot) {
    beforeConflict = checkSlotForCatViolation(beforeAssertedSlot, assertedLoopVariations, scheduledItem.advertisingCategory.value, scheduledItem.brand.value);
  }
  if(afterAssertedSlot) {
    afterConflict = checkSlotForCatViolation(afterAssertedSlot, assertedLoopVariations, scheduledItem.advertisingCategory.value, scheduledItem.brand.value);
  }
  if(beforeConflict || afterConflict) {
    return true;
  }
  else {
    return false;
  }
}