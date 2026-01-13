
import React from "react";

declare global {
    namespace JSX {
        interface IntrinsicElements {
            "model-viewer": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
                src?: string;
                poster?: string;
                alt?: string;
                "shadow-intensity"?: string;
                "camera-controls"?: boolean;
                "auto-rotate"?: boolean;
                ar?: boolean;
                "ar-modes"?: string;
                "tone-mapping"?: string;
                scale?: string;
                orientation?: string;
                ref?: any;
                slot?: string;
            }, HTMLElement>;
        }
    }
}
