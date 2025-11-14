/* utils/prompts.js */

const questionAnswerPrompt = (role , experience , topicsToFocus , numberOfQuestions) => (`
    You are an AI trained to generate technical interview questions and answer.
    
    Task:
    -Role: ${role}
    -Candidate Experience: ${experience} years
    -Focus Topics: ${topicsToFocus}
    -Write ${numberOfQuestions} interview questions.
    -For each question generate a detailed but beginner-friendly answer.
    
    *** IMPORTANT FORMATTING RULES ***
    - Format the entire "answer" field as a single Markdown string.
    - **CRITICAL:** You MUST ensure the "answer" string is a valid JSON string. This means all newlines MUST be escaped as \\n, and all double-quotes MUST be escaped as \\".
    - Use Markdown for headings, lists, bold text, and paragraphs.
    - If the answer needs a code example, **YOU MUST** use fenced Markdown code blocks (e.g., \`\`\`javascript ... \`\`\`).
    - The example of a code block you provided previously (\`\`\`javascript ... \`\`\`) is the correct format to use *inside* the "answer" string.
    
    -Return a pure JSON array like:
    [
    {
        "question": "Question here",
        "answer": "# Markdown formatted answer here... with \\n for newlines and \\" for quotes."
    },
    ...
    ]
    Important: Do NOT add any extra text. Only return valid JSON.
`);

const conceptExplainPrompt = (question) => (`
    You are an AI trained to explain programming and computer science interview concepts clearly and in depth.

    Your task:
    - Explain the given question in detail as if teaching a beginner developer.
    - Include short bullet points for clarity.

    *** IMPORTANT FORMATTING RULES ***
    - Format the entire "answer" field as a single Markdown string.
    - **CRITICAL:** You MUST ensure the "explaination" string is a valid JSON string. This means all newlines MUST be escaped as \\n, and all double-quotes MUST be escaped as \\".
    - Use Markdown for headings, lists, bold text, and paragraphs.
    - If the answer needs a code example, **YOU MUST** use fenced Markdown code blocks (e.g., \`\`\`javascript ... \`\`\`).
    - The example of a code block you provided previously (\`\`\`javascript ... \`\`\`) is the correct format to use *inside* the "answer" string.

    Example output format:
    {
    "title": "Short title summarizing the topic",
    "explaination": "# Markdown explanation here... with \\n for newlines and \\" for quotes."
    }
    Important: Do NOT add any extra text. Only return valid JSON.
    Now, generate your response in **this exact format** for the question: "${question}".
`);


module.exports = {questionAnswerPrompt , conceptExplainPrompt};