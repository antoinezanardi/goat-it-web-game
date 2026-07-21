import { ObjectId } from "mongodb";

import { SIXTY_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_MUSIC_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_SCIENCE_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_HISTORY_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_GEOGRAPHY_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_LITERATURE_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_ANIMALS_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_SPACE_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_ART_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_FOOD_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_MEDICINE_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_ASTRONOMY_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_BIOLOGY_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_CHEMISTRY_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_PHYSICS_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_TECHNOLOGY_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_GAMING_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_POKER_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_MEDITATION_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_FITNESS_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_NUTRITION_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_CRYPTOGRAPHY_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_ROBOTICS_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_COFFEE_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_CHOCOLATE_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_CARS_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_COMICS_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_AVIATION_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_MARITIME_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_WINE_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_BEER_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_TEA_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_GARDENING_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_DANCE_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_THEATER_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_FASHION_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_ARCHITECTURE_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_POLITICS_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_PHILOSOPHY_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_PSYCHOLOGY_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_SOCIOLOGY_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_ANTHROPOLOGY_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_MYTHOLOGY_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_MILITARY_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_RELIGION_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_MATHEMATICS_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_YOGA_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_TRAVEL_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_CLIMATE_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_ECOLOGY_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_ENERGY_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_PALEONTOLOGY_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_CHESS_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_PHOTOGRAPHY_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_ANIME_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_MAGIC_ENTRY, SIXTY_QUESTION_THEMES_FIXTURE_SPORTS_ENTRY } from "../../question-theme/sets/sixty-question-themes.fixture-set.ts";

