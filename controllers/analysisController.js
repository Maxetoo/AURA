const Analysis = require('../models/analysisModel');
const User = require('../models/userModel');
const Question = require('../models/questionAssessmentModel');
const Assessment = require('../models/assessmentModel')
const CustomError = require('../errors')
const { StatusCodes } = require('http-status-codes');
const openai = require('../services/openAiClient');


const runPatientAnalysis = async(req, res) => {
    const { symptoms } = req.body;
    // get user id  
    const user = req.user.userId || ''

    if (!symptoms) {
        throw new CustomError.BadRequestError('Please specify symptoms');
    }

    if (!user) {
      throw new CustomError.BadRequestError('You are not logged in');
    }

    if (symptoms.length < 20) {
       throw new CustomError.BadRequestError('Symptoms are too short for test suggestions!');
    }

    let findUser = await User.findOne({_id: user})

    try {

        const prompt = `
      A user describes their symptoms as follows: "${symptoms}"

      Based on these symptoms, suggest the most appropriate mental health screening tests. Choose from standard assessments like PHQ-9 (Depression), GAD-7 (Anxiety), ASRS (ADHD), PCL-5 (PTSD), ISI (Insomnia), etc.

      Respond with a JSON array like this:
      [
        { "test": "PHQ-9 Depression Assessment", "reason": "Screens for depression symptoms" },
        { "test": "GAD-7 Anxiety Assessment", "reason": "Screens for generalized anxiety disorder" }
      ]
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    }); 

    const text = completion.choices[0].message.content;

    // parse response to json object
    const jsonMatch = text.match(/\[\s*{[\s\S]*}\s*\]/);

    if (!jsonMatch) {
      throw new CustomError.BadRequestError("Failed to extract valid JSON from AI response");
    }

    const parsedTests = JSON.parse(jsonMatch[0]);

    const userAssessmentAnalysis = await Analysis.create({
      user,
      description: symptoms,
      assessments: parsedTests
    })

    if (findUser) {
      findUser.recommendedTests.push(userAssessmentAnalysis._id)
    }

  await findUser.save()    


    res.status(StatusCodes.CREATED).json({ suggestedTests: userAssessmentAnalysis });

    } catch (error) {
    
    res.status(500).json({ message: "AI failed to suggest tests", error });

    }
}



const getAllPatientAnalysis = async(req, res) => {
    const { sort = -1, page = 1, limit = 5, select, user} = req.query

    let filter = {};

    if (user) {
      filter.email = user
    }

    const userAnalysis = await Analysis.find(filter).select(select).sort(sort).limit(limit).skip((page - 1) * limit)

    const totalCount = await Analysis.countDocuments();
    const totalPages = Math.ceil(totalCount / limit)

    res.status(StatusCodes.OK).json({ 
        userAnalysis, 
        totalMerch: totalCount,
        totalPages,
        currentPage: parseInt(page),
        perPage: parseInt(limit),
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
    })
}

const generateAssessmentQuestions = async (req, res) => {
  const { test, reason } = req.body;

  if (!test) {
    throw new CustomError.BadRequestError('Test name should be specified');
  }

  if (!reason) {
    throw new CustomError.BadRequestError('Reason should be specified');
  }

  const assessment = await Question.findOne({test, reason})


  try {
    const prompt = `
      A user has been recommended the "${test}" mental health screening test for the following reason: "${reason}".

      Based on the standard practice for this test, generate a suitable set of assessment questions that would help screen the user's condition accurately.

      Each question should be structured as a JSON object with four standard response options.

      Respond ONLY with a valid JSON array like this:
      [
        {
          "question": "Little interest or pleasure in doing things",
          "options": ["Not at all", "Several days", "More than half the days", "Nearly every day"]
        }
      ]
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const text = completion.choices[0].message.content;

    // Extract JSON array from response
    const jsonMatch = text.match(/\[\s*{[\s\S]*?}\s*\]/);

    if (!jsonMatch) {
      throw new CustomError.BadRequestError("Failed to extract valid JSON from AI response");
    }

    const parsedQuestions = JSON.parse(jsonMatch[0]);

    if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
      throw new CustomError.BadRequestError("No questions returned in AI response"); 
    }

    if (assessment) {
      res.status(StatusCodes.OK).json({assessment});
    } else {
      const newAssessment = await Question.create({
        test,
        reason,
        questions: parsedQuestions
      })

      res.status(StatusCodes.CREATED).json({assessment: newAssessment});

    }
    
  } catch (error) {
    console.error("Error generating assessment questions:", error.message);
    res.status(500).json({
      message: "AI failed to generate assessment questions",
      error: error.message,
    });
  }
};


