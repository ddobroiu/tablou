"use client";
// components/TextileConfigurator.tsx

import { NumberInput } from "@/components/ui/NumberInput";
import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";
import { Plus, Minus, ShoppingCart, Info, ChevronDown, UploadCloud, Image as ImageIcon, Ruler, PlayCircle, MessageCircle, X, PencilRuler } from "lucide-react";
import DeliveryEstimation from "./DeliveryEstimation";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from 'next/link';
import Image from "next/image";
import FaqAccordion from "./FaqAccordion";
import Reviews from "./Reviews";
import QuickNav from "./QuickNav";
import RelatedProducts from "./RelatedProducts";
import { useUserActivityTracking } from "@/hooks/useAbandonedCartCapture";
import {
    calculateTextilePrice,
    TEXTILE_CONSTANTS,
    formatMoneyDisplay,
    roundMoney,
    type PriceInputTextile
} from "@/lib/pricing";
import { QA } from "@/types";

/* --- MODEL DATA --- */
type TextileModel = {
    id: string;
    name: string;
    colors: string[];
    sizes: string[];
    images?: Record<string, string>;
    description?: string;
};

const TRICOURI_MODELS: TextileModel[] = [
    {
        "id": "basic",
        "name": "Tricou Basic",
        "colors": ["Alb", "Negru", "Albastru Marin", "Albastru Regal", "Rosu", "Gri Inchis", "Portocaliu", "Verde sticla", "Galben"],
        "sizes": ["XS", "S", "M", "L", "XL", "XXL"],
        "images": {
            "Alb": "https://shop.printcenter.ro/cdn/shop/files/tricou-clasic-personalizat-tshirt-textiledivision-alb-xs-119972_800x.webp",
            "Negru": "https://shop.printcenter.ro/cdn/shop/files/tricou-clasic-personalizat-tshirt-textiledivision-negru-xs-247203_800x.webp",
            "Albastru Marin": "https://shop.printcenter.ro/cdn/shop/files/tricou-clasic-personalizat-tshirt-textiledivision-albastru-marin-xs-562991_800x.webp",
            "Albastru Regal": "https://shop.printcenter.ro/cdn/shop/files/tricou-clasic-personalizat-tshirt-textiledivision-albastru-regal-xs-324998_800x.webp",
            "Rosu": "https://shop.printcenter.ro/cdn/shop/files/tricou-clasic-personalizat-tshirt-textiledivision-rosu-xs-995395_800x.webp",
            "Gri Inchis": "https://shop.printcenter.ro/cdn/shop/files/tricou-clasic-personalizat-tshirt-textiledivision-gri-inchis-xs-511062_800x.webp",
            "Portocaliu": "https://shop.printcenter.ro/cdn/shop/files/tricou-clasic-personalizat-tshirt-textiledivision-portocaliu-xs-392939_800x.webp",
            "Verde sticla": "https://shop.printcenter.ro/cdn/shop/files/tricou-clasic-personalizat-tshirt-textiledivision-verde-sticla-xs-983798_800x.webp",
            "Galben": "https://shop.printcenter.ro/cdn/shop/files/tricou-clasic-personalizat-tshirt-textiledivision-galben-xs-784459_800x.webp"
        },
        "description": "Single Jersey, 100 % bumbac (compoziţia culorii poate să fie diferită - culoarea 03 - 97 % bumbac, 3 % viscoza, culoarea 12 – 85 % bumbac şi 15 % vâscoză), finisaj cu silicon. Croială tubulară, tivul gulerului este confecționat din material raiat 1:1, este aplicată o bandă de întărire de la umăr la umăr."
    },
    {
        "id": "polo_pique",
        "name": "Tricou Polo Pique Barbati",
        "colors": ["Alb", "Negru", "Albastru Marin", "Albastru Regal", "Rosu", "Portocaliu", "Galben", "Verde Mediu", "Gri Metalic"],
        "sizes": ["S", "M", "L", "XL", "XXL", "XXXL"],
        "images": {
            "Alb": "https://shop.printcenter.ro/cdn/shop/files/tricou-polo-pique-personalizat-tshirt-textiledivision-alb-s-607943_800x.jpg",
            "Negru": "https://shop.printcenter.ro/cdn/shop/files/tricou-polo-pique-personalizat-tshirt-textiledivision-negru-s-666567_800x.jpg",
            "Albastru Marin": "https://shop.printcenter.ro/cdn/shop/files/tricou-polo-pique-personalizat-tshirt-textiledivision-albastru-marin-s-467019_800x.jpg",
            "Albastru Regal": "https://shop.printcenter.ro/cdn/shop/files/tricou-polo-pique-personalizat-tshirt-textiledivision-albastru-regal-s-740687_800x.jpg",
            "Rosu": "https://shop.printcenter.ro/cdn/shop/files/tricou-polo-pique-personalizat-tshirt-textiledivision-rosu-s-212154_800x.jpg",
            "Portocaliu": "https://shop.printcenter.ro/cdn/shop/files/tricou-polo-pique-personalizat-tshirt-textiledivision-portocaliu-s-720311_800x.jpg",
            "Galben": "https://shop.printcenter.ro/cdn/shop/files/tricou-polo-pique-personalizat-tshirt-textiledivision-galben-s-470957_800x.jpg",
            "Verde Mediu": "https://shop.printcenter.ro/cdn/shop/files/tricou-polo-pique-personalizat-tshirt-textiledivision-verde-mediu-s-519219_800x.jpg",
            "Gri Metalic": "https://shop.printcenter.ro/cdn/shop/files/tricou-polo-pique-personalizat-tshirt-textiledivision-gri-metalic-s-605041_800x.jpg"
        },
        "description": "Pique, 65 % bumbac, 35 % poliester (compoziţia culorii poate să fie diferită: culoarea 03 - 97 % bumbac, 3 % viscoza, culoarea 12 – 85 % bumbac şi 15 % vâscoză). Prezintă cusături laterale, gulerul și manșetele sunt din material raiat 1:1, cu două dungi decorative în relief, fentă cu trei nasturi de culoarea materialului de bază, interiorul gulerului prezintă o bandă confecţionată din acelaşi material precum cel de bază, la nivelul umerilor sunt prezente cusături de întărire."
    },
    {
        "id": "polo_pique_femei",
        "name": "Tricou Polo Pique Femei",
        "colors": ["Alb", "Negru", "Albastru Marin", "Albastru Regal", "Rosu", "Portocaliu", "Galben", "Verde Sticla", "Gri Inchis"],
        "sizes": ["XS", "S", "M", "L", "XL", "XXL"],
        "images": {
            "Alb": "https://shop.printcenter.ro/cdn/shop/files/tricou-polo-pique-femei-personalizat-tshirt-textiledivision-alb-xs-281843_800x.jpg",
            "Negru": "https://shop.printcenter.ro/cdn/shop/files/tricou-polo-pique-femei-personalizat-tshirt-textiledivision-negru-xs-441234_800x.jpg",
            "Albastru Marin": "https://shop.printcenter.ro/cdn/shop/files/tricou-polo-pique-femei-personalizat-tshirt-textiledivision-albastru-marin-xs-267016_800x.jpg",
            "Albastru Regal": "https://shop.printcenter.ro/cdn/shop/files/tricou-polo-pique-femei-personalizat-tshirt-textiledivision-albastru-regal-xs-537011_800x.jpg",
            "Rosu": "https://shop.printcenter.ro/cdn/shop/files/tricou-polo-pique-femei-personalizat-tshirt-textiledivision-rosu-xs-496056_800x.jpg",
            "Portocaliu": "https://shop.printcenter.ro/cdn/shop/files/tricou-polo-pique-femei-personalizat-tshirt-textiledivision-portocaliu-xs-717297_800x.jpg",
            "Galben": "https://shop.printcenter.ro/cdn/shop/files/tricou-polo-pique-femei-personalizat-tshirt-textiledivision-galben-xs-392904_800x.jpg",
            "Verde Sticla": "https://shop.printcenter.ro/cdn/shop/files/tricou-polo-pique-femei-personalizat-tshirt-textiledivision-verde-sticla-xs-112872_800x.jpg",
            "Gri Inchis": "https://shop.printcenter.ro/cdn/shop/files/tricou-polo-pique-femei-personalizat-tshirt-textiledivision-gri-inchis-xs-428587_800x.jpg"
        },
        "description": "Pique, 65 % bumbac, 35 % poliester (compoziţia culorii poate să fie diferită: culoarea 03 - 97 % bumbac, 3 % viscoza, culoarea 12 – 85 % bumbac şi 15 % vâscoză). Model cambrat ce prezintă cusături laterale, gulerul și manșetele sunt din material raiat 1:1, cu două dungi decorative în relief, fentă îngustă cu cinci nasturi de culoarea materialului de bază, interiorul gulerului prezintă o bandă confecţionată din acelaşi material precum cel de bază, la nivelul umerilor sunt prezente cusături de întărire."
    },
    {
        "id": "v_neck_barbati",
        "name": "Tricou V-Neck Barbati",
        "colors": ["Alb", "Negru", "Albastru Marin", "Albastru Regal", "Rosu", "Gri Inchis", "Verde Mediu", "Galben"],
        "sizes": ["S", "M", "L", "XL", "XXL", "XXXL"],
        "images": {
            "Alb": "https://shop.printcenter.ro/cdn/shop/files/tricou-clasic-personalizat-tshirt-textiledivision-alb-xs-119972_800x.webp",
            "Negru": "https://shop.printcenter.ro/cdn/shop/files/tricou-clasic-personalizat-tshirt-textiledivision-negru-xs-247203_800x.webp",
            "Albastru Marin": "https://shop.printcenter.ro/cdn/shop/files/tricou-clasic-personalizat-tshirt-textiledivision-albastru-marin-xs-562991_800x.webp",
            "Albastru Regal": "https://shop.printcenter.ro/cdn/shop/files/tricou-clasic-personalizat-tshirt-textiledivision-albastru-regal-xs-324998_800x.webp",
            "Rosu": "https://shop.printcenter.ro/cdn/shop/files/tricou-clasic-personalizat-tshirt-textiledivision-rosu-xs-995395_800x.webp",
            "Gri Inchis": "https://shop.printcenter.ro/cdn/shop/files/tricou-clasic-personalizat-tshirt-textiledivision-gri-inchis-xs-511062_800x.webp",
            "Verde Mediu": "https://shop.printcenter.ro/cdn/shop/files/tricou-clasic-personalizat-tshirt-textiledivision-verde-sticla-xs-983798_800x.webp",
            "Galben": "https://shop.printcenter.ro/cdn/shop/files/tricou-clasic-personalizat-tshirt-textiledivision-galben-xs-784459_800x.webp"
        },
        "description": "Single Jersey, 100 % bumbac (compoziţia culorii 12 poate să fie diferită – 85 % bumbac şi 15 % vâscoză), finisaj cu silicon. Croială slim fit ce prezintă cusături laterale, guler în formă de V cu decolteu adânc, tivul îngust al gulerului este confecționat din material raiat 1:1, cu adaos de 5 % elastan, interiorul gulerului prezintă bandă de întărire din același material de bază, la nivelul umerilor este aplicată o cusătură de întărire, finisaj cu silicon."
    },
    {
        "id": "v_neck_femei",
        "name": "Tricou V-Neck Femei",
        "colors": ["Alb", "Negru", "Albastru Marin", "Albastru Regal", "Rosu", "Gri Inchis", "Turcoaz", "Verde Mediu", "Galben"],
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "images": {
            "Alb": "https://shop.printcenter.ro/cdn/shop/files/tricou-v-neck-femei-personalizat-tshirt-textiledivision-alb-s-786621_800x.jpg",
            "Negru": "https://shop.printcenter.ro/cdn/shop/files/tricou-v-neck-femei-personalizat-tshirt-textiledivision-negru-s-222401_800x.jpg",
            "Albastru Marin": "https://shop.printcenter.ro/cdn/shop/files/tricou-v-neck-femei-personalizat-tshirt-textiledivision-albastru-marin-s-114507_800x.jpg",
            "Albastru Regal": "https://shop.printcenter.ro/cdn/shop/files/tricou-v-neck-femei-personalizat-tshirt-textiledivision-albastru-regal-s-711816_800x.jpg",
            "Rosu": "https://shop.printcenter.ro/cdn/shop/files/tricou-v-neck-femei-personalizat-tshirt-textiledivision-rosu-s-711452_800x.jpg",
            "Gri Inchis": "https://shop.printcenter.ro/cdn/shop/files/tricou-v-neck-femei-personalizat-tshirt-textiledivision-gri-inchis-s-338888_800x.jpg",
            "Turcoaz": "https://shop.printcenter.ro/cdn/shop/files/tricou-v-neck-femei-personalizat-tshirt-textiledivision-turcoaz-s-986445_800x.jpg",
            "Verde Mediu": "https://shop.printcenter.ro/cdn/shop/files/tricou-v-neck-femei-personalizat-tshirt-textiledivision-verde-mediu-s-933477_800x.jpg",
            "Galben": "https://shop.printcenter.ro/cdn/shop/files/tricou-v-neck-femei-personalizat-tshirt-textiledivision-galben-s-809368_800x.jpg"
        },
        "description": "Single Jersey, 100 % bumbac (compoziţia culorii 12 poate să fie diferită – 85 % bumbac şi 15 % vâscoză), finisaj cu silicon. Croială cambrată ce prezintă cusături laterale, guler în formă de V cu decolteu adânc, tivul gulerului este din același material de bază, cu 5% adaos de elastan, interiorul gulerului prezintă bandă de întărire din același material de bază, la nivelul umerilor este aplicată o cusătură de întărire, mâneci mai scurte, finisaj cu silicon."
    },
    {
        "id": "basic_copii",
        "name": "Tricou Basic Copii",
        "colors": ["Alb", "Negru", "Albastru Marin", "Albastru Regal", "Rosu", "Portocaliu", "Galben", "Gri Inchis", "Verde Sticla"],
        "sizes": ["110 cm", "122 cm", "134 cm", "146 cm", "158 cm"],
        "images": {
            "Alb": "https://shop.printcenter.ro/cdn/shop/files/copy-of-tricou-basic-copii-personalizat-tshirt-textiledivision-alb-110-cm4-ani-223120_800x.jpg",
            "Negru": "https://shop.printcenter.ro/cdn/shop/files/copy-of-tricou-basic-copii-personalizat-tshirt-textiledivision-negnu-110-cm4-ani-917506_800x.jpg",
            "Albastru Marin": "https://shop.printcenter.ro/cdn/shop/files/copy-of-tricou-basic-copii-personalizat-tshirt-textiledivision-albastru-marin-110-cm4-ani-264906_800x.jpg",
            "Albastru Regal": "https://shop.printcenter.ro/cdn/shop/files/copy-of-tricou-basic-copii-personalizat-tshirt-textiledivision-albastru-regal-110-cm4-ani-825703_800x.jpg",
            "Rosu": "https://shop.printcenter.ro/cdn/shop/files/copy-of-tricou-basic-copii-personalizat-tshirt-textiledivision-rosu-110-cm4-ani-429646_800x.jpg",
            "Portocaliu": "https://shop.printcenter.ro/cdn/shop/files/copy-of-tricou-basic-copii-personalizat-tshirt-textiledivision-portocaliu-110-cm4-ani-353917_800x.jpg",
            "Galben": "https://shop.printcenter.ro/cdn/shop/files/copy-of-tricou-basic-copii-personalizat-tshirt-textiledivision-galben-110-cm4-ani-503832_800x.jpg",
            "Gri Inchis": "https://shop.printcenter.ro/cdn/shop/files/copy-of-tricou-basic-copii-personalizat-tshirt-textiledivision-gri-inchis-110-cm4-ani-105931_800x.jpg",
            "Verde Sticla": "https://shop.printcenter.ro/cdn/shop/files/copy-of-tricou-basic-copii-personalizat-tshirt-textiledivision-verde-sticla-110-cm4-ani-275102_800x.jpg"
        },
        "description": "Single Jersey, 100 % bumbac, (compoziţia culorii poate să fie diferită - culoarea 12 – 85 % bumbac şi 15 % vâscoză), finisaj cu silicon. Fără etichetă - pregătit de rebranding, cusături laterale, tivul îngust al gulerului este confecționat din material raiat 1:1, cu adaos de 5 % elastan, etichetă pentru mărime, de dimensiuni mici, în partea posterioară a gulerului, interiorul gulerului prezintă bandă de întărire din același material de bază, la nivelul umerilor este aplicată o cusătură de întărire, finisaj cu silicon."
    },
    {
        "id": "polo_pique_copii",
        "name": "Tricou Polo Pique Copii",
        "colors": ["Alb", "Negru", "Albastru Marin", "Albastru Regal", "Rosu", "Turcoaz", "Galben", "Verde Mar", "Gri Inchis"],
        "sizes": ["110 cm", "122 cm", "134 cm", "146 cm", "158 cm"],
        "images": {
            "Alb": "https://shop.printcenter.ro/cdn/shop/files/tricou-polo-pique-copii-personalizat-tshirt-textiledivision-alb-110-cm4-ani-371478_800x.jpg",
            "Negru": "https://shop.printcenter.ro/cdn/shop/files/tricou-polo-pique-copii-personalizat-tshirt-textiledivision-negru-110-cm4-ani-951762_800x.jpg",
            "Albastru Marin": "https://shop.printcenter.ro/cdn/shop/files/tricou-polo-pique-copii-personalizat-tshirt-textiledivision-albastru-marin-110-cm4-ani-899167_800x.jpg",
            "Albastru Regal": "https://shop.printcenter.ro/cdn/shop/files/tricou-polo-pique-copii-personalizat-tshirt-textiledivision-albastru-regal-110-cm4-ani-555774_800x.jpg",
            "Rosu": "https://shop.printcenter.ro/cdn/shop/files/tricou-polo-pique-copii-personalizat-tshirt-textiledivision-rosu-110-cm4-ani-728688_800x.jpg",
            "Turcoaz": "https://shop.printcenter.ro/cdn/shop/files/tricou-polo-pique-copii-personalizat-tshirt-textiledivision-turcoaz-110-cm4-ani-119428_800x.jpg",
            "Galben": "https://shop.printcenter.ro/cdn/shop/files/tricou-polo-pique-copii-personalizat-tshirt-textiledivision-galben-110-cm4-ani-441728_800x.jpg",
            "Verde Mar": "https://shop.printcenter.ro/cdn/shop/files/tricou-polo-pique-copii-personalizat-tshirt-textiledivision-verde-mar-110-cm4-ani-616581_800x.jpg",
            "Gri Inchis": "https://shop.printcenter.ro/cdn/shop/files/tricou-polo-pique-copii-personalizat-tshirt-textiledivision-gri-inchis-110-cm4-ani-701324_800x.jpg"
        },
        "description": "Pique, 65 % bumbac, 35 % poliester (compoziţia culorii 12 poate să fie diferită – 85 % bumbac şi 15 % vâscoză). Cusături laterale, gulerul și manșetele sunt din material raiat 1:1, cu două dungi decorative în relief, fentă îngustă cu trei nasturi de culoarea materialului de bază, interiorul gulerului prezintă o bandă confecţionată din acelaşi material precum cel de bază, la nivelul umerilor sunt prezente cusături de întărire."
    }
];

