import { Assets, Sprite, Texture } from 'pixi.js';
import { gsap } from "gsap";


export default class Symbol extends Sprite {

        private bg: Sprite = new Sprite();
        private icon: Sprite = new Sprite();
        private icon_win: Sprite = new Sprite();
        public id: number = 0;
        public assets_version: string = "slot";

        constructor(name: string, symbol_id: number) {

                super();
                //set id
                this.id = symbol_id;

                //set to center
                this.anchor.set(0.5);
                this.pivot.set(0.5);

                this.bg.texture = Assets.get(this.assets_version).textures["symbol_bg_0"];
                this.bg.anchor.set(0.5);
                this.bg.pivot.set(0.5);
                this.addChild(this.bg);

                this.icon.texture = Assets.get(this.assets_version).textures[name + "_0"];
                this.icon.anchor.set(0.5);
                this.icon.pivot.set(0.5);
                this.bg.addChild(this.icon);

                this.icon_win.texture = Assets.get(this.assets_version).textures[name + "_1"];
                this.icon_win.anchor.set(0.5);
                this.icon_win.pivot.set(0.5);
                this.icon_win.visible = false;
                this.bg.addChild(this.icon_win);
        }

        updateImage(txtr: string) {
                this.icon.texture = Assets.get(this.assets_version).textures[txtr + "_0"]; //base symbol asset
                this.icon_win.texture = Assets.get(this.assets_version).textures[txtr + "_1"]; //win symbol asset
        }

        animate() {
                this.icon_win.visible = true;
                gsap.to(this.icon_win, 0.5, { alpha: 1, repeat: 0, yoyo: true, startAt: { alpha: 0 } });
                gsap.to(this.bg.scale, 0.2, { x: 1.1, y: 1.1, repeat: 5, yoyo: true });
        }

        reset() {
                //reset animation and restore to original form
                this.icon_win.visible = false;
                gsap.killTweensOf(this.bg.scale);
                this.bg.scale.set(1);
        }
}
