import { Wine, TastingExperience } from './types';

// Let's use the actual generated images from AI image tool
export const IMAGES = {
  hero: '/src/assets/images/wine_spot_hero_1782757827367.jpg',
  bottle: '/src/assets/images/luxury_wine_bottle_1782757842715.jpg',
  experience: '/src/assets/images/wine_tasting_experience_1782757858895.jpg'
};

export const WINES: Wine[] = [
  {
    id: "w1",
    brand: "Bosman Wines",
    name: "Bosman Cabernet Sauvignon",
    price: 340,
    category: "Red",
    desc: "A stalwart from Bosman Family Vineyards, this Cabernet Sauvignon is made from grapes harvested from older vineyards. Positioned in the brand’s signature collection, it beautifully reflects the estate’s long-standing focus on classic varietal character. A structured, premium red perfect for a cellar-worthy collection.",
    aroma: "Blackcurrant, subtle cedar wood, and hints of dark cocoa.",
    palate: "Firm structural tannins, ripe blackberry, and an elegant, lingering toasted oak finish."
  },
  {
    id: "w2",
    brand: "Aslina Wines",
    name: "Aslina Chenin Blanc",
    price: 290,
    category: "White",
    desc: "Crafted by South Africa's pioneering first black female winemaker, Ntsiki Biyela. This Chenin Blanc is a refreshing yet rich white wine showing complex honeybush tea characteristics on the nose. It offers a silky palate with supple tannins, succulent yellow pear notes, and a deep, structured texture.",
    aroma: "Honeybush tea, delicate white flowers, and citrus rind.",
    palate: "Rich yellow pear, balanced bright acidity, and a creamy, lingering stone fruit finish."
  },
  {
    id: "w3",
    brand: "Aslina Wines",
    name: "Aslina Umsasane Bold Blend",
    price: 480,
    category: "Blend",
    desc: "A flagship premium Bordeaux-style red blend representing strength and shelter. Bold, complex layers of dark fruit, elegant spice, and structured tannins provide a luxurious, lingering finish. Ideal for serious wine collectors looking for true heritage depth.",
    aroma: "Plum, dark chocolate, and hints of savory black olive and cedar.",
    palate: "Full-bodied with structured tannins, blackberry compote, and a refined, velvety touch."
  },
  {
    id: "w4",
    brand: "Bayede!",
    name: "B’Royal Chenin Blanc",
    price: 195,
    category: "White",
    desc: "A crisp, off-dry royal white wine bursting with fresh apple, ripe pear, pineapple, and vibrant tropical fruits on the nose. Medium-bodied and perfectly balanced with a clean, refreshing fruit-to-acid finish. Positioned as an easy-drinking yet beautifully polished expression.",
    aroma: "Green apple, fresh pineapple, and ripe yellow pear.",
    palate: "Off-dry tropical fruit entry, bright zesty lime acidity, and a crisp, clean finish."
  },
  {
    id: "w5",
    brand: "Birthmark of Africa",
    name: "Birthmark Premium Pinotage",
    price: 380,
    category: "Red",
    desc: "A stunning expression of South Africa's signature grape variety, deeply tied to ancestral land and cultural pride. Bold dark berries, hints of rich smoky cacao, and velvety smooth tannins form the profile of this deeply evocative red. Crafted explicitly to tell a true destiny story of African heritage.",
    aroma: "Spiced plum, roasted coffee bean, and dark cherries.",
    palate: "Rich forest berries, hints of smoke, smooth velvety finish with beautifully integrated wood tannins."
  },
  {
    id: "w6",
    brand: "Blouvlei / Mont du Toit",
    name: "Mont du Toit La Colline Viognier",
    price: 310,
    category: "White",
    desc: "An exceptional white varietal showcasing beautiful stone fruit aromatics, delicate orange blossom, and a rich, creamy mouthfeel. Sourced from choice Wellington slopes, it offers a beautifully nuanced texture that pairs spectacularly with aromatic cuisine. A sophisticated hidden gem.",
    aroma: "Apricot, orange blossom, and delicate white peach.",
    palate: "Creamy, medium-bodied mouthfeel, smooth honeyed stone fruit, and a soft, elegant floral length."
  },
  {
    id: "w7",
    brand: "Ayana Wine",
    name: "Ayana Premium Shiraz",
    price: 360,
    category: "Red",
    desc: "An artisanal, boutique red wine showcasing the intense spice, wild dark plum, and earthy undertones characteristic of top-tier Western Cape soils. Highly exclusive, smooth on the palate, and displaying a balanced structural integrity built for fine dining environments.",
    aroma: "Crushed black pepper, wild plum, and leather notes.",
    palate: "Rich dark fruit core, complex white pepper spice, balanced acidity, and tight, structured tannins."
  },
  {
    id: "w8",
    brand: "Brothers in Vines",
    name: "Brothers in Vines Reserve Blend",
    price: 420,
    category: "Blend",
    desc: "Born from a high-concept virtual cellar established in 2015, this premium red blend relies heavily on passion and master blending experience. Rich dark fruits seamlessly intertwine with subtle French oak spice and fine-grained tannins. An incredibly smooth, conversation-starting boutique bottle.",
    aroma: "Bramble, dark cherry, and integrated vanilla-cinnamon baking spices.",
    palate: "Supremely smooth entry, ripe mulberry, subtle tobacco leaf, and fine powdery tannins."
  },
  {
    id: "w9",
    brand: "Brunia Wines",
    name: "Brunia Cool-Climate Pinot Noir",
    price: 490,
    category: "Red",
    desc: "Sourced from the unique, maritime-influenced terroir of Stanford. This organic, cool-climate red features vibrant wild red berries, hints of earthy forest floor, and a highly precise, elegant mineral acidity. A world-class choice for refined, global Pinot enthusiasts.",
    aroma: "Wild raspberry, damp earth, dry herbs, and white pepper.",
    palate: "Delicate and light-bodied, yet intensely layered; mineral precision and a long, savory finish."
  },
  {
    id: "w10",
    brand: "Botébo Wines",
    name: "Botébo Private Cellar Merlot",
    price: 280,
    category: "Red",
    desc: "Hailing from a dedicated boutique wine farm in Jacobsdal, this Merlot is celebrated for its lush black cherry core, soft vanilla oak integrations, and incredibly supple, velvety finish. It highlights the incredible cultivation excellence and inspiring journey of the estate.",
    aroma: "Black cherry, chocolate mint, and dark plums.",
    palate: "Juicy, medium-bodied palate, extremely soft tannins, vanilla cream, and a smooth cocoa finish."
  }
];