const HANORACE_MODELS: TextileModel[] = [
    {
        "id": "hanorac_basic",
        "name": "Hanorac Cape Barbati",
        "colors": ["Alb", "Negru", "Albastru Marin", "Albastru Regal", "Rosu", "Galben", "Turcoaz", "Gri Inchis", "Verde Sticla"],
        "sizes": ["S", "M", "L", "XL", "XXL", "XXXL"],
        "images": {
            "Alb": "https://shop.printcenter.ro/cdn/shop/files/hanorac-cape-personalizat-tshirt-textiledivision-alb-s-292392_800x.jpg",
            "Negru": "https://shop.printcenter.ro/cdn/shop/files/hanorac-cape-personalizat-tshirt-textiledivision-negru-s-352049_800x.jpg",
            "Albastru Marin": "https://shop.printcenter.ro/cdn/shop/files/hanorac-cape-personalizat-tshirt-textiledivision-albastru-marin-s-350438_800x.jpg",
            "Albastru Regal": "https://shop.printcenter.ro/cdn/shop/files/hanorac-cape-personalizat-tshirt-textiledivision-albastru-regal-s-627714_800x.jpg",
            "Rosu": "https://shop.printcenter.ro/cdn/shop/files/hanorac-cape-personalizat-tshirt-textiledivision-rosu-s-352693_800x.jpg",
            "Galben": "https://shop.printcenter.ro/cdn/shop/files/hanorac-cape-personalizat-tshirt-textiledivision-galben-s-568823_800x.jpg",
            "Turcoaz": "https://shop.printcenter.ro/cdn/shop/files/hanorac-cape-personalizat-tshirt-textiledivision-turcoaz-s-556057_800x.jpg",
            "Gri Inchis": "https://shop.printcenter.ro/cdn/shop/files/hanorac-cape-personalizat-tshirt-textiledivision-gri-inchis-s-752235_800x.jpg",
            "Verde Sticla": "https://shop.printcenter.ro/cdn/shop/files/hanorac-cape-personalizat-tshirt-textiledivision-verde-sticla-s-330497_800x.jpg"
        },
        "description": "French terry, interior pieptănat, 65 % bumbac, 35 % poliester (compoziţia culorii poate să fie diferită – 85 % bumbac şi 15 % vâscoză). Croială dreaptă ce prezintă cusături laterale, fermoar modelat pe toată lungimea, glugă căptușită, prevăzută cu șnur, interiorul gulerului prezintă bandă de întărire în culoarea materialului de bază, buzunare tip rândunică, tivul inferior și manșetele sunt din material raiat 2:2 cu 5 % elastan, interior pieptănat."
    },
    {
        "id": "hanorac_trendy_zipper",
        "name": "Hanorac Trendy Zipper Barbati",
        "colors": ["Alb", "Negru", "Albastru Marin", "Albastru Regal", "Rosu", "Verde Sticla", "Gri Inchis", "Turcoaz", "Lime"],
        "sizes": ["S", "M", "L", "XL", "XXL", "XXXL"],
        "images": {
            "Alb": "https://shop.printcenter.ro/cdn/shop/files/hanorac-trendy-zipper-personalizat-tshirt-textiledivision-alb-s-334855_800x.jpg",
            "Negru": "https://shop.printcenter.ro/cdn/shop/files/hanorac-trendy-zipper-personalizat-tshirt-textiledivision-negru-s-546619_800x.jpg",
            "Albastru Marin": "https://shop.printcenter.ro/cdn/shop/files/hanorac-trendy-zipper-personalizat-tshirt-textiledivision-albastru-marin-s-915031_800x.jpg",
            "Albastru Regal": "https://shop.printcenter.ro/cdn/shop/files/hanorac-trendy-zipper-personalizat-tshirt-textiledivision-albastru-regal-s-876188_800x.jpg",
            "Rosu": "https://shop.printcenter.ro/cdn/shop/files/hanorac-trendy-zipper-personalizat-tshirt-textiledivision-rosu-s-978571_800x.jpg",
            "Verde Sticla": "https://shop.printcenter.ro/cdn/shop/files/hanorac-trendy-zipper-personalizat-tshirt-textiledivision-verde-sticla-s-444925_800x.jpg",
            "Gri Inchis": "https://shop.printcenter.ro/cdn/shop/files/hanorac-trendy-zipper-personalizat-tshirt-textiledivision-gri-inchis-s-513097_800x.jpg",
            "Turcoaz": "https://shop.printcenter.ro/cdn/shop/files/hanorac-trendy-zipper-personalizat-tshirt-textiledivision-turcoaz-s-241866_800x.jpg",
            "Lime": "https://shop.printcenter.ro/cdn/shop/files/hanorac-trendy-zipper-personalizat-tshirt-textiledivision-lime-s-199959_800x.jpg"
        },
        "description": "French terry, interior pieptănat, 65 % bumbac, 35 % poliester (compoziţia culorii poate să fie diferită – 85 % bumbac şi 15 % vâscoză). Croială dreaptă ce prezintă cusături laterale, glugă căptușită, prevăzută cu șnur și cu bandă de întărire pe spate, gulerul format prin intersecţia părţilor glugii, buzunare tip rândunică, tivul inferior și manșetele sunt din material raiat 2:2 cu 5 % elastan, interior pieptănat."
    }
];

