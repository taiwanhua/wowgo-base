# E3 參考畫面驗收與額度中斷紀錄

## 最新續傳結果

B 第 14 批 `plan-20261004T152140Z-bfa45492` 已沿原 request 完成最後兩塊唯讀續傳，並經正式 CLI `record` 得到 `verified`：planned/applied 各 12、managedSlots 356、releasedSlots 13。此次使用 2 次唯讀 MCP，沒有新增 mutation。receipt digest 為 `b656a0203e42d64944cdee8cd1e1fb67885a754af9bb91570d345e76718e1cd8`；不可重送此 run 的 apply。

新增補充包 `e3-reference-evidence-r13-b14-resumed.zip`，466,464 bytes，SHA-256 為 `c3f000c2f0f574f332a7a8a820f9c5db79147d56a4c71f52618e22f5fc1cbe2c`。內含該 run 的完整 23 個檔案、當前 B receipt，以及逐檔長度／SHA-256 的 `manifest.json`，共 25 個 entries；已逐 entry 核對檔名、長度與雜湊。路徑沿既有 `b/.artifacts/figma-sync/` 與 `b/deploy/project/figma/receipts/` 慣例，不包含其他 runs。

原 quota-stop ZIP 保持原樣，保存中斷時點；新舊包應分開解壓，下面的 43-run 驗證器及恢復說明只對應舊包，不表示 B14 目前仍待續傳。此次只核補充包的檔名與雜湊，未重跑既有 43-run 驗證器。

後續 295 批 TEST 參考頁排程已停止，不再作為 E4 正式拆分前置；這是批次數，不是 Figma 呼叫數。正式檔仍未搬移，E4 的正式身分、引用、發布／接受及保護差異驗收仍須完成。

## 原 quota-stop 封存時點

這份隔離 TEST 證據屬於 issue #23，不表示 E 已完成。程式版本為 `334a5dbbb2ea53506808ec9d6061a70131cddfe6`，PR #35 仍未合併。

`e3-reference-evidence-r13-quota-stop.zip` 共 2,370 個檔案、38,389,434 bytes，SHA-256 為 `45156e0cbbece2951f7ce2837542345c5700fe62909119d78d268fecb609a4be`。不包含正式 CookHome 備份、Front 或業務 POC。

解壓後，以該程式版本執行：

```sh
node verify-e3-reference-partial.mjs SOURCE_CHECKOUT EXTRACTED_BUNDLE
```

驗證器檢查每個檔案的長度與 SHA-256，並沿正式 core 重新驗證 43 個已完成的 r13 runs 及 receipt。small reference batches 已完成 A 14 批、B 13 批；兩品牌各 210 個元件的完整證據另見 `README-e3-components-r12.md`。本包不能證明全 90 張參考畫面完成。

## 中斷與恢復

Figma MCP 回報 Professional Full seat 呼叫額度用完，沒有提供 reset 時間。兩個工作流程已結束，沒有背景寫入。額度規則見 [Figma 官方文件](https://developers.figma.com/docs/figma-mcp-server/rate-limits-access/)。

`evidence/e3-r13-quota-stop-recovery.json` 列出已完成及未收齊的 scans。A 第 15 批只做到 scan，沒有 apply。B 第 14 批 `plan-20261004T152140Z-bfa45492` 的 head 已回報 12 次寫入成功；4 個回傳塊只保存第 0、1 塊，**尚未完成驗證或更新 receipt**。

恢復 B 時，沿原 `request-apply.json` 執行 `transport/apply/read-000002.js`，以正常 `record` 收下結果，再使用其回傳的下一個唯讀來源。執行參數使用候選程式 `buildFigmaToolArguments` 產生。不得重新執行 `execute.js`、重新 apply，或將 head 的 applied 當作 verified。若內容漂移，依 toolbox 的 transport recovery 處理，不能改寫舊證據。

將包內對應品牌的 `.artifacts/figma-sync`、receipts 及公開測試設定放入該品牌的隔離 checkout；先核對檔案及 HEAD，不能覆蓋其他專案。操作正本是候選分支 `docs/agents/toolbox.md`「Figma 品牌同步」。

small 與 large queue 只記 TEST 範圍，不是新的專案設定格式。large 每品牌 139 批尚未 apply；A 有 45 批預掃完整，4 批預掃尚未收齊，B 尚未預掃。11 個 parent checkpoints 由 `large-refine` 的 root IDs 辨識，必須等其 children 寫入後重新掃描；不能使用寫入前的 parent inventory。

原生畫面檢查已看過兩品牌登入系列的藍／綠配色、陰影與中性色；未將瀏覽器畫面另存為 screenshot 檔案。其他參考畫面的全量核對及正式 E4 拆分尚未完成。
