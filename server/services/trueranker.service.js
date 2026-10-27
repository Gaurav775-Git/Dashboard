const TRUERANKER_API_KEY = process.env.TRUERANKER_API_KEY;
const BASE_URL = 'https://app.trueranker.com/data';

async function getAiVisibility(projectId) {
  if (!TRUERANKER_API_KEY) {
    throw new Error('TrueRanker API key is missing');
  }

  // Using the valid keyword endpoint as discussed
  const url = `${BASE_URL}/project/keyword/list?key=${TRUERANKER_API_KEY}&project=${projectId}&start=20240101&end=20261231`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.ok) throw new Error(data.error || 'Failed to fetch TrueRanker data');

    const keywords = data.data || [];
    const aiKeywords = keywords.filter(k => (k.keyword || '').toLowerCase().includes('ai'));
    const mentioned = aiKeywords.filter(k => k.position && k.position <= 10).length;

    return {
      visibilityScore: aiKeywords.length > 0 ? Math.round((mentioned / aiKeywords.length) * 100) : 0,
      mentionCount: mentioned,
      totalPrompts: aiKeywords.length,
      shareOfVoice: 0,
      prompts: aiKeywords.slice(0, 50).map(k => ({
        text: k.keyword,
        cited: k.position && k.position <= 10,
        position: k.position,
        evidenceUrl: k.url
      }))
    };
  } catch (error) {
    throw error;
  }
}

module.exports = { getAiVisibility };