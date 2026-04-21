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

  // Nature
  {
    id: 'nat-1',
    categoryId: 'nature',
    title: "Octopuses have three hearts",
    body: 'An octopus has three hearts: two branchial hearts pump blood through each of the two gills, while the third — the systemic heart — pumps oxygenated blood to the rest of the body. When an octopus swims, the systemic heart stops beating, which is why they prefer crawling.',
    imageId: 21,
  },
  {
    id: 'nat-2',
    categoryId: 'nature',
    title: 'A group of flamingos is called a flamboyance',
    body: 'Collective nouns for animals are often wonderfully descriptive. Flamingos gather in a "flamboyance," sharks swim in a "shiver," crows form a "murder," and owls congregate in a "parliament." These terms date back centuries to Medieval English hunting tradition.',
    imageId: 22,
  },
  {
    id: 'nat-3',
    categoryId: 'nature',
    title: 'Trees communicate through fungal networks',
    body: 'Forests contain vast underground networks of mycorrhizal fungi that connect the roots of different trees. Through these networks — sometimes called the "wood wide web" — trees share nutrients, water and chemical warning signals when under attack from insects or disease.',
    imageId: 23,
  },
  {
    id: 'nat-4',
    categoryId: 'nature',
    title: 'Wombat droppings are cube-shaped',
    body: 'Wombats are the only animals known to produce cube-shaped faeces. This unusual trait is thought to help them mark territory, as the flat-sided cubes stack rather than rolling away. Scientists discovered in 2018 that the cubes form in the final stretch of the intestine, where the tissue contracts unevenly.',
    imageId: 24,
  },
  {
    id: 'nat-5',
    categoryId: 'nature',
    title: "Cleopatra fish can recognise human faces",
    body: 'Archerfish, found across Southeast Asia and Australia, can identify and remember individual human faces with surprising accuracy — even when expressions change. This makes them one of the few non-mammalian species known to possess this ability, despite having a simple brain with no neocortex.',
    imageId: 25,
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
    title: 'There are more possible chess games than atoms in the universe',
    body: 'The number of possible chess games — known as the Shannon number — is estimated at 10¹²⁰. The observable universe contains roughly 10⁸⁰ atoms. Even at 40 moves per game, the sheer combinatorial explosion of possibilities exceeds our ability to fully enumerate them, even with all computing power on Earth.',
    imageId: 45,
  },
];

export function getFactsByCategory(categoryId: string): Fact[] {
  return FACTS.filter((f) => f.categoryId === categoryId);
}

export function getFactById(id: string): Fact | undefined {
  return FACTS.find((f) => f.id === id);
}
