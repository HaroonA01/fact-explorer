export type Fact = {
  id: string;
  categoryId: string;
  title: string;
  body: string;
  imageId: number;
};

export const FACTS: Fact[] = [
  // Science
  {
    id: 'sci-1',
    categoryId: 'science',
    title: 'Light takes 8 minutes to reach Earth',
    body: 'Sunlight travels at 299,792 kilometres per second, yet it still takes approximately 8 minutes and 20 seconds to travel the 150 million kilometres from the Sun to Earth. This means we always see the Sun as it was over 8 minutes ago.',
    imageId: 1,
  },
  {
    id: 'sci-2',
    categoryId: 'science',
    title: 'Water can boil and freeze simultaneously',
    body: 'At the "triple point" — a precise combination of temperature and pressure — water can exist simultaneously as a solid, liquid and gas. For pure water, this occurs at exactly 273.16 K (0.01°C) and 611.657 pascals of pressure.',
    imageId: 2,
  },
  {
    id: 'sci-3',
    categoryId: 'science',
    title: 'A teaspoon of neutron star weighs a billion tonnes',
    body: 'Neutron stars are incredibly dense remnants of collapsed stars. The material inside is so tightly packed that a single teaspoon would weigh roughly one billion tonnes on Earth — more than all the buildings ever constructed by humanity.',
    imageId: 3,
  },
  {
    id: 'sci-4',
    categoryId: 'science',
    title: 'Honey never spoils',
    body: 'Archaeologists have found 3,000-year-old honey in Egyptian tombs that was still perfectly edible. Honey\'s low moisture content, acidic pH and natural hydrogen peroxide make it inhospitable to bacteria and microorganisms.',
    imageId: 4,
  },
  {
    id: 'sci-5',
    categoryId: 'science',
    title: 'The human body contains enough carbon for 900 pencils',
    body: 'Carbon makes up roughly 18% of the human body by mass. In an average adult, that amounts to approximately 16 kilograms of carbon — enough to fill around 900 pencils with graphite, which is a crystalline form of carbon.',
    imageId: 5,
  },
  {
    id: 'sci-6',
    categoryId: 'science',
    title: 'You shed your outer layer of skin every 27 days',
    body: 'The human body loses roughly 40,000 skin cells every minute. Over 27 days, enough cells are shed and replaced that you effectively grow a new outer layer of skin. Across a lifetime, this amounts to about 18 kilograms of dead skin — roughly the weight of a large dog.',
    imageId: 6,
  },

  // History
  {
    id: 'his-1',
    categoryId: 'history',
    title: 'Cleopatra lived closer to the Moon landing than the pyramids',
    body: 'The Great Pyramid of Giza was built around 2560 BCE. Cleopatra lived around 30 BCE — roughly 2,500 years after the pyramids were completed. The Moon landing occurred in 1969, only about 2,000 years after Cleopatra. The pyramids are older than we instinctively imagine.',
    imageId: 11,
  },
  {
    id: 'his-2',
    categoryId: 'history',
    title: 'Oxford University predates the Aztec Empire',
    body: 'Teaching at Oxford began around 1096 CE and developed rapidly after 1167. The Aztec Empire, often associated with ancient history, was not founded until 1428 CE — over three centuries after Oxford had already established itself as a centre of learning.',
    imageId: 12,
  },
  {
    id: 'his-3',
    categoryId: 'history',
    title: 'Napoleon was not short for his era',
    body: 'Napoleon stood around 5 feet 6 inches (168 cm), which was average for a Frenchman of his time. The myth of his short stature arose partly from British propaganda and a confusion between French and English measurement units — his French height of 5\'2" used a longer inch than the English standard.',
    imageId: 13,
  },
  {
    id: 'his-4',
    categoryId: 'history',
    title: 'Ancient Romans used crushed mouse brains as toothpaste',
    body: 'Roman dental hygiene recipes included a variety of unusual ingredients. Among the more striking was a formula incorporating crushed mouse brains, which Romans believed had cleansing properties. They also used powdered bone, oyster shell and charcoal in their dental preparations.',
    imageId: 14,
  },
  {
    id: 'his-5',
    categoryId: 'history',
    title: 'The Great Wall of China is not visible from space',
    body: 'Contrary to popular belief, the Great Wall of China is not visible to the naked eye from space. At most points the wall is only 4–5 metres wide — far too narrow to see from low Earth orbit without optical aids. Chinese astronaut Yang Liwei confirmed this after his 2003 spaceflight.',
    imageId: 15,
  },
  {
    id: 'his-6',
    categoryId: 'history',
    title: 'The shortest war in history lasted 38 minutes',
    body: 'The Anglo-Zanzibar War of 27 August 1896 began at 9:02 am when the Royal Navy started shelling the Sultan\'s palace, and ended by 9:40 am with surrender. It is the shortest recorded war in history. Casualties on the Zanzibar side numbered around 500; the British suffered a single injured sailor.',
    imageId: 16,
  },

  // Nature
  {
    id: 'nat-1',
    categoryId: 'nature',
    title: 'Trees communicate through fungal networks',
    body: 'Forests contain vast underground networks of mycorrhizal fungi that connect the roots of different trees. Through these networks — sometimes called the "wood wide web" — trees share nutrients, water and chemical warning signals when under attack from insects or disease.',
    imageId: 21,
  },
  {
    id: 'nat-2',
    categoryId: 'nature',
    title: 'Bananas are berries, but strawberries are not',
    body: 'Botanically, a berry must develop from a single flower with one ovary and contain seeds inside the flesh. Bananas, tomatoes and kiwifruit all qualify. Strawberries develop from multiple ovaries and carry their seeds on the outside — making them, technically, aggregate accessory fruits.',
    imageId: 22,
  },
  {
    id: 'nat-3',
    categoryId: 'nature',
    title: 'Lightning heats air to five times the Sun\'s surface',
    body: 'A single lightning bolt can raise the surrounding air to around 30,000°C — roughly five times hotter than the surface of the Sun. The rapid expansion of this superheated air is what produces the shockwave we hear as thunder.',
    imageId: 23,
  },
  {
    id: 'nat-4',
    categoryId: 'nature',
    title: 'There\'s a single fungus covering 2,385 acres',
    body: 'In Oregon\'s Malheur National Forest, a single specimen of Armillaria ostoyae — a honey fungus — spans 3.7 square miles underground. Estimated at 2,400 years old, it is widely considered the largest living organism on Earth by area.',
    imageId: 24,
  },
  {
    id: 'nat-5',
    categoryId: 'nature',
    title: 'The Amazon produces 20% of Earth\'s oxygen — actually, no',
    body: 'The often-quoted claim that the Amazon produces 20% of the world\'s oxygen is misleading. The rainforest consumes nearly as much oxygen through respiration and decomposition as it produces. Most of Earth\'s oxygen — over half — comes from phytoplankton in the oceans.',
    imageId: 25,
  },
  {
    id: 'nat-6',
    categoryId: 'nature',
    title: 'Volcanic lightning exists',
    body: 'When volcanoes erupt violently, the collision of ash particles can generate static electricity, producing dramatic lightning storms within the ash plume. Known as a "dirty thunderstorm," this phenomenon has been recorded at Mount Etna, Eyjafjallajökull and other active volcanoes.',
    imageId: 26,
  },

  // Technology
  {
    id: 'tec-1',
    categoryId: 'technology',
    title: 'The first computer bug was a real insect',
    body: 'In 1947, engineers working on the Harvard Mark II computer found an actual moth trapped in a relay, causing a malfunction. They taped it into the logbook with the note "First actual case of bug being found." The term "debugging" was already in use, but this incident gave it a literal moment.',
    imageId: 31,
  },
  {
    id: 'tec-2',
    categoryId: 'technology',
    title: 'Wi-Fi was invented accidentally via astronomy',
    body: 'The technology underpinning Wi-Fi emerged from radio telescope research in the 1990s. Australian astronomer John O\'Sullivan and his team developed a chip to detect the echoes of mini black holes. Their method for cleaning up radio signals became the core of IEEE 802.11 wireless networking.',
    imageId: 32,
  },
  {
    id: 'tec-3',
    categoryId: 'technology',
    title: 'The first website is still online',
    body: 'Tim Berners-Lee published the world\'s first website on 6 August 1991 at CERN. The page explained what the World Wide Web was and how to use it. CERN restored the original URL in 2013, and the page remains accessible today at info.cern.ch.',
    imageId: 33,
  },
  {
    id: 'tec-4',
    categoryId: 'technology',
    title: 'More transistors exist than grains of rice on Earth',
    body: 'A modern processor contains billions of transistors. The total number of transistors manufactured globally now exceeds 10 sextillion (10²²) — far more than the estimated 7.5 × 10¹⁸ grains of rice on Earth. Each transistor is smaller than a coronavirus at just a few nanometres wide.',
    imageId: 34,
  },
  {
    id: 'tec-5',
    categoryId: 'technology',
    title: 'GPS satellites correct for Einstein\'s relativity',
    body: 'GPS satellites experience two competing relativistic effects: time runs faster at altitude (general relativity) and slower due to orbital speed (special relativity). The net effect would cause GPS clocks to drift by about 38 microseconds per day — enough to cause kilometre-scale errors if uncorrected.',
    imageId: 35,
  },
  {
    id: 'tec-6',
    categoryId: 'technology',
    title: 'Email predates the World Wide Web by 20 years',
    body: 'The first networked email was sent by Ray Tomlinson in 1971. He chose the @ symbol to separate user from host because it was rarely used in names. Tim Berners-Lee would not invent the World Wide Web for another two decades, launching it at CERN in 1991.',
    imageId: 36,
  },

  // Mathematics
  {
    id: 'mat-1',
    categoryId: 'math',
    title: 'Zero was invented twice, independently',
    body: 'The concept of zero as a number was developed independently in ancient India (around 628 CE by Brahmagupta) and by the Maya civilisation in Mesoamerica. The Babylonians had a placeholder symbol for zero much earlier, but did not treat it as a number in its own right.',
    imageId: 41,
  },
  {
    id: 'mat-2',
    categoryId: 'math',
    title: 'A googol has more zeroes than atoms in the universe',
    body: 'A googol is 10¹⁰⁰ — a 1 followed by 100 zeroes. The estimated number of atoms in the observable universe is around 10⁸⁰, which is vastly smaller than a googol. The search engine Google takes its name from a deliberate misspelling of the word.',
    imageId: 42,
  },
  {
    id: 'mat-3',
    categoryId: 'math',
    title: 'The Monty Hall Problem confounded mathematicians',
    body: 'When given the choice to switch doors after a host reveals a goat, most people feel it makes no difference. But switching wins two-thirds of the time. This counterintuitive result was published by Marilyn vos Savant in 1990 and promptly disputed by thousands of readers, including professional mathematicians.',
    imageId: 43,
  },
  {
    id: 'mat-4',
    categoryId: 'math',
    title: 'Pi has been calculated to 100 trillion digits',
    body: 'Pi (π ≈ 3.14159...) is irrational — its decimal expansion never terminates or repeats. In 2022, a team using Google Cloud computed pi to 100 trillion digits, a record that took 157 days of computation. Despite this, just 39 digits are sufficient to calculate the circumference of the observable universe to the width of a hydrogen atom.',
    imageId: 44,
  },
  {
    id: 'mat-5',
    categoryId: 'math',
    title: 'There are more chess games than atoms in the universe',
    body: 'The number of possible chess games — known as the Shannon number — is estimated at 10¹²⁰. The observable universe contains roughly 10⁸⁰ atoms. Even at 40 moves per game, the sheer combinatorial explosion of possibilities exceeds our ability to fully enumerate them, even with all computing power on Earth.',
    imageId: 45,
  },
  {
    id: 'mat-6',
    categoryId: 'math',
    title: '0.999… is exactly equal to 1',
    body: 'Though it feels wrong, the repeating decimal 0.9999… is not slightly less than 1 — it is equal to 1. A simple proof: 1/3 equals 0.333…, and 3 × 1/3 = 1, so 3 × 0.333… = 0.999… must also equal 1. The two expressions are the same number written differently.',
    imageId: 46,
  },

  // Space
  {
    id: 'spc-1',
    categoryId: 'space',
    title: 'There\'s a planet where it rains glass sideways',
    body: 'HD 189733b, a deep-blue exoplanet 63 light-years from Earth, has 5,400 mph winds and silicate particles in its atmosphere. The extreme heat causes glass-like rain to fall horizontally at supersonic speed, driven by some of the most violent weather ever observed.',
    imageId: 51,
  },
  {
    id: 'spc-2',
    categoryId: 'space',
    title: 'A day on Venus is longer than its year',
    body: 'Venus rotates so slowly — and backwards compared to most planets — that one Venusian day takes 243 Earth days. A full orbit around the Sun, meanwhile, takes just 225 Earth days. This makes Venus the only major planet where a day outlasts a year.',
    imageId: 52,
  },
  {
    id: 'spc-3',
    categoryId: 'space',
    title: 'Saturn would float in a bathtub — in theory',
    body: 'Saturn\'s average density is just 0.687 g/cm³, less than that of water. Given a tub large enough, Saturn would technically float. In practice, the gravitational and tidal forces involved would tear the planet apart long before any floating could occur.',
    imageId: 53,
  },
  {
    id: 'spc-4',
    categoryId: 'space',
    title: 'The footprints on the Moon will last millions of years',
    body: 'The Moon has no wind and no liquid water to erode its surface. The footprints left by Apollo astronauts, the rover tracks and discarded equipment will remain essentially unchanged for an estimated 10 to 100 million years — only disturbed by the occasional micrometeorite impact.',
    imageId: 54,
  },
  {
    id: 'spc-5',
    categoryId: 'space',
    title: 'There\'s a giant cloud of alcohol in deep space',
    body: 'A cloud in the constellation Aquila, roughly 10,000 light-years from Earth, contains enough vinyl alcohol and ethyl alcohol to fill hundreds of trillions of trillions of pints. It sits within a star-forming region astronomers study for clues to prebiotic organic chemistry.',
    imageId: 55,
  },
  {
    id: 'spc-6',
    categoryId: 'space',
    title: 'Neutron stars can spin 700 times a second',
    body: 'Pulsars are rapidly rotating neutron stars, and the fastest known — PSR J1748-2446ad — spins over 700 times every second. At this rate, the surface at the equator moves at nearly a quarter the speed of light: the fastest macroscopic rotation ever observed in the universe.',
    imageId: 56,
  },
  {
    id: 'spc-7',
    categoryId: 'space',
    title: 'Jupiter\'s Great Red Spot is a storm larger than Earth',
    body: 'This persistent anticyclone has raged for at least 350 years and is currently around 10,000 miles wide — wider than our entire planet. Though it has been shrinking gradually over the last century, it remains the most powerful storm known in our Solar System.',
    imageId: 57,
  },

  // Animals
  {
    id: 'ani-1',
    categoryId: 'animals',
    title: 'Octopuses have three hearts',
    body: 'An octopus has three hearts: two branchial hearts pump blood through each of the two gills, while the third — the systemic heart — pumps oxygenated blood to the rest of the body. When an octopus swims, the systemic heart stops beating, which is why they prefer crawling.',
    imageId: 61,
  },
  {
    id: 'ani-2',
    categoryId: 'animals',
    title: 'Tardigrades can survive the vacuum of space',
    body: 'Also called water bears, tardigrades are microscopic animals capable of enduring temperatures near absolute zero, pressures six times that of the deepest ocean, and 1,000× the radiation lethal to humans. In 2007, they became the first known animals to survive direct exposure to space.',
    imageId: 62,
  },
  {
    id: 'ani-3',
    categoryId: 'animals',
    title: 'Dolphins call each other by name',
    body: 'Bottlenose dolphins develop a unique signature whistle early in life and use it to identify themselves. They also address specific individuals by imitating that individual\'s whistle — one of the very few species, alongside humans, known to use something resembling personal names.',
    imageId: 63,
  },
  {
    id: 'ani-4',
    categoryId: 'animals',
    title: 'Elephants mourn their dead',
    body: 'Elephants pay long, gentle visits to the bones of deceased herd members, touching the remains with their trunks. They have been observed returning to the same sites year after year — a behaviour most researchers interpret as a form of grief, and one of the clearest examples of animal ritual.',
    imageId: 64,
  },
  {
    id: 'ani-5',
    categoryId: 'animals',
    title: 'Sloths can hold their breath for 40 minutes',
    body: 'By slowing their heart rate to one-third of its normal pace, sloths comfortably outperform dolphins at holding their breath. They are also surprisingly capable swimmers, using their long arms to move across Amazon rivers three times faster than they move through the trees.',
    imageId: 65,
  },
  {
    id: 'ani-6',
    categoryId: 'animals',
    title: 'Axolotls can regrow their own brains',
    body: 'Native to the lakes near Mexico City, axolotls can regenerate not only limbs but also portions of their heart, spine, lungs and even brain tissue. They retain their larval features throughout adult life — a developmental state called neoteny — making them a focus of regenerative medicine research.',
    imageId: 66,
  },
  {
    id: 'ani-7',
    categoryId: 'animals',
    title: 'A group of flamingos is a "flamboyance"',
    body: 'Collective nouns for animals are often wonderfully descriptive. Flamingos gather in a flamboyance, sharks swim in a shiver, crows form a murder, and owls congregate in a parliament. Most of these terms date back to Medieval English hunting tradition.',
    imageId: 67,
  },

  // Countries
  {
    id: 'cnt-1',
    categoryId: 'countries',
    title: 'Russia spans 11 time zones',
    body: 'Stretching roughly 9,000 kilometres from west to east, Russia is by far the largest country on Earth. When it\'s midnight in Kaliningrad on the Baltic coast, it\'s already 10 am the next day in Kamchatka on the Pacific. No other country spans more time zones.',
    imageId: 71,
  },
  {
    id: 'cnt-2',
    categoryId: 'countries',
    title: 'Bhutan measures Gross National Happiness',
    body: 'In the 1970s, Bhutan replaced GDP with a Gross National Happiness index as its chief measure of progress. The index weighs psychological wellbeing, cultural diversity, ecological resilience and good governance alongside the traditional economic metrics.',
    imageId: 72,
  },
  {
    id: 'cnt-3',
    categoryId: 'countries',
    title: 'France last used the guillotine in 1977',
    body: 'The last civil execution by guillotine in France took place on 10 September 1977, when Hamida Djandoubi was beheaded at Baumettes Prison in Marseille. France abolished capital punishment altogether four years later, in 1981.',
    imageId: 73,
  },
  {
    id: 'cnt-4',
    categoryId: 'countries',
    title: 'Finland has more saunas than cars',
    body: 'With around 3.3 million saunas for 5.5 million residents, Finland averages nearly one sauna for every two people — far outstripping the country\'s car count. Sauna culture is so integral to Finnish life that it was added to UNESCO\'s intangible heritage list in 2020.',
    imageId: 74,
  },
  {
    id: 'cnt-5',
    categoryId: 'countries',
    title: 'Canada holds more lake area than the rest of the world combined',
    body: 'Canada contains roughly 2 million lakes, around 563 of which are larger than 100 square kilometres. Taken together, Canada\'s lakes cover more surface area than the lakes of every other country on Earth combined.',
    imageId: 75,
  },
  {
    id: 'cnt-6',
    categoryId: 'countries',
    title: 'Vatican City has more citizens abroad than at home',
    body: 'The Vatican is the world\'s smallest sovereign state, with a resident population of around 800. Because Vatican citizenship is tied to office rather than birth, a significant share of its citizens — diplomats, clergy and staff — live outside its walls at any given time.',
    imageId: 76,
  },
];

export function getFactsByCategory(categoryId: string): Fact[] {
  return FACTS.filter((f) => f.categoryId === categoryId);
}

export function getFactById(id: string): Fact | undefined {
  return FACTS.find((f) => f.id === id);
}

export type SearchFilters = {
  categoryId?: string | null;
  savedIds?: Set<string>;
  onlySaved?: boolean;
};

export function searchFacts(query: string, filters: SearchFilters = {}): Fact[] {
  const q = query.trim().toLowerCase();
  return FACTS.filter((fact) => {
    if (filters.categoryId && fact.categoryId !== filters.categoryId) return false;
    if (filters.onlySaved && !filters.savedIds?.has(fact.id)) return false;
    if (!q) return true;
    return (
      fact.title.toLowerCase().includes(q) ||
      fact.body.toLowerCase().includes(q)
    );
  });
}

function hashDateKey(date: Date): number {
  const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function getFeaturedFactForDate(date: Date = new Date()): Fact {
  const idx = hashDateKey(date) % FACTS.length;
  return FACTS[idx];
}
