var should = require('should')
    sb = require('../local_modules/stack-builder.js');

        /**************************
              Chip Definition
        **************************/

//console.log(sb.compareCounts)

// Chip is Object 
// interp. single type of chip :: fields color, denom AND count
var testChip1 = {
  color : "blue",
  denom : 0,
  count : 40
};

var testChip2 = {
  color : "red",
  denom : 0,
  count : 33
};

var testChip3 = {
  color : "green",
  denom : 0,
  count : 24
};

var testChip4 = {
  color : "orange",
  denom : 0,
  count : 48
};

var testChip5 = {
  color : "red",
  denom : 0,
  count : 67
};

var lessChip1 = {
  color : "red",
  denom : 0,
  count : 24
};

var lessChip2 = {
  color : "red",
  denom : 0,
  count : 20
};

var lessChip3 = {
  color : "red",
  denom : 0,
  count : 30
};

var realExample = [ { color: 'red', denom: 25, count: 7 },
                    { color: 'orange', denom: '50', count: 5 },
                    { color: 'black', denom: 100, count: 4 },
                    { color: 'pink', denom: 300, count: 3 } ];


        /**************************
              Setup Definition
        **************************/

// Setup is Object
// interp. game setup :: fields stackType, bb and players
var setup1 = {
  players : 9,    // INTEGER
  stackType : 100,  // INTEGER
  bb : 50         // INTEGER
};

var setup2 = {
  players : 13,
  stackType : 150,
  bb : 100
};



var noChips = [];
var moreChips = [testChip1,testChip2,testChip3,testChip4,testChip5];
var lessChips = [lessChip1,lessChip2,lessChip3];

describe("Stack Builder Module", function() {

	describe("chip sorter", function() {
    it('should return a sorted list in descending order', function() {
      (lessChips.sort(sb.sortAsc)).should.eql([lessChip3,lessChip1,lessChip2]);
      (moreChips.sort(sb.sortAsc)).should.eql([testChip5,testChip4,testChip1,testChip2,testChip3]);
    });
    it('should NOT return the original list order', function() {
      (lessChips.sort(sb.sortAsc)).should.not.be.eql([lessChip1,lessChip2,lessChip3]);
      (lessChips.sort(sb.sortAsc)).should.not.be.eql([testChip1,testChip2,testChip3,testChip4,testChip5]);
    });
	});

  var distroMore = sb.distroChips(moreChips,setup1);
  var distroLess = sb.distroChips(lessChips,setup2);

  describe("distro function", function() {
    it("result should be array and chip count should be less than original", function() {
      distroMore.should.be.an.instanceOf(Array);
      distroMore[0].count.should.be.below(67); //testchip5 (now in position 0) previous value
    });
    // it("chips should have a count less than original", function() {
    //   var countTest = sb.distroChips(moreChips,setup1);
    //   countTest[0].count.should.be.above(1);
    // })
  });

  describe("setting denominations", function() {
    it('true if total value of chips greater than final stack value', function() {
      sb.setDenoms(distroMore,setup2)[0].denom.should.eql(50); // half of setup2's BB
      sb.setDenoms(distroLess,setup1)[1].denom.should.eql(50); // setup1's BB
    });
  });

  describe("enough chips validation", function() {
    it('true if total value of chips greater than final stack value', function() {
      sb.enoughValue(distroMore,setup1).should.be.true;
      sb.enoughValue(distroLess,setup2).should.be.false;
    });
  });

  describe("shave down chips", function() {
    it('sum of each chip\'s denom * count should equal expected stack total', function() {
      var testTotal1 = 0;
      distroMore.sort(sb.sortDesc);

      sb.shaveChips(distroMore,setup1);
      for (var i in distroMore) {
        testTotal1 = testTotal1 + (distroMore[i].count * distroMore[i].denom)
      }
      testTotal1.should.eql(setup1.bb * setup1.stackType); 

      // var testTotal2 = 0;
      // realExample.sort(sb.sortDesc);

      // sb.shaveChips(realExample,setup1);
      // for (var i in realExample) {
      //   testTotal2 = testTotal2 + (realExample[i].count * realExample[i].denom)
      // }
      // testTotal2.should.eql(setup1.bb * setup1.stackType); 
    });
  });

});