const SIXTY_QUESTIONS_FIXTURE_SET = [
  {
    _id: new ObjectId("700000000000000000000001"),
    category: "trivia",
    status: "active",
    cognitiveDifficulty: "easy",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "Which 1994 film starring Tom Hanks won the Academy Award for Best Picture?",
        fr: "Quel film de 1994 avec Tom Hanks a remporté l'Oscar du meilleur film?",
      },
      answer: {
        en: "Forrest Gump",
        fr: "Forrest Gump",
      },
      context: {
        en: "'Forrest Gump' won six Academy Awards including Best Picture, Best Actor, and Best Director in 1995.",
        fr: "'Forrest Gump' a remporté six Oscars dont ceux du meilleur film, du meilleur acteur et du meilleur réalisateur en 1995.",
      },
      trivia: {
        en: ["The film's visual effects allowed Tom Hanks to appear in historical footage with US presidents.", "The screenplay was originally much darker in tone."],
        fr: ["Les effets visuels du film ont permis à Tom Hanks d'apparaître dans des images d'archives avec des présidents américains.", "Le scénario était à l'origine beaucoup plus sombre."],
      },
    },
    author: {
      role: "admin",
      name: "Question Curator",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Forrest_Gump", "https://www.imdb.com/title/tt0109830/"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("700000000000000000000002"),
    category: "lexicon",
    status: "active",
    cognitiveDifficulty: "medium",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_MUSIC_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "What term refers to a group of four musicians performing together?",
        fr: "Quel terme désigne un groupe de quatre musiciens jouant ensemble?",
      },
      answer: {
        en: "Quartet",
        fr: "Quatuor",
      },
      trivia: {
        en: ["The string quartet is one of the most prominent chamber music ensembles.", "Famous quartets include the Beatles as a rock band formation."],
        fr: ["Le quatuor à cordes est l'un des ensembles de musique de chambre les plus importants.", "Les Beatles sont un exemple célèbre de formation en quatuor rock."],
      },
    },
    author: {
      role: "ai",
      name: "Lexicon AI",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Quartet"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("700000000000000000000003"),
    category: "riddle",
    status: "active",
    cognitiveDifficulty: "hard",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_SCIENCE_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "I can be cracked, made, told, and played. What am I?",
        fr: "Je peux être brisé, fabriqué, raconté et joué. Que suis-je?",
      },
      answer: {
        en: "A joke",
        fr: "Une blague",
      },
      context: {
        en: "The word 'joke' fits all these verbs: crack a joke, make a joke, tell a joke, play a joke.",
        fr: "Le mot 'blague' correspond à tous ces verbes : crack a joke (faire une blague), make a joke, tell a joke (raconter une blague), play a joke (jouer un tour).",
      },
    },
    author: {
      role: "game",
      gameId: new ObjectId("a00000000000000000000001"),
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Joke"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("700000000000000000000004"),
    category: "explanation",
    status: "active",
    cognitiveDifficulty: "medium",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_HISTORY_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "Explain why the Roman Empire fell in the 5th century AD.",
        fr: "Expliquez pourquoi l'Empire romain s'est effondré au 5e siècle après J.-C.",
      },
      answer: {
        en: "The Roman Empire fell due to a combination of economic troubles, military defeats, political corruption, and barbarian invasions.",
        fr: "L'Empire romain est tombé en raison d'une combinaison de problèmes économiques, de défaites militaires, de corruption politique et d'invasions barbares.",
      },
      context: {
        en: "The Western Roman Empire officially ended in 476 AD when Emperor Romulus Augustus was deposed.",
        fr: "L'Empire romain d'Occident a officiellement pris fin en 476 après J.-C. lorsque l'empereur Romulus Auguste a été destitué.",
      },
      trivia: {
        en: ["The Eastern Roman Empire continued as the Byzantine Empire for another thousand years."],
        fr: ["L'Empire romain d'Orient a continué sous le nom d'Empire byzantin pendant encore mille ans."],
      },
    },
    author: {
      role: "admin",
      name: "History Expert",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Fall_of_the_Western_Roman_Empire", "https://www.britannica.com/event/Fall-of-the-Roman-Empire", "https://www.history.com/topics/ancient-rome/fall-of-rome"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("700000000000000000000005"),
    category: "trivia",
    status: "active",
    cognitiveDifficulty: "easy",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_GEOGRAPHY_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "What is the longest river in the world?",
        fr: "Quel est le plus long fleuve du monde?",
      },
      answer: {
        en: "The Nile",
        fr: "Le Nil",
      },
      context: {
        en: "The Nile River flows through 11 countries in northeastern Africa and is approximately 6,650 km long.",
        fr: "Le Nil traverse 11 pays d'Afrique du Nord-Est et mesure environ 6 650 km de long.",
      },
    },
    author: {
      role: "ai",
      name: "Geography AI",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Nile"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("700000000000000000000006"),
    category: "lexicon",
    status: "active",
    cognitiveDifficulty: "medium",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_LITERATURE_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "What is the literary term for a character who opposes the protagonist?",
        fr: "Quel est le terme littéraire pour désigner un personnage qui s'oppose au protagoniste?",
      },
      answer: {
        en: "Antagonist",
        fr: "Antagoniste",
      },
      trivia: {
        en: ["The term comes from the Greek word 'antagonistes' meaning opponent or rival."],
        fr: ["Le terme vient du mot grec 'antagonistes' qui signifie opposant ou rival."],
      },
    },
    author: {
      role: "game",
      gameId: new ObjectId("a00000000000000000000002"),
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Antagonist"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("700000000000000000000007"),
    category: "riddle",
    status: "active",
    cognitiveDifficulty: "easy",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_ANIMALS_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "What animal is known as the 'king of the jungle' even though it doesn't live in the jungle?",
        fr: "Quel animal est connu comme le 'roi de la jungle' même s'il ne vit pas dans la jungle?",
      },
      answer: {
        en: "Lion",
        fr: "Lion",
      },
      context: {
        en: "Lions actually live in savannas and grasslands, not jungles. The phrase 'king of the jungle' comes from their majestic appearance and behavior.",
        fr: "Les lions vivent en réalité dans les savanes et les prairies, pas dans les jungles. L'expression 'roi de la jungle' vient de leur apparence majestueuse et de leur comportement.",
      },
    },
    author: {
      role: "admin",
      name: "Wildlife Expert",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Lion"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("700000000000000000000008"),
    category: "trivia",
    status: "active",
    cognitiveDifficulty: "hard",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_SPACE_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "What is the name of the first human-made object to reach interstellar space?",
        fr: "Quel est le nom du premier objet fabriqué par l'homme à avoir atteint l'espace interstellaire?",
      },
      answer: {
        en: "Voyager 1",
        fr: "Voyager 1",
      },
      context: {
        en: "Voyager 1 crossed the heliopause and entered interstellar space in August 2012.",
        fr: "Voyager 1 a traversé l'héliopause et est entré dans l'espace interstellaire en août 2012.",
      },
      trivia: {
        en: ["Voyager 1 carries the Golden Record, a time capsule of sounds and images from Earth.", "It was launched in 1977 and is still communicating with NASA."],
        fr: ["Voyager 1 transporte le Golden Record, une capsule temporelle de sons et d'images de la Terre.", "Il a été lancé en 1977 et communique toujours avec la NASA."],
      },
    },
    author: {
      role: "ai",
      name: "Space AI",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Voyager_1", "https://www.nasa.gov/mission/voyager/"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("700000000000000000000009"),
    category: "explanation",
    status: "active",
    cognitiveDifficulty: "medium",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_ART_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "Explain the technique of chiaroscuro in painting.",
        fr: "Expliquez la technique du clair-obscur en peinture.",
      },
      answer: {
        en: "Chiaroscuro is an artistic technique using strong contrasts between light and dark to create a sense of volume and three-dimensionality.",
        fr: "Le clair-obscur est une technique artistique utilisant de forts contrastes entre la lumière et l'ombre pour créer un sentiment de volume et de tridimensionnalité.",
      },
      context: {
        en: "The technique was pioneered during the Renaissance by artists like Leonardo da Vinci and Caravaggio.",
        fr: "La technique a été initiée à la Renaissance par des artistes comme Léonard de Vinci et Le Caravage.",
      },
    },
    author: {
      role: "game",
      gameId: new ObjectId("a00000000000000000000003"),
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Chiaroscuro"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("70000000000000000000000a"),
    category: "trivia",
    status: "active",
    cognitiveDifficulty: "easy",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_FOOD_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "Which fruit is known as the 'king of fruits' and has a strong distinctive smell?",
        fr: "Quel fruit est connu comme le 'roi des fruits' et a une odeur forte et distinctive?",
      },
      answer: {
        en: "Durian",
        fr: "Durian",
      },
      context: {
        en: "Durian is native to Southeast Asia and is banned from many public places due to its pungent odor.",
        fr: "Le durian est originaire d'Asie du Sud-Est et est interdit dans de nombreux lieux publics en raison de son odeur piquante.",
      },
      trivia: {
        en: ["Despite its smell, durian is considered a delicacy in many Asian countries.", "There are over 100 varieties of durian."],
        fr: ["Malgré son odeur, le durian est considéré comme un mets délicat dans de nombreux pays asiatiques.", "Il existe plus de 100 variétés de durian."],
      },
    },
    author: {
      role: "admin",
      name: "Food Expert",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Durian"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("70000000000000000000000b"),
    category: "lexicon",
    status: "active",
    cognitiveDifficulty: "hard",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_MEDICINE_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "What is the medical term for inflammation of the joints?",
        fr: "Quel est le terme médical pour l'inflammation des articulations?",
      },
      answer: {
        en: "Arthritis",
        fr: "Arthrite",
      },
      trivia: {
        en: ["There are over 100 different types of arthritis.", "Osteoarthritis is the most common form."],
        fr: ["Il existe plus de 100 types différents d'arthrite.", "L'arthrose est la forme la plus courante."],
      },
    },
    author: {
      role: "ai",
      name: "Medical AI",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Arthritis", "https://www.who.int/news-room/fact-sheets/detail/arthritis"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("70000000000000000000000c"),
    category: "riddle",
    status: "active",
    cognitiveDifficulty: "hard",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_ASTRONOMY_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "I have a head and a tail but no body. I travel through space, leaving a bright trail. What am I?",
        fr: "J'ai une tête et une queue mais pas de corps. Je voyage dans l'espace, laissant une traînée lumineuse. Que suis-je?",
      },
      answer: {
        en: "A comet",
        fr: "Une comète",
      },
      context: {
        en: "Comets are icy bodies that heat up as they approach the Sun, releasing gas and dust that form a visible coma and tail.",
        fr: "Les comètes sont des corps glacés qui se réchauffent en s'approchant du Soleil, libérant du gaz et de la poussière qui forment une chevelure et une queue visibles.",
      },
    },
    author: {
      role: "game",
      gameId: new ObjectId("a00000000000000000000004"),
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Comet"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("70000000000000000000000d"),
    category: "explanation",
    status: "active",
    cognitiveDifficulty: "medium",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_BIOLOGY_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "Explain how photosynthesis works in plants.",
        fr: "Expliquez comment fonctionne la photosynthèse chez les plantes.",
      },
      answer: {
        en: "Photosynthesis is the process where plants convert sunlight, water, and carbon dioxide into glucose and oxygen using chlorophyll.",
        fr: "La photosynthèse est le processus par lequel les plantes convertissent la lumière du soleil, l'eau et le dioxyde de carbone en glucose et en oxygène à l'aide de la chlorophylle.",
      },
      context: {
        en: "Photosynthesis occurs in the chloroplasts of plant cells, primarily in the leaves.",
        fr: "La photosynthèse se produit dans les chloroplastes des cellules végétales, principalement dans les feuilles.",
      },
    },
    author: {
      role: "admin",
      name: "Biology Teacher",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Photosynthesis"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("70000000000000000000000e"),
    category: "trivia",
    status: "pending",
    cognitiveDifficulty: "easy",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_CHEMISTRY_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "What is the chemical symbol for gold?",
        fr: "Quel est le symbole chimique de l'or?",
      },
      answer: {
        en: "Au",
        fr: "Au",
      },
      context: {
        en: "The symbol Au comes from the Latin word 'aurum', meaning gold.",
        fr: "Le symbole Au vient du mot latin 'aurum', qui signifie or.",
      },
    },
    author: {
      role: "ai",
      name: "Chemistry AI",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Gold"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("70000000000000000000000f"),
    category: "lexicon",
    status: "active",
    cognitiveDifficulty: "hard",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_PHYSICS_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "What is the SI unit of electric current?",
        fr: "Quelle est l'unité SI du courant électrique?",
      },
      answer: {
        en: "Ampere",
        fr: "Ampère",
      },
      trivia: {
        en: ["The ampere is named after the French mathematician and physicist André-Marie Ampère.", "It is one of the seven SI base units."],
        fr: ["L'ampère est nommé d'après le mathématicien et physicien français André-Marie Ampère.", "C'est l'une des sept unités de base du SI."],
      },
    },
    author: {
      role: "game",
      gameId: new ObjectId("a00000000000000000000005"),
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Ampere"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("700000000000000000000010"),
    category: "riddle",
    status: "active",
    cognitiveDifficulty: "easy",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_TECHNOLOGY_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "I have keys but no locks. I have space but no room. You can enter but can't go inside. What am I?",
        fr: "J'ai des touches mais pas de serrures. J'ai de l'espace mais pas de pièce. On peut entrer mais pas aller à l'intérieur. Que suis-je?",
      },
      answer: {
        en: "A keyboard",
        fr: "Un clavier",
      },
    },
    author: {
      role: "admin",
      name: "Riddle Master",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Computer_keyboard"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("700000000000000000000011"),
    category: "explanation",
    status: "active",
    cognitiveDifficulty: "medium",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_PSYCHOLOGY_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_PHILOSOPHY_ENTRY._id,
        isHint: true,
        isPrimary: false,
      },
    ],
    content: {
      statement: {
        en: "Explain the concept of classical conditioning as discovered by Pavlov.",
        fr: "Expliquez le concept du conditionnement classique découvert par Pavlov.",
      },
      answer: {
        en: "Classical conditioning is a learning process where a neutral stimulus becomes associated with a reflexive response through repeated pairing with an unconditioned stimulus.",
        fr: "Le conditionnement classique est un processus d'apprentissage où un stimulus neutre s'associe à une réponse réflexe par association répétée avec un stimulus inconditionnel.",
      },
      context: {
        en: "Ivan Pavlov famously demonstrated this by conditioning dogs to salivate at the sound of a bell.",
        fr: "Ivan Pavlov a célèbrement démontré ce phénomène en conditionnant des chiens à saliver au son d'une cloche.",
      },
    },
    author: {
      role: "ai",
      name: "Psychology AI",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Classical_conditioning"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("700000000000000000000012"),
    category: "trivia",
    status: "active",
    cognitiveDifficulty: "hard",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_COFFEE_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "Which country is the world's largest producer of coffee?",
        fr: "Quel pays est le plus grand producteur de café au monde?",
      },
      answer: {
        en: "Brazil",
        fr: "Le Brésil",
      },
      context: {
        en: "Brazil has been the world's largest coffee producer for many years, accounting for about one-third of all coffee produced globally.",
        fr: "Le Brésil est le plus grand producteur de café au monde depuis de nombreuses années, représentant environ un tiers de tout le café produit dans le monde.",
      },
      trivia: {
        en: ["Coffee was first discovered in Ethiopia, likely in the 9th century.", "There are two main types of coffee beans: Arabica and Robusta."],
        fr: ["Le café a été découvert pour la première fois en Éthiopie, probablement au IXe siècle.", "Il existe deux principaux types de grains de café : l'Arabica et le Robusta."],
      },
    },
    author: {
      role: "game",
      gameId: new ObjectId("a00000000000000000000006"),
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Coffee_production_in_Brazil"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("700000000000000000000013"),
    category: "lexicon",
    status: "active",
    cognitiveDifficulty: "medium",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_TECHNOLOGY_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "What does the acronym 'CPU' stand for in computing?",
        fr: "Que signifie l'acronyme 'CPU' en informatique?",
      },
      answer: {
        en: "Central Processing Unit",
        fr: "Unité centrale de traitement",
      },
    },
    author: {
      role: "ai",
      name: "Tech AI",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Central_processing_unit"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("700000000000000000000014"),
    category: "riddle",
    status: "active",
    cognitiveDifficulty: "hard",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_GAMING_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_COMICS_ENTRY._id,
        isHint: true,
        isPrimary: false,
      },
    ],
    content: {
      statement: {
        en: "I follow you all the time and copy your every move, but you can't touch me or catch me. What am I?",
        fr: "Je te suis tout le temps et copie tous tes mouvements, mais tu ne peux ni me toucher ni m'attraper. Que suis-je?",
      },
      answer: {
        en: "Your shadow",
        fr: "Ton ombre",
      },
      context: {
        en: "A shadow is a dark area where light is blocked by an object. It follows the object that blocks the light.",
        fr: "Une ombre est une zone sombre où la lumière est bloquée par un objet. Elle suit l'objet qui bloque la lumière.",
      },
      trivia: {
        en: ["Shadows are shortest at noon when the sun is directly overhead.", "On a cloudy day, shadows are less defined because light scatters in all directions."],
        fr: ["Les ombres sont les plus courtes à midi quand le soleil est au zénith.", "Par temps nuageux, les ombres sont moins nettes car la lumière se diffuse dans toutes les directions."],
      },
    },
    author: {
      role: "game",
      gameId: new ObjectId("a00000000000000000000007"),
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Shadow"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("700000000000000000000015"),
    category: "explanation",
    status: "active",
    cognitiveDifficulty: "hard",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_POLITICS_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "Explain what a democracy is and list its key principles.",
        fr: "Expliquez ce qu'est une démocratie et énumérez ses principes clés.",
      },
      answer: {
        en: "Democracy is a system of government where citizens exercise power through voting and representation. Key principles include free elections, rule of law, separation of powers, and protection of individual rights.",
        fr: "La démocratie est un système de gouvernement où les citoyens exercent le pouvoir par le vote et la représentation. Les principes clés incluent des élections libres, l'état de droit, la séparation des pouvoirs et la protection des droits individuels.",
      },
      context: {
        en: "The word democracy comes from the Greek words 'demos' meaning people and 'kratos' meaning power.",
        fr: "Le mot démocratie vient des mots grecs 'demos' signifiant peuple et 'kratos' signifiant pouvoir.",
      },
    },
    author: {
      role: "admin",
      name: "Political Scientist",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Democracy"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("700000000000000000000016"),
    category: "trivia",
    status: "active",
    cognitiveDifficulty: "easy",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_CARS_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_TECHNOLOGY_ENTRY._id,
        isHint: true,
        isPrimary: false,
      },
    ],
    content: {
      statement: {
        en: "Which company manufactured the Model T car?",
        fr: "Quelle entreprise a fabriqué la voiture Model T?",
      },
      answer: {
        en: "Ford Motor Company",
        fr: "Ford Motor Company",
      },
      context: {
        en: "The Ford Model T was produced from 1908 to 1927 and is considered the first affordable automobile.",
        fr: "La Ford Model T a été produite de 1908 à 1927 et est considérée comme la première automobile abordable.",
      },
      trivia: {
        en: ["The Model T was nicknamed 'Tin Lizzie'.", "Over 15 million Model T cars were produced."],
        fr: ["La Model T était surnommée 'Tin Lizzie'.", "Plus de 15 millions de voitures Model T ont été produites."],
      },
    },
    author: {
      role: "admin",
      name: "Car Enthusiast",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Ford_Model_T"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("700000000000000000000017"),
    category: "lexicon",
    status: "active",
    cognitiveDifficulty: "medium",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_NUTRITION_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "What is the term for a substance that provides nourishment essential for growth and life?",
        fr: "Quel est le terme pour une substance qui fournit les nutriments essentiels à la croissance et à la vie?",
      },
      answer: {
        en: "Nutrient",
        fr: "Nutriment",
      },
    },
    author: {
      role: "game",
      gameId: new ObjectId("a00000000000000000000008"),
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Nutrient"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("700000000000000000000018"),
    category: "riddle",
    status: "active",
    cognitiveDifficulty: "easy",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_FITNESS_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "I am always hungry and must always be fed. The finger I touch will soon turn red. What am I?",
        fr: "J'ai toujours faim et je dois toujours être nourri. Le doigt que je touche devient bientôt rouge. Que suis-je?",
      },
      answer: {
        en: "Fire",
        fr: "Le feu",
      },
      context: {
        en: "Fire requires fuel, oxygen, and heat to sustain itself. Touching fire causes burns, hence turning red.",
        fr: "Le feu nécessite du combustible, de l'oxygène et de la chaleur pour subsister. Toucher le feu provoque des brûlures, d'où le rouge.",
      },
    },
    author: {
      role: "ai",
      name: "Riddle Generator",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Fire"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("700000000000000000000019"),
    category: "explanation",
    status: "active",
    cognitiveDifficulty: "hard",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_PSYCHOLOGY_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_SOCIOLOGY_ENTRY._id,
        isHint: false,
        isPrimary: false,
      },
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_ANTHROPOLOGY_ENTRY._id,
        isHint: true,
        isPrimary: false,
      },
    ],
    content: {
      statement: {
        en: "Explain the difference between conformity and obedience in social psychology.",
        fr: "Expliquez la différence entre la conformité et l'obéissance en psychologie sociale.",
      },
      answer: {
        en: "Conformity involves changing behavior to match group norms, while obedience involves following direct commands from an authority figure.",
        fr: "La conformité implique de changer son comportement pour correspondre aux normes du groupe, tandis que l'obéissance implique de suivre des ordres directs d'une figure d'autorité.",
      },
      context: {
        en: "Famous experiments include Asch's conformity experiments and Milgram's obedience experiments.",
        fr: "Des expériences célèbres incluent les expériences de conformité d'Asch et les expériences d'obéissance de Milgram.",
      },
      trivia: {
        en: ["The Asch conformity experiment found that 75% of participants conformed at least once.", "Milgram's experiment found 65% of participants administered the maximum voltage."],
        fr: ["L'expérience de conformité d'Asch a révélé que 75% des participants se sont conformés au moins une fois.", "L'expérience de Milgram a révélé que 65% des participants ont administré la tension maximale."],
      },
    },
    author: {
      role: "admin",
      name: "Psychology Professor",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Conformity", "https://en.wikipedia.org/wiki/Milgram_experiment", "https://en.wikipedia.org/wiki/Asch_conformity_experiments"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("70000000000000000000001a"),
    category: "trivia",
    status: "active",
    cognitiveDifficulty: "medium",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_POKER_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "In poker, what is the highest possible hand ranking?",
        fr: "Au poker, quelle est la meilleure main possible?",
      },
      answer: {
        en: "Royal Flush",
        fr: "Quinte flush royale",
      },
      trivia: {
        en: ["A royal flush consists of Ace, King, Queen, Jack, and 10 all of the same suit.", "The odds of being dealt a royal flush are 649,739 to 1."],
        fr: ["Une quinte flush royale consiste en As, Roi, Dame, Valet et 10 de la même couleur.", "Les chances d'obtenir une quinte flush royale sont de 1 contre 649 739."],
      },
    },
    author: {
      role: "game",
      gameId: new ObjectId("a00000000000000000000009"),
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/List_of_poker_hands"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("70000000000000000000001b"),
    category: "lexicon",
    status: "active",
    cognitiveDifficulty: "easy",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_CRYPTOGRAPHY_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "What is the term for the practice of hiding messages in plain sight, such as within images?",
        fr: "Quel est le terme pour la pratique qui consiste à cacher des messages à la vue de tous, comme dans des images?",
      },
      answer: {
        en: "Steganography",
        fr: "Stéganographie",
      },
      context: {
        en: "Steganography differs from cryptography in that it conceals the existence of the message, not just its content.",
        fr: "La stéganographie diffère de la cryptographie en ce qu'elle cache l'existence du message, pas seulement son contenu.",
      },
    },
    author: {
      role: "admin",
      name: "Security Expert",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Steganography"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("70000000000000000000001c"),
    category: "riddle",
    status: "archived",
    cognitiveDifficulty: "medium",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_ANIME_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_COMICS_ENTRY._id,
        isHint: true,
        isPrimary: false,
      },
    ],
    content: {
      statement: {
        en: "I am drawn in panels, tell stories with speech bubbles, and can be found in both Japanese and Western traditions. What am I?",
        fr: "Je suis dessiné en cases, raconte des histoires avec des bulles, et on me trouve dans les traditions japonaise et occidentale. Que suis-je?",
      },
      answer: {
        en: "A comic or manga",
        fr: "Une bande dessinée ou un manga",
      },
      context: {
        en: "Comics and manga use sequential art to tell stories, with manga originating in Japan and comics in the West.",
        fr: "Les bandes dessinées et les mangas utilisent l'art séquentiel pour raconter des histoires, les mangas étant originaires du Japon et les BD de l'Occident.",
      },
    },
    author: {
      role: "ai",
      name: "Pop Culture AI",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Comics", "https://en.wikipedia.org/wiki/Manga"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("70000000000000000000001d"),
    category: "explanation",
    status: "active",
    cognitiveDifficulty: "hard",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_AVIATION_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "Explain how an airplane achieves flight based on lift principles.",
        fr: "Expliquez comment un avion parvient à voler selon les principes de la portance.",
      },
      answer: {
        en: "An airplane flies thanks to lift generated by its wings. The curved shape of the wing creates a pressure difference: air moves faster above than below, creating an upward force.",
        fr: "Un avion vole grâce à la portance générée par ses ailes. La forme bombée de l'aile crée une différence de pression : l'air se déplace plus vite au-dessus qu'en dessous, créant une force ascendante.",
      },
      context: {
        en: "This principle is mainly explained by the Bernoulli effect and Newton's third law.",
        fr: "Ce principe est principalement expliqué par l'effet Bernoulli et la troisième loi de Newton.",
      },
    },
    author: {
      role: "game",
      gameId: new ObjectId("a0000000000000000000000a"),
    },
    sourceUrls: ["https://fr.wikipedia.org/wiki/Portance"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("70000000000000000000001e"),
    category: "trivia",
    status: "active",
    cognitiveDifficulty: "easy",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_WINE_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_BEER_ENTRY._id,
        isHint: true,
        isPrimary: false,
      },
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_FOOD_ENTRY._id,
        isHint: true,
        isPrimary: false,
      },
    ],
    content: {
      statement: {
        en: "What is the most consumed alcoholic beverage in the world?",
        fr: "Quelle est la boisson alcoolisée la plus consommée dans le monde?",
      },
      answer: {
        en: "Beer",
        fr: "La bière",
      },
      context: {
        en: "Beer is the third most popular drink overall after water and tea.",
        fr: "La bière est la troisième boisson la plus populaire après l'eau et le thé.",
      },
      trivia: {
        en: ["The oldest known beer recipe dates back to ancient Mesopotamia around 1800 BCE.", "China is the world's largest beer producer."],
        fr: ["La plus ancienne recette de bière connue remonte à l'ancienne Mésopotamie vers 1800 avant J.-C.", "La Chine est le plus grand producteur de bière au monde."],
      },
    },
    author: {
      role: "admin",
      name: "Beverage Expert",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Beer", "https://en.wikipedia.org/wiki/List_of_most_consumed_alcoholic_beverages"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("70000000000000000000001f"),
    category: "lexicon",
    status: "active",
    cognitiveDifficulty: "hard",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_MARITIME_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "What is the term for a ship that breaks ice to open a passage in frozen waters?",
        fr: "Quel est le terme désignant le navire qui brise la glace pour ouvrir un passage dans les eaux gelées?",
      },
      answer: {
        en: "An icebreaker",
        fr: "Un brise-glace",
      },
    },
    author: {
      role: "game",
      gameId: new ObjectId("a0000000000000000000000b"),
    },
    sourceUrls: ["https://fr.wikipedia.org/wiki/Brise-glace"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("700000000000000000000020"),
    category: "riddle",
    status: "active",
    cognitiveDifficulty: "hard",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_TEA_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "I am a leaf that is brewed, I can be green, black or white, and I come from China. What am I?",
        fr: "Je suis une feuille que l'on infuse, je peux être vert, noir ou blanc, et je viens de Chine. Que suis-je?",
      },
      answer: {
        en: "Tea",
        fr: "Le thé",
      },
      context: {
        en: "Tea is the second most consumed beverage in the world after water, with a history dating back over 5,000 years in China.",
        fr: "Le thé est la deuxième boisson la plus consommée au monde après l'eau, avec une histoire qui remonte à plus de 5 000 ans en Chine.",
      },
    },
    author: {
      role: "ai",
      name: "Beverage AI",
    },
    sourceUrls: ["https://fr.wikipedia.org/wiki/Th%C3%A9"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("700000000000000000000021"),
    category: "explanation",
    status: "active",
    cognitiveDifficulty: "easy",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_GARDENING_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_ECOLOGY_ENTRY._id,
        isHint: true,
        isPrimary: false,
      },
    ],
    content: {
      statement: {
        en: "Explain what composting is and why it is beneficial for the environment.",
        fr: "Expliquez ce qu'est le compostage et pourquoi il est bénéfique pour l'environnement.",
      },
      answer: {
        en: "Composting is the natural process of recycling organic matter into a rich soil amendment. It benefits the environment by reducing landfill waste and creating natural fertilizer.",
        fr: "Le compostage est le processus naturel de recyclage des matières organiques en un amendement riche pour le sol. Il bénéficie à l'environnement en réduisant les déchets et en créant un engrais naturel.",
      },
      context: {
        en: "Composting also helps reduce methane emissions from landfills and improves soil health.",
        fr: "Le compostage aide également à réduire les émissions de méthane des décharges et améliore la santé des sols.",
      },
    },
    author: {
      role: "admin",
      name: "Environmentalist",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Compost"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("700000000000000000000022"),
    category: "riddle",
    status: "active",
    cognitiveDifficulty: "medium",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_DANCE_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "I am an activity where you move to music, I can be classical or modern, and I am often practiced in a studio. What am I?",
        fr: "Je suis une activité où l'on bouge sur la musique, je peux être classique ou moderne, et je suis souvent pratiqué en studio. Que suis-je?",
      },
      answer: {
        en: "Dance",
        fr: "La danse",
      },
      context: {
        en: "Dance exists in all cultures of the world, from classical ballet to contemporary dance and traditional dances.",
        fr: "La danse existe dans toutes les cultures du monde, du ballet classique à la danse contemporaine en passant par les danses traditionnelles.",
      },
    },
    author: {
      role: "game",
      gameId: new ObjectId("a0000000000000000000000c"),
    },
    sourceUrls: ["https://fr.wikipedia.org/wiki/Danse"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("700000000000000000000023"),
    category: "lexicon",
    status: "active",
    cognitiveDifficulty: "hard",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_THEATER_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_ART_ENTRY._id,
        isHint: true,
        isPrimary: false,
      },
    ],
    content: {
      statement: {
        en: "What is the term for a dramatic performance in which actors perform without spoken words?",
        fr: "Quel est le terme pour une représentation dramatique où les acteurs jouent sans paroles?",
      },
      answer: {
        en: "Mime",
        fr: "Mime",
      },
      trivia: {
        en: ["Mime originated in ancient Greece and was later popularized in France.", "Famous mime artists include Marcel Marceau."],
        fr: ["Le mime est originaire de la Grèce antique et a été popularisé en France.", "Les artistes de mime célèbres incluent Marcel Marceau."],
      },
    },
    author: {
      role: "ai",
      name: "Arts AI",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Mime_artist"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("700000000000000000000024"),
    category: "riddle",
    status: "active",
    cognitiveDifficulty: "easy",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_FASHION_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "I am worn every day, I have sleeves and a collar, I can be elegant or casual. What am I?",
        fr: "Je me porte tous les jours, j'ai des manches et un col, je peux être élégante ou décontractée. Que suis-je?",
      },
      answer: {
        en: "A shirt",
        fr: "Une chemise",
      },
    },
    author: {
      role: "admin",
      name: "Fashion Designer",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Shirt"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("700000000000000000000025"),
    category: "explanation",
    status: "active",
    cognitiveDifficulty: "medium",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_ARCHITECTURE_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "Explain what Gothic architecture is and its main characteristics.",
        fr: "Expliquez ce qu'est l'architecture gothique et ses principales caractéristiques.",
      },
      answer: {
        en: "Gothic architecture is an architectural style that flourished in Europe from the 12th to the 16th century. Its main features include flying buttresses, ribbed vaults, colorful stained glass windows, and large rose windows.",
        fr: "L'architecture gothique est un style architectural qui a prospéré en Europe du XIIe au XVIe siècle. Ses caractéristiques principales incluent les arcs-boutants, les voûtes sur croisées d'ogives, les vitraux colorés et les grandes rosaces.",
      },
      context: {
        en: "Notre-Dame de Paris Cathedral is one of the most famous examples of French Gothic architecture.",
        fr: "La cathédrale Notre-Dame de Paris est l'un des exemples les plus célèbres d'architecture gothique française.",
      },
    },
    author: {
      role: "game",
      gameId: new ObjectId("a0000000000000000000000d"),
    },
    sourceUrls: ["https://fr.wikipedia.org/wiki/Architecture_gothique"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("700000000000000000000026"),
    category: "trivia",
    status: "active",
    cognitiveDifficulty: "hard",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_MUSIC_ENTRY._id,
        isHint: true,
        isPrimary: false,
      },
    ],
    content: {
      statement: {
        en: "Which film won the Academy Award for Best Original Song in 2023?",
        fr: "Quel film a remporté l'Oscar de la meilleure chanson originale en 2023?",
      },
      answer: {
        en: "RRR (for the song 'Naatu Naatu')",
        fr: "RRR (pour la chanson 'Naatu Naatu')",
      },
      context: {
        en: "'Naatu Naatu' from the Indian film RRR became the first song from an Indian film to win the Oscar for Best Original Song.",
        fr: "'Naatu Naatu' du film indien RRR est devenue la première chanson d'un film indien à remporter l'Oscar de la meilleure chanson originale.",
      },
    },
    author: {
      role: "admin",
      name: "Film Buff",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/RRR_(film)", "https://en.wikipedia.org/wiki/Naatu_Naatu"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("700000000000000000000027"),
    category: "lexicon",
    status: "active",
    cognitiveDifficulty: "easy",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_MYTHOLOGY_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_RELIGION_ENTRY._id,
        isHint: true,
        isPrimary: false,
      },
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_HISTORY_ENTRY._id,
        isHint: true,
        isPrimary: false,
      },
    ],
    content: {
      statement: {
        en: "What is the term for a symbolic story or narrative that explains the origins of a culture or natural phenomenon?",
        fr: "Quel est le terme pour une histoire symbolique qui explique les origines d'une culture ou d'un phénomène naturel?",
      },
      answer: {
        en: "Myth",
        fr: "Mythe",
      },
      trivia: {
        en: ["Myths differ from legends because they involve supernatural elements.", "Joseph Campbell studied the common patterns in myths from around the world."],
        fr: ["Les mythes diffèrent des légendes car ils impliquent des éléments surnaturels.", "Joseph Campbell a étudié les motifs communs dans les mythes du monde entier."],
      },
    },
    author: {
      role: "game",
      gameId: new ObjectId("a0000000000000000000000e"),
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Myth"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("700000000000000000000028"),
    category: "riddle",
    status: "active",
    cognitiveDifficulty: "medium",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_MILITARY_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "I can be launched, fired, or thrown. I travel through air or water. I have a target but no eyes. What am I?",
        fr: "Je peux être lancé, tiré ou jeté. Je voyage dans l'air ou dans l'eau. J'ai une cible mais pas d'yeux. Que suis-je?",
      },
      answer: {
        en: "A missile or projectile",
        fr: "Un missile ou projectile",
      },
      context: {
        en: "Projectiles follow a trajectory determined by initial velocity, gravity, and air resistance.",
        fr: "Les projectiles suivent une trajectoire déterminée par la vélocité initiale, la gravité et la résistance de l'air.",
      },
    },
    author: {
      role: "ai",
      name: "Military AI",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Projectile"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("700000000000000000000029"),
    category: "explanation",
    status: "active",
    cognitiveDifficulty: "hard",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_MATHEMATICS_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_PHYSICS_ENTRY._id,
        isHint: true,
        isPrimary: false,
      },
    ],
    content: {
      statement: {
        en: "Explain what the Pythagorean theorem states and give an example of its use.",
        fr: "Expliquez ce qu'énonce le théorème de Pythagore et donnez un exemple de son utilisation.",
      },
      answer: {
        en: "The Pythagorean theorem states that in a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides. For example, if sides are 3 and 4, the hypotenuse is 5.",
        fr: "Le théorème de Pythagore énonce que dans un triangle rectangle, le carré de l'hypoténuse est égal à la somme des carrés des deux autres côtés. Par exemple, si les côtés sont 3 et 4, l'hypoténuse est 5.",
      },
      context: {
        en: "The theorem is named after the ancient Greek mathematician Pythagoras.",
        fr: "Le théorème porte le nom du mathématicien grec antique Pythagore.",
      },
    },
    author: {
      role: "admin",
      name: "Math Teacher",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Pythagorean_theorem"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("70000000000000000000002a"),
    category: "trivia",
    status: "active",
    cognitiveDifficulty: "medium",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_YOGA_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "Which ancient Indian language is the word 'yoga' derived from?",
        fr: "De quelle langue indienne ancienne le mot 'yoga' est-il dérivé?",
      },
      answer: {
        en: "Sanskrit",
        fr: "Sanskrit",
      },
      context: {
        en: "In Sanskrit, 'yoga' means union or connection, referring to the union of mind, body, and spirit.",
        fr: "En sanskrit, 'yoga' signifie union ou connexion, faisant référence à l'union du corps, de l'esprit et de l'âme.",
      },
    },
    author: {
      role: "game",
      gameId: new ObjectId("a0000000000000000000000f"),
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Yoga"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("70000000000000000000002b"),
    category: "lexicon",
    status: "active",
    cognitiveDifficulty: "medium",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_TRAVEL_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_GEOGRAPHY_ENTRY._id,
        isHint: true,
        isPrimary: false,
      },
    ],
    content: {
      statement: {
        en: "What is the term for a person who travels to different countries for pleasure?",
        fr: "Quel est le terme pour une personne qui voyage dans différents pays pour le plaisir?",
      },
      answer: {
        en: "Tourist",
        fr: "Touriste",
      },
      trivia: {
        en: ["The word 'tourist' first appeared in the English language around 1772.", "International tourism reached 1.4 billion arrivals worldwide in 2019."],
        fr: ["Le mot 'touriste' est apparu pour la première fois en langue française vers 1772.", "Le tourisme international a atteint 1,4 milliard d'arrivées dans le monde en 2019."],
      },
    },
    author: {
      role: "ai",
      name: "Travel AI",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Tourism"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("70000000000000000000002c"),
    category: "riddle",
    status: "active",
    cognitiveDifficulty: "hard",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_CLIMATE_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "I can be high or low, cold or warm. I affect the weather but I am not the weather. I change with the seasons. What am I?",
        fr: "Je peux être haute ou basse, froide ou chaude. J'affecte le temps mais je ne suis pas le temps. Je change avec les saisons. Que suis-je?",
      },
      answer: {
        en: "Temperature",
        fr: "La température",
      },
      context: {
        en: "Temperature is a measure of the average kinetic energy of particles in a substance, measured using thermometers.",
        fr: "La température est une mesure de l'énergie cinétique moyenne des particules d'une substance, mesurée à l'aide de thermomètres.",
      },
    },
    author: {
      role: "admin",
      name: "Climate Scientist",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Temperature"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("70000000000000000000002d"),
    category: "explanation",
    status: "active",
    cognitiveDifficulty: "easy",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_ENERGY_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "Explain what renewable energy is and give two examples.",
        fr: "Expliquez ce qu'est l'énergie renouvelable et donnez deux exemples.",
      },
      answer: {
        en: "Renewable energy comes from natural sources that replenish themselves. Examples include solar power from sunlight and wind power from moving air.",
        fr: "L'énergie renouvelable provient de sources naturelles qui se renouvellent. Les exemples incluent l'énergie solaire du soleil et l'énergie éolienne du vent.",
      },
      context: {
        en: "Renewable energy is key to reducing greenhouse gas emissions and combating climate change.",
        fr: "L'énergie renouvelable est essentielle pour réduire les émissions de gaz à effet de serre et lutter contre le changement climatique.",
      },
    },
    author: {
      role: "game",
      gameId: new ObjectId("a00000000000000000000010"),
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Renewable_energy"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("70000000000000000000002e"),
    category: "trivia",
    status: "active",
    cognitiveDifficulty: "hard",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_PALEONTOLOGY_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_BIOLOGY_ENTRY._id,
        isHint: true,
        isPrimary: false,
      },
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_ANIMALS_ENTRY._id,
        isHint: true,
        isPrimary: false,
      },
    ],
    content: {
      statement: {
        en: "What is the name of the prehistoric dinosaur known for its three horns and large frill?",
        fr: "Quel est le nom du dinosaure préhistorique connu pour ses trois cornes et sa grande collerette?",
      },
      answer: {
        en: "Triceratops",
        fr: "Triceratops",
      },
      context: {
        en: "Triceratops lived during the late Cretaceous period, about 68 to 66 million years ago.",
        fr: "Le Triceratops vivait à la fin du Crétacé, il y a environ 68 à 66 millions d'années.",
      },
      trivia: {
        en: ["Triceratops means 'three-horned face' in Greek.", "Its frill may have been used for display and temperature regulation."],
        fr: ["Triceratops signifie 'visage à trois cornes' en grec.", "Sa collerette servait peut-être à la parade et à la régulation de la température."],
      },
    },
    author: {
      role: "admin",
      name: "Paleontology Expert",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Triceratops"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("70000000000000000000002f"),
    category: "lexicon",
    status: "active",
    cognitiveDifficulty: "hard",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_CHESS_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "What is the term for a chess move where the king and rook swap positions?",
        fr: "Quel est le terme pour un mouvement aux échecs où le roi et la tour échangent leurs positions?",
      },
      answer: {
        en: "Castling",
        fr: "Roque",
      },
      trivia: {
        en: ["Castling is the only move in chess that moves two pieces at once.", "There are two types of castling: kingside and queenside."],
        fr: ["Le roque est le seul mouvement aux échecs qui déplace deux pièces à la fois.", "Il existe deux types de roque : le petit roque et le grand roque."],
      },
    },
    author: {
      role: "ai",
      name: "Chess AI",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Castling"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("700000000000000000000030"),
    category: "riddle",
    status: "active",
    cognitiveDifficulty: "easy",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_PHOTOGRAPHY_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_ART_ENTRY._id,
        isHint: true,
        isPrimary: false,
      },
    ],
    content: {
      statement: {
        en: "I capture moments without drawing or painting. I have a lens and a shutter. People say 'cheese' when I'm around. What am I?",
        fr: "Je capture des moments sans dessiner ni peindre. J'ai un objectif et un obturateur. Les gens disent 'cheese' quand je suis là. Que suis-je?",
      },
      answer: {
        en: "A camera",
        fr: "Un appareil photo",
      },
      context: {
        en: "The first permanent photograph was taken in 1826 by Joseph Nicéphore Niépce.",
        fr: "La première photographie permanente a été prise en 1826 par Joseph Nicéphore Niépce.",
      },
    },
    author: {
      role: "game",
      gameId: new ObjectId("a00000000000000000000011"),
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Camera"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("700000000000000000000031"),
    category: "explanation",
    status: "active",
    cognitiveDifficulty: "medium",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_MAGIC_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "Explain how a magician performs the classic cups and balls trick.",
        fr: "Expliquez comment un magicien réalise le tour classique des gobelets et des balles.",
      },
      answer: {
        en: "The cups and balls trick uses sleight of hand to make balls appear, disappear, and travel between cups through misdirection and quick movements.",
        fr: "Le tour des gobelets et des balles utilise la prestidigitation pour faire apparaître, disparaître et voyager les balles entre les gobelets grâce à la tromperie et aux mouvements rapides.",
      },
    },
    author: {
      role: "admin",
      name: "Magician",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Cups_and_balls"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("700000000000000000000032"),
    category: "trivia",
    status: "active",
    cognitiveDifficulty: "hard",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_SPORTS_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY._id,
        isHint: true,
        isPrimary: false,
      },
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_MUSIC_ENTRY._id,
        isHint: false,
        isPrimary: false,
      },
    ],
    content: {
      statement: {
        en: "Which athlete has won the most Olympic gold medals of all time?",
        fr: "Quel athlète a remporté le plus de médailles d'or olympiques de tous les temps?",
      },
      answer: {
        en: "Michael Phelps",
        fr: "Michael Phelps",
      },
      context: {
        en: "Michael Phelps won 23 Olympic gold medals in swimming, the most of any athlete in history.",
        fr: "Michael Phelps a remporté 23 médailles d'or olympiques en natation, le plus grand nombre jamais atteint par un athlète dans l'histoire.",
      },
      trivia: {
        en: ["Phelps also holds the record for most total Olympic medals with 28.", "He competed in five Olympic Games from 2000 to 2016."],
        fr: ["Phelps détient également le record du plus grand nombre de médailles olympiques totales avec 28.", "Il a participé à cinq Jeux Olympiques de 2000 à 2016."],
      },
    },
    author: {
      role: "ai",
      name: "Sports AI",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Michael_Phelps"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("700000000000000000000033"),
    category: "lexicon",
    status: "active",
    cognitiveDifficulty: "easy",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_LITERATURE_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY._id,
        isHint: true,
        isPrimary: false,
      },
    ],
    content: {
      statement: {
        en: "What is the term for a novel that has been adapted into a film?",
        fr: "Quel est le terme pour un roman qui a été adapté au cinéma?",
      },
      answer: {
        en: "Film adaptation",
        fr: "Adaptation cinématographique",
      },
    },
    author: {
      role: "game",
      gameId: new ObjectId("a00000000000000000000012"),
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Film_adaptation"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("700000000000000000000034"),
    category: "riddle",
    status: "active",
    cognitiveDifficulty: "medium",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_SPACE_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_ASTRONOMY_ENTRY._id,
        isHint: false,
        isPrimary: false,
      },
    ],
    content: {
      statement: {
        en: "I am not alive, but I grow. I don't have lungs, but I need air. I don't have a mouth, but I need water to live. What am I?",
        fr: "Je ne suis pas vivant, mais je grandis. Je n'ai pas de poumons, mais j'ai besoin d'air. Je n'ai pas de bouche, mais j'ai besoin d'eau pour vivre. Que suis-je?",
      },
      answer: {
        en: "Fire",
        fr: "Le feu",
      },
      context: {
        en: "Fire is a chemical reaction called combustion that requires fuel, heat, and oxygen.",
        fr: "Le feu est une réaction chimique appelée combustion qui nécessite du combustible, de la chaleur et de l'oxygène.",
      },
    },
    author: {
      role: "admin",
      name: "Science Teacher",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Fire"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("700000000000000000000035"),
    category: "explanation",
    status: "active",
    cognitiveDifficulty: "hard",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_CHEMISTRY_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_BIOLOGY_ENTRY._id,
        isHint: true,
        isPrimary: false,
      },
    ],
    content: {
      statement: {
        en: "Explain the difference between DNA and RNA.",
        fr: "Expliquez la différence entre l'ADN et l'ARN.",
      },
      answer: {
        en: "DNA is a double-stranded molecule that stores genetic information, while RNA is single-stranded and helps in protein synthesis by carrying instructions from DNA.",
        fr: "L'ADN est une molécule à double brin qui stocke l'information génétique, tandis que l'ARN est à simple brin et aide à la synthèse des protéines en transportant les instructions de l'ADN.",
      },
      context: {
        en: "Both DNA and RNA are nucleic acids, essential for all known forms of life.",
        fr: "L'ADN et l'ARN sont tous deux des acides nucléiques, essentiels à toutes les formes de vie connues.",
      },
    },
    author: {
      role: "ai",
      name: "Biology AI",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/DNA", "https://en.wikipedia.org/wiki/RNA"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("700000000000000000000036"),
    category: "trivia",
    status: "rejected",
    cognitiveDifficulty: "easy",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_HISTORY_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "Who was the first President of the United States?",
        fr: "Qui a été le premier président des États-Unis?",
      },
      answer: {
        en: "George Washington",
        fr: "George Washington",
      },
    },
    author: {
      role: "admin",
      name: "Test Author",
    },
    rejection: {
      type: "duplicate-question",
      comment: "This question is a duplicate of an existing question in the database.",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/George_Washington"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("700000000000000000000037"),
    category: "lexicon",
    status: "active",
    cognitiveDifficulty: "medium",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_POKER_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_GAMING_ENTRY._id,
        isHint: true,
        isPrimary: false,
      },
    ],
    content: {
      statement: {
        en: "What is the term for the minimum amount required to start a hand in poker?",
        fr: "Quel est le terme pour le montant minimum requis pour commencer une main au poker?",
      },
      answer: {
        en: "Ante or blind",
        fr: "Ante ou blind",
      },
      trivia: {
        en: ["There are two types of blinds: small blind and big blind.", "The ante is a forced bet that all players must pay before each hand."],
        fr: ["Il existe deux types de blinds : la petite blind et la grande blind.", "L'ante est une mise forcée que tous les joueurs doivent payer avant chaque main."],
      },
    },
    author: {
      role: "game",
      gameId: new ObjectId("a00000000000000000000013"),
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Blind_(poker)", "https://en.wikipedia.org/wiki/Ante_(poker)"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("700000000000000000000038"),
    category: "riddle",
    status: "active",
    cognitiveDifficulty: "hard",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_TECHNOLOGY_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_ROBOTICS_ENTRY._id,
        isHint: true,
        isPrimary: false,
      },
    ],
    content: {
      statement: {
        en: "I can calculate, store, and display. I can be desktop, laptop, or tablet. I run on electricity and logic. What am I?",
        fr: "Je peux calculer, stocker et afficher. Je peux être de bureau, portable ou tablette. Je fonctionne à l'électricité et à la logique. Que suis-je?",
      },
      answer: {
        en: "A computer",
        fr: "Un ordinateur",
      },
      context: {
        en: "The first electronic general-purpose computer was the ENIAC, completed in 1945.",
        fr: "Le premier ordinateur électronique polyvalent était l'ENIAC, achevé en 1945.",
      },
    },
    author: {
      role: "ai",
      name: "Tech Riddle AI",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Computer"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("700000000000000000000039"),
    category: "explanation",
    status: "active",
    cognitiveDifficulty: "easy",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_MEDITATION_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_YOGA_ENTRY._id,
        isHint: false,
        isPrimary: false,
      },
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_FITNESS_ENTRY._id,
        isHint: true,
        isPrimary: false,
      },
    ],
    content: {
      statement: {
        en: "Explain the basic principles of mindfulness meditation.",
        fr: "Expliquez les principes de base de la méditation de pleine conscience.",
      },
      answer: {
        en: "Mindfulness meditation involves focusing attention on the present moment, observing thoughts without judgment, and cultivating awareness of breath and body sensations.",
        fr: "La méditation de pleine conscience consiste à se concentrer sur le moment présent, à observer les pensées sans jugement et à cultiver la conscience de la respiration et des sensations corporelles.",
      },
      context: {
        en: "Mindfulness has roots in Buddhist traditions but has been widely adopted in secular contexts for stress reduction.",
        fr: "La pleine conscience a des racines dans les traditions bouddhistes mais a été largement adoptée dans des contextes laïques pour la réduction du stress.",
      },
    },
    author: {
      role: "admin",
      name: "Wellness Coach",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Mindfulness"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("70000000000000000000003a"),
    category: "trivia",
    status: "active",
    cognitiveDifficulty: "medium",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_COFFEE_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_CHOCOLATE_ENTRY._id,
        isHint: true,
        isPrimary: false,
      },
    ],
    content: {
      statement: {
        en: "Which stimulant is found in both coffee and chocolate?",
        fr: "Quel stimulant trouve-t-on à la fois dans le café et le chocolat?",
      },
      answer: {
        en: "Caffeine",
        fr: "La caféine",
      },
      trivia: {
        en: ["Caffeine is the world's most widely consumed psychoactive substance.", "A typical cup of coffee contains 80-100 mg of caffeine, while dark chocolate has about 12 mg per ounce."],
        fr: ["La caféine est la substance psychoactive la plus consommée au monde.", "Une tasse de café typique contient 80 à 100 mg de caféine, tandis que le chocolat noir en contient environ 12 mg par once."],
      },
    },
    author: {
      role: "game",
      gameId: new ObjectId("a00000000000000000000014"),
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Caffeine"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("70000000000000000000003b"),
    category: "lexicon",
    status: "active",
    cognitiveDifficulty: "hard",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_CARS_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_TECHNOLOGY_ENTRY._id,
        isHint: true,
        isPrimary: false,
      },
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_AVIATION_ENTRY._id,
        isHint: true,
        isPrimary: false,
      },
    ],
    content: {
      statement: {
        en: "What is the term for a vehicle that can operate both on roads and in the air?",
        fr: "Quel est le terme pour un véhicule qui peut circuler à la fois sur les routes et dans les airs?",
      },
      answer: {
        en: "Flying car or VTOL vehicle",
        fr: "Voiture volante ou véhicule à décollage vertical",
      },
      context: {
        en: "VTOL stands for Vertical Take-Off and Landing, a key technology for flying cars.",
        fr: "VTOL signifie décollage et atterrissage verticaux, une technologie clé pour les voitures volantes.",
      },
    },
    author: {
      role: "ai",
      name: "Future Tech AI",
    },
    sourceUrls: ["https://en.wikipedia.org/wiki/Flying_car"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
  {
    _id: new ObjectId("70000000000000000000003c"),
    category: "explanation",
    status: "active",
    cognitiveDifficulty: "easy",
    themes: [
      {
        themeId: SIXTY_QUESTION_THEMES_FIXTURE_ARCHITECTURE_ENTRY._id,
        isHint: false,
        isPrimary: true,
      },
    ],
    content: {
      statement: {
        en: "Explain what an architectural plan is and what it is used for.",
        fr: "Expliquez ce qu'est un plan architectural et à quoi il sert.",
      },
      answer: {
        en: "An architectural plan is a technical drawing that represents the design of a building. It is used to guide construction, comply with standards, and visualize the space before construction.",
        fr: "Un plan architectural est un dessin technique qui représente la conception d'un bâtiment. Il sert à guider la construction, à respecter les normes et à visualiser l'espace avant la réalisation.",
      },
    },
    author: {
      role: "admin",
      name: "Architect",
    },
    sourceUrls: ["https://fr.wikipedia.org/wiki/Plan_d%27architecture"],
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
  },
] as const;

export { SIXTY_QUESTIONS_FIXTURE_SET };