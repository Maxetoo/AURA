const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  selection: {
    type: String,
    required: true
  }, 
});

const AssessmentSessionSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
},
  analysisId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "AnalysisTest", 
    required: true 
},
  review: [{
    testCode: {
      type: String,
      required: true,
    },
  answers: [AnswerSchema],
  }],
  score: Number,
  status: { 
    type: String, 
    enum: ["in_progress", "completed", "reviewed"], 
    default: "in_progress" 
},
embedding: {
  type: [Number], 
  default: []
},
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Therapist" },
  diagnosisNote: {
    type: String,

  }
}, {
    timestamps: true
});

module.exports = mongoose.model("AssessmentSession", AssessmentSessionSchema);
