const { Schema, model } = require('mongoose')

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    thoughts: [],
    friends: [],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
  }
)

userSchema
  .virtual('friendCount')
  .get(function() {
    return this.friends.length
  })

const User = model('user', userSchema)

module.exports = User
