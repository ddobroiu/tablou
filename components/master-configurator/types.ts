import { Package, Ruler, Layers, Check } from "lucide-react";

export interface ConfigState {
    selectedId: string | null;
    width: number;
    height: number;
    materialId: string;
    options: Record<string, any>;
    quantity: number;
    designOption: 'standard' | 'upload' | 'text_only' | 'pro';
    artworkUrl: string | null;
    artworkUrlVerso: string | null;
    textDesign: string;
    textDesignVerso: string;
}

export const STEPS = [
    { id: 1, name: "Produs", icon: Package },
    { id: 2, name: "Dimensiuni", icon: Ruler },
    { id: 3, name: "Opțiuni", icon: Layers },
    { id: 4, name: "Finalizare", icon: Check },
];
