async function getMoodInsights() {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    body: JSON.stringify({
      query: "How does my diet affect my mood?",
      user_data: moodData
    })
  });
  return response.json();
}