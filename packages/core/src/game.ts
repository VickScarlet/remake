export interface GameEffects {
    save: (profile: any) => Promise<boolean>
    load: () => Promise<any>
}
