function startGameAnimation(newFrame) {
    let progress = (newFrame - startAnimation) / 1000 * 2;

    if (progress >= 1) {
        progress = 1;
        darkness.interactive = false;
    } else {
        requestAnimationFrame(this.startGameAnimation);
    }
    darkness.alpha = (1 - progress) * 0.5;
    startBarGroup.y = 1525 + 400 * progress;
    finishBarGroup.y = 220 - 560 * progress;
}

function finishGameAnimation(newFrame) {
    let progress = (newFrame - startAnimation) / 1000 * 2;

    if (progress >= 1) {
        progress = 1;
    } else {
        requestAnimationFrame(finishGameAnimation);
    }
    darkness.alpha = progress * 0.5;
    startBarGroup.y = 1525 + 400 * (1 - progress);
    finishBarGroup.y = 220 - 560 * (1 - progress);
}

class Background {

    constructor() {
        this.container = new PIXI.Container();
        this.backGround = new PIXI.Sprite(PIXI.Texture.fromImage("images/Location_assets/magic_forest_bg.jpg"));
        this.magic_forest_win_up_to_100 = new PIXI.Sprite(PIXI.Texture.fromImage("images/Location_assets/magic_forest_win_up_to_100.png"));
        this.magic_forest_winner_frame = new PIXI.Sprite(PIXI.Texture.fromImage("images/Location_assets/magic_forest_winner_frame.png"));
        this.magic_forest_frame_for_text = new PIXI.Sprite(PIXI.Texture.fromImage("images/Location_assets/magic_forest_frame_for_text.png"));
        this.magic_forest_scratch_frame_big = new PIXI.Sprite(PIXI.Texture.fromImage('images/Location_assets/magic_forest_scratch_frame_big.png'));
        this.desxriptionGroup = new PIXI.Container();
    }

    addToContainer() {
        this.backGround.name = 'backGround';
        this.backGround.x += -152;
        this.magic_forest_win_up_to_100.name = 'titleTextSprite';
        this.magic_forest_win_up_to_100.position.set(159, 40);
        this.magic_forest_winner_frame.name = 'bonusBG';
        this.magic_forest_winner_frame.position.set(528, 140);
        this.magic_forest_frame_for_text.name = 'descriptionBG';
        this.magic_forest_frame_for_text.position.set(55, 1043);
        this.magic_forest_frame_for_text.scale.set(0.98, 1);
        this.magic_forest_scratch_frame_big.name = 'bonusHideLayer';
        this.magic_forest_scratch_frame_big.position.set(801, 553);
        this.magic_forest_scratch_frame_big.anchor.set(0.5);
        this.desxriptionGroup.name = 'desxriptionGroup';
        this.desxriptionGroup.position.set(88, 1071);

        let frame = new Frame();
        frame.frames();

        if (mask != null) {
            let msgDescriptionStyle = new PIXI.TextStyle({
                fontFamily: "DRAguSansBlack",
                fontSize: 52,
                fill: "#f45b4e",
            });

            let msgDescription1 = new PIXI.Text("MATCH THE WINNER", msgDescriptionStyle);
            msgDescription1.name = 'msgDescription1';
            msgDescription1.position.set(1, 0);
            this.desxriptionGroup.addChild(msgDescription1);

            let msgDescription2 = new PIXI.Text("AND WIN A PRIZE!", msgDescriptionStyle);
            msgDescription2.name = 'msgDescription2';
            msgDescription2.position.set(543, 0);
            this.desxriptionGroup.addChild(msgDescription2);

            let msgDescriptionImg = new PIXI.Sprite(PIXI.Texture.fromImage(cards[winSymbol]));
            msgDescriptionImg.name = 'msgDescriptionImg';
            msgDescriptionImg.position.set(453, -10);
            msgDescriptionImg.scale.set(0.3);

            this.desxriptionGroup.addChild(msgDescriptionImg);
        }

        this.container.addChild(this.backGround, this.magic_forest_win_up_to_100, this.magic_forest_winner_frame,
            this.magic_forest_frame_for_text, this.magic_forest_scratch_frame_big, this.desxriptionGroup);

        this.hideLayerTexture = PIXI.Texture.fromImage("images/Location_assets/magic_forest_scratch_frame.png");
        fieldsPosition.forEach((pos, i) => {
            let hideLayer = new PIXI.Sprite(this.hideLayerTexture);
            hideLayer.name = 'hideLayer' + i;
            hideLayer.position.set(pos[0], pos[1]);
            hideLayer.anchor.set(0.5);
            this.container.addChild(hideLayer);
        });

        this.container.addChild(gameGroup);

        return this.container;
    }
}

