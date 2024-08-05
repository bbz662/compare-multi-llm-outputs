# LLM Comparison Cloudflare Worker

This project is a Cloudflare Worker that compares responses from multiple Language Learning Models (LLMs) including Gemini, GPT, and Claude. It provides a simple web interface for users to input prompts and receive responses from various LLM models.

## Features

- Compares responses from multiple LLM models:
  - Gemini: 1.5-flash and 1.5-pro
  - GPT: 4o-mini and 4o
  - Claude: 3-haiku, 3-5-sonnet, and 3-opus
- Simple web interface for input and display of results
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

3. update `wrangler.toml` with your account details.

4. Set up environment variables in your Cloudflare Worker:
   - GEMINI_API_KEY
   - OPENAI_API_KEY
   - ANTHROPIC_API_KEY

   You can set these in the Cloudflare dashboard or using the Wrangler CLI.

5. Deploy the worker:
   ```
   wrangler deploy
   ```

## Usage

1. Access the deployed worker URL in your web browser.
2. Enter a prompt in the text area.
3. Click "Submit" to send the prompt to all configured LLM models.
4. View the responses from each model in the results section.

## Security Considerations

- Never commit your API keys to the repository.
- Use environment variables to manage sensitive information.
- Be mindful of API usage limits and costs associated with each LLM provider.
