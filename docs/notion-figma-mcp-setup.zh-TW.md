# 設定 Notion 和 Figma MCP 伺服器

本指南將幫助您在 Visual Studio Code 中設定和使用 Notion 和 Figma MCP（模型上下文協議）伺服器與 GitHub Copilot。

## 先決條件

- 已安裝 GitHub Copilot 擴充功能的 Visual Studio Code
- 已安裝 Node.js 和 npm
- 有效的 GitHub Copilot 訂閱

## Notion MCP 伺服器

Notion MCP 伺服器允許 GitHub Copilot 與您的 Notion 工作區互動，讓您能夠讀取和寫入 Notion 頁面、資料庫等。

### 配置

Notion MCP 伺服器已在 `.vscode/mcp.json` 中配置：

```json
"notion": {
  "command": "npx",
  "args": ["-y", "mcp-remote", "https://mcp.notion.com/mcp"]
}
```

### 設定步驟

1. **啟動 Notion MCP 伺服器**：
   - 在 VS Code 中打開 `.vscode/mcp.json`
   - 點擊 Notion 伺服器條目上方的 **Start**

2. **使用 Notion 進行身份驗證**：
   - 出現提示時，按照 OAuth 流程授權 MCP 伺服器存取您的 Notion 工作區
   - 您可能需要選擇要連接的 Notion 工作區

3. **驗證連接**：
   - 身份驗證完成後，伺服器狀態應顯示為"正在運行"
   - 現在您可以使用 Copilot 與您的 Notion 工作區互動

### 使用 Notion MCP

配置完成後，您可以要求 GitHub Copilot：
- 從 Notion 頁面讀取內容
- 建立新的 Notion 頁面
- 更新現有頁面
- 查詢 Notion 資料庫
- 以及更多功能

範例提示：
- "顯示我的 Notion 專案追蹤器中的最新更新"
- "在 Notion 中建立一個包含今天會議記錄的新頁面"

## Figma MCP 伺服器

Figma MCP 伺服器使 GitHub Copilot 能夠與 Figma 設計互動，允許您從設計生成程式碼、檢查設計標記等。

### 配置

Figma MCP 伺服器已在 `.vscode/mcp.json` 中配置：

```json
"figma": {
  "command": "npx",
  "args": ["figma-developer-mcp", "--stdio"],
  "env": {
    "FIGMA_API_KEY": ""
  }
}
```

### 設定步驟

1. **取得您的 Figma API 金鑰**：
   - 登入您的 Figma 帳戶
   - 前往 **帳戶設定** → **個人存取權杖**
   - 點擊 **生成新權杖**
   - 給它一個描述性名稱（例如，"VS Code MCP"）
   - 複製生成的權杖

2. **配置 API 金鑰**：
   - 打開 `.vscode/mcp.json`
   - 將空的 `FIGMA_API_KEY` 值替換為您的實際 API 權杖：
     ```json
     "figma": {
       "command": "npx",
       "args": ["figma-developer-mcp", "--stdio"],
       "env": {
         "FIGMA_API_KEY": "your-actual-api-key-here"
       }
     }
     ```
   - 儲存檔案

   > **⚠️ 安全警告**：切勿將 API 金鑰提交到版本控制。在生產環境中，請考慮使用環境變數或 VS Code 的密鑰儲存。

3. **啟動 Figma MCP 伺服器**：
   - 在 `.vscode/mcp.json` 中，點擊 Figma 伺服器條目上方的 **Start**
   - 伺服器應該會啟動，無需額外的身份驗證

4. **驗證連接**：
   - 伺服器狀態應顯示為"正在運行"
   - 現在您可以使用 Copilot 與您的 Figma 設計互動

### 使用 Figma MCP

配置完成後，您可以要求 GitHub Copilot：
- 從 Figma 設計生成程式碼
- 提取設計標記（顏色、排版、間距）
- 取得有關 Figma 檔案和元件的資訊
- 檢查設計規格

範例提示：
- "從我的 Figma 設計檔案生成 React 元件"
- "這個 Figma 檔案中使用了哪些顏色標記？"
- "顯示設計系統的間距規格"

## 安全最佳實踐

> **重要**：像對待專案中的任何其他依賴項一樣對待 MCP 伺服器。在使用 MCP 伺服器之前：
> - 仔細審查其原始碼
> - 驗證發布者
> - 考慮安全影響
> - 僅使用您信任的 MCP 伺服器
> - 在授予對敏感資源或操作的存取權限時要謹慎

### 保護 API 金鑰

對於 Figma 和其他需要 API 金鑰的 MCP 伺服器：

1. **切勿將 API 金鑰提交到版本控制**
   - 如果 `.vscode/mcp.json` 包含敏感數據，請將其添加到 `.gitignore`
   - 改用環境變數

2. **使用環境變數**（替代方法）：
   ```json
   "figma": {
     "command": "npx",
     "args": ["figma-developer-mcp", "--stdio"],
     "env": {
       "FIGMA_API_KEY": "${env:FIGMA_API_KEY}"
     }
   }
   ```

3. **定期輪換金鑰**：
   - 定期生成新的 API 金鑰
   - 撤銷不再使用的舊金鑰

## 故障排除

### 伺服器無法啟動

- 確保已安裝 Node.js 和 npm：`node --version` 和 `npm --version`
- 檢查您是否有網路連接
- 嘗試重新啟動 VS Code

### 身份驗證問題（Notion）

- 清除瀏覽器快取和 Cookie
- 再次嘗試身份驗證流程
- 確保您在 Notion 工作區中擁有必要的權限

### Figma API 金鑰無法使用

- 驗證 API 金鑰是否正確且未過期
- 確保金鑰具有必要的範圍/權限
- 如有需要，生成新權杖

### MCP 伺服器顯示為"錯誤"

- 檢查 VS Code 輸出面板中的錯誤訊息
- 確保所有配置值正確
- 嘗試停止並重新啟動伺服器

## 資源

- [VS Code MCP 配置文件](https://code.visualstudio.com/docs/copilot/customization/mcp-servers)
- [Notion MCP 文件](https://developers.notion.com/docs/mcp)
- [Figma MCP 伺服器指南](https://dev.to/danilo1/figma-mcp-server-guide-2a18)
- [模型上下文協議概述](https://github.blog/ai-and-ml/llms/what-the-heck-is-mcp-and-why-is-everyone-talking-about-it/)
