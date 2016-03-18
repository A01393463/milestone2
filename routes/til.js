var express = require('express');
var router = express.Router();

var til = [
  { slug:"How to implement pipes in a shell", body:"Use pipe() and dup2()", created_at:"March 5 2016" },
  { slug:"How to write a dynamic website", body:"Use express and a bunch of other stuff", created_at:"March 4 2016" }
];

/* READ all: GET til listing. */
router.get('/', function(req, res, next) {
  req.db.driver.execQuery(
    "SELECT * FROM entries;",
    function (err, data) {
      if(err) { console.log(err); }
      console.log(data);
      res.render('til/index', { title: 'Today I Learned', til: data });
    }
  )
});

/* CREATE til entry form: GET /til/new */
router.get('/new', function(req, res, next) {
  res.render('til/new', { title:"Create new til entry" } );
});

/* CREATE til entry: POST /til/ */
router.post('/', function(req, res, next) {
  til.push(req.body);
  res.render('til/index', { title: 'Today I Learned', til: til });
});

/* UPDATE til entry form: GET /til/1/edit */
router.get('/:id/edit', function(req, res, next) {
  res.render('til/update',
  {
    title: 'Update a til entry',
    id: req.params.id,
    entry: til[req.params.id]
  });
});

/* UPDATE til entry: POST /til/1 */
router.post('/:id', function(req, res, next) {
  til[req.params.id] = req.body;
  res.render('til/index',
  {
    title: 'Update a til entry',
    til: til
  });
});

/* DELETE til entry: GET /til/1/delete */
router.get('/:id/delete', function(req, res, next) {
  var id = req.params.id;
  til = til.slice(0,id).concat(til.slice(id+1, til.length));
  res.render('til/index', { title:'Today I Learned', til: til });
});

/* THIS NEEDS TO BE LAST or /new goes here rather than where it should */
/* READ one til entry: GET /til/0 */
router.get('/:id', function(req, res, next) {
  res.render('til/entry', { title:"A til entry", entry: til[req.params.id] } );
});

module.exports = router;
