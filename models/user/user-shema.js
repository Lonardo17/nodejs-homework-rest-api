const { Schema, model } = require('mongoose');
const bycrypt = require('bycryptjs');
require('doenv').config();

const userSchema = new Shema(
    {
        password: {
          type: String,
          required: [true, 'Set password for user'],
        },
        email: {
          type: String,
          required: [true, 'Email is required'],
          unique: true,
        },
        subscription: {
          type: String,
          enum: ["starter", "pro", "business"],
          default: "starter"
        },
        token: String
      },
      {
        versionKey: false,
        timestamps: true,
        toJSON: {
          virtuals: true,
          transform: function (doc, ret) {
            delete ret._id;
            return ret;
          },
        },
      },
)

userSchema.pre('save', async function(next){
    if (this.isModified('password')){
        const salt = await bcrypt.genSalt(6);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
})

userShema.methods.isValidPassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

const User = model('user', userSchema);

module.export = User;