import { Application, Assets, Container, Graphics, Sprite, Spritesheet, Text } from 'pixi.js';

import { gsap, Sine, Elastic, Power0, Back } from "gsap";
import { sound } from '@pixi/sound';
import Reel from '../components/Reel';
import Slot from '../components/Slot';
import GameBackground from '../components/GameBackground';
import { GAMEDATA, SETTINGS } from '../../GlobalVar';
import TextContainer from '../components/TextContainer';

/**
* GamePage
* @param GameAssets add game assets object
*/

export default class GamePage extends Sprite {

    public app: Application;

    public slotmachine_container: Container = new Container();
    public slotmachine: Slot = new Slot();
    public reels: Reel[] = [];
    public spinButton: Sprite = new Sprite();
    public hud: Graphics = new Graphics();

    public winContainer: TextContainer;
    public balanceContainer: TextContainer;

    //status
    public spinEnabled: boolean = true;


    //sample message in the announcement text                                     
    private message_arr: string[] = [
        "Press Spin button to Play",
        "Good Luck!",
        "Play and Win up to 5,000 Jackpot!"
    ];


    public win_announcement_text: Text = new Text({
        text: "Welcome!",
        style: {
            fontFamily: "roboto-c",
            fontSize: 30,
            fill: 0x0,
            align: 'center',
            wordWrap: true,
            wordWrapWidth: 650
        }
    });

    public gameBackground: GameBackground;

    constructor(app: Application) {
        super();
        this.anchor.set(0.5);
        this.pivot.set(0.5);
        this.app = app;
        this.gameBackground = new GameBackground();

        this.winContainer = new TextContainer("Win: 0");
        this.balanceContainer = new TextContainer("Balance: 0");

        //initialize game
        this.init();
    }

    init() {
        //play ambient sounds
        this.playSound();

        //draw elements
        this.drawGameElements();

        //auto detect size based on the device screen
        this.checkScreenSize();

        this.updatePlayerBalance(GAMEDATA.balance);
        this.updateWin(0);
    }


    playSound() {
        sound.play("sfx_ambient", { loop: true, volume: 0.3 });
    }

    drawGameElements() {
        //add game background
        this.addChild(this.gameBackground);

        this.addChild(this.hud);
        this.hud.rect(-SETTINGS.width * 0.5, -50, SETTINGS.width, 100);
        this.hud.fill('#990000');
        this.hud.roundRect(-400, -30, 800, 60, 60);
        this.hud.fill('#ffffff');

        //add win container
        this.addChild(this.winContainer);
        this.winContainer.position.set(-350, 220);

        //add win container
        this.addChild(this.balanceContainer);
        this.balanceContainer.position.set(350, 220);

        this.hud.pivot.set(0.5);
        this.hud.y = 320;

        this.win_announcement_text.pivot.set(0.5);
        this.win_announcement_text.y = -5;
        this.win_announcement_text.anchor.set(0.5)
        this.hud.addChild(this.win_announcement_text);

        //Add slot machine asset
        this.addChild(this.slotmachine);
        this.slotmachine.y = -40;

        //spin button
        this.spinButton.texture = Assets.get("slot").textures["btn_spin_0"];
        this.spinButton.anchor.set(0.5);
        this.spinButton.position.set(0, 220)
        this.spinButton.eventMode = "static"
        this.addChild(this.spinButton);

        //update announcement text
        this.slotmachine.on("announcement_update", (e) => {
            this.win_announcement_text.text = e[0];
        });

        this.slotmachine.on("win_update", (e: number) => {
            GAMEDATA.balance = Number(GAMEDATA.balance) + Number(e);
            this.updateWin(e);
            this.updatePlayerBalance(GAMEDATA.balance)
        });
    }

    checkScreenSize() {
        document.body.onresize = () => { gsap.delayedCall(0.1, () => { this.resizeScreen() }); };
        gsap.delayedCall(0.1, () => { this.resizeScreen() });
    }

    updatePlayerBalance(balance: number) {
        this.balanceContainer.labeltext.text = "💵Balance: " + balance;
    }

    updateWin(win: number) {
        this.winContainer.labeltext.text = "🎯Bet: " + GAMEDATA.bet + "    " + "💰Win: " + win;
    }


    //handle screen for mobile orientation
    resizeScreen() {

        this.x = (this.app.renderer.width / 2);
        this.y = (this.app.renderer.height / 2);

        if (this.app.renderer.width < this.app.renderer.height) {
            //portrait
            this.gameBackground.scale.set(1);

            this.slotmachine.scale.set(0.4);
            this.slotmachine.y = -100;

            this.hud.y = 0;
            this.hud.scale.set(0.4)

            this.spinButton.scale.set(0.75);
            this.spinButton.y = 250;

            this.balanceContainer.scale.set(0.72);
            this.balanceContainer.position.set(0, 120);

            this.winContainer.scale.set(0.72)
            this.winContainer.position.set(0, 65)

            this.width = (this.app.renderer.height / SETTINGS.height) * 1;
            this.height = (this.app.renderer.height / SETTINGS.height) * 1;
        } else {
            //landscape
            this.width = (this.app.renderer.width / SETTINGS.width) * 1;
            this.height = (this.app.renderer.height / SETTINGS.height) * 1;

            this.gameBackground.scale.set(1);

            this.slotmachine.scale.set(1);
            this.slotmachine.y = -40;

            this.hud.y = 320;
            this.hud.scale.set(1);

            this.balanceContainer.scale.set(1);
            this.balanceContainer.position.set(350, 220);

            this.winContainer.scale.set(1)
            this.winContainer.position.set(-350, 220);

            this.spinButton.scale.set(1);
            this.spinButton.y = 220;
        }
    }

    enabledSpinButton(id: boolean = true) {
        if (id) {
            this.spinButton.tint = 0xffffff;
            this.spinEnabled = true;
        } else {
            this.spinButton.tint = 0x666666;
            this.spinEnabled = false;
        }

    }

    generateRandomMessage() {
        this.win_announcement_text.text = this.message_arr[Math.floor(Math.random() * 3)];
    }
}