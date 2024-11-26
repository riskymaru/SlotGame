import GamePage from "./assets/pages/GamePage";
import { gsap } from "gsap";
import { sound } from "@pixi/sound";
import { REEL_COUNT, REEL_BANDS, GAMEDATA, SETTINGS, REEL_BAND_1 } from "./GlobalVar";

//all controls and other interaction code

export default class Controller {

  private gamepage: GamePage;
  private reelstop: number[] = [];

  //for demo test code
  private testCode: number = 0;

  //slot spinning status
  private isSlotSpinning: boolean = false;


  /**
   * Controller.ts
   * @param GamePage add GamePage object
   */
  constructor(parent: GamePage) {
    this.gamepage = parent;
    this.init();
  }

  init() {

    //initiate random reel stop
    this.goStop(false);

    //add event trigger for spin button
    this.gamepage.spinButton.on("pointerup", () => {
      this.forceStop();
      this.goSpin();
    });

    //add keyboard shortcuts
    window.addEventListener("keyup", (e) => {
      //enable testCode to show winnings
      if (e.key == "q") {
        // 3 wins
        this.testCode = 1;

      } else if (e.key == "w") {
        // 2 wins
        this.testCode = 2;

      } else if (e.key == " ") {
        //spacebar to spin
        this.forceStop();
        this.goSpin();
      }
    });
  }

  goSpin() {
    let i: number = 0;
    if (this.gamepage.spinEnabled == true) {
      if (GAMEDATA.balance >= GAMEDATA.bet) {

        this.isSlotSpinning = true;
        this.gamepage.enabledSpinButton(false);

        //play slot sound
        sound.play("spin_music1");

        this.deductBalance();

        //reset the game to avoid animation conflict
        this.gameReset();

        //start reel spin animation
        for (i = 0; i < REEL_COUNT; i++) {
          this.gamepage.slotmachine.reels[i].animateReelSymbols(i * 0.1);
        }

        this.gamepage.generateRandomMessage();

        //simulation stop function assuming the data was received---------------------
        gsap.to(this.gamepage, REEL_COUNT + 1, {
          onComplete: () => {
            this.goStop();
          }
        });

      } else {
        // if not enought balance
        this.gamepage.enabledSpinButton(false);
        this.gamepage.win_announcement_text.text = "Insufficient Balance, Please add balance to continue."
      }
    }
  }

  deductBalance() {
    GAMEDATA.balance -= GAMEDATA.bet;
  }

  forceStop() {
    if (this.isSlotSpinning == true) {
      gsap.killTweensOf(this.gamepage);
      this.goStop();
    }
  }

  goStop(checkWin: boolean = true) {
    sound.stop("spin_music1");
    this.isSlotSpinning = false;
    this.reelstop = this.generateReelStopPattern();
    this.gamepage.slotmachine.updateReels(this.reelstop, checkWin);

    //enable spin button after reel stop
    gsap.delayedCall(SETTINGS.spinDelay, () => {
      this.testCode = 0;
      this.gamepage.enabledSpinButton(true);
    });
  }

  generateReelStopPattern() {
    //this will generate random output for reel stop
    let arr: number[] = [];
    let i: number = 0;
    for (i = 0; i < REEL_COUNT; i++) {
      arr[i] = Math.floor(Math.random() * (REEL_BANDS[i].length - 3));
    }

    //FOR DEMO
    /*9
    PRESS W before spinning to get 3 symbols
    PRESS Q to get 2 winning symbol
    */
    if (this.testCode == 1) {
      arr = [32, 32, 32, 32, 32]; // 3 wins 
    } else if (this.testCode == 2) {
      arr = [0, 0, 0, 0, 0]; // 2 wins 
    }
    return arr;
  }

  gameReset() {
    this.gamepage.updateWin(0);
    this.gamepage.updatePlayerBalance(GAMEDATA.balance);
    this.gamepage.slotmachine.reset();
  }
}
