const { User, Thought, Reaction } = require('../models')

module.exports = {
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find()

      res.json(thoughts)
    } catch (err) {
      console.log(err)
      return res.status(500).json(err)
    }
  },

  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v')

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' })
      }

      res.json(thought)
    } catch (err) {
      console.log(err)
      return res.status(500).json(err)
    }
  },

  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body)

      const user = await User.findOneAndUpdate(
        {username: req.body.username},
        {$push: {thoughts: thought._id}}
      )

      res.json(user)
    } catch (err) {
      res.status(500).json(err)
    }
  },

  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndRemove({ _id: req.params.thoughtId })

      if (!thought) {
        return res.status(404).json({ message: 'No such thought exists' })
      }

      const reaction = await Reaction.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      )

      if (!reaction) {
        return res.status(404).json({
          message: 'Thought deleted, but no reactions found',
        })
      }

      res.json({ message: 'Thought successfully deleted' })
    } catch (err) {
      console.log(err);
      res.status(500).json(err)
    }
  },

  async addReaction(req, res) {
    console.log('You are adding a reaction')
    console.log(req.body)

    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      )

      if (!thought) {
        return res
          .status(404)
          .json({ message: 'No thought found with that id' })
      }

      res.json(thought)
    } catch (err) {
      res.status(500).json(err)
    }
  },
  async removeReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      )

      if (!thought) {
        return res
          .status(404)
          .json({ message: 'No reaction found with that id' })
      }

      res.json(thought)
    } catch (err) {
      res.status(500).json(err)
    }
  },
}
