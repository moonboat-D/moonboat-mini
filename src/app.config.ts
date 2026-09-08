export default defineAppConfig({
  lazyCodeLoading: "requiredComponents",
  pages: [
    "pages/index/index",
    "pages/genshin/index",
    "pages/HanDou/index",
    "pages/Sudoku/index",
    "pages/Pokemon/index",
    "pages/ScriptRecord/index",
    "pages/QrCode/index",
    "pages/CardExchangeMarket/index",
    "pages/CardExchangeSubscription/index",
    "pages/About/index",
  ],
  window: {
    backgroundTextStyle: "dark",
    backgroundColor: "#F7F3ED",
    backgroundColorTop: "#F7F3ED",
    backgroundColorBottom: "#F7F3ED",
    navigationBarBackgroundColor: "#F7F3ED",
    navigationBarTextStyle: "black",
  },
});
