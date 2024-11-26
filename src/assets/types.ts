// global.d.ts
export interface GameObject {
    height: number;
    width: number;
    spinDelay: number;
}

export interface Box {
    width: number,
    height: number,
    x: number,
    y: number
}

export interface GameData {
    balance: number,
    win: number,
    bet: number
}