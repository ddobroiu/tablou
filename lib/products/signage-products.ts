
export interface SignageProduct {
    id: string;
    slug: string;
    title: string;
    description: string;
    image: string;
    price: number;
    category: string;
    dimensions: string;
    variants?: {
        name: string;
        price: number;
    }[];
    tags: string[];
}

import { printCenterProducts } from "./signage-products-printcenter";

const dedemanProducts: SignageProduct[] = [
    {
        "id": "7049349",
        "slug": "semn-indicator-stop-proprietate-privata-pvc-37-cm-7049349",
        "title": "Semn Indicator Stop proprietate privata, PVC, 37 cm",
        "description": "Comandă online Semn Indicator Stop proprietate privata, PVC, 37 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/7049349.jpg",
        "price": 57.52,
        "category": "Indicatoare",
        "dimensions": "Standard",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "7046210",
        "slug": "semn-indicator-supraveghere-video-pvc-30-x-20-cm-7046210",
        "title": "Semn Indicator Supraveghere video, PVC, 30 x 20 cm",
        "description": "Comandă online Semn Indicator Supraveghere video, PVC, 30 x 20 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/7046210.jpg",
        "price": 13.29,
        "category": "Indicatoare",
        "dimensions": "30x20 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "5004061",
        "slug": "semn-indicator-incepator-auto-pvc-diametru-9-6-cm-set-2-bucati-5004061",
        "title": "Semn Indicator Incepator auto, PVC, diametru 9.6 cm, set 2 bucati",
        "description": "Comandă online Semn Indicator Incepator auto, PVC, diametru 9.6 cm, set 2 bucati la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/5004061.jpg",
        "price": 12.9,
        "category": "Indicatoare",
        "dimensions": "Standard",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "7043145",
        "slug": "semn-indicator-punct-de-prim-ajutor-pvc-20-x-30-cm-7043145",
        "title": "Semn Indicator Punct de prim ajutor, PVC, 20 x 30 cm",
        "description": "Comandă online Semn Indicator Punct de prim ajutor, PVC, 20 x 30 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/7043145.jpg",
        "price": 16.9,
        "category": "Indicatoare",
        "dimensions": "20x30 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "5004042",
        "slug": "semn-indicator-acces-strict-interzis-persoanelor-neautorizate-pvc-30-x-20-cm-5004042",
        "title": "Semn Indicator Acces strict interzis persoanelor neautorizate, PVC, 30 x 20 cm",
        "description": "Comandă online Semn Indicator Acces strict interzis persoanelor neautorizate, PVC, 30 x 20 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/5004042.jpg",
        "price": 13.49,
        "category": "Indicatoare",
        "dimensions": "30x20 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "7049348",
        "slug": "semn-indicator-priza-220-400-v-autocolant-25-x-15-cm-7049348",
        "title": "Semn Indicator Priza 220/ 400 V, autocolant, 25 x 15 cm",
        "description": "Comandă online Semn Indicator Priza 220/ 400 V, autocolant, 25 x 15 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/7049348.jpg",
        "price": 13.9,
        "category": "Indicatoare",
        "dimensions": "25x15 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "5004045",
        "slug": "semn-indicator-acces-interzis-pvc-30-x20-cm-5004045",
        "title": "Semn Indicator Acces interzis, PVC, 30 x20 cm",
        "description": "Comandă online Semn Indicator Acces interzis, PVC, 30 x20 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/5004045.jpg",
        "price": 16.9,
        "category": "Indicatoare",
        "dimensions": "30x20 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "5006265",
        "slug": "semn-indicator-interdictie-autocolant-30-x-20-cm-set-6-bucati-5006265",
        "title": "Semn Indicator Interdictie, autocolant, 30 x 20 cm, set 6 bucati",
        "description": "Comandă online Semn Indicator Interdictie, autocolant, 30 x 20 cm, set 6 bucati la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/5006265.jpg",
        "price": 15.9,
        "category": "Indicatoare",
        "dimensions": "30x20 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "7045245",
        "slug": "semn-indicator-fumatul-interzis-pvc-20-x-15-cm-7045245",
        "title": "Semn Indicator Fumatul interzis, PVC, 20 x 15 cm",
        "description": "Comandă online Semn Indicator Fumatul interzis, PVC, 20 x 15 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/7045245.jpg",
        "price": 11.89,
        "category": "Indicatoare",
        "dimensions": "20x15 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "5004064",
        "slug": "semn-indicator-inalta-tensiune-pvc-15-x-15-cm-5004064",
        "title": "Semn Indicator Inalta tensiune, PVC, 15 x 15 cm",
        "description": "Comandă online Semn Indicator Inalta tensiune, PVC, 15 x 15 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/5004064.jpg",
        "price": 11.89,
        "category": "Indicatoare",
        "dimensions": "15x15 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "5004060",
        "slug": "semn-indicator-nu-parcati-pvc-30-x-20-cm-5004060",
        "title": "Semn Indicator Nu parcati, PVC, 30 x 20 cm",
        "description": "Comandă online Semn Indicator Nu parcati, PVC, 30 x 20 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/5004060.jpg",
        "price": 12.29,
        "category": "Indicatoare",
        "dimensions": "30x20 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "5004023",
        "slug": "indicator-solicitati-bon-fiscal-pvc-30-x-20-cm-5004023",
        "title": "Indicator Solicitati bon fiscal, PVC, 30 x 20 cm",
        "description": "Comandă online Indicator Solicitati bon fiscal, PVC, 30 x 20 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/5004023.jpg",
        "price": 13.49,
        "category": "Indicatoare",
        "dimensions": "30x20 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "7041810",
        "slug": "semn-indicator-stingator-autocolant-20-x-20-cm-7041810",
        "title": "Semn Indicator Stingator, autocolant, 20 x 20 cm",
        "description": "Comandă online Semn Indicator Stingator, autocolant, 20 x 20 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/7041810.jpg",
        "price": 11.89,
        "category": "Indicatoare",
        "dimensions": "20x20 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "7049342",
        "slug": "semn-indicator-parcare-rezervata-pvc-40-x-30-cm-7049342",
        "title": "Semn Indicator Parcare rezervata, PVC, 40 x 30 cm",
        "description": "Comandă online Semn Indicator Parcare rezervata, PVC, 40 x 30 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/7049342.jpg",
        "price": 29.9,
        "category": "Indicatoare",
        "dimensions": "40x30 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "5004038",
        "slug": "semn-indicator-pastrati-curatenia-pvc-30-x-20-cm-5004038",
        "title": "Semn Indicator Pastrati curatenia, PVC, 30 x 20 cm",
        "description": "Comandă online Semn Indicator Pastrati curatenia, PVC, 30 x 20 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/5004038.jpg",
        "price": 13.49,
        "category": "Indicatoare",
        "dimensions": "30x20 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "5006267",
        "slug": "indicator-informare-spatii-comerciale-autocolant-30-x-20-cm-set-7-bucati-5006267",
        "title": "Indicator Informare spatii comerciale, autocolant, 30 x 20 cm, set 7 bucati",
        "description": "Comandă online Indicator Informare spatii comerciale, autocolant, 30 x 20 cm, set 7 bucati la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/5006267.jpg",
        "price": 15.9,
        "category": "Indicatoare",
        "dimensions": "30x20 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "5006268",
        "slug": "indicator-psi-autocolant-30-x-20-cm-set-6-bucati-5006268",
        "title": "Indicator PSI, autocolant, 30 x 20 cm, set 6 bucati",
        "description": "Comandă online Indicator PSI, autocolant, 30 x 20 cm, set 6 bucati la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/5006268.jpg",
        "price": 15.9,
        "category": "Indicatoare",
        "dimensions": "30x20 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "7049344",
        "slug": "indicator-luminescent-exit-autocolant-reflectorizant-19-5-x-7-5-cm-7049344",
        "title": "Indicator luminescent Exit, autocolant reflectorizant, 19.5 x 7.5 cm",
        "description": "Comandă online Indicator luminescent Exit, autocolant reflectorizant, 19.5 x 7.5 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/7049344.jpg",
        "price": 17.9,
        "category": "Indicatoare",
        "dimensions": "5x7 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "5006266",
        "slug": "semn-indicator-iesiri-in-caz-de-urgenta-autocolant-30-x-20-cm-set-4-bucati-5006266",
        "title": "Semn Indicator Iesiri in caz de urgenta, autocolant, 30 x 20 cm, set 4 bucati",
        "description": "Comandă online Semn Indicator Iesiri in caz de urgenta, autocolant, 30 x 20 cm, set 4 bucati la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/5006266.jpg",
        "price": 17.9,
        "category": "Indicatoare",
        "dimensions": "30x20 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "7049347",
        "slug": "semn-indicator-acces-interzis-persoanelor-neautorizate-pvc-30-x-20-cm-7049347",
        "title": "Semn Indicator Acces interzis persoanelor neautorizate, PVC, 30 x 20 cm",
        "description": "Comandă online Semn Indicator Acces interzis persoanelor neautorizate, PVC, 30 x 20 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/7049347.jpg",
        "price": 13.49,
        "category": "Indicatoare",
        "dimensions": "30x20 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "5004068",
        "slug": "semn-indicator-iesire-in-caz-de-urgenta-stanga-pvc-30-x-10-cm-5004068",
        "title": "Semn Indicator Iesire in caz de urgenta Stanga, PVC, 30 x 10 cm",
        "description": "Comandă online Semn Indicator Iesire in caz de urgenta Stanga, PVC, 30 x 10 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/5004068.jpg",
        "price": 11.89,
        "category": "Indicatoare",
        "dimensions": "30x10 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "5004673",
        "slug": "semn-indicator-toaleta-barbati-pvc-14-x-10-cm-5004673",
        "title": "Semn Indicator Toaleta barbati, PVC, 14 x 10 cm",
        "description": "Comandă online Semn Indicator Toaleta barbati, PVC, 14 x 10 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/5004673.jpg",
        "price": 11.89,
        "category": "Indicatoare",
        "dimensions": "14x10 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "5004055",
        "slug": "semn-indicator-nu-parcati-garaj-pvc-30-x-20-cm-5004055",
        "title": "Semn Indicator Nu parcati - Garaj, PVC, 30 x 20 cm",
        "description": "Comandă online Semn Indicator Nu parcati - Garaj, PVC, 30 x 20 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/5004055.jpg",
        "price": 16.9,
        "category": "Indicatoare",
        "dimensions": "30x20 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "5004069",
        "slug": "semn-indicator-iesire-in-caz-de-urgenta-dreapta-pvc-30-x-10-cm-5004069",
        "title": "Semn Indicator Iesire in caz de urgenta Dreapta, PVC, 30 x 10 cm",
        "description": "Comandă online Semn Indicator Iesire in caz de urgenta Dreapta, PVC, 30 x 10 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/5004069.jpg",
        "price": 11.89,
        "category": "Indicatoare",
        "dimensions": "30x10 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "5004063",
        "slug": "semn-indicator-priza-avertizare-400-v-pvc-10-x-5-cm-set-10-bucati-5004063",
        "title": "Semn Indicator Priza avertizare 400 V,  PVC, 10 x 5 cm, set 10 bucati",
        "description": "Comandă online Semn Indicator Priza avertizare 400 V,  PVC, 10 x 5 cm, set 10 bucati la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/5004063.jpg",
        "price": 14.9,
        "category": "Indicatoare",
        "dimensions": "10x5 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "5006282",
        "slug": "semn-indicator-limitare-viteza-70-autocolant-diametru-12-cm-5006282",
        "title": "Semn Indicator Limitare viteza 70, autocolant, diametru 12 cm",
        "description": "Comandă online Semn Indicator Limitare viteza 70, autocolant, diametru 12 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/5006282.jpg",
        "price": 5.49,
        "category": "Indicatoare",
        "dimensions": "Standard",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "7043176",
        "slug": "semn-indicator-priza-230-v-autocolant-9-5-x-4-5-cm-set-12-bucati-7043176",
        "title": "Semn Indicator Priza 230 V, autocolant, 9.5 x 4.5 cm, set 12 bucati",
        "description": "Comandă online Semn Indicator Priza 230 V, autocolant, 9.5 x 4.5 cm, set 12 bucati la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/7043176.jpg",
        "price": 15.9,
        "category": "Indicatoare",
        "dimensions": "5x4 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "5006264",
        "slug": "indicator-instructiuni-in-caz-de-urgenta-pvc-40-x-30-cm-5006264",
        "title": "Indicator Instructiuni in caz de urgenta, PVC, 40 x 30 cm",
        "description": "Comandă online Indicator Instructiuni in caz de urgenta, PVC, 40 x 30 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/5006264.jpg",
        "price": 23.81,
        "category": "Indicatoare",
        "dimensions": "40x30 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "7043205",
        "slug": "semn-indicator-stingator-autocolant-15-x-20-cm-7043205",
        "title": "Semn Indicator Stingator, autocolant, 15 x 20 cm",
        "description": "Comandă online Semn Indicator Stingator, autocolant, 15 x 20 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/7043205.jpg",
        "price": 10.9,
        "category": "Indicatoare",
        "dimensions": "15x20 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "5004674",
        "slug": "semn-indicator-toaleta-mixta-pvc-14-x-10-cm-5004674",
        "title": "Semn Indicator Toaleta mixta,  PVC, 14 x 10 cm",
        "description": "Comandă online Semn Indicator Toaleta mixta,  PVC, 14 x 10 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/5004674.jpg",
        "price": 11.89,
        "category": "Indicatoare",
        "dimensions": "14x10 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "5007429",
        "slug": "semn-indicator-interzis-foc-deschis-si-fumat-pvc-20-x-30-cm-5007429",
        "title": "Semn Indicator Interzis foc deschis si fumat, PVC, 20 x 30 cm",
        "description": "Comandă online Semn Indicator Interzis foc deschis si fumat, PVC, 20 x 30 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/5007429.jpg",
        "price": 16.9,
        "category": "Indicatoare",
        "dimensions": "20x30 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "5006263",
        "slug": "semn-indicator-orientare-aluminiu-28-x-9-cm-5006263",
        "title": "Semn Indicator Orientare, aluminiu, 28 x 9 cm",
        "description": "Comandă online Semn Indicator Orientare, aluminiu, 28 x 9 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/5006263.jpg",
        "price": 44.9,
        "category": "Indicatoare",
        "dimensions": "28x9 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "7049350",
        "slug": "semn-indicator-stop-acces-interzis-pvc-37-cm-7049350",
        "title": "Semn Indicator Stop acces interzis, PVC, 37 cm",
        "description": "Comandă online Semn Indicator Stop acces interzis, PVC, 37 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/7049350.jpg",
        "price": 57.52,
        "category": "Indicatoare",
        "dimensions": "Standard",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "7043149",
        "slug": "semn-indicator-pericol-electrocutare-autocolant-15-x-20-cm-7043149",
        "title": "Semn Indicator Pericol electrocutare, autocolant, 15 x 20 cm",
        "description": "Comandă online Semn Indicator Pericol electrocutare, autocolant, 15 x 20 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/7043149.jpg",
        "price": 10.9,
        "category": "Indicatoare",
        "dimensions": "15x20 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "5004067",
        "slug": "semn-indicator-directii-de-urmat-pvc-15-x-15-cm-5004067",
        "title": "Semn Indicator Directii de urmat, PVC, 15 x 15 cm",
        "description": "Comandă online Semn Indicator Directii de urmat, PVC, 15 x 15 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/5004067.jpg",
        "price": 11.89,
        "category": "Indicatoare",
        "dimensions": "15x15 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "5004025",
        "slug": "indicator-nu-vindem-minorilor-alcool-si-tutun-pvc-20-x-15-cm-5004025",
        "title": "Indicator Nu vindem minorilor alcool si tutun, PVC, 20 x 15 cm",
        "description": "Comandă online Indicator Nu vindem minorilor alcool si tutun, PVC, 20 x 15 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/5004025.jpg",
        "price": 13.49,
        "category": "Indicatoare",
        "dimensions": "20x15 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "5004037",
        "slug": "semn-indicator-loc-pentru-fumat-pvc-30-x-20-cm-5004037",
        "title": "Semn Indicator Loc pentru fumat, PVC, 30 x 20 cm",
        "description": "Comandă online Semn Indicator Loc pentru fumat, PVC, 30 x 20 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/5004037.jpg",
        "price": 13.49,
        "category": "Indicatoare",
        "dimensions": "30x20 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "5006269",
        "slug": "semn-indicator-depasirea-interzisa-depasire-pe-partea-stanga-autocolant-diametru-12-cm-set-2-bucati-5006269",
        "title": "Semn Indicator Depasirea interzisa + Depasire pe partea stanga, autocolant, diametru 12 cm, set 2 bucati",
        "description": "Comandă online Semn Indicator Depasirea interzisa + Depasire pe partea stanga, autocolant, diametru 12 cm, set 2 bucati la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/5006269.jpg",
        "price": 13.9,
        "category": "Indicatoare",
        "dimensions": "Standard",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "7057654",
        "slug": "indicator-pastrati-distanta-sociala-1-5-m-pvc-20-x-30-cm-7057654",
        "title": "Indicator Pastrati distanta sociala 1.5 m, PVC, 20 x 30 cm",
        "description": "Comandă online Indicator Pastrati distanta sociala 1.5 m, PVC, 20 x 30 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/7057654.jpg",
        "price": 14.7,
        "category": "Indicatoare",
        "dimensions": "20x30 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "7043925",
        "slug": "semn-indicator-deseuri-sticla-w0102-a4-autocolant-20-x-30-cm-7043925",
        "title": "Semn Indicator Deseuri sticla W0102 A4, autocolant, 20 x 30 cm",
        "description": "Comandă online Semn Indicator Deseuri sticla W0102 A4, autocolant, 20 x 30 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/7043925.jpg",
        "price": 14.9,
        "category": "Indicatoare",
        "dimensions": "20x30 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "7043922",
        "slug": "semn-indicator-deseuri-hartie-w0101-a4-autocolant-20-x-30-cm-7043922",
        "title": "Semn Indicator Deseuri hartie W0101 A4, autocolant, 20 x 30 cm",
        "description": "Comandă online Semn Indicator Deseuri hartie W0101 A4, autocolant, 20 x 30 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/7043922.jpg",
        "price": 14.9,
        "category": "Indicatoare",
        "dimensions": "20x30 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "7040411",
        "slug": "semn-indicator-loc-de-adunare-in-caz-de-urgenta-pvc-20-x-30-cm-7040411",
        "title": "Semn Indicator Loc de adunare in caz de urgenta, PVC, 20 x 30 cm",
        "description": "Comandă online Semn Indicator Loc de adunare in caz de urgenta, PVC, 20 x 30 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/7040411.jpg",
        "price": 16.9,
        "category": "Indicatoare",
        "dimensions": "20x30 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "7049345",
        "slug": "indicator-luminescent-exit-dreapta-autocolant-reflectorizant-19-5-x-7-5-cm-7049345",
        "title": "Indicator luminescent Exit Dreapta, autocolant reflectorizant, 19.5 x 7.5 cm",
        "description": "Comandă online Indicator luminescent Exit Dreapta, autocolant reflectorizant, 19.5 x 7.5 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/7049345.jpg",
        "price": 17.9,
        "category": "Indicatoare",
        "dimensions": "5x7 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "7049346",
        "slug": "indicator-luminescent-exit-stanga-autocolant-reflectorizant-19-5-x-7-5-cm-7049346",
        "title": "Indicator luminescent Exit Stanga, autocolant reflectorizant, 19.5 x 7.5 cm",
        "description": "Comandă online Indicator luminescent Exit Stanga, autocolant reflectorizant, 19.5 x 7.5 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/7049346.jpg",
        "price": 17.9,
        "category": "Indicatoare",
        "dimensions": "5x7 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "3029927",
        "slug": "indicator-toaleta-barbati-13530200-crom-abs-8-x-8-cm-3029927",
        "title": "Indicator toaleta, barbati 13530200, crom, ABS, 8 x 8 cm",
        "description": "Comandă online Indicator toaleta, barbati 13530200, crom, ABS, 8 x 8 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/3029927.jpg",
        "price": 28,
        "category": "Indicatoare",
        "dimensions": "8x8 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "5006280",
        "slug": "semn-indicator-depasire-stanga-autocolant-diametru-12-cm-5006280",
        "title": "Semn Indicator Depasire stanga, autocolant, diametru 12 cm",
        "description": "Comandă online Semn Indicator Depasire stanga, autocolant, diametru 12 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/5006280.jpg",
        "price": 6.9,
        "category": "Indicatoare",
        "dimensions": "Standard",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "5004065",
        "slug": "semn-indicator-hidrant-pvc-15-x-15-cm-5004065",
        "title": "Semn Indicator Hidrant, PVC, 15 x 15 cm",
        "description": "Comandă online Semn Indicator Hidrant, PVC, 15 x 15 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/5004065.jpg",
        "price": 11.89,
        "category": "Indicatoare",
        "dimensions": "15x15 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "7057653",
        "slug": "indicator-pastrati-distanta-de-siguranta-2-m-pvc-20-x-30-cm-7057653",
        "title": "Indicator Pastrati distanta de siguranta 2 m, PVC, 20 x 30 cm",
        "description": "Comandă online Indicator Pastrati distanta de siguranta 2 m, PVC, 20 x 30 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/7057653.jpg",
        "price": 14.7,
        "category": "Indicatoare",
        "dimensions": "20x30 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "7043923",
        "slug": "semn-indicator-deseuri-menajere-w0103-a4-autocolant-20-x-30-cm-7043923",
        "title": "Semn Indicator Deseuri menajere W0103 A4, autocolant, 20 x 30 cm",
        "description": "Comandă online Semn Indicator Deseuri menajere W0103 A4, autocolant, 20 x 30 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/7043923.jpg",
        "price": 14.9,
        "category": "Indicatoare",
        "dimensions": "20x30 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "7043924",
        "slug": "semn-indicator-deseuri-plastic-w0104-a4-autocolant-20-x-30-cm-7043924",
        "title": "Semn Indicator Deseuri plastic W0104 A4, autocolant, 20 x 30 cm",
        "description": "Comandă online Semn Indicator Deseuri plastic W0104 A4, autocolant, 20 x 30 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/7043924.jpg",
        "price": 14.9,
        "category": "Indicatoare",
        "dimensions": "20x30 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "7043926",
        "slug": "semn-indicator-deseuri-metalice-w0105-a4-autocolant-20-x-30-cm-7043926",
        "title": "Semn Indicator Deseuri metalice W0105 A4, autocolant, 20 x 30 cm",
        "description": "Comandă online Semn Indicator Deseuri metalice W0105 A4, autocolant, 20 x 30 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/7043926.jpg",
        "price": 14.9,
        "category": "Indicatoare",
        "dimensions": "20x30 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "7057649",
        "slug": "indicator-stop-covid-m0144-pvc-30-x-40-cm-7057649",
        "title": "Indicator Stop Covid M0144, PVC, 30 x 40 cm",
        "description": "Comandă online Indicator Stop Covid M0144, PVC, 30 x 40 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/7057649.jpg",
        "price": 26.64,
        "category": "Indicatoare",
        "dimensions": "30x40 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "5006787",
        "slug": "semn-indicator-toaleta-femei-aluminiu-12-x-10-cm-5006787",
        "title": "Semn Indicator Toaleta femei, aluminiu, 12 x 10 cm",
        "description": "Comandă online Semn Indicator Toaleta femei, aluminiu, 12 x 10 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/5006787.jpg",
        "price": 39.89,
        "category": "Indicatoare",
        "dimensions": "12x10 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "7029721",
        "slug": "semn-indicator-supraveghere-video-autocolant-20-x-15-cm-7029721",
        "title": "Semn Indicator Supraveghere video, autocolant, 20 x 15 cm",
        "description": "Comandă online Semn Indicator Supraveghere video, autocolant, 20 x 15 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/7029721.jpg",
        "price": 9.51,
        "category": "Indicatoare",
        "dimensions": "20x15 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "7046211",
        "slug": "semn-indicator-supraveghere-video-autocolant-diametru-15-cm-7046211",
        "title": "Semn Indicator Supraveghere video, autocolant, diametru 15 cm",
        "description": "Comandă online Semn Indicator Supraveghere video, autocolant, diametru 15 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/7046211.jpg",
        "price": 6.74,
        "category": "Indicatoare",
        "dimensions": "Standard",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "5004062",
        "slug": "semn-indicator-priza-220-230-v-pvc-10-x-5-cm-set-10-bucati-5004062",
        "title": "Semn Indicator Priza 220/ 230 V, PVC, 10 x 5 cm, set 10 bucati",
        "description": "Comandă online Semn Indicator Priza 220/ 230 V, PVC, 10 x 5 cm, set 10 bucati la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/5004062.jpg",
        "price": 14.9,
        "category": "Indicatoare",
        "dimensions": "10x5 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "5004066",
        "slug": "semn-indicator-stingator-pvc-15-x-15-cm-5004066",
        "title": "Semn Indicator Stingator, PVC, 15 x 15 cm",
        "description": "Comandă online Semn Indicator Stingator, PVC, 15 x 15 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/5004066.jpg",
        "price": 11.89,
        "category": "Indicatoare",
        "dimensions": "15x15 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "5006281",
        "slug": "semn-indicator-limitare-viteza-50-autocolant-diametru-12-cm-5006281",
        "title": "Semn Indicator Limitare viteza 50, autocolant, diametru 12 cm",
        "description": "Comandă online Semn Indicator Limitare viteza 50, autocolant, diametru 12 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/5006281.jpg",
        "price": 5.49,
        "category": "Indicatoare",
        "dimensions": "Standard",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "7049343",
        "slug": "semn-indicator-nu-parcati-pvc-40-x-20-cm-7049343",
        "title": "Semn Indicator Nu parcati, PVC, 40 x 20 cm",
        "description": "Comandă online Semn Indicator Nu parcati, PVC, 40 x 20 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/7049343.jpg",
        "price": 21.9,
        "category": "Indicatoare",
        "dimensions": "40x20 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "7042458",
        "slug": "semn-indicator-limitare-viteza-60-autocolant-diametru-12-cm-7042458",
        "title": "Semn Indicator Limitare viteza 60, autocolant, diametru 12 cm",
        "description": "Comandă online Semn Indicator Limitare viteza 60, autocolant, diametru 12 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/7042458.jpg",
        "price": 5.49,
        "category": "Indicatoare",
        "dimensions": "Standard",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "7042471",
        "slug": "semn-indicator-limitare-viteza-110-autocolant-diametru-12-cm-7042471",
        "title": "Semn Indicator Limitare viteza 110, autocolant, diametru 12 cm",
        "description": "Comandă online Semn Indicator Limitare viteza 110, autocolant, diametru 12 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/7042471.jpg",
        "price": 5.49,
        "category": "Indicatoare",
        "dimensions": "Standard",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "7042472",
        "slug": "semn-indicator-limitare-viteza-130-autocolant-diametru-12-cm-7042472",
        "title": "Semn Indicator Limitare viteza 130, autocolant, diametru 12 cm",
        "description": "Comandă online Semn Indicator Limitare viteza 130, autocolant, diametru 12 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/7042472.jpg",
        "price": 5.49,
        "category": "Indicatoare",
        "dimensions": "Standard",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "5004036",
        "slug": "semn-indicator-fumatul-interzis-pvc-30-x-20-cm-5004036",
        "title": "Semn Indicator Fumatul interzis, PVC, 30 x 20 cm",
        "description": "Comandă online Semn Indicator Fumatul interzis, PVC, 30 x 20 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/5004036.jpg",
        "price": 13.49,
        "category": "Indicatoare",
        "dimensions": "30x20 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "5006262",
        "slug": "semn-indicator-toaleta-mixta-aluminiu-12-x-10-cm-5006262",
        "title": "Semn Indicator Toaleta mixta, aluminiu, 12 x 10 cm",
        "description": "Comandă online Semn Indicator Toaleta mixta, aluminiu, 12 x 10 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/5006262.jpg",
        "price": 39.89,
        "category": "Indicatoare",
        "dimensions": "12x10 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "7042470",
        "slug": "semn-indicator-limitare-viteza-100-autocolant-diametru-12-cm-7042470",
        "title": "Semn Indicator Limitare viteza 100, autocolant, diametru 12 cm",
        "description": "Comandă online Semn Indicator Limitare viteza 100, autocolant, diametru 12 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/7042470.jpg",
        "price": 5.49,
        "category": "Indicatoare",
        "dimensions": "Standard",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "7042459",
        "slug": "semn-indicator-limitare-viteza-80-autocolant-diametru-12-cm-7042459",
        "title": "Semn Indicator Limitare viteza 80, autocolant, diametru 12 cm",
        "description": "Comandă online Semn Indicator Limitare viteza 80, autocolant, diametru 12 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/7042459.jpg",
        "price": 5.49,
        "category": "Indicatoare",
        "dimensions": "Standard",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "5006283",
        "slug": "semn-indicator-limitare-viteza-90-autocolant-diametru-12-cm-5006283",
        "title": "Semn Indicator Limitare viteza 90, autocolant, diametru 12 cm",
        "description": "Comandă online Semn Indicator Limitare viteza 90, autocolant, diametru 12 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/5006283.jpg",
        "price": 5.49,
        "category": "Indicatoare",
        "dimensions": "Standard",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "5006284",
        "slug": "semn-indicator-limitare-viteza-120-autocolant-diametru-12-cm-5006284",
        "title": "Semn Indicator Limitare viteza 120, autocolant, diametru 12 cm",
        "description": "Comandă online Semn Indicator Limitare viteza 120, autocolant, diametru 12 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/5006284.jpg",
        "price": 5.49,
        "category": "Indicatoare",
        "dimensions": "Standard",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "5004672",
        "slug": "semn-indicator-toaleta-femei-pvc-14-x-10-cm-5004672",
        "title": "Semn Indicator Toaleta femei, PVC, 14 x 10 cm",
        "description": "Comandă online Semn Indicator Toaleta femei, PVC, 14 x 10 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/5004672.jpg",
        "price": 11.89,
        "category": "Indicatoare",
        "dimensions": "14x10 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "7057648",
        "slug": "indicator-stop-covid-m0145-pvc-30-x-40-cm-7057648",
        "title": "Indicator Stop Covid M0145, PVC, 30 x 40 cm",
        "description": "Comandă online Indicator Stop Covid M0145, PVC, 30 x 40 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/7057648.jpg",
        "price": 26.64,
        "category": "Indicatoare",
        "dimensions": "30x40 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "3029928",
        "slug": "indicator-toaleta-femei-barbati-13530300-crom-abs-8-x-8-cm-3029928",
        "title": "Indicator toaleta, femei / barbati 13530300, crom, ABS, 8 x 8 cm",
        "description": "Comandă online Indicator toaleta, femei / barbati 13530300, crom, ABS, 8 x 8 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/3029928.jpg",
        "price": 31,
        "category": "Indicatoare",
        "dimensions": "8x8 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    },
    {
        "id": "5006261",
        "slug": "semn-indicator-toaleta-barbati-aluminiu-12-x-10-cm-5006261",
        "title": "Semn Indicator Toaleta barbati, aluminiu, 12 x 10 cm",
        "description": "Comandă online Semn Indicator Toaleta barbati, aluminiu, 12 x 10 cm la cel mai bun preț. Disponibil pe suport PVC rezistent, Autocolant calitativ sau Dibond premium. Ideal pentru semnalistică de interior și exterior, protecția muncii și informare. Livrare rapidă prin tablou.net!",
        "image": "/r2/5006261.jpg",
        "price": 39.89,
        "category": "Indicatoare",
        "dimensions": "12x10 cm",
        "tags": [
            "semnalistica",
            "dedeman-style",
            "constructii",
            "protectia-muncii",
            "indicatoare",
            "pvc",
            "autocolant",
            "pret producator",
            "magazin online"
        ]
    }
];

export const signageProducts: SignageProduct[] = [
    ...dedemanProducts,
    ...printCenterProducts
];
