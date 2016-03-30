var express = require('express');
var router = express.Router();

var til = [];

/* READ all: GET til listing. */
router.get('/', function(req, res, next) {
  console.log(req.cookies.username);
  var name = req.cookies.username || 'anonymous';
  req.db.driver.execQuery(
    "SELECT * FROM entries;",
    function (err, data) {
      if(err)
      {
        console.log(err);
      }
      //console.log(data);
      res.render('til/index', { title: 'Today I Learned', til: data, name: name });
    }
  )
});

/* CREATE til entry form: GET /til/new */
router.get('/new', function(req, res, next) {
  res.render('til/new', { title:"Create new til entry" } );
});

/* CREATE til entry: POST /til/ */
router.post('/', function(req, res, next) {
  req.db.driver.execQuery(
    "INSERT INTO entries (slug, body) VALUES (?,?);",
    [req.body.slug, req.body.body],
    function(err, data) {
      if(err)
      {
        console.log(err);
      }
  
      res.redirect(303, '/til/');
    }
  );
});

/* UPDATE til entry form: GET /til/1/edit */
router.get('/:id/edit', function(req, res, next) {
  req.db.driver.execQuery(
    'SELECT * FROM entries WHERE id=?;',
    [parseInt(req.params.id)],
    function(err, data) {
      if(err)
      {
        console.log(err);
      }

      res.render('til/update',
      {
	title: 'Update a til entry',
	entry: data[0]
      });
    }
  );
});

/* UPDATE til entry: POST /til/1 */
router.post('/:id', function(req, res, next) {
  var id=parseInt(req.params.id);

  req.db.driver.execQuery(
    "UPDATE entries SET slug=? ,body=? WHERE id=?;",
    [req.body.slug, req.body.body, parseInt(req.params.id)],
    function(err, data) {
      if(err)
      {
        console.log(err);
      }
      
      res.redirect(303, '/til/' + id);
    }
  );

});

/* DELETE til entry: GET /til/1/delete */
router.get('/:id/delete', function(req, res, next) {
  req.db.driver.execQuery(
    'DELETE FROM entries WHERE id=?;',
    [parseInt(req.params.id)],
    function(err, data) {
      if(err)
      {
        console.log(err);
      }
    
      res.redirect(303, '/til/');
    }
  );
});

/* THIS NEEDS TO BE LAST or /new goes here rather than where it should */
/* READ one til entry: GET /til/0 */
router.get('/:id', function(req, res, next) {
  console.log("GET entry id");
  req.db.driver.execQuery(
    'SELECT * FROM entries WHERE id=?;',
    [parseInt(req.params.id)],
    function(err, data) {
      if(err)
      {
        console.log(err);
      }

      res.render('til/entry', { title: "a entry", entry: data[0] } );
    }
  );
});

module.exports = router;
