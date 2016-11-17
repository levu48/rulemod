export default function checkSlotForCatViolation(slot, loopVariationsToCheck, categoryValue, brandValue){
  let flag = false;
  slot.loopVariations.forEach((variation) => {
    let item = variation.scheduledItem;
      if(
        item
        && loopVariationsToCheck.indexOf(variation.loopVariationNumber) > -1
        && item.advertisingCategory.value === categoryValue
        && item.brand.value  !== brandValue
      ) {
        flag = true;
      }
  });
  return flag;
}

