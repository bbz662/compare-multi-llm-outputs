# LLM Comparison Cloudflare Worker

This project is a Cloudflare Worker that compares responses from multiple Language Learning Models (LLMs) including Gemini, GPT, and Claude. It provides a web interface for users to input prompts, optionally specify JSON schemas for structured outputs, and receive responses from various LLM models.

## Features

- Compares responses from multiple LLM models:
  - Gemini: 1.5-flash, 1.5-pro, and 1.5-pro-exp-0801
  - GPT: 4o-mini and 4o-2024-08-06
  - Claude: 3-haiku, 3-5-sonnet, and 3-opus
- Support for JSON Schema to structure model outputs
- Interactive web interface with example prompts and JSON schemas
- Configurable token limit for responses
- Cloudflare Worker backend for handling API requests

## Prerequisites

- Cloudflare account
- API keys for Gemini, OpenAI, and Anthropic
- Node.js and npm (for local development)
- Wrangler CLI (Cloudflare Workers CLI)

## Setup

1. Clone this repository:
   ```
   git clone https://github.com/your-username/llm-comparison-worker.git
   cd llm-comparison-worker
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Update `wrangler.toml` with your account details.

4. Set up environment variables in your Cloudflare Worker:
   - GEMINI_API_KEY
   - OPENAI_API_KEY
   - ANTHROPIC_API_KEY
   - OUTPUT_MAX_TOKENS (optional, defaults to 1024)

   You can set these in the Cloudflare dashboard or using the Wrangler CLI.

5. Deploy the worker:
   ```
   wrangler deploy
   ```

## Usage

1. Access the deployed worker URL in your web browser.
2. Enter a prompt in the text area.
3. (Optional) Provide a JSON schema to structure the model outputs.
4. Click "Submit" to send the prompt to all configured LLM models.
5. View the responses from each model in the results section.
6. Use the example panels to view and use pre-defined prompts and JSON schemas.

## Development

For local development:

1. Copy `.dev.vars.example` to `.dev.vars` and fill in your API keys.
2. Run the worker locally:
   ```
   wrangler dev
   ```

## Security Considerations

- Never commit your API keys to the repository. Use `.gitignore` to exclude `.dev.vars`.
- Use environment variables to manage sensitive information.
- Be mindful of API usage limits and costs associated with each LLM provider.
