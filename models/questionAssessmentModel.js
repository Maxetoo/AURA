const mongoose = require("mongoose");


const QuestionSchema = new mongoose.Schema({
  question: String,
  options: Array, 
});


const QuestionSessionSchema = new mongoose.Schema({
    test: { 
    type: String, 
    required: true 
},
    reason: { 
    type: String, 
    required: true 
},

questions: [QuestionSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model("QuestionAssessment", QuestionSessionSchema);