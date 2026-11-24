# 排球輪轉系統（教學版）

排球輪轉規則的最小實作，用純 HTML / CSS / JavaScript 寫成，
沒有任何框架與編譯步驟——把檔案放在同一個資料夾，打開
index.html 就能執行。

## 檔案

- config.js      球員、座標、顏色、起始發球方、分數上限
- rotation.js    輪轉運算（純函式，不碰畫面）
- app.js         畫面與事件
- index.html     名單 / 輪轉 / 比賽 三個頁面
- style.css      樣式

## 測試

    node rotation.test.js    產生全部六個輪次，驗證每人各發球一次
    node rally.test.js       模擬七球，驗證只有 side-out 會輪轉
