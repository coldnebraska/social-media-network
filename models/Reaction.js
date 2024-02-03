const { Schema } = require('mongoose')
const { format_date } = require('../utils/helpers')

const reactionSchema = new Schema(
  {
    reactionID: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId()
    },
    reactionBody: {
      type: String,
      required: true,
      maxLength: 280
    },
    username: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: () => format_date(Date.now())
    }
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
)


module.exports = reactionSchema