const SEPCI_MODELS: TextileModel[] = [
    {
        "id": "sapca_personalizata",
        "name": "Șapcă Personalizată",
        "colors": [
            "Alba",
            "Neagra",
            "Galbena",
            "Albastru regal",
            "Rosu",
            "Portocaliu",
            "Verde mediu",
            "Gri antic",
            "Turcoaz"
        ],
        "sizes": [
            "Universal"
        ],
        "images": {
            "Alba": "https://shop.printcenter.ro/cdn/shop/files/sapca-personalizata-hats-textiledivision-alba-942108_800x.jpg",
            "Neagra": "https://shop.printcenter.ro/cdn/shop/files/sapca-personalizata-hats-textiledivision-neagra-777755_800x.jpg",
            "Galbena": "https://shop.printcenter.ro/cdn/shop/files/sapca-personalizata-hats-textiledivision-galbena-476184_800x.jpg",
            "Albastru regal": "https://shop.printcenter.ro/cdn/shop/files/sapca-personalizata-hats-textiledivision-albastru-regal-859983_800x.jpg",
            "Rosu": "https://shop.printcenter.ro/cdn/shop/files/sapca-personalizata-hats-textiledivision-rosu-155315_800x.jpg",
            "Portocaliu": "https://shop.printcenter.ro/cdn/shop/files/sapca-personalizata-hats-textiledivision-portocaliu-937276_800x.jpg",
            "Verde mediu": "https://shop.printcenter.ro/cdn/shop/files/sapca-personalizata-hats-textiledivision-verde-mediu-713198_800x.jpg",
            "Gri antic": "https://shop.printcenter.ro/cdn/shop/files/sapca-personalizata-hats-textiledivision-gri-antic-841763_800x.jpg",
            "Turcoaz": "https://shop.printcenter.ro/cdn/shop/files/sapca-personalizata-hats-textiledivision-turcoaz-571541_800x.jpg"
        },
        "description": "Şapcă unisex reglabilă Twill pieptănat, 100 % bumbac model cu 5 paneluri panel frontal îmbinat cozoroc cusut, ușor curbat găuri de ventilaţie cusute bandă absorbantă a transpiraţiei mărime ajustabilă prin cataramă Etichetă: satin Personalizare: imprimare digitala color"
    }
];

