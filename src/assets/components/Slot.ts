import { Assets, Container, Graphics, Sprite, Text } from 'pixi.js';
import { gsap } from "gsap";
import Reel from '../components/Reel';
import { sound } from '@pixi/sound';
import { REEL_BANDS, REEL_COUNT, GAMEDATA } from '../../GlobalVar';

export default class Slot extends Sprite {

    //mini text to show winnnings
    public win_text: Text = new Text({
        text: "10",
        style: {
            fontFamily: "roboto-c",
            fontSize: 30,
            fill: 0x0,
            align: 'center'
        }
    });

    private reelband: string[][] = REEL_BANDS;

    //init slot objects
    public reels: Reel[] = [];
    public slotmachine_container: Container;
    private win_text_container: Sprite = new Sprite();

    //this gsap time line will hold all winning animations
    //and will be cleared if the user do a new spin action
    private animationTimeline: gsap.core.Timeline;

    constructor() {

        super();
        //set to center
        this.anchor.set(0.5);
        this.pivot.set(0.5);

        //add container
        this.slotmachine_container = this.addChild(new Container());

        //add timeline win animation
        this.animationTimeline = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });


        this.drawSlotObjects();
    }

    drawSlotObjects() {

        let background: Graphics = this.slotmachine_container.addChild(new Graphics());
        background.roundRect(-500, -300, 1000, 500, 20);
        background.fill('#ffffff');
        background.alpha = 0.4;

        let bgimg: Sprite = this.slotmachine_container.addChild(new Sprite(Assets.get("bg1")));
        bgimg.anchor.set(0.5);
        bgimg.pivot.set(0.5);
        bgimg.alpha = 0;

        //add reels
        let i: number = 0;

        for (i = 0; i < REEL_COUNT; i++) {
            this.reels[i] = this.slotmachine_container.addChild(new Reel());
            this.reels[i].position.set(((-100 * REEL_COUNT) + 100) + (200 * i), -280);
        }

        //add win text container at the center
        this.win_text_container.texture = Assets.get("slot").textures["win_container_0"];
        this.win_text_container.anchor.set(0.5);
        this.win_text_container.pivot.set(0.5);
        this.slotmachine_container.addChild(this.win_text_container);

        //set to invisible
        this.win_text_container.visible = false;

        //mini text container to show individual win
        this.win_text_container.addChild(this.win_text);
        this.win_text.anchor.set(0.5)
        this.win_text.position.set(0, 0);

        //set all reels to zero index
        let reel_id: number[] = [];
        for (i = 0; i < REEL_COUNT; i++) {
            reel_id[i] = 0;
        }

        this.updateReels(reel_id, false);
    }

    updateReels(reelband_stop_ids: number[], checkPaylines: boolean = true) {

        //reelband_stop_ids - this is the location id of the reelband where the reel will stop
        let i: number = 0;
        let set: string[] = []; //name sets of 3 symbols to show per reel
        let setsPerReel: string[][] = [];//all currrent visible reel symbols

        for (i = 0; i < REEL_COUNT; i++) {
            set = this.reelband[i].slice(reelband_stop_ids[i], reelband_stop_ids[i] + 3);
            this.reels[i].updateSymbols(set, set);
            setsPerReel[i] = set;
            if (checkPaylines) {
                this.reels[i].stop(i * 0.1);
            }
        }

        if (checkPaylines) {
            //wait for 1 second to proceed with winning animation
            gsap.delayedCall(1, () => {
                this.checkSymbolPattern(setsPerReel);
            });
        }
    }

    checkSymbolPattern(reel_pattern: string[][]) {

        let i: number = 0;
        let j: number = 0;
        let k: number = 0;
        let winID: number[] = [];
        let allWinID: number[][] = [];
        let match: boolean = false;

        for (k = 0; k < REEL_COUNT; k++) {

            winID = [];
            for (i = 0; i < 3; i++) {
                match = false;
                for (j = 0; j < 3; j++) {
                    if (reel_pattern[k][i] == reel_pattern[k][j] && i !== j) {
                        match = true;
                    }
                }
                //record matched symbol
                if (match) {
                    winID.push(i);
                    match = false;
                }
            }
            allWinID[k] = winID;
        }

        this.showWinnings(allWinID);
    }


    showWinnings(allWinID: number[][]) {

        let message: string = "";
        let totalWinAmount: number = 0;
        let i: number = 0;

        for (i = 0; i < REEL_COUNT; i++) {
            let reelID: number = i

            let winningAmount = GAMEDATA.bet * allWinID[reelID].length;
            totalWinAmount += (winningAmount);

            if (winningAmount > 0) {
                this.animationTimeline.add(
                    gsap.to(this, 2, {
                        x: 0,
                        onStart: () => {
                            //set a sequence of winnings per reel symbol
                            allWinID[reelID].forEach((symbolID: number) => {
                                winningAmount = GAMEDATA.bet * allWinID[reelID].length;
                                message = "Congratulations! You win " + winningAmount + ".00 $ on Reel " + (reelID + 1);
                                this.reels[reelID].symbols[symbolID].animate();
                                this.emit("announcement_update", [message]);
                                sound.play("line_win1");
                            });
                        }
                    }))
            }
        }

        this.emit("win_update", [totalWinAmount]);
    }

    animateWinText(winnings: number, winLine: number = 0) {

        //reposition mini win text container
        if (winLine == 2 || winLine == 7) {
            this.win_text_container.y = -150;
        } else if (winLine == 3 || winLine == 6) {
            this.win_text_container.y = 150
        } else {
            this.win_text_container.y = 0;
        }

        this.win_text_container.visible = true;
        this.win_text.text = winnings;

        gsap.to(this.win_text_container.scale, 0.2, { x: 1.1, y: 1.1, yoyo: true, repeat: 5 });
    }





    resetReels() {
        let i: number = 0;
        for (i = 0; i < REEL_COUNT; i++) {
            this.reels[i].reset();
        }
    }

    reset() {
        //reset elements ideally every spin to prevent animation issue
        this.win_text_container.visible = false;
        this.animationTimeline.kill();
        this.animationTimeline.clear(true);


        this.resetReels();
    }
}


