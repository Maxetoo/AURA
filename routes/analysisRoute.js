const express = require('express');
const AnalysisRoute = express.Router()
const { runPatientAnalysis, generateAssessmentQuestions, addUserAssessment, getMyAssessments} = require('../controllers/analysisController');
const { authentication, authorization } = require('../middlewares/authentication')


AnalysisRoute.route('/').post(authentication, runPatientAnalysis)
AnalysisRoute.route('/generate-questions').post(authentication, generateAssessmentQuestions)
AnalysisRoute.route('/add-assessment').post(authentication, addUserAssessment)
AnalysisRoute.route('/assessment/:id').get(authentication, getMyAssessments)



module.exports = AnalysisRoute