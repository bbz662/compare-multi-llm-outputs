const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  
  const htmlContent = `<!DOCTYPE html>
  <html lang="ja">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>LLM Comparison App - Multiple Models</title>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js" crossorigin="anonymous"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js" crossorigin="anonymous"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.5/babel.min.js" crossorigin="anonymous"></script>
      <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
      <div id="root"></div>
  
      <script type="text/babel">
          const { useState } = React;
  
          const Input = React.memo(({ id, type, value, onChange, placeholder }) => (
              <input
                  id={id}
                  type={type}
                  value={value}
                  onChange={onChange}
                  placeholder={placeholder}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
          ));
  
          const Button = React.memo(({ onClick, disabled, children }) => (
              <button
                  onClick={onClick}
                  disabled={disabled}
                  className="px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline disabled:opacity-50"
              >
                  {children}
              </button>
          ));
  
          const Textarea = React.memo(({ id, value, onChange, placeholder, rows }) => (
              <textarea
                  id={id}
                  value={value}
                  onChange={onChange}
                  placeholder={placeholder}
                  rows={rows}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
          ));
  
          const Card = React.memo(({ title, content }) => (
              <div className="bg-white shadow-md rounded-lg p-6 mb-4">
                  <h3 className="text-lg font-semibold mb-2">{title}</h3>
                  <p className="whitespace-pre-wrap">{content}</p>
              </div>
          ));
  
          const LLMComparisonApp = () => {
              const [prompt, setPrompt] = useState('');
              const [results, setResults] = useState({
                  'gemini-1.5-flash': '',
                  'gemini-1.5-pro': '',
                'gemini-1.5-pro-exp-0801': '',
                  'gpt-4o-mini': '',
                'gpt-4o-2024-08-06': '',
                  'claude-3-haiku-20240307': '',
                  'claude-3-5-sonnet-20240620': '',
                  'claude-3-opus-20240229': ''
              });
              const [loading, setLoading] = useState(false);
              const [error, setError] = useState('');
  
              const handlePromptChange = (e) => {
                  setPrompt(e.target.value);
              };
  
              const handleSubmit = async () => {
                  if (!prompt.trim()) {
                      setError('Please enter a prompt before submitting.');
                      return;
                  }
  
                  setLoading(true);
                  setError('');
                  setResults(prev => Object.fromEntries(Object.keys(prev).map(key => [key, ''])));
  
                  try {
                      const response = await fetch('/api', {
                          method: 'POST',
                          headers: {
                              'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ prompt }),
                      });
  
                      if (!response.ok) {
                          throw new Error(\`HTTP error! status: \${response.status}\`);
                      }
  
                      const data = await response.json();
                      setResults(data);
                  } catch (err) {
                      console.error('Error occurred:', err);
                      setError(\`An error occurred while fetching results: \${err.message}\`);
                  } finally {
                      setLoading(false);
                  }
              };
  
              return (
                  <div className="container mx-auto p-4">
                      <h1 className="text-2xl font-bold mb-4">LLM Comparison App - Multiple Models</h1>
                      
                      <div className="mb-4">
                          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">Prompt</label>
                          <Textarea
                              id="prompt"
                              value={prompt}
                              onChange={handlePromptChange}
                              placeholder="Enter your prompt here"
                              rows={4}
                          />
                      </div>
  
                      <Button onClick={handleSubmit} disabled={loading}>
                          {loading ? 'Submitting...' : 'Submit'}
                      </Button>
  
                      {error && (
                          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                              <strong className="font-bold">Error!</strong>
                              <span className="block sm:inline"> {error}</span>
                          </div>
                      )}
  
                      <div className="mt-4">
                          {Object.entries(results).map(([model, result]) => (
                              <Card key={model} title={model} content={result || 'No result yet'} />
                          ))}
                      </div>
                  </div>
              );
          };
  
          const root = ReactDOM.createRoot(document.getElementById('root'));
          root.render(<LLMComparisonApp />);
      </script>
  </body>
  </html>`;
  
