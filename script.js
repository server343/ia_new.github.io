import { HfInference } from '@huggingface/inference';

// Store credentials securely, e.g., using environment variables
const email = process.env.HF_EMAIL;
const password = process.env.HF_PASSWORD;

async function getAccessToken(email, password) {
  // Use a secure authentication mechanism, e.g., OAuth or JWT
  const authUrl = 'https://huggingface.co/api/oauth/token';
  const clientId = 'minecraftcacaron@gmail.com';
  const clientSecret = '97RoServof@';

  const authResponse = await fetch(authUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=password&username=${email}&password=${password}&client_id=${clientId}&client_secret=${clientSecret}`,
  });

  if (!authResponse.ok) {
    throw new Error('Failed to authenticate');
  }

  const authToken = await authResponse.json();
  return authToken.access_token;
}

document.getElementById('textForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const userInput = document.getElementById('userInput').value;
  const outputContainer = document.getElementById('output');
  outputContainer.textContent = 'Generating...';

  try {
    const token = await getAccessToken(email, password);
    const hf = new HfInference(token);

    const response = await hf.textGeneration({
      model:'meta-llama/Meta-Llama-3-70B-Instruct',
      inputs: userInput,
      parameters: {
        max_new_tokens: 100
      }
    });

    outputContainer.textContent = response.generated_text || 'No response from the model';
  } catch (error) {
    outputContainer.textContent = 'Error generating text:'+ error.message;
  }
});