class Mask {

    constructor() {
        let renderTexture = PIXI.RenderTexture.create(app.screen.width, app.screen.height);
        this.renderTextureSprite = new PIXI.Sprite(renderTexture);
        this.rendererMask = new PIXI.Sprite();
        gameGroup.addChild(this.renderTextureSprite);

        this.rendererMask.mask = this.renderTextureSprite;

        gameGroup.interactive = true;

        gameGroup.on('touchstart', pointerDown);
        gameGroup.on('touchend', pointerUp);
        gameGroup.on('touchmove', (event) => {
            pointerMove(event);
            if (currentAnimation == 'idle') {
                currentAnimation = 'worry';
                char.state.setAnimation(0, 'red_worry_st', false)
                char.state.addAnimation(0, 'red_worry_loop', true, 0);
            }
        });

        gameGroup.on('pointerover', pointerDown);
        gameGroup.on('pointerout', pointerUp);
        gameGroup.on('pointermove', pointerMove);

        let brush = new PIXI.Graphics();
        brush.beginFill(0xffffff);
        brush.drawCircle(0, 0, 50);
        brush.endFill();

        let dragging = false;
        function pointerMove(event) {
            if (dragging) {
                brush.position.copy(event.data.global);
                app.renderer.render(brush, renderTexture, false, null, false);
            }
        }

        function pointerDown(event) {
            dragging = true;
            pointerMove(event);
        }

        function pointerUp(event) {
            dragging = false;
            if (currentAnimation == 'worry') {
                currentAnimation = 'idle';
                char.state.setAnimation(0, 'red_worry_end', false)
                char.state.addAnimation(0, 'red_idle_loop', true, 0);
            }
        }
    }
}

class Frame {

