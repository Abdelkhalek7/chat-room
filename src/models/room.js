const mongoose =require('mongoose')

const roomschema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        trim:true,
        unique:true,
        lowercase:true,
        

    },admin:{
        type:String,
        required: true,
        trim:true,
        lowercase:true,
    },
    password:{
        type:String,
        //required: true,
        trim:true,

 
        
    },
    messages:[ {message:{
          msg:{
            type: String,
           },
           owner:{
            type: String,
            //required:true,
            },
            time:{
            type: String
                
            }

        }
       
        
        
    }]
},{
    timestamps:true,
    toJSON: {virtuals: true}
})
const Task=mongoose.model('Room',roomschema)



roomschema.methods.addmsg=async function(msg){
    const room = this;
    
    room.messages = room.messages.concat({msg})
    await user.save()
    return

}

module.exports=Task
