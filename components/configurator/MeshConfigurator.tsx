"use client";

import type { ComponentProps } from "react";
import BannerConfigurator from "./BannerConfigurator";

export default function MeshConfigurator(props: Omit<ComponentProps<typeof BannerConfigurator>, "productKind">) {
    return <BannerConfigurator {...props} productKind="mesh" />;
}