    frames() {
        let symbolList = [];
        let openCount = 1;
        winSymbol = -1;
        let random = Math.round(Math.random() * 100);

        regularFrame();
        bonusFrame();

        function regularFrame() {
            if (random < 2) {
                winSymbol = 4;
                winCoin += 100;
            } else
                if (random < 6) {
                    winSymbol = 3;
                    winCoin += 50;
                } else
                    if (random < 12) {
                        winSymbol = 2;
                        winCoin += 35;
                    } else
                        if (random < 20) {
                            winSymbol = 1;
                            winCoin += 30;
                        } else
                            if (random < 30) {
                                winCoin += 25;
                                winSymbol = 0;
                            }

            if (winSymbol > -1) {
                isWin = true;
                symbolList[0] = symbolList[1] = symbolList[2] = winSymbol;
                for (let i = 3; i < 6; i++) {
                    let nextSymbol;
                    do {
                        nextSymbol = randomInt(0, 4);
                    } while (nextSymbol == winSymbol)
                    symbolList.push(nextSymbol);
                }

                symbolList.forEach((symbol, ind) => {
                    let changeInd;
                    do {
                        changeInd = randomInt(0, 4);
                    } while (changeInd == ind)
                    symbolList[ind] = symbolList[changeInd];
                    symbolList[changeInd] = symbol;
                });

            } else {
                isWin = false;
                winSymbol = randomInt(0, 4);
                let winCount = 0;
                for (let i = 0; i < 6; i++) {
                    let symbol;
                    do {
                        symbol = randomInt(0, 4);
                    } while (symbol == winSymbol && winCount == 2)
                    if (symbol == winSymbol)++winCount;
                    symbolList.push(symbol);
                }
            }

            let magic_forest_frame = PIXI.Texture.fromImage("images/Location_assets/magic_forest_frame.png");

            symbolList.forEach((id, i) => {
                let filedBG = new PIXI.Sprite(magic_forest_frame);
                filedBG.name = 'filedBG' + i;
                filedBG.position.set(fieldsPosition[i][0], fieldsPosition[i][1]);
                filedBG.anchor.set(0.5);

                let symbol = new PIXI.Sprite(PIXI.Texture.fromImage(cards[id]));
                symbol.name = 'symbol' + i;
                symbol.position.set(fieldsPosition[i][0], fieldsPosition[i][1]);
                symbol.anchor.set(0.5);

                let graphics = new PIXI.Graphics();

                if (mask != null) {
                    mask.rendererMask.addChild(filedBG, symbol);
                    graphics.alpha = 0;
                    graphics.beginFill(0x000000);
                    graphics.drawRect(fieldsPosition[i][0] - 140, fieldsPosition[i][1] - 140, 280, 280);
                    gameGroup.addChild(graphics);
                }

                let startPointX = fieldsPosition[i][0] - 140;
                let startPointY = fieldsPosition[i][1] - 140;
                let minPos, maxPos;

                graphics.interactive = true;

                let isWinSymbol = id == winSymbol;

                let touchmove = (event) => {

                    let drag = true;
                    let pos = event.data.global;
                    if (pos.x < startPointX || pos.x > startPointX + 280
                        || pos.y < startPointY || pos.y > startPointY + 280
                    ) {
                        return;
                    }

                    if (!minPos) {
                        minPos = { x: event.data.global.x, y: event.data.global.y };
                        maxPos = { x: event.data.global.x, y: event.data.global.y };
                    }
                    if (pos.x < minPos.x) minPos.x = pos.x;
                    if (pos.x > maxPos.x) maxPos.x = pos.x;
                    if (pos.y < minPos.y) minPos.y = pos.y;
                    if (pos.y > maxPos.y) maxPos.y = pos.y;
                    let length = ((minPos.x - maxPos.x) ** 2 + (minPos.y - maxPos.y) ** 2) ** 0.5;
                    if (length >= 280) {
                        drag = false;

                        gameGroup.addChild(filedBG, symbol)
                        graphics.destroy();

                        if (isWinSymbol)
                            changeAnimation('red_happy_card');
                        else
                            changeAnimation('red_disappointed');
                        if (openCount == 7) start.finish();
                        openCount++;
                    }

                }
                graphics.on('touchmove', touchmove);
                graphics.on('pointermove', touchmove);

                graphics.on('pointerover', () => {
                    redMonster.char.state.setAnimation(0, 'red_worry_st', false)
                    redMonster.char.state.addAnimation(0, 'red_worry_loop', true, 0);
                });
                graphics.on('pointerout', () => {
                    redMonster.char.state.setAnimation(0, 'red_worry_end', false)
                    redMonster.char.state.addAnimation(0, 'red_idle_loop', true, 0);
                });
                if (mask != null) {
                    gameGroup.addChild(mask.rendererMask);
                }
            });
        }

        function bonusFrame() {
            let magic_forest_winner_frame = new PIXI.Sprite(PIXI.Texture.fromImage("images/Location_assets/magic_forest_winner_frame.png"));
            magic_forest_winner_frame.name = 'bonusBG';
            magic_forest_winner_frame.position.set(528, 140);

            let symbol = new PIXI.Sprite(PIXI.Texture.fromImage(cards[winSymbol]));
            symbol.name = 'bonusSymbol';
            symbol.position.set(800, 590);
            symbol.anchor.set(0.5);

            let graphics = new PIXI.Graphics();

            if (mask != null) {
                mask.rendererMask.addChild(magic_forest_winner_frame, symbol);
                graphics.alpha = 0;
                graphics.beginFill(0x000000);
                graphics.drawRect(614, 367, 368, 368);
                gameGroup.addChild(graphics);
            }

            let minPos, maxPos;
            graphics.interactive = true;

            let drag = false;
            let touchmove = (event) => {
                let pos = event.data.global;
                if (pos.x < 614 || pos.x > 614 + 368
                    || pos.y < 367 || pos.y > 367 + 368
                ) {
                    return;
                }

                if (!minPos) {
                    minPos = { x: event.data.global.x, y: event.data.global.y };
                    maxPos = { x: event.data.global.x, y: event.data.global.y };
                }
                if (pos.x < minPos.x) minPos.x = pos.x;
                if (pos.x > maxPos.x) maxPos.x = pos.x;
                if (pos.y < minPos.y) minPos.y = pos.y;
                if (pos.y > maxPos.y) maxPos.y = pos.y;
                let length = ((minPos.x - maxPos.x) ** 2 + (minPos.y - maxPos.y) ** 2) ** 0.5;
                if (length >= 440) {
                    drag = false;
                    gameGroup.addChild(magic_forest_winner_frame, symbol)
                    graphics.destroy();
                    changeAnimation('red_happy_bonus');
                    if (openCount == 7) start.finish();
                    console.log(openCount);
                    openCount++;
                }
            };
            graphics.on('touchmove', touchmove);
            graphics.on('pointermove', touchmove);

            graphics.on('pointerover', () => {
                redMonster.char.state.setAnimation(0, 'red_worry_st', false)
                redMonster.char.state.addAnimation(0, 'red_worry_loop', true, 0);
            });
            graphics.on('pointerout', () => {
                redMonster.char.state.setAnimation(0, 'red_worry_end', false)
                redMonster.char.state.addAnimation(0, 'red_idle_loop', true, 0);
            });
        }

        function randomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function changeAnimation(key) {
            currentAnimation = key;
            redMonster.char.state.setAnimation(0, key + '_st', false)
            redMonster.char.state.addAnimation(0, key + '_loop', false, 0);
            redMonster.char.state.addAnimation(0, key + '_end', false, 0);
            redMonster.char.state.addAnimation(0, 'red_idle_loop', true, 0);
            setTimeout(() => {
                currentAnimation = 'idle';
            }, 2000);
        }
    }
}

