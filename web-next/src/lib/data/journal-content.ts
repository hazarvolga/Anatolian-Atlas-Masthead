import { DEMO_IMAGES } from "./demo-images";

export interface JournalCitation {
  id: string;
  source: string;
  publication: string;
  year: string;
  url?: string;
}

export interface JournalSection {
  id: string;
  heading: string;
  paragraphs: string[];
  pullQuote?: {
    text: string;
    attribution: string;
  };
  figure?: {
    image: string;
    caption: string;
    coordinates: string;
  };
}

export interface JournalArticle {
  slug: string;
  folioNo: string;
  title: string;
  subtitle: string;
  excerpt: string;
  category: "Archaeology" | "Architecture" | "Geology" | "Maritime History";
  regionId: string;
  regionName: string;
  relatedTourId: string;
  coordinates: string;
  elevation: string;
  publishedAt: string;
  readingMinutes: number;
  heroImage: string;
  heroCaption: string;
  author: {
    name: string;
    role: string;
    isDemoByline: true;
    demoNotice: string;
  };
  keyFacts: Array<{
    label: string;
    value: string;
  }>;
  sections: JournalSection[];
  citations: JournalCitation[];
}

export const DEMO_EDITORIAL_DISCLAIMER =
  "DEMO CONTENT — Sample editorial monograph for theme preview. Verify all historical, geological, and technical claims before production publishing.";

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    slug: "gobekli-tepe-and-the-limestone-enclosures-of-taht-tash",
    folioNo: "MONOGRAPH 01",
    title: "T-Pillars of the Harran Horizon: Reading Pre-Pottery Neolithic Enclosures at Göbekli Tepe",
    subtitle:
      "How Pre-Pottery Neolithic communities quarried monolithic limestone pillars on the Germuş ridge overlooking the Harran Plain.",
    excerpt:
      "Above the Harran Plain in Şanlıurfa Province, circular megalithic enclosures erected during the Pre-Pottery Neolithic horizon reshaped archaeological models of early monumental architecture.",
    category: "Archaeology",
    regionId: "dest-mardin",
    regionName: "Mardin & Upper Mesopotamia",
    relatedTourId: "tour-mardin-mesopotamia",
    coordinates: "37.2233° N, 38.9225° E",
    elevation: "Germuş Mountain Range, Şanlıurfa",
    publishedAt: "2026-02-14",
    readingMinutes: 7,
    heroImage: DEMO_IMAGES.suleymaniyeGoldenHorn,
    heroCaption:
      "Upper Mesopotamian limestone plateau looking south toward the Harran basin at dusk.",
    author: {
      name: "Editorial Research Desk (Demo)",
      role: "Anatolian Atlas Monograph Series",
      isDemoByline: true,
      demoNotice: DEMO_EDITORIAL_DISCLAIMER,
    },
    keyFacts: [
      { label: "Archaeological Horizon", value: "Pre-Pottery Neolithic A–B" },
      { label: "UNESCO World Heritage", value: "Inscribed 2018 (Ref. 1572)" },
      { label: "Monumental Form", value: "Circular enclosures with T-shaped limestone pillars" },
      { label: "Bedrock Lithology", value: "Karstic limestone plateau" },
    ],
    sections: [
      {
        id: "stratigraphy-and-chronology",
        heading: "01. Stratigraphy on the Germuş Crest",
        paragraphs: [
          "Positioned along the Germuş mountain range northeast of Şanlıurfa, Göbekli Tepe overlooks the northern arc of the Fertile Crescent. Excavations initiated by the Şanlıurfa Museum and the German Archaeological Institute (DAI) under Klaus Schmidt revealed a multi-layered tell where monumental stone enclosures were erected prior to pottery and metallurgy.",
          "The oldest monumental phase comprises circular and oval enclosures centered on pairs of free-standing T-shaped limestone monoliths surrounded by smaller pillars set into stone benches.",
        ],
        pullQuote: {
          text: "The T-shaped pillars act as stylized anthropomorphic forms, with low-relief arms carved along the shafts folding toward belt and loincloth motifs.",
          attribution: "Demo Field Note 01.A — Enclosure Iconography Overview",
        },
      },
      {
        id: "quarrying-and-iconography",
        heading: "02. Limestone Quarrying & High-Relief Fauna",
        paragraphs: [
          "Adjacent limestone plateaus show how Neolithic stonecutters leveraged natural horizontal bedding planes in the bedrock, trenching channels with flint tools before wedging monoliths free from the stratum.",
          "The enclosures feature bas-reliefs of wild boar, aurochs, gazelles, cranes, and foxes. Ongoing research across the wider Taş Tepeler initiative in Şanlıurfa situates Göbekli Tepe within a regional network of prehistoric upland sites.",
        ],
      },
    ],
    citations: [
      {
        id: "cit-1",
        source: "UNESCO World Heritage Centre",
        publication: "Göbekli Tepe — World Heritage List Dossier No. 1572",
        year: "2018",
        url: "https://whc.unesco.org/en/list/1572/",
      },
      {
        id: "cit-2",
        source: "Klaus Schmidt",
        publication: "Göbekli Tepe: A Stone Age Sanctuary in South-Eastern Anatolia",
        year: "2012",
      },
    ],
  },
  {
    slug: "mimar-sinan-acoustic-vessels-and-structural-geometry-in-istanbul",
    folioNo: "MONOGRAPH 02",
    title: "Hollow Clay & Counter-Domes: Mimar Sinan’s Structural and Acoustic Engineering in Sixteenth-Century İstanbul",
    subtitle:
      "Tracing the terracotta dome vessels, load-distributing half-domes, and soot-ventilation chambers of the Süleymaniye complex.",
    excerpt:
      "In the mid-sixteenth century, Chief Imperial Architect Mimar Sinan raised the Süleymaniye complex above the Golden Horn using stepped foundations, counter-domes, and hollow earthenware vessels set into the dome masonry.",
    category: "Architecture",
    regionId: "dest-istanbul",
    regionName: "İstanbul & The Bosphorus",
    relatedTourId: "tour-istanbul-strata",
    coordinates: "41.0162° N, 28.9639° E",
    elevation: "Third Hill of the Historic Peninsula, İstanbul",
    publishedAt: "2026-02-28",
    readingMinutes: 8,
    heroImage: DEMO_IMAGES.istanbulBosphorus,
    heroCaption:
      "Cascading lead-sheathed domes and buttress piers above the Golden Horn at first light.",
    author: {
      name: "Editorial Research Desk (Demo)",
      role: "Anatolian Atlas Monograph Series",
      isDemoByline: true,
      demoNotice: DEMO_EDITORIAL_DISCLAIMER,
    },
    keyFacts: [
      { label: "Süleymaniye Complex", value: "Mid-16th century imperial külliye" },
      { label: "Structural System", value: "Central dome buttressed by two longitudinal half-domes" },
      { label: "Masonry Details", value: "Embedded hollow terracotta vessels in upper masonry" },
      { label: "UNESCO World Heritage", value: "Historic Areas of Istanbul (Ref. 356)" },
    ],
    sections: [
      {
        id: "seismic-foundations",
        heading: "01. Foundation Engineering on the Third Hill",
        paragraphs: [
          "Commissioned by Sultan Süleyman I on the sloped terrain of İstanbul’s Third Hill overlooking the Golden Horn, the Süleymaniye complex required extensive substructure preparation. Ottoman construction registers published by Ömer Lütfi Barkan and architectural analyses by Gülru Necipoğlu describe how the foundation phase excavated down to firm ground and employed stepped masonry bound with lime-pozzolana Khorasan mortar (horasan harcı).",
          "By allowing the substructure to settle before erecting the four primary baldachin piers and counter-balancing half-domes, Sinan achieved remarkable structural resilience in a seismically active region.",
        ],
        pullQuote: {
          text: "Ottoman construction ledgers document the acquisition of hollow earthenware vessels set into the upper dome masonry—lightening the haunches while contributing to the hall’s acoustic balance.",
          attribution: "Demo Field Note 02.B — Architectural & Acoustic Overview",
        },
      },
      {
        id: "helmholtz-acoustics-and-soot-ventilation",
        heading: "02. Terracotta Dome Vessels & Convective Soot Chambers",
        paragraphs: [
          "Historical construction records and modern archaeoacoustic studies of Sinan’s mosques examine the placement of hollow terracotta jars (küp / sebu) within the upper dome structure. In addition to reducing dead weight in the masonry haunches, these cavities—working alongside porous lime plasters, muqarnas transitions, and carpeted floors—helped moderate low-frequency reflections in a monumental stone interior.",
          "Above the main portal, Sinan also incorporated a passive air-circulation path designed to draw smoke from oil lamps toward a central soot chamber (is odası), helping protect interior stonework and tilework while collecting lampblack for ink preparation.",
        ],
      },
    ],
    citations: [
      {
        id: "cit-sinan-1",
        source: "Gülru Necipoğlu",
        publication: "The Age of Sinan: Architectural Culture in the Ottoman Empire (Princeton University Press)",
        year: "2005",
      },
      {
        id: "cit-sinan-2",
        source: "Ömer Lütfi Barkan",
        publication: "Süleymaniye Cami ve İmareti İnşaatı (Türk Tarih Kurumu)",
        year: "1972",
      },
      {
        id: "cit-sinan-3",
        source: "Zühre Sü Gül & Mehmet Çalışkan",
        publication: "Impact of Design Decisions on Acoustical Comfort Parameters: Case Study of Süleymaniye Mosque (Building Acoustics)",
        year: "2013",
      },
    ],
  },
  {
    slug: "cappadocia-ignimbrite-stratigraphy-and-byzantine-fresco-preservation",
    folioNo: "MONOGRAPH 03",
    title: "Tuff, Basalt Caps & Mineral Pigments: Ignimbrite Differential Erosion and Byzantine Fresco Preservation in Cappadocia",
    subtitle:
      "How Mio-Pliocene volcanic ash sheets formed a natural thermal and UV buffer for the rock-cut churches of Göreme.",
    excerpt:
      "Across the Nevşehir plateau, soft volcanic ignimbrite overlaid by harder caprock created both the hoodoo pinnacles of Paşabağ and the dark, microclimatically stable vaults of Göreme’s rock-cut churches.",
    category: "Geology",
    regionId: "dest-cappadocia",
    regionName: "Cappadocia & Central Plateau",
    relatedTourId: "tour-cappadocia-tuff",
    coordinates: "38.6431° N, 34.8289° E",
    elevation: "Göreme Valley Basin, Nevşehir",
    publishedAt: "2026-03-10",
    readingMinutes: 6,
    heroImage: DEMO_IMAGES.cappadociaIgnimbrite,
    heroCaption:
      "Differential erosion columns in the Cappadocian ignimbrite formations at dawn.",
    author: {
      name: "Editorial Research Desk (Demo)",
      role: "Anatolian Atlas Monograph Series",
      isDemoByline: true,
      demoNotice: DEMO_EDITORIAL_DISCLAIMER,
    },
    keyFacts: [
      { label: "Geological Setting", value: "Central Anatolian Volcanic Province" },
      { label: "Primary Eruptive Centers", value: "Erciyes, Hasan Dağı, Melendiz complex" },
      { label: "UNESCO World Heritage", value: "Göreme National Park and the Rock Sites of Cappadocia (Ref. 357)" },
      { label: "Conservation Factor", value: "Low-light rock-cut interiors buffering temperature and UV" },
    ],
    sections: [
      {
        id: "ignimbrite-formation",
        heading: "01. Pyroclastic Flows & Basalt Capstones",
        paragraphs: [
          "Successive eruptions across the Central Anatolian Volcanic Province deposited thick sheets of volcanic ash, pumice, and welded ignimbrite, later capped in places by harder basaltic and andesitic flows. As surface runoff and river tributaries incised the plateau, vertical joints guided erosion through the upper layers.",
          "Where isolated blocks of denser caprock remained above columns of softer tuff, they shielded the underlying cones from direct erosion, producing the characteristic pinnacles of Paşabağ and Zelve.",
        ],
        pullQuote: {
          text: "Freshly cut volcanic tuff is workable with hand tools, yet upon exposure to air its outer surface dehydrates and hardens into a self-supporting vault.",
          attribution: "Demo Field Note 03.A — Lithological Overview, Göreme Basin",
        },
      },
      {
        id: "karanlik-kilise-pigments",
        heading: "02. Photochemical Shielding in Rock-Cut Churches",
        paragraphs: [
          "During the Middle Byzantine period, monastic communities and local donors excavated cross-in-square churches directly out of the volcanic rock at Göreme, Soğanlı, and the Ihlara valley. Artisans carved columns, pendentives, and domes in negative relief before applying lime-based plaster layers and mineral pigments.",
          "Art-historical studies of Cappadocian wall paintings note that while select high-patronage monuments such as the tenth-century New Church at Tokalı Kilise incorporated precious imported blue pigments, the vivid preservation seen in eleventh-century Karanlık Kilise ('Dark Church') owes much to its minimal window openings, which shielded its mineral earth, green earth, and blue pigments from solar ultraviolet degradation.",
        ],
      },
    ],
    citations: [
      {
        id: "cit-cap-1",
        source: "Catherine Jolivet-Lévy",
        publication: "Les églises byzantines de Cappadoce (CNRS Éditions)",
        year: "1991",
      },
      {
        id: "cit-cap-2",
        source: "Ann Wharton Epstein",
        publication: "Tokalı Kilise: Tenth-Century Metropolitan Art in Byzantine Cappadocia (Dumbarton Oaks Studies)",
        year: "1986",
      },
      {
        id: "cit-cap-3",
        source: "Attila Çiner & Erkan Aydar",
        publication: "Geomorphology and Volcano-stratigraphy of the Cappadocian Ignimbrites (Landscapes and Landforms of Turkey, Springer)",
        year: "2019",
      },
    ],
  },
  {
    slug: "patara-stadiasmus-and-the-maritime-topography-of-lycia",
    folioNo: "MONOGRAPH 04",
    title: "The Stadiasmus of Patara and the Silted Harbors of the Lycian League",
    subtitle:
      "Epigraphic road tables, Roman lighthouse architecture, and alluvial shoreline shifts along the Teke Peninsula.",
    excerpt:
      "At the mouth of the Xanthos Valley, a Roman road monument erected under Emperor Claudius recorded the highway network linking the cities of Lycia.",
    category: "Maritime History",
    regionId: "dest-lycia",
    regionName: "Lycian Coast & Kaş",
    relatedTourId: "tour-lycian-gulet",
    coordinates: "36.2619° N, 29.3156° E",
    elevation: "Patara Harbor Estuary, Antalya",
    publishedAt: "2026-03-22",
    readingMinutes: 7,
    heroImage: DEMO_IMAGES.lyciaPataraHarbor,
    heroCaption:
      "Limestone littoral and submerged harbor breakwaters between Kaş and Kekova Island.",
    author: {
      name: "Editorial Research Desk (Demo)",
      role: "Anatolian Atlas Monograph Series",
      isDemoByline: true,
      demoNotice: DEMO_EDITORIAL_DISCLAIMER,
    },
    keyFacts: [
      { label: "Lycian Federation", value: "Proportional council documented by Strabo (Geographica)" },
      { label: "Stadiasmus Patarensis", value: "Claudian-era inscribed Roman road monument at Patara" },
      { label: "Harbor Monuments", value: "Roman lighthouse and Hadrianic granary (horrea)" },
      { label: "UNESCO World Heritage", value: "Xanthos-Letoon (Ref. 484)" },
    ],
    sections: [
      {
        id: "federation-and-bouleuterion",
        heading: "01. Proportional Representation in the Patara Bouleuterion",
        paragraphs: [
          "The ancient geographer Strabo described the constitutional structure of the Lycian League: member cities convened in a shared council where larger cities held three votes, medium-sized poleis held two, and smaller settlements held one, with civic contributions scaled accordingly.",
          "At Patara, the League’s primary port and archival center, excavations uncovered the semi-circular Bouleuterion alongside the Hadrianic granary built to store grain awaiting maritime transport.",
        ],
        pullQuote: {
          text: "Recovered from reused blocks in a Late Antique wall, the Stadiasmus Patarensis preserves an inscribed survey of mountain and coastal routes across Roman Lycia.",
          attribution: "Demo Field Note 04.B — Epigraphic Overview, Patara",
        },
      },
      {
        id: "alluvial-silting-and-kekova-subsidence",
        heading: "02. Alluvial Progradation at Xanthos vs. Coastal Subsidence at Simena",
        paragraphs: [
          "The Lycian shoreline illustrates two distinct coastal processes. At Patara, sediment carried down the Xanthos (Eşen) valley gradually silted the embayment and formed coastal sand dunes around the Roman lighthouse.",
          "Further east along the channel between Kekova Island and Kaleköy (ancient Simena), historical seismic subsidence left rock-cut foundations, slipways, and staircases partially submerged along the limestone shore.",
        ],
      },
    ],
    citations: [
      {
        id: "cit-lyc-1",
        source: "Sencer Şahin & Mustafa Adak",
        publication: "Stadiasmus Patarensis: Itineraria Romana Provinciae Lyciae",
        year: "2007",
      },
      {
        id: "cit-lyc-2",
        source: "UNESCO World Heritage Centre",
        publication: "Xanthos-Letoon — World Heritage List Dossier No. 484",
        year: "1988",
        url: "https://whc.unesco.org/en/list/484/",
      },
    ],
  },
  {
    slug: "cayster-alluvium-and-marble-urbanism-at-ephesus",
    folioNo: "MONOGRAPH 05",
    title: "The Retreating Sea of Ephesus: Alluvial Silting of the Cayster Estuary and Roman Terrace Engineering",
    subtitle:
      "How Küçük Menderes sedimentation shifted the Aegean shoreline westward while terraced Roman residences rose on Bülbül Dağı.",
    excerpt:
      "At Ephesus, centuries of alluvial silt from the Cayster River transformed a coastal port into an inland archaeological landscape while preserving terraced Roman domestic quarters.",
    category: "Archaeology",
    regionId: "dest-ephesus",
    regionName: "Ephesus & The Ionian Coast",
    relatedTourId: "tour-ephesus-ionian",
    coordinates: "37.9395° N, 27.3417° E",
    elevation: "Panayırdağ & Bülbül Dağı Saddle, Selçuk",
    publishedAt: "2026-04-02",
    readingMinutes: 7,
    heroImage: DEMO_IMAGES.aegeanIonia,
    heroCaption:
      "Marble colonnades along the Curetes Way and the facade of the Library of Celsus.",
    author: {
      name: "Editorial Research Desk (Demo)",
      role: "Anatolian Atlas Monograph Series",
      isDemoByline: true,
      demoNotice: DEMO_EDITORIAL_DISCLAIMER,
    },
    keyFacts: [
      { label: "Geomorphology", value: "Westward deltaic progradation of the Küçük Menderes (Cayster)" },
      { label: "Civic Architecture", value: "Library of Celsus with double-walled masonry envelope" },
      { label: "Domestic Quarters", value: "Terrace Houses (Hanghäuser) with frescoes and hypocausts" },
      { label: "UNESCO World Heritage", value: "Ephesus (Inscribed 2015, Ref. 1018)" },
    ],
    sections: [
      {
        id: "harbor-silting-and-lysimachus",
        heading: "01. Harbor Silting & Urban Relocation",
        paragraphs: [
          "Geoarchaeological research across the Selçuk plain shows how sediment carried by the Küçük Menderes (ancient Cayster) River progressively filled the ancient embayment. During the early Hellenistic period, Lysimachus re-established the city in the valley between Panayırdağ and Bülbül Dağı.",
          "Throughout the Roman Imperial period, maintaining navigable access between the harbor basin and the sea required repeated dredging efforts before alluvial progradation eventually stranded the harbor several kilometers inland.",
        ],
        pullQuote: {
          text: "Behind the marble facade of the Library of Celsus, a peripheral cavity separates the inner brick wall from the exterior masonry to buffer moisture.",
          attribution: "Demo Field Note 05.A — Structural Section, Library of Celsus",
        },
      },
      {
        id: "terrace-houses-hydraulic-systems",
        heading: "02. Gravity-Fed Hydraulics in the Slope Houses (Yamaç Evler)",
        paragraphs: [
          "Opposite the Temple of Hadrian, the Terrace Houses climb the northern slope of Bülbül Dağı on stepped platforms. Conserved under a protective shelter by the Austrian Archaeological Institute (ÖAI), these residences preserve marble veneers, floor mosaics, and wall paintings.",
          "Terracotta piping connected to regional aqueducts supplied courtyard fountains and domestic baths, complemented by hypocaust underfloor heating channels.",
        ],
      },
    ],
    citations: [
      {
        id: "cit-eph-1",
        source: "Sabine Ladstätter / Austrian Archaeological Institute (ÖAI)",
        publication: "Terrace House 2 in Ephesos: An Archaeological Guide",
        year: "2013",
      },
      {
        id: "cit-eph-2",
        source: "UNESCO World Heritage Centre",
        publication: "Ephesus — World Heritage List Dossier No. 1018",
        year: "2015",
        url: "https://whc.unesco.org/en/list/1018/",
      },
    ],
  },
  {
    slug: "hydrothermal-travertine-terraces-and-marble-carving-at-hierapolis-aphrodisias",
    folioNo: "MONOGRAPH 06",
    title: "Calcium Bicarbonate & Blue-Grey Marble: Hydrothermal Travertine at Hierapolis and the Sculptors’ Workshops of Aphrodisias",
    subtitle:
      "Fault-controlled thermal springs in the Denizli basin and the nearby marble quarries that supplied the sculptural workshops of Aphrodisias.",
    excerpt:
      "Hierapolis and Aphrodisias illustrate how geothermal fault lines and high-grade marble beds shaped civic architecture across southwestern Anatolia.",
    category: "Geology",
    regionId: "dest-pamukkale",
    regionName: "Pamukkale, Hierapolis & Aphrodisias",
    relatedTourId: "tour-pamukkale-hierapolis",
    coordinates: "37.9250° N, 29.1258° E",
    elevation: "Çürüksu Graben & Dandalas Valley",
    publishedAt: "2026-04-12",
    readingMinutes: 6,
    heroImage: DEMO_IMAGES.ephesusCelsus,
    heroCaption:
      "Calcite rimstone pools and travertine escarpment above the Lycos Valley.",
    author: {
      name: "Editorial Research Desk (Demo)",
      role: "Anatolian Atlas Monograph Series",
      isDemoByline: true,
      demoNotice: DEMO_EDITORIAL_DISCLAIMER,
    },
    keyFacts: [
      { label: "Geothermal Process", value: "CO₂ degassing and calcium carbonate (CaCO₃) precipitation" },
      { label: "Hierapolis Sanctuary", value: "Hellenistic & Roman spa city above the travertine cliff" },
      { label: "Aphrodisias Quarries", value: "White and blue-grey marble beds on the slopes of Baba Dağ" },
      { label: "UNESCO World Heritage", value: "Hierapolis-Pamukkale (Ref. 485) & Aphrodisias (Ref. 1519)" },
    ],
    sections: [
      {
        id: "travertine-geochemistry",
        heading: "01. Degassing CO₂ & Rimstone Precipitation on the Pamukkale Fault",
        paragraphs: [
          "Along the fault system of the Denizli basin, thermal waters enriched with dissolved calcium bicarbonate emerge along the Hierapolis plateau. As the warm water flows across the escarpment and degasses carbon dioxide, calcium carbonate precipitates to form white travertine terraces and rimstone pools.",
          "Founded in the Hellenistic period and expanded under Roman rule, Hierapolis channeled these thermal springs into its monumental bath complexes while situating its Apollo sanctuary above a natural gas-venting fissure.",
        ],
        pullQuote: {
          text: "Because the marble quarries of Baba Dağ lay close to the city walls, Aphrodisian sculptors could transport blocks directly into urban workshops.",
          attribution: "Demo Field Note 06.B — Quarry & Workshop Overview, Aphrodisias",
        },
      },
      {
        id: "aphrodisias-marble-school",
        heading: "02. Two-Tone Marble & The Sculptors’ Workshop of Aphrodisias",
        paragraphs: [
          "West of the Denizli basin, Aphrodisias benefited from immediate proximity to the marble quarries on the slopes of Baba Dağ. These beds yielded both fine white marble and distinctive blue-grey marble, supporting a renowned local school of sculpture.",
          "Excavations initiated by Kenan Erim and continued by New York University and Oxford University uncovered an intact late-antique Sculptor’s Workshop near the Bouleuterion, preserving carving tools, unfinished statues, and practice reliefs.",
        ],
      },
    ],
    citations: [
      {
        id: "cit-pam-1",
        source: "UNESCO World Heritage Centre",
        publication: "Hierapolis-Pamukkale (No. 485) & Aphrodisias (No. 1519) World Heritage Dossiers",
        year: "1988 / 2017",
        url: "https://whc.unesco.org/en/list/1519/",
      },
      {
        id: "cit-pam-2",
        source: "R.R.R. Smith / New York University Excavations at Aphrodisias",
        publication: "Aphrodisias Papers & Excavation Reports",
        year: "2016",
      },
    ],
  },
];

export function getJournalArticleBySlug(slug: string): JournalArticle | null {
  return JOURNAL_ARTICLES.find((a) => a.slug === slug) || null;
}
