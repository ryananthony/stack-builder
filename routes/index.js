
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Texas Hold\'em Stack Builder' });
};

exports.getStack = function(req, res){
  res.render('index', { title: 'Texas Hold\'em Stack Builder' });
};