class Monster {

    constructor() {
        this.container = new PIXI.Container();
        this.allMoves;
        this.char = new PIXI.spine.Spine(Res.redJson.spineData);
    }

    addToContainer() {
        this.char.skeleton.setToSetupPose();
        this.char.update(0);
        this.char.autoUpdate = false;

        this.container.addChild(this.char);
        let localRect = this.char.getLocalBounds();
        this.char.position.set(-localRect.x, -localRect.y);

        this.container.position.set(80, 280);
        this.char.state.setAnimation(0, 'red_idle_loop', true)

        requestAnimationFrame(skeletonAnimation);

        let charLastFrame = 0;
        let c = this.char;
        function skeletonAnimation(newframe) {
            let frameTime = (newframe - charLastFrame) / 1000;
            charLastFrame = newframe;
            c.update(frameTime);
            requestAnimationFrame(skeletonAnimation);
        }

        return this.container;
    }
}

class Game {

    BuildGame() {
        back = new Background();
        redMonster = new Monster();
        app.stage.addChild(back.addToContainer(), redMonster.addToContainer());
        document.body.appendChild(app.view);
    }
}

class StartGame {

    constructor() {
        startBarGroup = new PIXI.Container();
        finishBarGroup = new PIXI.Container();
        darkness = new PIXI.Graphics();
        let coinWinTextStyle = new PIXI.TextStyle({
            fontFamily: "DRAguSansBlack",
            fontSize: 126,
            fill: "#311d1f"
        });
        this.coinWinText = new PIXI.Text('25', coinWinTextStyle);
    }

