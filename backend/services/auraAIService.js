import dotenv from 'dotenv';
dotenv.config();

/**
 * AuraAIService calculates remaining classes needed for 75% attendance and returns a coaching tip.
 * Uses a mathematical fallback if the LLM isn't perfectly configured.
 */
export const generateAIInsight = async (attendancePercentage, currentClassesAttended, totalClassesConducted) => {
  try {
    // Math logic calculation for 75% rule
    // (attended + required) / (total + required) >= 0.75
    // attended + required >= 0.75 * total + 0.75 * required
    // 0.25 * required >= 0.75 * total - attended
    // required >= 3 * total - 4 * attended
    
    let requiredClasses = Math.ceil(3 * totalClassesConducted - 4 * currentClassesAttended);
    if (requiredClasses < 0) requiredClasses = 0;
    
    // Simulate LLM API Call
    // Real implementation would use: fetch('api.openai.com/v1/completions', { headers: { Authorization: `Bearer ${process.env.LLM_API_KEY}` }})
    // For now, we simulate an AI response with prompt template:
    const insightTemplate = 
      requiredClasses === 0 
        ? `Great job! You're above 75%. Keep up the momentum.`
        : `You need to attend ${requiredClasses} consecutive classes to hit your 75% safe zone. You can do this!`;
    
    return {
      insight: insightTemplate,
      required_consecutive_classes: requiredClasses,
      provided_by: "AuraAI",
    };
  } catch (error) {
    // Mathematical Fallback
    const fallbackRequired = Math.ceil(3 * totalClassesConducted - 4 * currentClassesAttended);
    return {
      insight: `Required classes to maintain 75%: ${fallbackRequired > 0 ? fallbackRequired : 0}`,
      required_consecutive_classes: fallbackRequired > 0 ? fallbackRequired : 0,
      provided_by: "Math-Fallback",
    };
  }
};
