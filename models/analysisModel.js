const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema({
    test: { type: String, required: true },
    reason: { type: String,  required: true },
  });

const AnalysisTestSchema = new mongoose.Schema({
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true
    },
    description: { 
      type: String,
      minLength: 15,
      maxLength: 400, 
      required: true 
  },
  assessments: [AssessmentSchema]
    
  }, {
      timestamps: true
  });
  
module.exports = mongoose.model("AnalysisTest", AnalysisTestSchema);


