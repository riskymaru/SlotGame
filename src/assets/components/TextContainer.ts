import { Graphics, Sprite, Text } from 'pixi.js';
import { gsap } from "gsap";
import { Box } from '../types';

export default class TextContainer extends Sprite {

    public background = new Graphics();

    public labeltext: Text

    constructor(text: string, size: Box = { width: 100, height: 100, x: 0, y: 0 }) {
        super();

        this.labeltext = new Text({
            text: text,
            style: {
                fontFamily: "roboto-c",
                fontSize: 25,
                fill: 0x0,
                align: 'center',
                wordWrap: true,
                wordWrapWidth: 650
            }
        });

        //set to center
        this.anchor.set(0.5);
        this.pivot.set(0.5);

        this.addChild(this.background);
        this.background.roundRect(-150, -30, 300, 60, 60);
        this.background.fill('#ffffff');

        this.labeltext.anchor.set(0.5);
        this.background.addChild(this.labeltext);
    }


}