export const TASTINGS: TastingExperience[] = [
  {
    id: "t1",
    name: "The Black-Owned Showcase",
    price: 195,
    duration: "60 Mins",
    pours: "5 Pours",
    tour: "30-Min Tour Included",
    desc: "A stellar curation of premier black-owned South African wineries. Taste the visionary craft from pioneering estates that are reshaping the South African oenological landscapes.",
    highlights: ["5 Exceptional Pours", "30-Minute Heritage & Liberation Tour", "Storytelling with our lead sommeliers", "Sip award-winning boutique bottles"]
  },
  {
    id: "t2",
    name: "The Heritage & Liberation Pairing",
    price: 195,
    duration: "60 Mins",
    pours: "5 Pours",
    tour: "30-Min Tour Included",
    desc: "A deep dive into historical connections, mapping curated vintages with seminal moments in the liberation story at the iconic Long March to Freedom monument.",
    highlights: ["Historical flight of 5 landmark pours", "Guided walking heritage tour", "Bespoke tasting mats with key historical milestones", "Insightful cultural narrative session"]
  },
  {
    id: "t3",
    name: "Artisanal Wine & Chocolate",
    price: 195,
    duration: "60 Mins",
    pours: "5 Pours",
    tour: "30-Min Tour Included",
    desc: "Indulge in a premium pairing of artisanal, single-origin South African chocolates handcrafted to accentuate and reveal the deep layers of our select red and white wines.",
    highlights: ["5 hand-picked boutique wines", "5 artisanal chocolate matching pieces", "Interactive tasting ledger", "Heritage site tour entry"]
  },
  {
    id: "t4",
    name: "The Conscious Collection (NOLO)",
    price: 195,
    duration: "60 Mins",
    pours: "5 Pours",
    tour: "30-Min Tour Included",
    desc: "An incredible exploration of ultra-premium non-alcoholic and low-alcohol alternatives. Perfect for conscious oenophiles seeking pure South African terroir flavors with none of the alcohol.",
    highlights: ["5 premium non-alcoholic / de-alcoholized pours", "Light healthy local botanical snack plate", "Heritage site walking tour", "Sophisticated alternative flavor profiling"]
  },
  {
    id: "t5",
    name: "The Character Safaris (Non-Wine)",
    price: 195,
    duration: "60 Mins",
    pours: "5 Pours",
    tour: "30-Min Tour Included",
    desc: "For those looking to explore beyond the vine. Experience exceptional micro-batch botanical gins, rooibos-infused cold brews, and honeybush-distilled elixirs from local craft producers.",
    highlights: ["5 non-wine premium South African botanical elixirs", "Salty snack pairing plate", "30-minute historical guided tour", "Unique craft distilling stories"]
  }
];

export const B2B_BENEFITS = [
  {
    title: "Bespoke Tour Operators",
    desc: "Offer your international travelers a premium, high-concept cultural experience that blends world-class oenology with deep historical connection at the Long March to Freedom heritage site.",
    perks: ["Group rate packages", "Exclusive VIP booking slots", "Interactive digital vouchers", "Direct bus drop-off accessibility"]
  },
  {
    title: "MICE & Corporate Galas",
    desc: "Exquisite corporate packages from high-end private tasting lunches to elegant evening events celebrating South African heritage with pioneering black-owned winemakers.",
    perks: ["Customized corporate label printing", "Sommelier-led group activities", "Full venue buy-out opportunities", "Flexible catering integrations"]
  },
  {
    title: "Curated International Exports",
    desc: "Assisting global sommeliers, wine distributors, and premium hospitality outlets in source-acquiring these highly exclusive, boutique micro-vintages from black South African producers.",
    perks: ["Consolidated shipping advisory", "Exclusive allocation reserves", "Full technical winemaker data", "Direct producer price match guarantees"]
  }
];
