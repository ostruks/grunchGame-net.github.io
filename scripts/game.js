let type = "WebGL"
if (!PIXI.utils.isWebGLSupported()) {
  type = "canvas"
}
PIXI.utils.sayHello(type)

let allImages = [
  "../images/Location_assets/magic_forest_bg.jpg",
  "../images/Location_assets/magic_forest_button.png",
  "../images/Location_assets/magic_forest_coin_icon_big.png",
  "../images/Location_assets/magic_forest_dollar_icon.png",
  "../images/Location_assets/magic_forest_frame.png",
  "../images/Location_assets/magic_forest_frame_for_text.png",
  "../images/Location_assets/magic_forest_frame1.png",
  "../images/Location_assets/magic_forest_frame2.png",
  "../images/Location_assets/magic_forest_frame3.png",
  "../images/Location_assets/magic_forest_gift_icon.png",
  "../images/Location_assets/magic_forest_question_icon.png",
  "../images/Location_assets/magic_forest_shadow_40_percent.png",
  "../images/Location_assets/magic_forest_win_up_to_100.png",
  "../images/Location_assets/magic_forest_winner.png",
  "../images/Location_assets/magic_forest_winner_frame.png",
  "../images/Location_assets/text_px.png",
  "../images/Location_assets/magic_forest_bonfire_small.png",
  "../images/Location_assets/magic_forest_coin_icon_small.png",
  "../images/Location_assets/magic_forest_bow_small.png",
  "../images/Location_assets/magic_forest_leaf_small.png",
  "../images/Location_assets/magic_forest_rope_small.png",
  "../images/Location_assets/magic_forest_tent_small.png",
  "../images/Location_assets/magic_forest_scratch_frame.png",
  "../images/Location_assets/magic_forest_scratch_frame_big.png"
];

let cards = [
  "../images/Location_assets/magic_forest_bonfire.png",
  "../images/Location_assets/magic_forest_bow.png",
  "../images/Location_assets/magic_forest_leaf.png",
  "../images/Location_assets/magic_forest_rope.png",
  "../images/Location_assets/magic_forest_tent.png",
];

let fieldsPosition = [[214, 1366], [552, 1366], [889, 1366], [214, 1703], [552, 1703], [889, 1703]];

function loadProgressHandler(loader, resource) {
  console.log("loading: " + resource.url);
  console.log("progress: " + loader.progress + "%");
}

let app = new PIXI.Application({
  width: 1097,
  height: 1920,
}
);

let gameGroup = new PIXI.Container();
gameGroup.name = 'gameGroup';

let check = false;
let startBarGroup;
let finishBarGroup;
let darkness;
let winSymbol;
let winCoin = 25;
let isWin = false;
let mask = null;
let startAnimation;
let currentAnimation = "idle";
let Res;
let redMonster;
let back;
let start = new StartGame();

function onAssetsLoaded(loader, res){
  Res = res;
  start.start();
};

PIXI.loader
  .add(allImages)
  .add(cards)
  .add('redJson', '../scripts/red.json')
  .on("progress", loadProgressHandler)
  .load(onAssetsLoaded);