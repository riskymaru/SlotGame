console.log("SlotGame v0.0.1");

import { Application, Assets, Container } from 'pixi.js';
import GamePage from './assets/pages/GamePage';
import Controller from './Controller';
import PreloaderPage from './assets/pages/PreloaderPage';
import { SETTINGS } from './GlobalVar';

const cssstyle = require('./assets/css/style.css');

(async () => {
    // Create a new application
    const app: Application = new Application();

    // Initialize the application
    await app.init({ background: '#030303', resizeTo: window });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    // Create and add a container to the stage
    const game_container = new Container();
    app.stage.addChild(game_container);

    //init game assets
    Assets.addBundle("images",
        {
            //load spritesheet
            slot: "assets/img/slot-assets-3.json",

            //load img
            hud: 'assets/img/hud.png',
            konoha: 'assets/img/bg/konoha-bg.png',
            sky: 'assets/img/bg/sky.png',

            //load sounds
            spin_music1: 'assets/sndm4a/bgm-naruto-theme.m4a',
            btn_spin: 'assets/sndm4a/sfx-spin.m4a',
            reel_stop: 'assets/sndm4a/sfx-kunai.m4a',
            line_win1: 'assets/sndm4a/sfx-win1.m4a',
            line_win2: 'assets/sndm4a/sfx-win2.m4a',
            sfx_ambient: 'assets/sndm4a/sfx-ambient.m4a',
        }
    );

    //draw preloader
    let preloadPage: PreloaderPage = new PreloaderPage();
    preloadPage.position.set(SETTINGS.width * 0.5, SETTINGS.height * 0.5); //center
    game_container.addChild(preloadPage);

    //now we load the assets
    await Assets.loadBundle("images", (e: number) => {
        preloadPage.showProgress(e);
    });

    //Add all drawing objects----------------------------------------------------------
    //initialize game;
    let gamePage = new GamePage(app);
    gamePage.position.set(SETTINGS.width * 0.5, SETTINGS.height * 0.5); //center
    game_container.addChild(gamePage);

    //Add all game controls-----------------------------
    let controller: Controller = new Controller(gamePage);

})();
