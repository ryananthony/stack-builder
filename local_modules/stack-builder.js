var Math = require('mathjs');

        /**************************
              Chip Definition
        **************************/

// Chip is Object 
// interp. single type of chip :: fields color, denom AND count


        /**************************
           ListOfChip Definition
        **************************/

// ListOfChips is one of:
//  - [] (empty list)            -BASE CASE
//  - ListOfChip.push(Chip)      -RECURSIVE CASE


        /**************************
           ChipList Sort Helper
        **************************/

// Object Object -> Integer
// produces decending and ascending lists sorted by each chip's 'count' property
//  - uses built-in 'sort' method.

var sortAsc = function(a, b) {
  if (a.count < b.count) {
    return 1;
  } else if (a.count > b.count) {
    return -1;
  } else {
    return 0;
  }
}

var sortDesc = function(a, b) {
  if (a.count > b.count) {
    return 1;
  } else if (a.count < b.count) {
    return -1;
  } else {
    return 0;
  }
}

        /**************************
              Distribute Chips
        **************************/
// ListOfChips Setup -> ListOfChips
// produces a chiplist with most chips each player can have when distro'd evenly

var distroChips = function(loc,setup) {

  for (var i=0;i<loc.length;i++) {
    loc[i].count = Math.floor(loc[i].count / setup.players);
  }

  return loc;
}
        /**************************
           Assign Denominations
        **************************/

// ListOfChips Setup -> ListOfChip
// modifies list so all Chip Objects contain denominations

var setDenoms = function(loc,setup) {
  if (setup.bb % 2 === 0) {
    // DEBUG console.log('divisible');     // set loc[0] to half bb
    loc[0].denom = (setup.bb / 2);
  } else {
    // DEBUG console.log('not divisible'); 
    loc[0].denom = (Math.floor(setup.bb / 2)); 
  }

  loc[1].denom = setup.bb;  // 2nd most chips is the Big Blind

  for (var i=2;i<loc.length;i++) {
    // look at modulo of bb
    if(loc[i-1].denom === 10) { // for .05/.10 have a quarter 
      loc[i].denom = 25;
    } else if (loc[i-1].denom === 25) { // if .10/.25, skip the .50
      loc[i].denom = 100;
    } else if (loc[i-1].denom === 200) { // break the linear 00's
      loc[i].denom = 500;
    } else if (loc[i-1].denom === 2000) { // break the linear 000's
      loc[i].denom = 5000;
    } else {
      loc[i].denom = (loc[i-1].denom * i);
    }
  }

  // DEBUG console.log('end of setDenoms' + loc);
  return loc;

}

        /**************************
              Validate Values
        **************************/

// ListOfChips Setup -> Boolean
// checks that setup.bb times setup.stackType < the sum of each chips denom * count

var enoughValue = function(loc,setup) {
  var actual = 0;
  var expected = Math.ceil(setup.stackType * setup.bb);

  for (var i in loc) {
    // DEBUG console.log(loc[i]);
    actual = actual + (loc[i].count * loc[i].denom);
  }

  // DEBUG console.log(actual);
  if(actual>expected) {
    return true;
  }

  return false;
}

        /**************************
              Shave Remainder
        **************************/

// ListOfChips Setup -> ListOfChips
// takes a given sorted, validated listofchips and returns a listofchips equal to setup.bb * setup.stackType

var shaveChips = function(loc,setup) {
  
  var expected = (setup.bb * setup.stackType);
  var current = 0;

  // get the starting value
  for (var i in loc) {
    current = current + (loc[i].count * loc[i].denom);
  }

  while (expected !== current) {

    for (var i in loc) {
      // DEBUG console.log(current)
      // DEBUG console.log(loc)
      if( (current - loc[i].denom) >= expected && loc[i].count > 0) {
        loc[i].count = loc[i].count - 1;
        current = current - loc[i].denom;
        break;
      }

      continue;
    
    }

  }

  // DEBUG console.log(loc);
  return loc;
}

exports.sortAsc = sortAsc;
exports.sortDesc = sortDesc;
exports.distroChips = distroChips;
exports.setDenoms = setDenoms;
exports.enoughValue = enoughValue;
exports.shaveChips = shaveChips;