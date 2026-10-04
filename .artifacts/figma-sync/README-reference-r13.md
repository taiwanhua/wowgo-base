# E3 參考畫面驗收與額度中斷紀錄

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