/* --- SUB-COMPONENTS --- */
const AccordionStep = ({ stepNumber, title, summary, isOpen, onClick, children, isLast = false }: { stepNumber: number; title: string; summary: string; isOpen: boolean; onClick: () => void; children: React.ReactNode; isLast?: boolean; }) => (
    <div className="relative pl-12">
        <div className="absolute top-5 left-0 flex flex-col items-center h-full">
            <span className={`flex items-center justify-center w-8 h-8 rounded-full text-md font-bold transition-colors ${isOpen ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700 dark:text-gray-300'}`}>{stepNumber}</span>
            {!isLast && <div className="w-px grow bg-gray-200 mt-2"></div>}
        </div>
        <div className="flex-1">
            <button type="button" className="w-full flex items-center justify-between py-5 text-left" onClick={onClick}>
                <div>
                    <h2 className="text-lg font-bold text-gray-800">{title}</h2>
                    {!isOpen && <p className="text-sm text-gray-500 truncate">{summary}</p>}
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
            </button>
            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100 pb-5" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">{children}</div>
            </div>
        </div>
    </div>
);

const textileFaqs: QA[] = [
    { question: "Ce material folosiți?", answer: "Folosim doar articole premium de la producători renumiți, din Bumbac 100% de înaltă densitate, foarte confortabile și rezistente." },
    { question: "Cum rezistă printul la spălare?", answer: "Folosim tehnologie DTF (Direct to Film) de ultimă generație. Printul se integrează perfect în țesătură și rezistă la zeci de spălări fără a crăpa sau a-și pierde din intensitatea culorilor (recomandăm spălarea la 30 grade, pe dos)." },
    { question: "Pot imprima și pe față și pe spate?", answer: "Da! Puteți selecta poziția printului din configurator: doar pe față, doar pe spate, sau pe ambele fețe." },
    { question: "Care este comanda minimă?", answer: "Nu există comandă minimă. Realizăm comenzi începând de la 1 bucată." },
];

