import { ObjectId } from "mongodb";

const SIXTY_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY = {
  _id: new ObjectId("600000000000000000000001"),
  slug: "cinema",
  color: "#33A1FF",
  label: {
    en: "Cinema",
    fr: "Cinéma",
  },
  aliases: {
    en: ["Movies", "Films"],
    fr: ["Films", "Ciné"],
  },
  description: {
    en: "Theme about cinema, filmmaking techniques, directors, and iconic movies.",
    fr: "Thème concernant le cinéma, les techniques de réalisation, les réalisateurs et les films emblématiques.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_MUSIC_ENTRY = {
  _id: new ObjectId("600000000000000000000002"),
  slug: "music",
  color: "#FA2333",
  label: {
    en: "Music",
    fr: "Musique",
  },
  aliases: {
    en: ["Songs", "Tunes"],
    fr: ["Chanson", "Son"],
  },
  description: {
    en: "Theme about music genres, instruments, composers, and musical history.",
    fr: "Thème sur les genres musicaux, les instruments, les compositeurs et l'histoire de la musique.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_SCIENCE_ENTRY = {
  _id: new ObjectId("600000000000000000000003"),
  slug: "science",
  color: "#00C853",
  label: {
    en: "Science",
    fr: "Science",
  },
  aliases: {
    en: ["Research", "Discovery"],
    fr: ["Recherche", "Découverte"],
  },
  description: {
    en: "Theme covering scientific discoveries, research methodologies, and technological innovations.",
    fr: "Thème couvrant les découvertes scientifiques, les méthodologies de recherche et les innovations technologiques.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_HISTORY_ENTRY = {
  _id: new ObjectId("600000000000000000000004"),
  slug: "history",
  color: "#FF5733",
  label: {
    en: "History",
    fr: "Histoire",
  },
  aliases: {
    en: ["Past", "Chronology"],
    fr: ["Passé", "Chronologie"],
  },
  description: {
    en: "Theme about historical events, influential figures, civilizations, and significant periods.",
    fr: "Thème sur les événements historiques, les personnages influents, les civilisations et les périodes marquantes.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_GEOGRAPHY_ENTRY = {
  _id: new ObjectId("600000000000000000000005"),
  slug: "geography",
  color: "#2962FF",
  label: {
    en: "Geography",
    fr: "Géographie",
  },
  aliases: {
    en: ["Countries", "Landscapes"],
    fr: ["Pays", "Paysages"],
  },
  description: {
    en: "Theme covering physical landscapes, political boundaries, climates, and human geography.",
    fr: "Thème couvrant les paysages physiques, les frontières politiques, les climats et la géographie humaine.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_LITERATURE_ENTRY = {
  _id: new ObjectId("600000000000000000000006"),
  slug: "literature",
  color: "#AA00FF",
  label: {
    en: "Literature",
    fr: "Littérature",
  },
  aliases: {
    en: ["Books", "Novels"],
    fr: ["Livres", "Romans"],
  },
  description: {
    en: "Theme covering literary works, genres, authors, and literary movements worldwide.",
    fr: "Thème couvrant les œuvres littéraires, les genres, les auteurs et les mouvements littéraires dans le monde.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_ANIMALS_ENTRY = {
  _id: new ObjectId("600000000000000000000007"),
  slug: "animals",
  color: "#FF6D00",
  label: {
    en: "Animals",
    fr: "Animaux",
  },
  aliases: {
    en: ["Creatures", "Wildlife"],
    fr: ["Créatures", "Faune"],
  },
  description: {
    en: "Theme covering the animal kingdom, species diversity, and wildlife habitats.",
    fr: "Thème couvrant le règne animal, la diversité des espèces et les habitats sauvages.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_SPACE_ENTRY = {
  _id: new ObjectId("600000000000000000000008"),
  slug: "space",
  color: "#1A237E",
  label: {
    en: "Space",
    fr: "Espace",
  },
  aliases: {
    en: ["Galaxy", "Cosmos"],
    fr: ["Galaxie", "Cosmos"],
  },
  description: {
    en: "Theme covering space exploration, planets, galaxies, and the mysteries of the cosmos.",
    fr: "Thème couvrant l'exploration spatiale, les planètes, les galaxies et les mystères du cosmos.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_ART_ENTRY = {
  _id: new ObjectId("600000000000000000000009"),
  slug: "art",
  color: "#E91E63",
  label: {
    en: "Art",
    fr: "Art",
  },
  aliases: {
    en: ["Painting", "Sculpture"],
    fr: ["Peinture", "Sculpture"],
  },
  description: {
    en: "Theme covering visual arts, art movements, and artistic expression throughout history.",
    fr: "Thème couvrant les arts visuels, les mouvements artistiques et l'expression artistique à travers l'histoire.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_FOOD_ENTRY = {
  _id: new ObjectId("60000000000000000000000a"),
  slug: "food",
  color: "#FFAB00",
  label: {
    en: "Food",
    fr: "Nourriture",
  },
  aliases: {
    en: ["Cuisine", "Recipes"],
    fr: ["Cuisine", "Recettes"],
  },
  description: {
    en: "Theme covering global cuisines, culinary techniques, ingredients, and food culture.",
    fr: "Thème couvrant les cuisines du monde, les techniques culinaires, les ingrédients et la culture alimentaire.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_MEDICINE_ENTRY = {
  _id: new ObjectId("60000000000000000000000b"),
  slug: "medicine",
  color: "#00ACC1",
  label: {
    en: "Medicine",
    fr: "Médecine",
  },
  aliases: {
    en: ["Healthcare", "Treatment"],
    fr: ["Santé", "Traitement"],
  },
  description: {
    en: "Theme covering medical science, diseases, treatments, and healthcare systems.",
    fr: "Thème couvrant la science médicale, les maladies, les traitements et les systèmes de santé.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_ASTRONOMY_ENTRY = {
  _id: new ObjectId("60000000000000000000000c"),
  slug: "astronomy",
  color: undefined,
  label: {
    en: "Astronomy",
    fr: "Astronomie",
  },
  aliases: {
    en: ["Stars", "Planets"],
    fr: ["Étoiles", "Planètes"],
  },
  description: {
    en: "Theme covering celestial bodies, cosmic phenomena, and the exploration of the universe.",
    fr: "Thème couvrant les corps célestes, les phénomènes cosmiques et l'exploration de l'univers.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_BIOLOGY_ENTRY = {
  _id: new ObjectId("60000000000000000000000d"),
  slug: "biology",
  color: "#4CAF50",
  label: {
    en: "Biology",
    fr: "Biologie",
  },
  aliases: {
    en: ["Organisms", "Cells"],
    fr: ["Organismes", "Cellules"],
  },
  description: {
    en: "Theme covering living organisms, biological processes, genetics, and evolution.",
    fr: "Thème couvrant les organismes vivants, les processus biologiques, la génétique et l'évolution.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_CHEMISTRY_ENTRY = {
  _id: new ObjectId("60000000000000000000000e"),
  slug: "chemistry",
  color: undefined,
  label: {
    en: "Chemistry",
    fr: "Chimie",
  },
  aliases: {
    en: ["Elements", "Reactions"],
    fr: ["Éléments", "Réactions"],
  },
  description: {
    en: "Theme covering chemical elements, molecular structures, and chemical reactions.",
    fr: "Thème couvrant les éléments chimiques, les structures moléculaires et les réactions chimiques.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_PHYSICS_ENTRY = {
  _id: new ObjectId("60000000000000000000000f"),
  slug: "physics",
  color: "#3F51B5",
  label: {
    en: "Physics",
    fr: "Physique",
  },
  aliases: {
    en: ["Forces", "Energy"],
    fr: ["Forces", "Énergie"],
  },
  description: {
    en: "Theme covering physical laws, forces, motion, energy, and the nature of matter.",
    fr: "Thème couvrant les lois physiques, les forces, le mouvement, l'énergie et la nature de la matière.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_TECHNOLOGY_ENTRY = {
  _id: new ObjectId("600000000000000000000010"),
  slug: "technology",
  color: "#00E5FF",
  label: {
    en: "Technology",
    fr: "Technologie",
  },
  aliases: {
    en: ["Tech", "Innovation"],
    fr: ["Tech", "Innovation"],
  },
  description: {
    en: "Theme covering technological advancements, digital tools, and modern innovations.",
    fr: "Thème couvrant les avancées technologiques, les outils numériques et les innovations modernes.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_GAMING_ENTRY = {
  _id: new ObjectId("600000000000000000000011"),
  slug: "gaming",
  color: "#6200EA",
  label: {
    en: "Gaming",
    fr: "Jeux vidéo",
  },
  aliases: {
    en: ["Video Games", "Esports"],
    fr: ["Jeux vidéo", "Esport"],
  },
  description: {
    en: "Theme covering video games, gaming culture, and the gaming industry.",
    fr: "Thème couvrant les jeux vidéo, la culture du jeu et l'industrie du jeu vidéo.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_POKER_ENTRY = {
  _id: new ObjectId("600000000000000000000012"),
  slug: "poker",
  color: undefined,
  label: {
    en: "Poker",
    fr: "Poker",
  },
  aliases: {
    en: ["Card Games", "Texas Hold'em"],
    fr: ["Jeux de cartes", "Texas Hold'em"],
  },
  description: {
    en: "Theme covering poker strategies, hands, and competitive card play.",
    fr: "Thème couvrant les stratégies de poker, les mains et le jeu de cartes compétitif.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_MEDITATION_ENTRY = {
  _id: new ObjectId("600000000000000000000013"),
  slug: "meditation",
  color: undefined,
  label: {
    en: "Meditation",
    fr: "Méditation",
  },
  aliases: {
    en: ["Mindfulness", "Zen"],
    fr: ["Pleine conscience", "Zen"],
  },
  description: {
    en: "Theme covering meditation techniques, mindfulness practices, and mental wellness.",
    fr: "Thème couvrant les techniques de méditation, les pratiques de pleine conscience et le bien-être mental.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_FITNESS_ENTRY = {
  _id: new ObjectId("600000000000000000000014"),
  slug: "fitness",
  color: "#76FF03",
  label: {
    en: "Fitness",
    fr: "Fitness",
  },
  aliases: {
    en: ["Exercise", "Workout"],
    fr: ["Exercice", "Entraînement"],
  },
  description: {
    en: "Theme covering physical fitness, exercise routines, and health training.",
    fr: "Thème couvrant la condition physique, les routines d'exercice et l'entraînement sportif.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_NUTRITION_ENTRY = {
  _id: new ObjectId("600000000000000000000015"),
  slug: "nutrition",
  color: undefined,
  label: {
    en: "Nutrition",
    fr: "Nutrition",
  },
  aliases: {
    en: ["Diet", "Healthy Eating"],
    fr: ["Régime", "Alimentation saine"],
  },
  description: {
    en: "Theme covering nutritional science, dietary patterns, and food health.",
    fr: "Thème couvrant la science nutritionnelle, les habitudes alimentaires et l'alimentation santé.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_CRYPTOGRAPHY_ENTRY = {
  _id: new ObjectId("600000000000000000000016"),
  slug: "cryptography",
  color: "#212121",
  label: {
    en: "Cryptography",
    fr: "Cryptographie",
  },
  aliases: {
    en: ["Encryption", "Ciphers"],
    fr: ["Chiffrement", "Cryptanalyse"],
  },
  description: {
    en: "Theme covering encryption methods, cryptanalysis, and secure communication.",
    fr: "Thème couvrant les méthodes de chiffrement, la cryptanalyse et la communication sécurisée.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_ROBOTICS_ENTRY = {
  _id: new ObjectId("600000000000000000000017"),
  slug: "robotics",
  color: "#607D8B",
  label: {
    en: "Robotics",
    fr: "Robotique",
  },
  aliases: {
    en: ["Automation", "Drones"],
    fr: ["Automatisation", "Drones"],
  },
  description: {
    en: "Theme covering robot design, autonomous systems, and robotic technology.",
    fr: "Thème couvrant la conception de robots, les systèmes autonomes et la technologie robotique.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_COFFEE_ENTRY = {
  _id: new ObjectId("600000000000000000000018"),
  slug: "coffee",
  color: "#795548",
  label: {
    en: "Coffee",
    fr: "Café",
  },
  aliases: {
    en: ["Brewing", "Espresso"],
    fr: ["Caféine", "Espresso"],
  },
  description: {
    en: "Theme covering coffee culture, brewing methods, and bean varieties.",
    fr: "Thème couvrant la culture du café, les méthodes d'infusion et les variétés de grains.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_CHOCOLATE_ENTRY = {
  _id: new ObjectId("600000000000000000000019"),
  slug: "chocolate",
  color: undefined,
  label: {
    en: "Chocolate",
    fr: "Chocolat",
  },
  aliases: {
    en: ["Cocoa", "Confectionery"],
    fr: ["Cacao", "Confiserie"],
  },
  description: {
    en: "Theme covering chocolate making, cacao history, and confectionery arts.",
    fr: "Thème couvrant la fabrication du chocolat, l'histoire du cacao et l'art de la confiserie.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_CARS_ENTRY = {
  _id: new ObjectId("60000000000000000000001a"),
  slug: "cars",
  color: "#D50000",
  label: {
    en: "Cars",
    fr: "Voitures",
  },
  aliases: {
    en: ["Automobiles", "Vehicles"],
    fr: ["Automobiles", "Véhicules"],
  },
  description: {
    en: "Theme covering automobiles, car history, and automotive engineering.",
    fr: "Thème couvrant les automobiles, l'histoire de l'automobile et l'ingénierie automobile.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_COMICS_ENTRY = {
  _id: new ObjectId("60000000000000000000001b"),
  slug: "comics",
  color: "#FF1744",
  label: {
    en: "Comics",
    fr: "BD",
  },
  aliases: {
    en: ["Graphic Novels", "Superheroes"],
    fr: ["Romans graphiques", "Super-héros"],
  },
  description: {
    en: "Theme covering comic books, graphic novels, and sequential art.",
    fr: "Thème couvrant les bandes dessinées, les romans graphiques et l'art séquentiel.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_AVIATION_ENTRY = {
  _id: new ObjectId("60000000000000000000001c"),
  slug: "aviation",
  color: "#40C4FF",
  label: {
    en: "Aviation",
    fr: "Aviation",
  },
  aliases: {
    en: ["Aeronautics", "Flight"],
    fr: ["Aéronautique", "Vol"],
  },
  description: {
    en: "Theme covering aviation, aircraft, and the history of flight.",
    fr: "Thème couvrant l'aviation, les aéronefs et l'histoire du vol.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_MARITIME_ENTRY = {
  _id: new ObjectId("60000000000000000000001d"),
  slug: "maritime",
  color: undefined,
  label: {
    en: "Maritime",
    fr: "Maritime",
  },
  aliases: {
    en: ["Navigation", "Ocean"],
    fr: ["Navigation", "Océan"],
  },
  description: {
    en: "Theme covering the maritime world, navigation, and oceans.",
    fr: "Thème couvrant le monde maritime, la navigation et les océans.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_WINE_ENTRY = {
  _id: new ObjectId("60000000000000000000001e"),
  slug: "wine",
  color: "#B71C1C",
  label: {
    en: "Wine",
    fr: "Vin",
  },
  aliases: {
    en: ["Viticulture", "Oenology"],
    fr: ["Viticulture", "Œnologie"],
  },
  description: {
    en: "Theme covering wine, viticulture, and oenology.",
    fr: "Thème couvrant le vin, la viticulture et l'œnologie.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_BEER_ENTRY = {
  _id: new ObjectId("60000000000000000000001f"),
  slug: "beer",
  color: undefined,
  label: {
    en: "Beer",
    fr: "Bière",
  },
  aliases: {
    en: ["Brewing", "Hops"],
    fr: ["Brasserie", "Houblon"],
  },
  description: {
    en: "Theme covering beer, breweries, and beer varieties.",
    fr: "Thème couvrant la bière, les brasseries et les types de bières.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_TEA_ENTRY = {
  _id: new ObjectId("600000000000000000000020"),
  slug: "tea",
  color: "#A5D6A7",
  label: {
    en: "Tea",
    fr: "Thé",
  },
  aliases: {
    en: ["Infusion", "Teapot"],
    fr: ["Infusion", "Théière"],
  },
  description: {
    en: "Theme covering tea, tea ceremonies, and tea varieties.",
    fr: "Thème couvrant le thé, les cérémonies du thé et les variétés.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_GARDENING_ENTRY = {
  _id: new ObjectId("600000000000000000000021"),
  slug: "gardening",
  color: "#2E7D32",
  label: {
    en: "Gardening",
    fr: "Jardinage",
  },
  aliases: {
    en: ["Horticulture", "Plants"],
    fr: ["Horticulture", "Plantes"],
  },
  description: {
    en: "Theme covering gardening, horticulture, and garden design.",
    fr: "Thème couvrant le jardinage, l'horticulture et l'art des jardins.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_DANCE_ENTRY = {
  _id: new ObjectId("600000000000000000000022"),
  slug: "dance",
  color: undefined,
  label: {
    en: "Dance",
    fr: "Danse",
  },
  aliases: {
    en: ["Ballet", "Choreography"],
    fr: ["Ballet", "Chorégraphie"],
  },
  description: {
    en: "Theme covering dance, dance styles, and choreography.",
    fr: "Thème couvrant la danse, les styles de danse et la chorégraphie.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_THEATER_ENTRY = {
  _id: new ObjectId("600000000000000000000023"),
  slug: "theater",
  color: "#FFC107",
  label: {
    en: "Theater",
    fr: "Théâtre",
  },
  aliases: {
    en: ["Performance", "Comedy"],
    fr: ["Spectacle", "Comédie"],
  },
  description: {
    en: "Theme covering theater, plays, and performing arts.",
    fr: "Thème couvrant le théâtre, les pièces et les arts de la scène.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_FASHION_ENTRY = {
  _id: new ObjectId("600000000000000000000024"),
  slug: "fashion",
  color: undefined,
  label: {
    en: "Fashion",
    fr: "Mode",
  },
  aliases: {
    en: ["Clothing", "Couture"],
    fr: ["Vêtements", "Couture"],
  },
  description: {
    en: "Theme covering fashion, clothing, and the textile industry.",
    fr: "Thème couvrant la mode, les vêtements et l'industrie textile.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_ARCHITECTURE_ENTRY = {
  _id: new ObjectId("600000000000000000000025"),
  slug: "architecture",
  color: "#8D6E63",
  label: {
    en: "Architecture",
    fr: "Architecture",
  },
  aliases: {
    en: ["Buildings", "Design"],
    fr: ["Bâtiments", "Design"],
  },
  description: {
    en: "Theme covering architecture, buildings, and urban planning.",
    fr: "Thème couvrant l'architecture, les bâtiments et l'urbanisme.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_POLITICS_ENTRY = {
  _id: new ObjectId("600000000000000000000026"),
  slug: "politics",
  color: undefined,
  label: {
    en: "Politics",
    fr: "Politique",
  },
  aliases: {
    en: ["Government", "Elections"],
    fr: ["Gouvernement", "Élections"],
  },
  description: {
    en: "Theme covering political systems, ideologies, governance, and international relations.",
    fr: "Thème couvrant les systèmes politiques, les idéologies, la gouvernance et les relations internationales.",
  },
  status: "archived",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_ECONOMICS_ENTRY = {
  _id: new ObjectId("600000000000000000000027"),
  slug: "economics",
  color: "#FFD600",
  label: {
    en: "Economics",
    fr: "Économie",
  },
  aliases: {
    en: ["Finance", "Trade"],
    fr: ["Finance", "Commerce"],
  },
  description: {
    en: "Theme covering economic systems, markets, trade, and financial theories.",
    fr: "Thème couvrant les systèmes économiques, les marchés, le commerce et les théories financières.",
  },
  status: "archived",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_PHILOSOPHY_ENTRY = {
  _id: new ObjectId("600000000000000000000028"),
  slug: "philosophy",
  color: undefined,
  label: {
    en: "Philosophy",
    fr: "Philosophie",
  },
  aliases: {
    en: ["Wisdom", "Ethics"],
    fr: ["Sagesse", "Éthique"],
  },
  description: {
    en: "Theme covering philosophical ideas, thinkers, ethics, logic, and schools of thought.",
    fr: "Thème couvrant les idées philosophiques, les penseurs, l'éthique, la logique et les écoles de pensée.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_PSYCHOLOGY_ENTRY = {
  _id: new ObjectId("600000000000000000000029"),
  slug: "psychology",
  color: "#9C27B0",
  label: {
    en: "Psychology",
    fr: "Psychologie",
  },
  aliases: {
    en: ["Mind", "Behavior"],
    fr: ["Esprit", "Comportement"],
  },
  description: {
    en: "Theme covering human behavior, mental processes, cognition, and psychological theories.",
    fr: "Thème couvrant le comportement humain, les processus mentaux, la cognition et les théories psychologiques.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_SOCIOLOGY_ENTRY = {
  _id: new ObjectId("60000000000000000000002a"),
  slug: "sociology",
  color: undefined,
  label: {
    en: "Sociology",
    fr: "Sociologie",
  },
  aliases: {
    en: ["Society", "Culture"],
    fr: ["Société", "Culture"],
  },
  description: {
    en: "Theme covering social structures, group behavior, cultural norms, and societal changes.",
    fr: "Thème couvrant les structures sociales, le comportement de groupe, les normes culturelles et les changements sociétaux.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_ANTHROPOLOGY_ENTRY = {
  _id: new ObjectId("60000000000000000000002b"),
  slug: "anthropology",
  color: "#F4511E",
  label: {
    en: "Anthropology",
    fr: "Anthropologie",
  },
  aliases: {
    en: ["Culture", "Evolution"],
    fr: ["Culture", "Évolution"],
  },
  description: {
    en: "Theme covering human societies, cultural evolution, and anthropological research.",
    fr: "Thème couvrant les sociétés humaines, l'évolution culturelle et la recherche anthropologique.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_ARCHAEOLOGY_ENTRY = {
  _id: new ObjectId("60000000000000000000002c"),
  slug: "archaeology",
  color: undefined,
  label: {
    en: "Archaeology",
    fr: "Archéologie",
  },
  aliases: {
    en: ["Excavation", "Artifacts"],
    fr: ["Fouilles", "Artéfacts"],
  },
  description: {
    en: "Theme covering archaeological digs, ancient civilizations, and material culture.",
    fr: "Thème couvrant les fouilles archéologiques, les civilisations anciennes et la culture matérielle.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_LINGUISTICS_ENTRY = {
  _id: new ObjectId("60000000000000000000002d"),
  slug: "linguistics",
  color: "#009688",
  label: {
    en: "Linguistics",
    fr: "Linguistique",
  },
  aliases: {
    en: ["Languages", "Grammar"],
    fr: ["Langues", "Grammaire"],
  },
  description: {
    en: "Theme covering language structure, phonetics, syntax, and linguistic theory.",
    fr: "Thème couvrant la structure des langues, la phonétique, la syntaxe et la théorie linguistique.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_MYTHOLOGY_ENTRY = {
  _id: new ObjectId("60000000000000000000002e"),
  slug: "mythology",
  color: "#E040FB",
  label: {
    en: "Mythology",
    fr: "Mythologie",
  },
  aliases: {
    en: ["Legends", "Deities"],
    fr: ["Légendes", "Divinités"],
  },
  description: {
    en: "Theme covering myths, legends, deities, and mythological traditions across cultures.",
    fr: "Thème couvrant les mythes, légendes, divinités et traditions mythologiques à travers les cultures.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_MILITARY_ENTRY = {
  _id: new ObjectId("60000000000000000000002f"),
  slug: "military",
  color: "#4E342E",
  label: {
    en: "Military",
    fr: "Militaire",
  },
  aliases: {
    en: ["Armed Forces", "Defense"],
    fr: ["Forces Armées", "Défense"],
  },
  description: {
    en: "Theme covering armed forces, military history, strategy, and defense systems.",
    fr: "Thème couvrant les forces armées, l'histoire militaire, la stratégie et les systèmes de défense.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_RELIGION_ENTRY = {
  _id: new ObjectId("600000000000000000000030"),
  slug: "religion",
  color: undefined,
  label: {
    en: "Religion",
    fr: "Religion",
  },
  aliases: {
    en: ["Faith", "Beliefs"],
    fr: ["Foi", "Croyances"],
  },
  description: {
    en: "Theme covering world religions, belief systems, rituals, and spiritual practices.",
    fr: "Thème couvrant les religions du monde, les systèmes de croyance, les rituels et les pratiques spirituelles.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_MATHEMATICS_ENTRY = {
  _id: new ObjectId("600000000000000000000031"),
  slug: "mathematics",
  color: "#1B5E20",
  label: {
    en: "Mathematics",
    fr: "Mathématiques",
  },
  aliases: {
    en: ["Algebra", "Geometry"],
    fr: ["Algèbre", "Géométrie"],
  },
  description: {
    en: "Theme covering mathematical theories, equations, proofs, and numerical concepts.",
    fr: "Thème couvrant les théories mathématiques, les équations, les preuves et les concepts numériques.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_YOGA_ENTRY = {
  _id: new ObjectId("600000000000000000000032"),
  slug: "yoga",
  color: undefined,
  label: {
    en: "Yoga",
    fr: "Yoga",
  },
  aliases: {
    en: ["Asanas", "Pranayama"],
    fr: ["Postures", "Respiration"],
  },
  description: {
    en: "Theme covering yoga practices, postures, breathing techniques, and meditation.",
    fr: "Thème couvrant les pratiques de yoga, les postures, les techniques de respiration et la méditation.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_TRAVEL_ENTRY = {
  _id: new ObjectId("600000000000000000000033"),
  slug: "travel",
  color: "#0288D1",
  label: {
    en: "Travel",
    fr: "Voyage",
  },
  aliases: {
    en: ["Tourism", "Adventure"],
    fr: ["Tourisme", "Aventure"],
  },
  description: {
    en: "Theme covering travel destinations, cultures, tourism, and exploration.",
    fr: "Thème couvrant les destinations de voyage, les cultures, le tourisme et l'exploration.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_CLIMATE_ENTRY = {
  _id: new ObjectId("600000000000000000000034"),
  slug: "climate",
  color: undefined,
  label: {
    en: "Climate",
    fr: "Climat",
  },
  aliases: {
    en: ["Weather", "Global Warming"],
    fr: ["Météo", "Réchauffement"],
  },
  description: {
    en: "Theme covering climate systems, weather patterns, and climate change science.",
    fr: "Thème couvrant les systèmes climatiques, les schémas météorologiques et la science du changement climatique.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_ECOLOGY_ENTRY = {
  _id: new ObjectId("600000000000000000000035"),
  slug: "ecology",
  color: "#33691E",
  label: {
    en: "Ecology",
    fr: "Écologie",
  },
  aliases: {
    en: ["Environment", "Conservation"],
    fr: ["Environnement", "Conservation"],
  },
  description: {
    en: "Theme covering ecosystems, biodiversity, conservation, and environmental science.",
    fr: "Thème couvrant les écosystèmes, la biodiversité, la conservation et la science environnementale.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_ENERGY_ENTRY = {
  _id: new ObjectId("600000000000000000000036"),
  slug: "energy",
  color: "#FFD600",
  label: {
    en: "Energy",
    fr: "Énergie",
  },
  aliases: {
    en: ["Power", "Renewables"],
    fr: ["Puissance", "Renouvelables"],
  },
  description: {
    en: "Theme covering energy sources, power generation, and sustainable technologies.",
    fr: "Thème couvrant les sources d'énergie, la production d'électricité et les technologies durables.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_PALEONTOLOGY_ENTRY = {
  _id: new ObjectId("600000000000000000000037"),
  slug: "paleontology",
  color: undefined,
  label: {
    en: "Paleontology",
    fr: "Paléontologie",
  },
  aliases: {
    en: ["Fossils", "Dinosaurs"],
    fr: ["Fossiles", "Dinosaures"],
  },
  description: {
    en: "Theme covering fossils, prehistoric life, dinosaurs, and geological time periods.",
    fr: "Thème couvrant les fossiles, la vie préhistorique, les dinosaures et les périodes géologiques.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_CHESS_ENTRY = {
  _id: new ObjectId("600000000000000000000038"),
  slug: "chess",
  color: "#455A64",
  label: {
    en: "Chess",
    fr: "Échecs",
  },
  aliases: {
    en: ["Chessboard", "Openings"],
    fr: ["Échiquier", "Ouvertures"],
  },
  description: {
    en: "Theme covering chess strategies, openings, endgames, and famous players.",
    fr: "Thème couvrant les stratégies d'échecs, les ouvertures, les finales et les joueurs célèbres.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_PHOTOGRAPHY_ENTRY = {
  _id: new ObjectId("600000000000000000000039"),
  slug: "photography",
  color: "#37474F",
  label: {
    en: "Photography",
    fr: "Photographie",
  },
  aliases: {
    en: ["Camera", "Portrait"],
    fr: ["Appareil Photo", "Portrait"],
  },
  description: {
    en: "Theme covering photography techniques, camera equipment, and visual composition.",
    fr: "Thème couvrant les techniques photographiques, le matériel et la composition visuelle.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_ANIME_ENTRY = {
  _id: new ObjectId("60000000000000000000003a"),
  slug: "anime",
  color: "#FF4081",
  label: {
    en: "Anime",
    fr: "Anime",
  },
  aliases: {
    en: ["Manga", "Japanese Animation"],
    fr: ["Manga", "Animation Japonaise"],
  },
  description: {
    en: "Theme covering anime series, films, genres, and Japanese animation culture.",
    fr: "Thème couvrant les séries animées, les films, les genres et la culture de l'animation japonaise.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_MAGIC_ENTRY = {
  _id: new ObjectId("60000000000000000000003b"),
  slug: "magic",
  color: "#7C4DFF",
  label: {
    en: "Magic",
    fr: "Magie",
  },
  aliases: {
    en: ["Illusion", "Sorcery"],
    fr: ["Illusion", "Sorcellerie"],
  },
  description: {
    en: "Theme covering magic tricks, illusionism, stage magic, and the history of conjuring.",
    fr: "Thème couvrant les tours de magie, l'illusionnisme, la magie de scène et l'histoire de la prestidigitation.",
  },
  status: "active",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_SPORTS_ENTRY = {
  _id: new ObjectId("60000000000000000000003c"),
  slug: "sports",
  color: undefined,
  label: {
    en: "Sports",
    fr: "Sports",
  },
  aliases: {
    en: ["Competition", "Games"],
    fr: ["Compétition", "Jeux"],
  },
  description: {
    en: "Theme covering athletic competitions, sports disciplines, teams, and sporting history.",
    fr: "Thème couvrant les compétitions sportives, les disciplines, les équipes et l'histoire du sport.",
  },
  status: "archived",
  createdAt: new Date("2025-01-01T00:00:00.000Z"),
  updatedAt: new Date("2025-01-01T00:00:00.000Z"),
};

const SIXTY_QUESTION_THEMES_FIXTURE_SET = [
  SIXTY_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_MUSIC_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_SCIENCE_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_HISTORY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_GEOGRAPHY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_LITERATURE_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ANIMALS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_SPACE_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ART_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_FOOD_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_MEDICINE_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ASTRONOMY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_BIOLOGY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_CHEMISTRY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_PHYSICS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_TECHNOLOGY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_GAMING_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_POKER_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_MEDITATION_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_FITNESS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_NUTRITION_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_CRYPTOGRAPHY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ROBOTICS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_COFFEE_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_CHOCOLATE_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_CARS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_COMICS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_AVIATION_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_MARITIME_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_WINE_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_BEER_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_TEA_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_GARDENING_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_DANCE_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_THEATER_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_FASHION_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ARCHITECTURE_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_POLITICS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ECONOMICS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_PHILOSOPHY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_PSYCHOLOGY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_SOCIOLOGY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ANTHROPOLOGY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ARCHAEOLOGY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_LINGUISTICS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_MYTHOLOGY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_MILITARY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_RELIGION_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_MATHEMATICS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_YOGA_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_TRAVEL_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_CLIMATE_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ECOLOGY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ENERGY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_PALEONTOLOGY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_CHESS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_PHOTOGRAPHY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ANIME_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_MAGIC_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_SPORTS_ENTRY,
] as const;

export {
  SIXTY_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_MUSIC_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_SCIENCE_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_HISTORY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_GEOGRAPHY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_LITERATURE_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ANIMALS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_SPACE_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ART_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_FOOD_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_MEDICINE_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ASTRONOMY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_BIOLOGY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_CHEMISTRY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_PHYSICS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_TECHNOLOGY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_GAMING_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_POKER_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_MEDITATION_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_FITNESS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_NUTRITION_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_CRYPTOGRAPHY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ROBOTICS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_COFFEE_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_CHOCOLATE_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_CARS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_COMICS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_AVIATION_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_MARITIME_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_WINE_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_BEER_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_TEA_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_GARDENING_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_DANCE_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_THEATER_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_FASHION_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ARCHITECTURE_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_POLITICS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ECONOMICS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_PHILOSOPHY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_PSYCHOLOGY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_SOCIOLOGY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ANTHROPOLOGY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ARCHAEOLOGY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_LINGUISTICS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_MYTHOLOGY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_MILITARY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_RELIGION_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_MATHEMATICS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_YOGA_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_TRAVEL_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_CLIMATE_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ECOLOGY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ENERGY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_PALEONTOLOGY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_CHESS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_PHOTOGRAPHY_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_ANIME_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_MAGIC_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_SPORTS_ENTRY,
  SIXTY_QUESTION_THEMES_FIXTURE_SET,
};