const getMyAssessments = async(req, res) => {
   const user = req.user.userId
   let message;
 
    if (!user) {
      throw new CustomError.BadRequestError('You are not logged in');
    }

    const { id: analysisId } = req.params;

     if (!analysisId) {
      throw new CustomError.BadRequestError('Analysis report should be specified');
    }

    const analysis = await Analysis.findOne({user, _id: analysisId})

    if (!analysis) {
      throw new CustomError.BadRequestError('No record for assessment');
    }

    const assessment = await Assessment.findOne({
      user,
      analysisId
    });


    // filter remaining assessments (with same testCode)
    const retrievedRemainingAssessments = analysis.assessments?.filter(
      (value) => !assessment.review.find(val => val.testCode === value.test)
    ).map(val => val.test).toString()

    message = retrievedRemainingAssessments ? `Please take the remaining assessments: ${retrievedRemainingAssessments}` : 'You have successfully completed all your assessments'

    const statusTitle = assessment.status === 'in_progress' ? 'Almost there!' : 'Assessment Complete'

    res.status(StatusCodes.OK).json({
      assessment,
      statusTitle,
      message
    })

}


const addUserAssessment = async(req, res) => {
    const user = req.user.userId || ''

    if (!user) {
      throw new CustomError.BadRequestError('You are not logged in');
    }


    const {analysisId, review = {}} = req.body;

    if (!analysisId) {
      throw new CustomError.BadRequestError('Analysis report should be specified');
    }

    if (!review || typeof review !== 'object') {
      throw new CustomError.BadRequestError('Review should be specified');
    }

    const {testCode, answers} = review

    if (!testCode || !Array.isArray(answers) || answers.length === 0) {
      throw new CustomError.BadRequestError('Review must contain a valid testCode and answers');
    }

    const assessmentQuestions = await Question.findOne({test: testCode});

    if (!assessmentQuestions) {
      throw new CustomError.BadRequestError('Could not get questions');
    }

    if (assessmentQuestions.questions.length !== answers.length) {
       throw new CustomError.BadRequestError('Please answer all the questions');
    }

    const userAssessments = await Analysis.findOne({user, _id: analysisId})

    if (!userAssessments) {
      throw new CustomError.BadRequestError('No record for assessment');
    }

    let assessment = await Assessment.findOne({
      user,
      analysisId
    });


    if (!assessment) {
      // first time answering 
      assessment = new Assessment({
        user,
        analysisId,
        review: [{
          testCode,
          answers
        }],
        status: 'in_progress'
      })

    } else {
      // find for existing test code
      const reviewItem = assessment.review.find(val => val.testCode === testCode);

      if (!reviewItem) {
        assessment.review.push({
          testCode,
          answers
        })
      } else {
        reviewItem.answers.push(...answers)
      }

      if (assessment.review.length === userAssessments.assessments.length) {
        assessment.status = 'completed'
      } 
    }   
 
    await assessment.save();

    res.status(StatusCodes.OK).json({message: 'Assessment added successfully!'})
}

const matchTherapist = async(req, res) => {
    const therapists = await User.find({
      role: 'therapist',
      isVerified: true
    }).select('firstname lastname email governmentIssuedId certifications resume')

    if (therapists) {
      throw new CustomError.BadRequestError('No therapist available at the moment!')
    }

  therapists.map(t => {
    return {
      id: t._id,
      content: `
        Name: ${t.firstname} ${t.lastname}
        Email: ${t.email}
        ID: ${t.governmentIssuedId}
        Certifications: ${t.certifications.join(', ')} 
        Qualifications: ${t.resume.join(', ')}
      `
    }
});


}





module.exports = {
    runPatientAnalysis,
    getAllPatientAnalysis,
    generateAssessmentQuestions,
    addUserAssessment,
    getMyAssessments
}


