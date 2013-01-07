
/*
 * GET home page.
 */

module.exports.index = function(req, res){
  console.log("POOOOOOOP");
  res.render('index', { 
    title: 'Welcome, to the Chat Server',
    users: res.app.settings['users']
   });
};

//Modify the exports object to act like a function, allows param passing
module.exports = function(params) {
  //Private scope for this module
  var app = params.app;
  return {
    //How can I pass params to the function below? Is that possible?
    index: exports.index//function(req, res) {
    //  console.log("I got it!", params);
    //  res.render('index', { 
    //    title: 'Welcome, to improved Aksel\'s Chat Server',
    //    users: res.app.settings['users']
    //  });
    }
  //};
};