    start() {

        let game = new Game();
        game.BuildGame();

        darkness.alpha = 0.5;
        darkness.beginFill(0x000000);
        darkness.drawRect(0, 0, app.screen.width, app.screen.height);
        darkness.interactive = true;
        app.stage.addChild(darkness);

        startBarGroup = new PIXI.Graphics();
        startBarGroup.name = 'startBarGroup';
        startBarGroup.position.set(0, 1530);
        app.stage.addChild(startBarGroup);

        finishBarGroup.name = 'finishBarGroup';
        if(check){
            finishBarGroup.visible = true;
        }
        else{
            finishBarGroup.visible = false;
        }
        finishBarGroup.position.set(47, 220);
        app.stage.addChild(finishBarGroup);

        let startBarBG = new PIXI.Sprite(PIXI.Texture.fromImage('images/Location_assets/magic_forest_frame2.png'));
        startBarBG.name = 'startBarBG';
        startBarBG.position.set(0, 0);
        startBarGroup.addChild(startBarBG);

        let startButton = new PIXI.Sprite(PIXI.Texture.fromImage('images/Location_assets/magic_forest_button.png'));
        startButton.name = 'startButton';
        startButton.position.set(27, 191);
        startButton.interactive = true;
        startButton.buttonMode = true;
        startBarGroup.addChild(startButton);

        startButton.on('touchend', pointerUp);
        startButton.on('mouseup', pointerUp);
        function pointerUp(event) {
            darkness = new PIXI.Graphics();
            startButton.interactive = false;
            startAnimation = performance.now();
            requestAnimationFrame(startGameAnimation);
            while (gameGroup.children[0]) {
                gameGroup.children[0].destroy();
            }
            mask = new Mask();
            start.start();
            check = true;
        }

        let howToPlayTextStyle = new PIXI.TextStyle({
            fontFamily: "DRAguSansBlack",
            fontSize: 72,
            fill: "#ff8729"
        });

        let howToPlayText = new PIXI.Text("How To Play", howToPlayTextStyle);
        howToPlayText.name = 'howToPlayText';
        howToPlayText.position.set(440, 60);
        startBarGroup.addChild(howToPlayText);

        let startButtonTextStyle = new PIXI.TextStyle({
            fontFamily: "DRAguSansBlack",
            fontSize: 72,
            fill: "#ffffff"
        });

        let startButtonText = new PIXI.Text("Play for 60", startButtonTextStyle);
        startButtonText.name = 'startButtonText';
        startButtonText.position.set(371, 238);
        startBarGroup.addChild(startButtonText);

        let helpIcon = new PIXI.Sprite(PIXI.Texture.fromImage('images/Location_assets/magic_forest_question_icon.png'));
        helpIcon.name = 'helpIcon';
        helpIcon.position.set(330, 63);
        helpIcon.interactive = true;
        helpIcon.buttonMode = true;
        helpIcon.on('touchend', pointerHelpIconUp);
        helpIcon.on('mouseup', pointerHelpIconUp);
        function pointerHelpIconUp(event) {
            helpIcon.interactive = false;
            startAnimation = performance.now();
            app.stage.children[1].destroy();
            let text_px = new PIXI.Sprite(PIXI.Texture.fromImage('images/Location_assets/text_px.png'));
            text_px.name = 'text_px';
            text_px.position.set(0, 120);
            text_px.x += -80;
            text_px.y += -150;
            text_px.scale.x *= 0.75;
            text_px.scale.y *= 1.2;
            gameGroup.addChild(text_px);
        }
        startBarGroup.addChild(helpIcon);

        let coinIcon = new PIXI.Sprite(PIXI.Texture.fromImage('images/Location_assets/magic_forest_coin_icon_small.png'));
        coinIcon.name = 'coinIcon';
        coinIcon.scale.set(0.85);
        coinIcon.position.set(726, 253);
        startBarGroup.addChild(coinIcon);

        let youWonTextStyle = new PIXI.TextStyle({
            fontFamily: "DRAguSansBlack",
            fontSize: 116,
            fill: "#f45b4e"
        });

        let finishBarBG = new PIXI.Sprite(PIXI.Texture.fromImage('images/Location_assets/magic_forest_frame1.png'));
        finishBarBG.name = 'finishBarBG';
        finishBarBG.position.set(0, 0);
        finishBarGroup.addChild(finishBarBG);

        let youWonText = new PIXI.Text("YOU WIN", youWonTextStyle);
        youWonText.name = 'youWonText';
        youWonText.position.set(300, 30);
        finishBarGroup.addChild(youWonText);

        this.coinWinText.name = 'coinWinText';
        this.coinWinText.position.set(550, 136);
        this.coinWinText.anchor.set(1, 0);
        finishBarGroup.addChild(this.coinWinText);

        let winCoinIcon = new PIXI.Sprite(PIXI.Texture.fromImage('images/Location_assets/magic_forest_coin_icon_big.png'));
        winCoinIcon.name = 'winCoinIcon';
        winCoinIcon.position.set(570, 160);
        finishBarGroup.addChild(winCoinIcon);

        document.body.appendChild(app.view);
    }

    finish() {
        finishBarGroup.visible = true;
        startBarGroup.getChildByName('startButton').interactive = true;
        darkness.interactive = true;
        this.coinWinText.text = '' + winCoin;
        console.log(winCoin);
        startAnimation = performance.now();
        requestAnimationFrame(finishGameAnimation);
        winCoin = 25;
        isWin = false;
        mask = null;        
    }
}