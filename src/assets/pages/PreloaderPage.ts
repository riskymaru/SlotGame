import { Container, Graphics, Sprite, Text } from 'pixi.js';
import { SETTINGS } from '../../GlobalVar';

export default class PreloaderPage extends Sprite {

    public preloader_container: Container = new Container();
    private bg: Graphics = new Graphics();
    private bg_progress_bar: Graphics = new Graphics();
    private progress_bar: Graphics = new Graphics();

    private progress_text: Text = new Text({
        text: "0 %",
        style: {
            fontFamily: 'roboto-c',
            fontSize: 24,
            fill: 0x0,
            align: 'center',
        }
    });

    constructor() {
        super();
        //set anchor to center
        this.anchor.set(0.5);
        this.pivot.set(0.5);
        this.init();
    }

    init() {
        //add preloader container
        this.addChild(this.preloader_container);

        //draw preloader bg
        this.bg.rect(-SETTINGS.width * 0.5, -SETTINGS.height * 0.5, SETTINGS.width, SETTINGS.height);
        this.bg.fill('#ffffff');

        //draw bg progress bar bg
        this.bg_progress_bar.rect(0, 0, 1000, 20);
        this.bg_progress_bar.fill('#999999');
        this.bg_progress_bar.position.set(-500, 280)

        //add child
        this.preloader_container.addChild(this.bg, this.bg_progress_bar);

        //draw progress bar
        this.progress_bar.rect(0, 0, 1000, 20);
        this.progress_bar.fill('#CB5027');
        this.progress_bar.scale.x = 0;

        //draw text
        this.progress_text.x = 500;
        this.progress_text.y = 25;

        //add
        this.bg_progress_bar.addChild(this.progress_bar, this.progress_text);
    }

    showProgress(progress: number = 0) {
        this.progress_bar.scale.x = progress;
        this.progress_text.text = (Math.round(progress * 100)) + " %";

        if (progress >= 1) {
            //emit custom event
            this.emit("preloadComplete");
            this.visible = false;

            //delete progress page
            this.destroy();
        }
    }






}