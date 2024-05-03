Someone needs to edit this telling professor what to do


//Function for the logout link

app.get('/logout', function(req, res) {
  req.session.destroy(function(err) {
      if(err) {
          console.error('Error destroying session:', err);
          res.status(500).send('Error logging out');
      } else {
          res.redirect('/');
      }
  });
});

//added href for layout page

        a(href='/logout') Logout &nbsp; | &nbsp;
