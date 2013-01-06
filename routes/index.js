
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { 
    title: 'Welcome, to Aksel\'s Chat Server',
    users: res.app.settings['users']
   });
};
