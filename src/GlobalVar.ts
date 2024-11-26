import { GameData, GameObject } from "./assets/types";

//GAME-----------------------------------------
export const SETTINGS: GameObject = {
    height: 720,
    width: 1280,
    spinDelay: 1,// 1 second
}

export const GAMEDATA: GameData = {
    balance: 100,
    bet: 1,
    win: 0
}


//SLOT-----------------------------------------
//you can change this up to 5 reels
export const REEL_COUNT: number = 5;

//reelband
/* for 5 reels
REEL_BAND_1
REEL_BAND_2
REEL_BAND_3
REEL_BAND_4
REEL_BAND_5
*/
export const REEL_BAND_1: string[] =
    [
        "SYM1", "SYM5", "SYM1", "SYM3", "SYM4", "SYM3",
        "SYM2", "SYM4", "SYM3", "SYM6", "SYM3", "SYM1",
        "SYM6", "SYM1", "SYM2", "SYM1", "SYM2", "SYM2",
        "SYM2", "SYM1", "SYM2", "SYM1", "SYM4", "SYM1",
        "SYM3", "SYM6", "SYM1", "SYM3", "SYM2", "SYM5",
        "SYM3", "SYM1", "SYM2", "SYM2", "SYM2", "SYM1",
        "SYM4", "SYM1", "SYM4", "SYM1", "SYM3", "SYM2",
        "SYM4", "SYM4", "SYM5", "SYM2", "SYM3", "SYM1",
        "SYM1", "SYM1", "SYM4", "SYM5", "SYM2", "SYM2",
        "SYM2", "SYM1", "SYM5", "SYM6", "SYM1", "SYM3",
        "SYM4", "SYM2", "SYM5", "SYM2", "SYM1", "SYM5",
        "SYM1", "SYM2", "SYM1", "SYM1", "SYM1", "SYM4",
        "SYM4", "SYM3", "SYM3", "SYM5", "SYM5", "SYM4",
        "SYM2", "SYM5", "SYM2", "SYM1", "SYM3", "SYM2",
        "SYM3", "SYM1", "SYM4", "SYM3", "SYM4", "SYM2",
        "SYM3", "SYM4", "SYM1", "SYM1", "SYM1", "SYM2",
        "SYM6", "SYM3", "SYM2", "SYM3", "SYM1", "SYM5",
    ];


export const REEL_BANDS: string[][] = [REEL_BAND_1, REEL_BAND_1, REEL_BAND_1, REEL_BAND_1, REEL_BAND_1]