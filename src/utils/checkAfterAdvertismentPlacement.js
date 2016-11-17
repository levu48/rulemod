export default function checkAfterAdvertismentPlacement(scheduledItem, area) {
  let primarySlotNumber = -1000;
  let siSlot = area.slots.find((slot)=> slot._id == scheduledItem.slotId);
  area.slots.forEach((slot) => {
    slot.loopVariations.forEach((loopV) => {
      if(loopV.scheduledItem && loopV.scheduledItem._id == scheduledItem.relatedScheduledItem) {
        primarySlotNumber = slot.slotNumber;
      }
    });
  });

  if(siSlot.slotNumber === (primarySlotNumber + 1)) {
    return true;
  }
  else {
    return false;
  }
}