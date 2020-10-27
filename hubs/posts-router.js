const express = require('express')
const router = express.Router()
const Post = require('./db')


router.get('/api/posts', (req, res) => {
    Post.find()
        .then((data) => {
            res.status(200).json(data)
        }).catch((err) => {
            res.status(500).json({ error: "There was an error while saving the comment to the database" })
        })
})

router.get('/api/posts/:id', (req, res) => {
    Post.findById(req.params.id)
        .then((data) => {
            if (!data.length) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            } else {
                res.status(200).json(data)
            }
        }).catch((err) => {
            res.status(500).json({ error: "The post information could not be retrieved." })
        })
})

router.get('/api/posts/:id/comments', (req, res) => {
    Post.findPostComments(req.params.id)
        .then((data) => {
            if (!data.length) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            } else {
                res.status(200).json({ data: data })
            }
        }).catch((err) => {
            res.status(500).json({ error: "The comments information could not be retrieved." })
        })
})

router.post('/api/posts', (req, res) => {
    const { title, contents } = req.body
    const newPost = { title, contents }
    Post.insert(newPost)
        .then((data) => {
            if (!title || !contents) {
                res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
            } else {
                res.status(201).json(data)
            }
        }).catch((err) => {
            res.status(500).json({ error: "There was an error while saving the post to the database" })
        })
})

router.post("/api/posts/:id/comments", (req, res) => {
    const id = req.params.id;
    const info = req.body;
    if (!info.text) {
        res.status(404).json({ message: "Please provide text for the comment." });
    } else {
        Post.findById(id)
            .then((data) => {
                if (!data.length) {
                    res.status(400).json({ message: "The post with the specified ID does not exist" });
                } else {
                    Post.insertComment({ ...info, post_id: id })
                        .then((ban) => {
                            res.status(201).json(ban);
                        });
                }
            })
            .catch((error) => {
                res.status(500).json({ error: "There was an error while saving the comment to the database" });
            });
    }
});


router.delete('/api/posts/:id', (req, res) => {
    Post.remove(req.params.id)
        .then((data) => {
            if (data === 0) {
                res.status(404).json({ message: `No post found with id ${req.params.id}` })
            } else {
                res.status(200).json({ message: 'Successfully Deleted Post' })
            }
        }).catch((err) => {
            res.status(500).json({ error: "The post could not be removed" })
        })
})

router.put('/api/posts/:id', (req, res) => {
    Post.update(req.params.id, req.body)
        .then((data) => {
            if (!data.length) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            } else {
                res.status(200).json(data)
            }
        }).catch((err) => {
            res.status(500).json({ error: "The post information could not be modified." })
        })
})

module.exports = router