const DEFAULT_OUTPUT_MAX_TOKENS = 1024;
  export default {
    async fetch(request, env) {
      const url = new URL(request.url);
  
      if (url.pathname === "/" && request.method === "GET") {
        return new Response(htmlContent, {
          headers: {
            'Content-Type': 'text/html',
          },
        });
      }
  
      if (url.pathname === "/api" && request.method === "POST") {
        const content = await request.json();
        const prompt = content.prompt;
      const jsonSchema = JSON.parse(content.jsonSchema);
  
        if (!prompt) {
          return new Response(JSON.stringify({ error: 'No prompt provided' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
  
        console.log('Received prompt:', prompt);
        if (!env.GEMINI_API_KEY || !env.OPENAI_API_KEY || !env.ANTHROPIC_API_KEY) {
          throw new Error('One or more API keys are missing');
        }

        try {
          const results = await Promise.all([
          getGeminiResponse(prompt, 'gemini-1.5-flash', env, jsonSchema),
          getGeminiResponse(prompt, 'gemini-1.5-pro', env, jsonSchema),
          getGeminiResponse(prompt, 'gemini-1.5-pro-exp-0801', env, jsonSchema),
          getChatGPTResponse(prompt, 'gpt-4o-mini', env, jsonSchema),
          getChatGPTResponse(prompt, 'gpt-4o-2024-08-06', env, jsonSchema),
          getClaudeResponse(prompt, 'claude-3-haiku-20240307', env, jsonSchema),
          getClaudeResponse(prompt, 'claude-3-5-sonnet-20240620', env, jsonSchema),
          getClaudeResponse(prompt, 'claude-3-opus-20240229', env, jsonSchema)
        ]);

          const response = {
            'gemini-1.5-flash': results[0],
            'gemini-1.5-pro': results[1],
          'gemini-1.5-pro-exp-0801': results[2],
          'gpt-4o-mini': results[3],
          'gpt-4o-2024-08-06': results[4],
          'claude-3-haiku-20240307': results[5],
          'claude-3-5-sonnet-20240620': results[6],
          'claude-3-opus-20240229': results[7]
          };
  
          return new Response(JSON.stringify(response), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        } catch (error) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }
  
      // CORS preflight request
      if (request.method === "OPTIONS") {
        return new Response(null, {
          headers: corsHeaders
        });
      }
  
      return new Response("Not Found", { status: 404 });
    }
  };
  
async function getGeminiResponse(prompt, model, env, jsonSchema) {
  try {
    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key is missing');
    }

    // const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    if (jsonSchema) {
      prompt = `${prompt}
      Use the following JSON schema for your response:
      ${JSON.stringify(jsonSchema, null, 2)}`
    }
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: parseInt(env.OUTPUT_MAX_TOKENS) || DEFAULT_OUTPUT_MAX_TOKENS,
          responseMimeType: jsonSchema ? "application/json" : "text/plain",
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${response.status} ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error(`Error in getGeminiResponse (${model}):`, error);
    throw error;
  }
}
  
async function getChatGPTResponse(prompt, model, env, jsonSchema) {
    try {
      const apiKey = env.OPENAI_API_KEY;
      const url = 'https://api.openai.com/v1/chat/completions';
    const requestBody = {
      model: model,
      max_tokens: parseInt(env.OUTPUT_MAX_TOKENS) || DEFAULT_OUTPUT_MAX_TOKENS,
      messages: [{ role: 'user', content: prompt }],
    }

    if (jsonSchema && typeof jsonSchema === 'object') {
      requestBody.response_format = {
        "type": "json_schema",
        "json_schema": {
          "name": "my_custom",
          "schema": jsonSchema,
          "strict": true
        }
      };
    } else {
      console.error("Invalid jsonSchema provided. Must be an object.");
    }
    
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
      body: JSON.stringify(requestBody)
      });
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error(`Error in getChatGPTResponse (${model}):`, error);
      throw error;
    }
  }

async function getClaudeResponse(prompt, model, env, jsonSchema) {
    try {
      const apiKey = env.ANTHROPIC_API_KEY;
      const url = 'https://api.anthropic.com/v1/messages';
    const requestBody = {
      model: model,
      max_tokens: parseInt(env.OUTPUT_MAX_TOKENS) || DEFAULT_OUTPUT_MAX_TOKENS,
      messages: [{ role: 'user', content: prompt }]
    }
    if (jsonSchema) {
      requestBody.tools = [
        {
          "name": "my_custom",
          "description": "Transform Output into My Custom JSON Schema.",
          "input_schema": jsonSchema
        }
      ],
      requestBody.tool_choice = { "type": "tool", "name": "my_custom" }
    }
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
      body: JSON.stringify(requestBody)
      });
      
      const data = await response.json();
      console.log(`Claude API Response for ${model}:`, JSON.stringify(data, null, 2));
      
      if (data.content && Array.isArray(data.content) && data.content.length > 0) {
      if (jsonSchema && data.content[0].input) {
        return data.content[0].input;
      }
        return data.content[0].text;
      } else if (data.error) {
        throw new Error(`Claude API Error: ${data.error.message}`);
      } else {
        throw new Error('Unexpected response structure from Claude API');
      }
    } catch (error) {
      console.error(`Error in getClaudeResponse (${model}):`, error);
      throw error;
    }
  }
