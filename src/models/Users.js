const mongoose = require("mongoose");

const userschema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      tirm: true,
      lowercase: true,
      //unique: true,
    },
    id: { 
        type:String,  
        //required: true
     },

    avater: {
      type: Buffer,
    },
    room: {
      type: mongoose.Schema.Types.String,
      lowercase: true,
      tirm: true,
     // required: true,
      ref: "Room",
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);
userschema.methods.toJSON = function () {
  const user = this;
  const userobject = user.toObject();

  return userobject;
};
userschema.index( { "username": 1, "room": 1 }, { unique: true } )

const User = mongoose.model("User", userschema);
//db.User.createIndex( { "username": 1, "room": 1 }, { unique: true } )
module.exports = User;
