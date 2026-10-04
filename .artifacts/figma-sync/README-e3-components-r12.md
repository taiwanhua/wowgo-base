# E3 全元件隔離驗收證據

此 evidence branch 不合併至 main。產品程式在 `codex/23-figma-sync-tool`，驗證器版本為 `d18a007c6c8bee0d72aeeee9afa141ad5ea72265`。

`e3-components-evidence-r12.zip` 為 14,363,937 bytes；SHA-256：`e48f2ba844e7ed0c550e9af9da78e1384a0cbfddfb18bb0aac6139df9f9ea583`。內含 858 個檔案與逐檔 SHA-256 manifest，打包後已逐項解壓核對。

兩個隔離消費檔各覆蓋 27 個元件頁群組、210 個變體實例、1,296 個節點，共 40 次 scan/review/plan/apply/record。每次完整 scope 保護、來源連結、品牌殘留及範圍外控制均通過。SideNav 含 134 個節點、66 個隱藏節點；完整重跑為零寫入、零匯入，每個消費檔累積 131 managed slots。

這是既有隔離品牌綁定經明示來源審查的接管驗收，不能稱全部為新實例首次自動收管。90 張參考畫面另行驗收；此包不代表 E3 全部結束、E4 正式拆分或 F 已完成。

- A：`JNKv4VNPRQm80m6XeimEoN`，primary `#1C4AD9`。
- B：`AvDWlskqqRupYNBKUABw8M`，primary `#086B38`。
- 各 run 保存原 inputs、plan、request、生成碼、回傳 envelope、attempt 與完整 after inventory。不同 run 的工具 commit 依封存資料列出，不將較早結果冒稱全部在最新版執行。
- `evidence/e3-components-matrix-proof.json` 將每個變體連回其驗證 run；另外三份 coverage proof 保存 receipt digest。

先核對 ZIP hash 並解壓，再以指定版本 checkout 的純驗證器重驗：

```text
node .artifacts/figma-sync/verify-e3-components.mjs <d18a007-source-checkout> <extracted-bundle>
```

指令只讀本機證據，不呼叫 Figma，也不執行封存的 `execute.js`。預期 858 files、2 brands、40 verifiedRuns、每品牌 210 variants。

品牌初建、更新、私有覆寫、恢復及大傳輸的其他證據見 [r9 說明](README-e3-r9.md)。不要重新執行這些已完成的 apply。
