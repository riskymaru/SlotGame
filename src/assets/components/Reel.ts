import { Assets, Graphics, Sprite, Container, BlurFilter } from 'pixi.js';
import Symbol from './Symbol';
import { gsap, Linear, Back } from "gsap";
import { sound } from '@pixi/sound';

export default class Reel extends Sprite {

    public symbols: Symbol[] = [];
    private upperGroupSymbols: Container = new Container();
    private lowerGroupSymbols: Container = new Container();
    private symbolCount: number = 6;
    private blur: BlurFilter = new BlurFilter({ strength: 5 });

    constructor() {
        super();

        //align to center
        this.anchor.set(0.5);
        this.pivot.set(0.5);

        //set blur effect for groups of symbols
        this.blur.blurY = 10;

        //mask the reel for the symbol animation
        let background: Graphics = this.addChild(new Graphics());
        background.rect(-90, 0, 180, 450);
        background.fill('#999999');
        background.alpha = 0.2;
        this.mask = background;

        //add 2 containers that contains 3 symbol each for animation
        this.addChild(this.upperGroupSymbols);
        this.addChild(this.lowerGroupSymbols);

        //note: the lowerGroupSymbols with id (0,1,2) will be the final set to appear in the screen after animation

        this.drawSymbols();

        //  reels will initally displayed like this and will force to set in this same manner after the reel fully stopped
        //  symbol [3]
        //  symbol [4]          <-- upper hidden screen
        //  symbol [5]          

        //-----------------
        //  symbol [0]     |   <-- visible screen
        //  symbol [1]     |
        //  symbol [2]     |
        //-----------------
    }

    drawSymbols() {
        let i: number = 0;
        for (i = 0; i < this.symbolCount; i++) {
            this.symbols[i] = new Symbol("lv1_0", i);
            this.symbols[i].scale.set(0.7);
            this.symbols[i].position.set(0, 75 + (150 * i));

            if (i < 3) {
                //this.symbols[i].tint = 0xffcc00;// to monitor groups
                this.lowerGroupSymbols.addChild(this.symbols[i]);
            } else {
                //this.symbols[i].tint = 0xff0000;// to monitor groups
                this.symbols[i].position.set(0, 75 + (150 * (i - 6)));
                this.upperGroupSymbols.addChild(this.symbols[i]);
            }
        }
    }

    animateReelSymbols(delay: number = 0) {
        //reset position
        this.upperGroupSymbols.y = 0;
        this.lowerGroupSymbols.y = 0;

        gsap.to(this.upperGroupSymbols, 0.15, { y: 450, repeat: -1, ease: Linear.easeNone, delay: delay });
        gsap.to(this.lowerGroupSymbols, 0.15, {
            y: 450, repeat: -1, ease: Linear.easeNone, delay: delay,
            onStart: () => {
                this.upperGroupSymbols.filters = [this.blur];
                this.lowerGroupSymbols.filters = [this.blur];
            }
        });
    }

    stop(delay: number) {
        //reset position
        this.upperGroupSymbols.y = 0;
        this.lowerGroupSymbols.y = 0;

        gsap.to(this.upperGroupSymbols, 0.3, { y: 450, ease: Back.easeOut, delay: delay });
        gsap.to(this.lowerGroupSymbols, 0.3, {
            y: 450, ease: Back.easeOut, delay: delay,
            onStart: () => {
                sound.play("reel_stop");
            },
            onComplete: () => {
                this.upperGroupSymbols.filters = [];
                this.lowerGroupSymbols.filters = [];

                gsap.killTweensOf([this.upperGroupSymbols, this.lowerGroupSymbols]);

                this.upperGroupSymbols.y = 0;
                this.lowerGroupSymbols.y = 0;
            }
        });
    }

    updateSymbols(arr_id: string[], arr_id2: string[]) {
        //this function can still be enhance, i just put it like this for now,
        //both upper and lower are having same set of symbols

        let i: number = 0;
        for (i = 0; i < 3; i++) {
            this.symbols[i].updateImage(arr_id[i]);
            this.symbols[i + 3].updateImage(arr_id2[i]);
        }
    }

    //added reset feature to easily reset this object
    reset() {
        let i: number = 0;
        //reset all symbols
        for (i = 0; i < this.symbolCount; i++) {
            this.symbols[i].reset();
        }
    }
}
