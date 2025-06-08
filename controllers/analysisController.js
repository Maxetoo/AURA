const Analysis = require('../models/analysisModel');
const User = require('../models/userModel');
const Question = require('../models/questionAssessmentModel');
const Assessment = require('../models/assessmentModel')
const CustomError = require('../errors')
const { StatusCodes } = require('http-status-codes');
const openai = require('../services/openAiClient');


const getEmbedding = async (...args) => {
const { getEmbedding } = await import('../services/transformer.mjs');
  return getEmbedding(...args);
};


const runPatientAnalysis = async (req, res) => {
  const { symptoms } = req.body;
  const user = req.user.userId || '';

  if (!symptoms) {
    throw new CustomError.BadRequestError('Please specify symptoms');
  }

  if (!user) {
    throw new CustomError.BadRequestError('You are not logged in');
  }

  if (symptoms.length < 20) {
    throw new CustomError.BadRequestError('Symptoms are too short for test suggestions!');
  }

  const findUser = await User.findById(user);

  // Step 1: Validate if symptom is actually a real symptom and not fake input
  const validationPrompt = `
    Someone said the following: "${symptoms}"

    Does this sound like a valid mental health symptom description, or is it a test/non-serious input?

    Respond with only "Valid" or "Invalid".
  `;

  try {
    const validationResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: validationPrompt }],
    });

    const validationResult = validationResponse.choices[0].message.content.trim().toLowerCase();

    if (validationResult !== 'valid') {
      throw new CustomError.BadRequestError('Symptom is not valid for test analysis.');
    }

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
    const jsonMatch = text.match(/\[\s*{[\s\S]*}\s*\]/);

    if (!jsonMatch) {
      throw new CustomError.BadRequestError("Failed to extract valid JSON from AI response");
    }

    const parsedTests = JSON.parse(jsonMatch[0]);

    const userAssessmentAnalysis = await Analysis.create({
      user,
      description: symptoms,
      assessments: parsedTests,
    });

    if (findUser) {
      // push the recommended tests 
      findUser.recommendedTests.push(userAssessmentAnalysis._id);
      // push active recommended test id
      findUser.activeAssessmentId = userAssessmentAnalysis._id
    }

    await findUser.save();

    console.log(user.activeAssessmentId)

    res.status(StatusCodes.CREATED).json({ suggestedTests: userAssessmentAnalysis });

  } catch (error) {
    res.status(500).json({ message: "AI failed to suggest tests", error: error.message || error });
  }
};




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

    // find user
    const findUser = await User.findById(user);

    if (!findUser) {
      throw new CustomError.NotFoundError('User not found');
    }

    const { id: analysisId } = req.params;

    // Determine which analysisId to use
    const targetAnalysisId = findUser.activeAssessmentId || analysisId;


     if (!targetAnalysisId) {
      throw new CustomError.BadRequestError('Analysis report should be specified');
    }


    // find the analysis report
    const analysis = await Analysis.findOne({user, _id: targetAnalysisId})


    // Find assessment
    const assessment = await Assessment.findOne({ user, analysisId: targetAnalysisId })
    // .select('-embedding');


    // filter remaining assessments (with same testCode)
    const retrievedRemainingAssessments = analysis.assessments?.filter(
      (value) => !assessment?.review?.find(val => val.testCode === value.test)
    ).map(val => val.test).join(', '); 



    message = !retrievedRemainingAssessments && assessment?.status === 'in_progress'
      ? `Please complete all assessments`
      : retrievedRemainingAssessments
      ? `Please take the remaining assessments: ${retrievedRemainingAssessments}`
      : 'You have completed all assessments'; 

      const statusTitle = assessment?.status === 'in_progress'
        ? 'Almost there!'
        : assessment?.status === 'completed'
        ? 'Assessment Complete'
        : 'Assessment In Progress';

    res.status(StatusCodes.OK).json({
      assessment,
      // analysis,
      statusTitle,
      message
    })

}


const addUserAssessment = async(req, res) => {
    const user = req.user.userId || ''

    if (!user) {
      throw new CustomError.BadRequestError('You are not logged in');
    }

    // find user
    const findUser = await User.findById(user);

    if (!findUser) {
      throw new CustomError.NotFoundError('User not found');
    }

    const {analysisId, review = {}} = req.body;

     // Determine which analysisId to use
    const targetAnalysisId = findUser.activeAssessmentId || analysisId;

    if (!targetAnalysisId) {
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

    // find analysis 
    const analysis = await Analysis.findOne({user, _id: targetAnalysisId});

    if (!analysis) {
      throw new CustomError.BadRequestError('No record for assessment');
    }

    let assessment = await Assessment.findOne({
      user,
      analysisId: targetAnalysisId
    });


    if (!assessment) {
      // first time answering 
      assessment = new Assessment({
        user,
        analysisId: targetAnalysisId,
        review: [{
          testCode,
          answers
        }],
        status: 'in_progress'
      })

    } else {

      const reviewItem = assessment.review.find(val => val.testCode === testCode);

      if (!reviewItem) {
        assessment.review.push({
          testCode,
          answers
        })
      } else {
        // Overwrite previous answers instead of pushing
        reviewItem.answers = answers;
      }

      if (assessment.review.length === analysis.assessments.length) {
          assessment.status = 'completed';

          const desiredProfile = `
              Patient is seeking help for:
              Symptoms: ${analysis.description}
              Date of Birth: ${findUser.dateOfBirth}
              Needs therapist experienced in: ${analysis.assessments.map(val => val.test).join(', ')}
          `;
          const embedding = await getEmbedding(desiredProfile);
          assessment.embedding = Array.from(embedding);
      }
    }   
 
    await assessment.save();

    res.status(StatusCodes.OK).json({message: 'Assessment added successfully!'})
}


const matchTherapist = async (req, res) => {
  const userId = req.user.userId;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;

  const user = await User.findById(userId);

  if (!user?.activeAssessmentId) {
    throw new CustomError.BadRequestError('Missing active assessment');
  }

  const assessment = await Assessment.findOne({
    user: userId,
    analysisId: user.activeAssessmentId
  });

  if (!assessment || assessment.status !== 'completed') {
    throw new CustomError.BadRequestError('Complete the assessment first');
  }

  if (!assessment.embedding?.length) {
    throw new CustomError.BadRequestError('No assessment embedding found');
  }


  const therapists = await User.aggregate([
  {
    $vectorSearch: {
      index: 'vector_index_search',
      queryVector: assessment.embedding,
      path: 'embedding',
      numCandidates: 100,
      limit: 100,
      filter: {
        role: 'therapist',
        isVerified: true
      }
    }
  },
  {
    $project: {
      firstname: 1,
      lastname: 1,
      email: 1,
      resume: 1,
      certifications: 1,
      profilePhoto: 1,
      yearsOfExperience: 1,
      specialties: 1,
      score: { $meta: 'vectorSearchScore' }
    }
  }, {
    $sort: { score: -1 }
  },
  {
    $skip: (page - 1) * limit
  },
  {
    $limit: limit
  }
]);

if (therapists.length === 0) {
  throw new CustomError.NotFoundError('No therapists found matching your assessments');
}


res.status(StatusCodes.OK).json({
  success: true,
  therapists,
  pagination: { page, limit }
});
};






module.exports = {
    runPatientAnalysis,
    getAllPatientAnalysis,
    generateAssessmentQuestions,
    addUserAssessment,
    getMyAssessments,
    matchTherapist
}