const TabButtonSEO = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (<button onClick={onClick} className={`flex-1 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${active ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 hover:border-gray-300'}`}>{children}</button>);

function TextileTypeSwitch() {
    const pathname = usePathname();
    const isTricouri = !!pathname && pathname.includes("/tricouri");
    const isHanorace = !!pathname && pathname.includes("/hanorace");
    const isSepci = !!pathname && pathname.includes("/sepci");

    return (
        <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1 shadow-sm">
            <Link
                href="/tricouri"
                className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all inline-flex items-center justify-center ${isTricouri ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-slate-50 dark:bg-slate-800'}`}
            >
                Tricouri
            </Link>
            <Link
                href="/hanorace"
                className={`ml-1 px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all inline-flex items-center justify-center ${isHanorace ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-slate-50 dark:bg-slate-800'}`}
            >
                Hanorace
            </Link>
            <Link
                href="/sepci"
                className={`ml-1 px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all inline-flex items-center justify-center ${isSepci ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-slate-50 dark:bg-slate-800'}`}
            >
                Șepci
            </Link>
        </div>
    );
}


function OptionButton({ active, onClick, title, subtitle }: { active: boolean; onClick: () => void; title: string; subtitle?: string; }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${active
                ? "border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600 shadow-md"
                : "border-gray-200 dark:border-slate-800 bg-white hover:border-gray-300 hover:bg-slate-50 dark:bg-slate-800"
                }`}
        >
            <div className={`font-bold transition-colors ${active ? "text-emerald-700" : "text-gray-800"}`}>{title}</div>
            {subtitle && <div className={`text-xs mt-1 transition-colors ${active ? "text-emerald-600/80" : "text-gray-500"}`}>{subtitle}</div>}
        </button>
    );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode; }) {
    return <button type="button" onClick={onClick} className={`px-4 py-2 text-sm font-semibold transition-colors rounded-t-lg ${active ? "border-b-2 border-emerald-600 text-emerald-600 bg-emerald-50" : "text-gray-500 hover:text-gray-800"}`}>{children}</button>;
}

type Props = { type: "tricouri" | "hanorace" | "sepci", productSlug: string; productImage?: string; renderOnlyConfigurator?: boolean; };

type ViewMode = 'gallery';

/* --- MAIN COMPONENT --- */
export default function TextileConfigurator({ type, productSlug, productImage, renderOnlyConfigurator = false }: Props) {
    const { addItem } = useCart();
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const AVAILABLE_MODELS = type === "tricouri" ? TRICOURI_MODELS : (type === "hanorace" ? HANORACE_MODELS : SEPCI_MODELS);

    const [input, setInput] = useState<PriceInputTextile>(() => {
        const pQ = searchParams.get("q");

        const initialModel = AVAILABLE_MODELS[0];

        return {
            type: type,
            model: initialModel.id,
            quantity: pQ ? parseInt(pQ) : 1,
            size: initialModel.sizes[1] || initialModel.sizes[0], // ex: default to M if it exists, otherwise first
            color: initialModel.colors[1] || initialModel.colors[0], // try to default to Negru/something, otherwise first
            printPosition: "fata",
            designOption: "upload"
        };
    });

    // Când schimbăm tipul (dacă devine relevant din afara prop-urilor, deși e static aici), sau modelul
    const selectedModelConfig = useMemo(() => AVAILABLE_MODELS.find(m => m.id === input.model) || AVAILABLE_MODELS[0], [AVAILABLE_MODELS, input.model]);

    const galleryImages = useMemo(() => {
        let currentImgUrl = selectedModelConfig?.images?.[input.color];
        if (!currentImgUrl) {
            currentImgUrl = type === "tricouri" ? "/products/banner/banner-1.webp" : "/products/banner/banner-1.webp";
        }
        return productImage ? [productImage, currentImgUrl] : [currentImgUrl];
    }, [productImage, type, selectedModelConfig, input.color]);

    const [viewMode, setViewMode] = useState<ViewMode>('gallery');

    const [activeImage, setActiveImage] = useState<string>(galleryImages[0]);

    useEffect(() => {
        if (!productImage && galleryImages[0]) {
            setActiveImage(galleryImages[0]);
        }
    }, [galleryImages, productImage]);
    const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const [textDesign, setTextDesign] = useState<string>("");
    const [activeStep, setActiveStep] = useState(1);
    const [activeProductTab, setActiveProductTab] = useState("descriere");
    const [detailsOpen, setDetailsOpen] = useState(false);
    const toast = useToast();

    const [userEmail, setUserEmail] = useState<string>("");

    const priceData = useMemo(() => calculateTextilePrice(input), [input]);
    const displayedTotal = priceData.finalPrice;

    const cartData = useMemo(() => ({
        configuratorId: type,
        email: userEmail,
        configuration: { ...input, artworkUrl, textDesign },
        price: displayedTotal,
        quantity: input.quantity
    }), [userEmail, input, artworkUrl, textDesign, displayedTotal, type]);

    useUserActivityTracking(cartData);

    const updateInput = <K extends keyof PriceInputTextile>(k: K, v: PriceInputTextile[K]) => setInput((p) => ({ ...p, [k]: v }));

    // Auto-update size/color if they don't exist in the current model
    useEffect(() => {
        let sizeValid = selectedModelConfig.sizes.includes(input.size);
        let colorValid = selectedModelConfig.colors.includes(input.color);

        if (!sizeValid || !colorValid) {
            setInput(prev => ({
                ...prev,
                size: sizeValid ? prev.size : selectedModelConfig.sizes[0],
                color: colorValid ? prev.color : selectedModelConfig.colors[0]
            }));
        }
    }, [selectedModelConfig, input.size, input.color]);


    const setQty = (v: number) => updateInput("quantity", Math.max(1, Math.floor(v)));

    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams();
            if (input.quantity > 1) params.set("q", input.quantity.toString());
            const current = new URLSearchParams(window.location.search);
            if (current.has('image')) params.set('image', current.get('image')!);
            if (current.has('title')) params.set('title', current.get('title')!);

            router.replace(`${pathname}?${params.toString()} `, { scroll: false });
        }, 500);

        return () => clearTimeout(timer);
    }, [input, pathname, router]);

    useEffect(() => {
        if (productImage) {
            setActiveImage(productImage);
            setArtworkUrl(productImage);
            setInput(prev => ({ ...prev, designOption: 'upload' }));
        }
    }, [productImage]);

    const handleArtworkFileInput = async (file: File | null) => {
        setArtworkUrl(null);
        setUploadError(null);

        if (!file) return;
        try {
            const previewUrl = URL.createObjectURL(file);
            setArtworkUrl(previewUrl);
            setViewMode('gallery');
            setUploading(true);
            const form = new FormData();
            form.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: form });
            if (!res.ok) throw new Error("Upload eșuat");
            const data = await res.json();
            setArtworkUrl(data.url);
        } catch (e: any) {
            setUploadError(e?.message ?? "Eroare la upload");
        } finally {
            setUploading(false);
        }
    };

    function handleAddToCart() {
        if (displayedTotal <= 0) {
            toast?.warning("Prețul trebuie calculat înainte de a adăuga în coș.");
            return;
        }
        const unitPrice = roundMoney(displayedTotal / input.quantity);
        const uniqueId = `${productSlug} -${Date.now()} -${Math.random().toString(36).slice(2, 9)} `;
        const typeLabel = selectedModelConfig.name;
        const title = `${typeLabel} - Mărimea ${input.size}, ${input.color} `;

        addItem({
            id: uniqueId,
            productId: productSlug,
            slug: productSlug,
            title,
            price: unitPrice,
            quantity: input.quantity,
            currency: "RON",
            metadata: {
                productType: type,
                "Model": selectedModelConfig.name,
                "Culoare": input.color,
                "Mărime": input.size,
                "Așezare Print": input.printPosition === "fata" ? "Doar Față" : input.printPosition === "spate" ? "Doar Spate" : "Față și Spate",
                "Grafică": input.designOption === 'pro' ? 'Vreau grafică' : input.designOption === 'text_only' ? 'Doar text' : 'Grafică proprie',
                designOption: input.designOption,
                ...(input.designOption === 'pro' && { "Cost grafică": formatMoneyDisplay(TEXTILE_CONSTANTS.PRO_DESIGN_FEE) }),
                artworkUrl,
                textDesign: input.designOption === 'text_only' ? textDesign : undefined,
            },
        });
    }

    const summaryStep1 = `Model: ${selectedModelConfig.name}, Mărime: ${input.size}, Culoare: ${input.color}, ${input.quantity} buc.`;
    const summaryStep2 = input.printPosition === "fata" ? "Doar Față" : input.printPosition === "spate" ? "Doar Spate" : "Față și Spate";
    const summaryStep3 = input.designOption === 'upload' ? 'Grafică proprie' : input.designOption === 'text_only' ? 'Doar text' : 'Design Pro';

    return (
        <main className={renderOnlyConfigurator ? "" : "bg-slate-50 dark:bg-slate-800 min-h-screen"}>
            <div className="container mx-auto px-4 py-6 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                    {/* STÂNGA - ZONA VIZUALĂ */}
                    <div className="lg:sticky top-24 h-max space-y-6 lg:space-y-8">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-800 overflow-hidden">
                            {/* TABS VIEW MODE */}
                            <div className="flex border-b border-gray-100 overflow-x-auto">
                                <button
                                    onClick={() => setViewMode('gallery')}
                                    className={`flex-1 py-3 min-w-20 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${viewMode === 'gallery' ? 'text-emerald-600 bg-emerald-50 border-b-2 border-emerald-600' : 'text-gray-500 hover:bg-slate-50 dark:bg-slate-800'}`}
                                >
                                    <ImageIcon size={16} />
                                    <span>Galerie</span>
                                </button>
                                <button
                                    onClick={() => setViewMode('gallery')} // Placeholder for now or add sketch if needed
                                    className={`flex-1 py-3 min-w-20 text-sm font-medium flex items-center justify-center gap-2 transition-colors text-gray-400 cursor-not-allowed`}
                                    disabled
                                >
                                    <Ruler size={16} />
                                    <span>Schiță</span>
                                </button>
                            </div>

                            <div className="aspect-square relative bg-white flex items-center justify-center p-8">
                                {productImage ? (
                                    <Image 
                                        src={productImage} 
                                        alt="Model" 
                                        fill
                                        className="object-contain animate-in fade-in duration-300" 
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        priority
                                    />
                                ) : (
                                    <Image 
                                        src={activeImage} 
                                        alt="Model" 
                                        fill
                                        className="object-contain animate-in fade-in duration-300" 
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        priority
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* DREAPTA - CONFIGURATOR */}
                    <div>
                        <header className="mb-4 sm:mb-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-3">
                                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white">
                                    Configurator {type === "tricouri" ? "Tricouri" : (type === "hanorace" ? "Hanorace" : "Șepci")}
                                </h2>
                                <TextileTypeSwitch />
                            </div>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Personalizează opțiunile în 3 pași simpli.</p>
                                <button type="button" onClick={() => setDetailsOpen(true)} className="inline-flex items-center text-sm px-3 py-2 border border-gray-300 rounded-lg hover:bg-slate-50 dark:bg-slate-800 transition-colors">
                                    <Info size={16} />
                                    <span className="ml-2 font-semibold">Detalii</span>
                                </button>
                            </div>
                        </header>

                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-slate-800 px-3 sm:px-4">
                            <AccordionStep stepNumber={1} title="Model, Culoare, Mărime & Cantitate" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                                <div className="space-y-5">

                                    <div>
                                        <label className="field-label text-sm sm:text-base mb-2">Alege Modelul</label>
                                        <select
                                            value={input.model}
                                            onChange={(e) => updateInput("model", e.target.value)}
                                            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm text-lg font-medium bg-white"
                                        >
                                            {AVAILABLE_MODELS.map(model => (
                                                <option key={model.id} value={model.id}>{model.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="field-label text-sm sm:text-base mb-2">Culoare</label>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedModelConfig.colors.map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => updateInput("color", color)}
                                                    className={`px-3 py-2 text-sm font-semibold rounded-lg border-2 transition-all ${input.color === color ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-gray-200 dark:border-slate-800 bg-white hover:border-gray-400 text-gray-700 dark:text-gray-300'}`}
                                                >
                                                    {color}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="field-label text-sm sm:text-base mb-2">Mărime</label>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedModelConfig.sizes.map(size => (
                                                <button
                                                    key={size}
                                                    onClick={() => updateInput("size", size)}
                                                    className={`px-3 py-2 text-sm font-semibold rounded-lg border-2 transition-all ${input.size === size ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-gray-200 dark:border-slate-800 bg-white hover:border-gray-400 text-gray-700 dark:text-gray-300'}`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-gray-100">
                                        <NumberInput label="Cantitate Diferită?" value={input.quantity} onChange={setQty} />
                                    </div>
                                </div>
                            </AccordionStep>

                            {type !== "sepci" && (
                                <AccordionStep stepNumber={2} title="Poziționare Print" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)}>
                                    <label className="field-label mb-2 text-sm sm:text-base">Alege unde imprimăm grafica</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                        <OptionButton active={input.printPosition === "fata"} onClick={() => updateInput("printPosition", "fata")} title="Doar Față" subtitle="Inclus în preț" />
                                        <OptionButton active={input.printPosition === "spate"} onClick={() => updateInput("printPosition", "spate")} title="Doar Spate" subtitle="Inclus în preț" />
                                        <div className="col-span-1 sm:col-span-2">
                                            <OptionButton active={input.printPosition === "fata_si_spate"} onClick={() => updateInput("printPosition", "fata_si_spate")} title="Față + Spate" subtitle={`+${input.model?.startsWith('polo_pique') ? TEXTILE_CONSTANTS.PRICES.polo.fata_si_spate : TEXTILE_CONSTANTS.PRICES[type].fata_si_spate} lei`} />
                                        </div>
                                    </div>
                                </AccordionStep>
                            )}

                            <AccordionStep stepNumber={type === "sepci" ? 2 : 3} title="Grafică" summary={summaryStep3} isOpen={activeStep === 3} onClick={() => setActiveStep(3)} isLast={true}>
                                <div>
                                    <div className="flex flex-col gap-4 mb-6">
                                        <Link 
                                            href={`/editor?w=30&h=40&product=${type}`}
                                            className="w-full py-4 px-6 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-extrabold text-sm uppercase tracking-widest transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-3 active:scale-[0.98] group"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
                                                <PencilRuler className="w-5 h-5" />
                                            </div>
                                            Vreau să creez grafică (Editor Online)
                                        </Link>
                                        
                                        <div className="flex items-center gap-4 px-2">
                                            <div className="h-px bg-slate-200 grow"></div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">sau personalizează aici</span>
                                            <div className="h-px bg-slate-200 grow"></div>
                                        </div>
                                    </div>

                                    <div className="mb-4 border-b border-gray-200 dark:border-slate-800">
                                        <div className="flex -mb-px overflow-x-auto no-scrollbar">
                                            <TabButton active={input.designOption === 'upload'} onClick={() => updateInput("designOption", 'upload')}>Încarcă Grafică</TabButton>
                                            <TabButton active={input.designOption === 'text_only'} onClick={() => updateInput("designOption", 'text_only')}>Doar Text</TabButton>
                                            <TabButton active={input.designOption === 'pro'} onClick={() => updateInput("designOption", 'pro')}>Vreau Grafică</TabButton>
                                        </div>
                                    </div>

                                    {input.designOption === 'upload' && (
                                        <div className="space-y-3">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Încarcă logo-ul tău, grafica dorită (preferabil PNG transparent, PDF, AI, PSD).</p>
                                            <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none active:bg-slate-50 dark:bg-slate-800">
                                                <span className="flex items-center space-x-2">
                                                    <UploadCloud className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                                                    <span className="font-medium text-gray-600 dark:text-gray-400">Apasă pentru a încărca</span>
                                                </span>
                                                <input type="file" name="file_upload" className="hidden" onChange={e => handleArtworkFileInput(e.target.files?.[0] ?? null)} />
                                            </label>
                                            {uploading && <p className="text-sm text-emerald-600">Se încarcă...</p>}
                                            {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
                                            {artworkUrl && !uploadError && <p className="text-sm text-green-600 font-semibold">Grafică încărcată cu succes!</p>}
                                        </div>
                                    )}

                                    {input.designOption === 'text_only' && (
                                        <div className="space-y-3">
                                            <label className="field-label text-sm sm:text-base">Introdu textele dorite pe print</label>
                                            <textarea className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm text-base min-h-24" rows={3} value={textDesign} onChange={e => setTextDesign(e.target.value)} placeholder="ex: FAȚĂ: Logo mic stânga piept | SPATE: STAFF"></textarea>
                                        </div>
                                    )}

                                    {input.designOption === 'pro' && (
                                        <div className="p-3 sm:p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-800">
                                            <p className="font-semibold">Serviciu de Grafică Profesională</p>
                                            <p>Vom crea noi design-ul! Vei primi o simulare pe email. Cost: <strong>{formatMoneyDisplay(TEXTILE_CONSTANTS.PRO_DESIGN_FEE)}</strong>.</p>
                                        </div>
                                    )}
                                </div>
                            </AccordionStep>
                        </div>

                        <div className="relative bg-white border lg:rounded-2xl lg:shadow-lg border-gray-200 dark:border-slate-800 p-3 sm:p-4 lg:p-6 mt-8">
                            <div className="flex flex-col gap-3">
                                <button onClick={handleAddToCart} className="w-full py-4 text-lg font-bold bg-emerald-600 text-white rounded-xl shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 active:scale-95">
                                    <ShoppingCart size={24} />
                                    Adaugă în Coș
                                </button>
                                <div className="flex flex-row justify-between items-center w-full gap-2 pt-1 mt-1 border-t border-gray-100">
                                    <div className="flex flex-col items-start leading-none">
                                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Preț Total</span>
                                        <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{formatMoneyDisplay(displayedTotal)}</span>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <DeliveryEstimation />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* BUTOANE SECUNDARE - WHATSAPP ȘI CERERE OFERTĂ */}
                        <div className="mt-4 lg:mt-6 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 text-center font-medium">Ai nevoie de cantități mari sau broderie?</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <a
                                    href="https://wa.me/40750473111?text=Ma%20intereseaza%20configuratorul%20textile"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                                >
                                    <MessageCircle size={18} />
                                    <span className="text-sm">WhatsApp</span>
                                </a>
                                <button
                                    type="button"
                                    onClick={() => window.location.href = '/contact'}
                                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                                >
                                    <Info size={18} />
                                    <span className="text-sm">Cerere Ofertă</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECȚIUNE DESCRIERE & FEATURES */}
                <div className="mt-8 lg:mt-12 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-800">
                    <nav className="border-b border-gray-200 dark:border-slate-800 flex">
                        <TabButtonSEO active={activeProductTab === "descriere"} onClick={() => setActiveProductTab("descriere")}>Descriere Tehnică</TabButtonSEO>
                        <TabButtonSEO active={activeProductTab === "recenzii"} onClick={() => setActiveProductTab("recenzii")}>Recenzii</TabButtonSEO>
                        <TabButtonSEO active={activeProductTab === "faq"} onClick={() => setActiveProductTab("faq")}>FAQ</TabButtonSEO>
                    </nav>

                    <div className="p-6 lg:p-8">
                        {activeProductTab === 'descriere' && (
                            <>
                                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                                    {type === "tricouri" ? "Tricouri Bumbac Premium" : (type === "hanorace" ? "Hanorace Premium Groase" : "Șepci Premium Personalizate")} cu Print DTF
                                </h2>
                                <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed text-base lg:text-lg">
                                    Folosim tehnologie de ultimă generație pentru a livra articole vestimentare care nu doar arată spectaculos, dar rezistă testului timpului. Indiferent că ești un brand la început de drum sau o companie care caută uniforme premium, soluțiile noastre de personalizare sunt etalonul de calitate în industrie.
                                </p>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">01</span>
                                            Materiale Selectate
                                        </h3>
                                        <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                                            <li className="flex items-start">
                                                <span className="text-emerald-600 font-bold mr-2 mt-1">•</span>
                                                <span><strong>Bumbac 100% Organinc:</strong> Majoritatea modelelor noastre folosesc bumbac pieptănat de 160-190g/mp, oferind un echilibru perfect între densitate și respirabilitate.</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-emerald-600 font-bold mr-2 mt-1">•</span>
                                                <span><strong>Finisaj cu Silicon:</strong> Tratament special care oferă materialului o textură mătăsoasă la atingere și previne formarea scamelor.</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-emerald-600 font-bold mr-2 mt-1">•</span>
                                                <span><strong>Certificare OEKO-TEX:</strong> Garantăm că materialele și vopselurile folosite sunt sigure pentru piele și prietenoase cu mediul.</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">02</span>
                                            Print DTF de Înaltă Definiție
                                        </h3>
                                        <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                                            <li className="flex items-start">
                                                <span className="text-emerald-600 font-bold mr-2 mt-1">✓</span>
                                                <span><strong>Detalii Fine:</strong> Tehnologia Direct to Film permite reproducerea celor mai mici detalii și gradiente fine, imposibile prin serigrafie clasică.</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-emerald-600 font-bold mr-2 mt-1">✓</span>
                                                <span><strong>Elasticitate Maximă:</strong> Stratul de print este incredibil de subțire și flexibil, întinzându-se odată cu materialul fără să se crape.</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-emerald-600 font-bold mr-2 mt-1">✓</span>
                                                <span><strong>Culori Vibrante:</strong> Folosim cerneluri premium care oferă o saturație excelentă și un alb opac perfect pe textile închise la culoare.</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-10 border-b border-gray-200 dark:border-slate-800">
                                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-emerald-100">
                                        <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Soft Touch</h3>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Senzație plăcută la atingere, fără aspect "plasticos".</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-emerald-100">
                                        <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Ultra Rezistent</h3>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Garantat peste 50 de spălări fără degradare.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-emerald-100">
                                        <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Rapiditate</h3>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Personalizare și expediere în 24-48 ore.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-emerald-100">
                                        <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.040L3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622l-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Îngrijire Ușoară</h3>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Spălare la 30°C pe dos, călcat tot pe dos.</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                        {activeProductTab === 'recenzii' && <Reviews productSlug={productSlug} />}
                        {activeProductTab === 'faq' && <FaqAccordion qa={textileFaqs} />}
                    </div>
                </div>
            </div>

            {/* MODAL DETALII (Match Banner style) */}
            {detailsOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="sticky top-0 bg-white/80 backdrop-blur-md p-6 border-b flex justify-between items-center z-10">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Detalii Produs</h2>
                            <button onClick={() => setDetailsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
                        </div>
                        <div className="p-6 sm:p-8 space-y-6">
                            <section>
                                <h3 className="text-lg font-bold text-emerald-600 mb-3 flex items-center gap-2">
                                    <Info size={20} />
                                    Descriere Model
                                </h3>
                                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-gray-700 dark:text-gray-300 leading-relaxed border border-gray-100">
                                    <p className="font-bold text-slate-900 dark:text-white mb-2">{selectedModelConfig.name}</p>
                                    <p className="text-sm">{selectedModelConfig.description}</p>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold text-emerald-600 mb-4 flex items-center gap-2">
                                    <PlayCircle size={20} />
                                    Tehnologie de Imprimare
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 border border-gray-200 dark:border-slate-800 rounded-2xl hover:border-emerald-200 transition-colors">
                                        <p className="font-bold text-slate-900 dark:text-white mb-1">DTF Premium</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Imprimare direct pe film, transferată termic în profunzimea fibrei.</p>
                                    </div>
                                    <div className="p-4 border border-gray-200 dark:border-slate-800 rounded-2xl hover:border-emerald-200 transition-colors">
                                        <p className="font-bold text-slate-900 dark:text-white mb-1">Rezistență 5/5</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Rezistă la zeci de spălări fără a se crăpa sau decolora.</p>
                                    </div>
                                </div>
                            </section>

                            <div className="bg-emerald-600 text-white p-6 rounded-3xl shadow-xl shadow-emerald-200 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                                    <MessageCircle size={24} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-lg leading-tight uppercase tracking-wide">Comandă Specială?</p>
                                    <p className="text-emerald-50 text-xs">Ai nevoie de peste 50 bucăți sau broderie? Contactează-ne!</p>
                                </div>
                                <button
                                    onClick={() => window.location.href = `https://wa.me/40750473111?text=Buna ziua, ma intereseaza o oferta pentru ${selectedModelConfig.name}`}
                                    className="bg-white text-emerald-600 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-colors shadow-sm active:scale-95"
                                >
                                    Cere Ofertă
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* NAVIGARE RAPIDĂ */}
            <div className="container mx-auto px-4 mt-20">
                <QuickNav title="Vrei să personalizezi alt produs?" />
            </div>

            {/* Produse Similare */}
            <div className="mt-16">
                <RelatedProducts category={type === "tricouri" ? "tricouri" : (type === "hanorace" ? "hanorace" : "sepci")} />
            </div>
        </main>
    );
}

