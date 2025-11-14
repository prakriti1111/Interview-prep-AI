const {GoogleGenerativeAI} = require("@google/generative-ai");
const { conceptExplainPrompt, questionAnswerPrompt } = require("../utils/prompts");

const ai = new GoogleGenerativeAI( process.env.GEMINI_API_KEY );

// @desc Generate interview questions and answers using Gemini
// @route POST /api/ai/generate-questions
// @acess Private
const generateInterviewQuestions = async (req , res) => {
    try{
        const { role , experience , topicsToFocus , numberOfQuestions } = req.body;

        if(!role || !experience || !topicsToFocus || !numberOfQuestions) {
            return res.status(400).json({message: "Missing required fields"});
        }

        const prompt = questionAnswerPrompt(role , experience , topicsToFocus , numberOfQuestions);
        // *** HIGHLIGHT: Using a more robust model is recommended ***
        const model = ai.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
        const result = await model.generateContent(prompt);
        let rawText = result.response.text();
        
        // --- HIGHLIGHT: This is the new, SAFER cleanup logic ---
        let cleanedText = rawText
            .replace(/^```json/i, "") // Remove ```json from the START
            .replace(/```$/, "")     // Remove ``` from the END
            .trim();                 // Remove leading/trailing whitespace

        cleanedText = cleanedText
        .replace(/^```[a-z]*\n?/gi, "") // remove ```json or ``` lines
        .replace(/```$/g, "")           // remove ending ```
        .replace(/[\u0000-\u001F]+/g, "") // remove stray control chars
        .replace(/,\s*([\]}])/g, "$1")  // remove trailing commas
        .trim();

        // Now, find the first { or [ and the last } or ]
        let jsonMatch = cleanedText.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
        // --- END HIGHLIGHT ---

        if (!jsonMatch) {
            console.error("No valid JSON found:", cleanedText);
            return res.status(500).json({ message: "No valid JSON found", raw: cleanedText });
        }

        try {
            const jsonData = JSON.parse(jsonMatch[0]);
            return res.status(200).json(jsonData);
        } catch (parseErr) {
            console.error("JSON parse failed:", parseErr.message, "\nRAW TEXT:\n", cleanedText);
            console.error(" JSON parse failed:", parseErr.message, "\nCleaned:", cleanedText);
            return res.status(500).json({ message: "Invalid JSON format", raw: cleanedText });
        }

    } catch(error){
        res.status(500).json({
            message: "Failed to generate questions!!", 
            error: error.message,
        });
    }
};

// @desc Generate explains a interview question
// @route POST /api/ai/generate-explaination
// @acess Private

const generateConceptExplaination = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ message: "Missing required field: question" });
    }

    const prompt = conceptExplainPrompt(question);
    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    const result = await model.generateContent(prompt);
    let rawText = result.response.text();

    let cleanedText = rawText
            .replace(/^```json/i, "") // Remove ```json from the START
            .replace(/```$/, "")     // Remove ``` from the END
            .trim();                 // Remove leading/trailing whitespace

        cleanedText = cleanedText
        .replace(/^```[a-z]*\n?/gi, "") // remove ```json or ``` lines
        .replace(/```$/g, "")           // remove ending ```
        .replace(/[\u0000-\u001F]+/g, "") // remove stray control chars
        .replace(/,\s*([\]}])/g, "$1")  // remove trailing commas
        .trim();

        // Now, find the first { or [ and the last } or ]
      let jsonMatch = cleanedText.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (!jsonMatch) {
      console.error("No valid JSON found:", cleanedText);
      return res.status(500).json({
        message: "No valid JSON found in AI output",
        raw: cleanedText,
      });
    }

    // Parse safely
    try {
      const jsonData = JSON.parse(jsonMatch[0]);
      return res.status(200).json(jsonData);
    } catch (parseErr) {
      console.error("JSON parse failed:", parseErr.message, "\nCleaned:", cleanedText);
      return res.status(500).json({
        message: "Invalid JSON format",
        raw: cleanedText,
      });
    }

  } catch (error) {
    console.error("Controller error:", error.message);
    return res.status(500).json({
      message: "Failed to generate explanation",
      error: error.message,
    });
  }
};
module.exports = {
    generateInterviewQuestions , generateConceptExplaination
};