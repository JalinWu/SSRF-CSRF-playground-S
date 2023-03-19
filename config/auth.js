module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.sessionStore) {
      if (Object.values(req.sessionStore.sessions).length > 0) {

        var sessions = JSON.parse(Object.values(req.sessionStore.sessions)[0]);
        // console.log(sessions);
        if (sessions.passport && sessions.passport.user != undefined) {
          return next();
        }
        
      }
    } 
    // if (req.isAuthenticated()) {
    //   return next();
    // }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/users/login');
  },
  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/ssrf');      
  }
};
