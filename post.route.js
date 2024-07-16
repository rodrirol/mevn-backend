const express = require('express');
const postRoutes = express.Router();

// Require Post model in our routes module
let Post = require('./post.model');

// Defined store route
postRoutes.route('/add').post(function (req, res) {
  let post = new Post(req.body);
  post.save()
    .then(() => {
      res.status(200).json({'business': 'business in added successfully'});
    })
    .catch(() => {
      res.status(400).send("unable to save to database");
    });
});

// Defined get data(index or listing) route
// postRoutes.route('/').get(function (req, res) {
//     Post.find(function(err, posts){
//     if(err){
//       res.json(err);
//     }
//     else {
//       res.json(posts);
//     }
//   });
// });

// This change is because callbacks are no longer supported for queries in this version of Mongoose
postRoutes.route('/').get(async function (req, res) {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.json(err);
  }
});

// Defined edit route
postRoutes.route('/edit/:id').get(function (req, res) {
  let id = req.params.id;
  Post.findById(id, function (err, post){
      if(err) {
        res.json(err);
      }
      res.json(post);
  });
});

//  Defined update route
postRoutes.route('/update/:id').post(function (req, res) {
    Post.findById(req.params.id, function(err, post) {
    if (!post)
      res.status(404).send("data is not found");
    else {
        post.title = req.body.title;
        post.body = req.body.body;
        post.save().then(() => {
          res.json('Update complete');
      })
      .catch(() => {
            res.status(400).send("unable to update the database");
      });
    }
  });
});

// Defined delete | remove | destroy route
// postRoutes.route('/delete/:id').delete(function (req, res) {
//     Post.findByIdAndRemove({_id: req.params.id}, function(err){
//         if(err) res.json(err);
//         else res.json('Successfully removed');
//     });
// });

// This change is because findByIdAndRemove() method is not available in this version of Mongoose
postRoutes.route('/delete/:id').delete(async function (req, res) {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json('Post not found');
    }
    res.json('Successfully removed');
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = postRoutes;