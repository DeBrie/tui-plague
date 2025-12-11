export interface SpecialAbility {
    id: string;
    name: string;
    description: string;
    cost: number;
    category: "stealth" | "mutation" | "resilience" | "spread" | "lethal";
    effect: {
        type: string;
        value: number;
    };
    unlocked: boolean;
    repeatable: boolean;
    timesPurchased: number;
    maxPurchases: number;
}
export declare const createSpecialAbilities: () => SpecialAbility[];
