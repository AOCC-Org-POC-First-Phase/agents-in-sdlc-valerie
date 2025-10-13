# Setting up Notion and Figma MCP Servers

This guide will help you set up and use the Notion and Figma MCP (Model Context Protocol) servers with GitHub Copilot in Visual Studio Code.

## Prerequisites

- Visual Studio Code with GitHub Copilot extension installed
- Node.js and npm installed
- Active GitHub Copilot subscription

## Notion MCP Server

The Notion MCP server allows GitHub Copilot to interact with your Notion workspace, enabling you to read and write Notion pages, databases, and more.

### Configuration

The Notion MCP server is already configured in `.vscode/mcp.json`:

```json
"notion": {
  "command": "npx",
  "args": ["-y", "mcp-remote", "https://mcp.notion.com/mcp"]
}
```

### Setup Steps

1. **Start the Notion MCP Server**:
   - Open `.vscode/mcp.json` in VS Code
   - Click **Start** above the Notion server entry

2. **Authenticate with Notion**:
   - When prompted, follow the OAuth flow to authorize the MCP server to access your Notion workspace
   - You may need to select which Notion workspace to connect

3. **Verify Connection**:
   - Once authenticated, the server status should show as "Running"
   - You can now use Copilot to interact with your Notion workspace

### Using Notion MCP

Once configured, you can ask GitHub Copilot to:
- Read content from Notion pages
- Create new Notion pages
- Update existing pages
- Query Notion databases
- And more

Example prompts:
- "Show me the latest updates from my Notion project tracker"
- "Create a new page in Notion with today's meeting notes"

## Figma MCP Server

The Figma MCP server enables GitHub Copilot to interact with Figma designs, allowing you to generate code from designs, inspect design tokens, and more.

### Configuration

The Figma MCP server is already configured in `.vscode/mcp.json`:

```json
"figma": {
  "command": "npx",
  "args": ["figma-developer-mcp", "--stdio"],
  "env": {
    "FIGMA_API_KEY": ""
  }
}
```

### Setup Steps

1. **Get Your Figma API Key**:
   - Log in to your Figma account
   - Go to **Account Settings** → **Personal Access Tokens**
   - Click **Generate new token**
   - Give it a descriptive name (e.g., "VS Code MCP")
   - Copy the generated token

2. **Configure the API Key**:
   - Open `.vscode/mcp.json`
   - Replace the empty `FIGMA_API_KEY` value with your actual API token:
     ```json
     "figma": {
       "command": "npx",
       "args": ["figma-developer-mcp", "--stdio"],
       "env": {
         "FIGMA_API_KEY": "your-actual-api-key-here"
       }
     }
     ```
   - Save the file

   > **⚠️ Security Warning**: Never commit your API key to version control. Consider using environment variables or VS Code's secrets storage for production use.

3. **Start the Figma MCP Server**:
   - In `.vscode/mcp.json`, click **Start** above the Figma server entry
   - The server should start without requiring additional authentication

4. **Verify Connection**:
   - The server status should show as "Running"
   - You can now use Copilot to interact with your Figma designs

### Using Figma MCP

Once configured, you can ask GitHub Copilot to:
- Generate code from Figma designs
- Extract design tokens (colors, typography, spacing)
- Get information about Figma files and components
- Inspect design specifications

Example prompts:
- "Generate React components from my Figma design file"
- "What are the color tokens used in this Figma file?"
- "Show me the spacing specifications from the design system"

## Security Best Practices

> **IMPORTANT**: Treat MCP servers as you would any other dependency in your project. Before using an MCP server:
> - Carefully review its source code
> - Verify the publisher
> - Consider the security implications
> - Only use MCP servers that you trust
> - Be cautious about granting access to sensitive resources or operations

### Protecting API Keys

For Figma and other MCP servers that require API keys:

1. **Never commit API keys to version control**
   - Add `.vscode/mcp.json` to `.gitignore` if it contains sensitive data
   - Use environment variables instead

2. **Use Environment Variables** (Alternative approach):
   ```json
   "figma": {
     "command": "npx",
     "args": ["figma-developer-mcp", "--stdio"],
     "env": {
       "FIGMA_API_KEY": "${env:FIGMA_API_KEY}"
     }
   }
   ```

3. **Rotate Keys Regularly**:
   - Generate new API keys periodically
   - Revoke old keys that are no longer in use

## Troubleshooting

### Server Won't Start

- Ensure you have Node.js and npm installed: `node --version` and `npm --version`
- Check that you have an internet connection
- Try restarting VS Code

### Authentication Issues (Notion)

- Clear your browser cache and cookies
- Try the authentication flow again
- Ensure you have the necessary permissions in your Notion workspace

### Figma API Key Not Working

- Verify the API key is correct and hasn't expired
- Ensure the key has the necessary scopes/permissions
- Generate a new token if needed

### MCP Server Shows as "Error"

- Check the VS Code Output panel for error messages
- Ensure all configuration values are correct
- Try stopping and restarting the server

## Resources

- [VS Code MCP Configuration Documentation](https://code.visualstudio.com/docs/copilot/customization/mcp-servers)
- [Notion MCP Documentation](https://developers.notion.com/docs/mcp)
- [Figma MCP Server Guide](https://dev.to/danilo1/figma-mcp-server-guide-2a18)
- [Model Context Protocol Overview](https://github.blog/ai-and-ml/llms/what-the-heck-is-mcp-and-why-is-everyone-talking-about-it/)
