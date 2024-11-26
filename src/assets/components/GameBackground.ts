import { Assets, Graphics, Sprite } from 'pixi.js';
import { gsap, Linear } from "gsap";
import { SETTINGS } from '../../GlobalVar';

export default class GameBackground extends Sprite {

    private bg: Sprite = new Sprite();
    private sky1: Sprite = new Sprite();
    private sky2: Sprite = new Sprite();

    public id: number = 0;
    constructor() {

        super();

        //set to center
        this.anchor.set(0.5);
        this.pivot.set(0.5);

        //add mask to prevent showing unnecessary elements
        let background: Graphics = this.addChild(new Graphics());
        background.rect(-SETTINGS.width * 0.5, -SETTINGS.height * 0.5, SETTINGS.width, SETTINGS.height);
        background.fill('#ffffff');
        this.mask = background;

        this.sky1.texture = Assets.get("sky");
        this.sky1.anchor.set(0.5);
        this.sky1.pivot.set(0.5);
        this.sky1.position.set(0, -100);
        this.addChild(this.sky1);

        this.sky2.texture = Assets.get("sky");
        this.sky2.anchor.set(0.5);
        this.sky2.pivot.set(0.5);
        this.sky2.scale.x = -1;
        this.sky2.position.set(-1738, -100);
        this.sky1.addChild(this.sky2);

        this.bg.texture = Assets.get("konoha");
        this.bg.anchor.set(0.5);
        this.bg.pivot.set(0.5);
        this.bg.position.set(0, 200);
        this.addChild(this.bg);

        this.animate();
    }

    animate() {
        gsap.to(this.sky1, 120, { x: 1740, startAt: { x: 0 }, ease: Linear.easeNone, repeat: -1 });
    }
}
