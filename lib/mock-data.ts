import type { Author, Book, BookPage, Profile, ShelfEntry } from "@/types";

// Demo content standing in for the Neon-backed data layer (see
// docs/DECISIONS.md ADR-002). Swapping to Prisma repositories later is a
// drop-in change - components only ever import from this module's shape.

export const currentUserId = "u_reader";

export const authors: Author[] = [
  {
    id: "a_2",
    name: "Herman Melville",
    bio: "Herman Melville (born Melvill; August 1, 1819 – September 28, 1891) was an American writer of the American Renaissance period. Among his best-known works are Moby-Dick (1851), Typee (1846), a romanticized account of his experiences in Polynesia, and Billy Budd, Sailor, a posthumously published novella. At the time of his death, Melville was not well known to the public, but 1919, the centennial of his birth, was the starting point of a Melville revival. Moby-Dick would eventually be considered one of the Great American Novels.",
    country: "American",
    photoUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e8/Herman_Melville_by_Joseph_O_Eaton.jpg/250px-Herman_Melville_by_Joseph_O_Eaton.jpg?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail",
  },
  {
    id: "a_3",
    name: "Franz Kafka",
    bio: "Franz Kafka (3 July 1883 – 3 June 1924) was a German-language Jewish Czech writer and novelist born in Prague, in the Austro-Hungarian Empire. Widely regarded as a major figure of 20th-century literature, his works fuse elements of realism and the fantastique, and typically feature isolated protagonists facing bizarre or surreal predicaments and incomprehensible bureaucratic powers. He is also celebrated for his brief fables and aphorisms, which frequently incorporated comedic elements alongside the darker themes of his longer works. His work has widely influenced artists, philosophers, composers, filmmakers, literary historians, religious scholars, and cultural theorists.",
    country: "Czech",
    photoUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/26/Franz_Kafka%2C_1923.jpg/250px-Franz_Kafka%2C_1923.jpg?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail",
  },
  {
    id: "a_4",
    name: "Mary Shelley",
    bio: "Mary Wollstonecraft Shelley (née Godwin; 30 August 1797 – 1 February 1851) was an English novelist who wrote the Gothic novel Frankenstein; or, The Modern Prometheus (1818), which is considered an early example of science fiction. She also edited and promoted the works of her husband, the Romantic poet and philosopher Percy Bysshe Shelley. Her father was the political philosopher William Godwin and her mother was the philosopher and women's rights advocate Mary Wollstonecraft.",
    country: "England",
    photoUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b4/Mary_Wollstonecraft_Shelley_Rothwell.tif/lossy-page1-250px-Mary_Wollstonecraft_Shelley_Rothwell.tif.jpg?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail",
  },
  {
    id: "a_5",
    name: "Arthur Ignatius Conan Doyle",
    bio: "Sir Arthur Ignatius Conan Doyle (22 May 1859 – 7 July 1930) was a British writer and physician. He is best known for his four novels and fifty-six short stories about the fictional consulting detective Sherlock Holmes and his assistant Dr. Watson, which are milestones in crime fiction, and for his first work featuring Professor Challenger, The Lost World (1912), which gave its name to a subgenre of speculative fiction. He was a prolific writer who produced over 200 stories and articles, four volumes of poetry, and a number of works for the stage. He was knighted by King Edward VII in the 1902 Coronation Honours.",
    country: "Scotland",
    photoUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bd/Arthur_Conan_Doyle_by_Walter_Benington%2C_1914.png/250px-Arthur_Conan_Doyle_by_Walter_Benington%2C_1914.png?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail",
  },
  {
    id: "a_6",
    name: "William Shakespeare",
    bio: "William Shakespeare (c. 23 April 1564[b] – 23 April 1616)[c] was an English playwright, poet and actor. He is widely regarded as the greatest writer in the English language and the world's pre-eminent dramatist. He is often called England's national poet and the 'Bard of Avon' or simply 'the Bard'. His extant works, including collaborations, consist of some 39 plays, 154 sonnets, 3 long narrative poems and a few other verses, some of uncertain authorship. His plays have been translated into every major living language and are performed more often than those of any other playwright. Shakespeare remains arguably the most influential writer in the English language, and his works continue to be studied and reinterpreted.",
    country: "England",
    photoUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/William_Shakespeare_by_John_Taylor%2C_edited.jpg/250px-William_Shakespeare_by_John_Taylor%2C_edited.jpg?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail",
  },
  {
    id: "a_7",
    name: "Homer",
    bio: "Homer (possibly born c. 8th century BC) was an ancient Greek poet who is traditionally credited as the author of the Iliad and the Odyssey, two epic poems that are foundational works of ancient Greek literature. Homer was highly revered in ancient Greek society and is considered one of the most influential authors in history. Today, the question of Homer's identity and existence-dubbed the 'Homeric Question' -continues to be debated, and scholars generally regard the two poems as the works of separate authors.",
    country: "Greece",
    photoUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f1/Homer_At_the_British_Museum_2024_%283x4_cropped%29.jpg/250px-Homer_At_the_British_Museum_2024_%283x4_cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail",
  },
  {
    id: "a_8",
    name: "Cormac McCarthy",
    bio: "Cormac McCarthy (born Charles Joseph McCarthy Jr.; July 20, 1933 – June 13, 2023) was an American author who wrote twelve novels, two plays, five screenplays, and three short stories, spanning the Western, post-apocalyptic, and Southern Gothic genres. His works often include graphic depictions of violence, and his writing style is characterized by a sparse use of punctuation and attribution. He is widely regarded as one of the greatest American novelists.",
    country: "America",
    photoUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7f/Cormac_McCarthy_%28Child_of_God_author_portrait_-_high-res%29.jpg/250px-Cormac_McCarthy_%28Child_of_God_author_portrait_-_high-res%29.jpg?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail",
  },
  {
    id: "a_9",
    name: "Harlan Ellison",
    bio: "Harlan Jay Ellison (May 27, 1934 – June 28, 2018) was an American writer, known for his prolific and influential work in New Wave speculative fiction[4] and for his outspoken, combative personality. His published works include more than 1,700 short stories, novellas, screenplays, comic-book scripts, teleplays, essays, and a wide range of criticism covering literature, film, television, and print media.",
    country: "America",
    photoUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/20/Harlan_Ellison_at_the_LA_Press_Club_%28cropped%29.jpg/250px-Harlan_Ellison_at_the_LA_Press_Club_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail",
  },
  {
    id: "a_10",
    name: "Marcus Aurelius",
    bio: "Marcus Aurelius Antoninus (26 April 121 – 17 March 180) was Roman emperor from 161 to 180 and a Stoic philosopher. He was a member of the Nerva–Antonine dynasty, the last of the rulers later known as the Five Good Emperors and the last emperor of the Pax Romana, an age of relative peace, calm, and stability for the Roman Empire lasting from 27 BC to 180 AD. He served as Roman consul in 140, 145, and 161.",
    country: "Greece",
    photoUrl: "https://en.wikipedia.org/wiki/Marcus_Aurelius#/media/File:MSR-ra-61-b-1-DM.jpg",
  },
  {
    id: "a_11",
    name: "Niccolò Machiavelli",
    bio: "Niccolò di Bernardo dei Machiavelli (3 May 1469 – 21 June 1527) was a Florentine diplomat, author, philosopher, and historian who lived during the Italian Renaissance. He is best known for his political treatise The Prince (Il Principe), written around 1513 but not published until 1532, five years after his death. He has often been called the father of modern political philosophy and political science.",
    country: "Italy",
    photoUrl: "https://en.wikipedia.org/wiki/Niccol%C3%B2_Machiavelli#/media/File:Portrait_of_Niccol%C3%B2_Machiavelli_by_Santi_di_Tito.jpg",
  },
];

export const books: Book[] = [
  {
    id: "b_2",
    slug: "moby-dick",
    title: "Moby Dick",
    authorId: "a_2",
    language: "English",
    genre: "Adventure Fiction",
    tags: ["Obsession", "Revenge", "Fate", "The Sea", "Nature", "Madness", "Religion", "Adventure", "Sublime"],
    coverImage: "https://imgs.search.brave.com/9vr-eIvDEHF05QRegSTY9DwRgFyQ063bbpFNOVQNZSA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjE1Z1lBTURIUUwu/anBn",
    coverTone: "blue",
    pageCount: 286,
    publishedYear: 1851,
    description:
      "Moby-Dick; or, The Whale is an 1851 epic novel by American writer Herman Melville. The book centers on the sailor Ishmael's narrative of the maniacal quest of Ahab, captain of the whaling ship Pequod, for vengeance against Moby Dick, the giant white sperm whale that bit off his leg on the ship's previous voyage. A contribution to the literature of the American Renaissance, Moby-Dick was published to mixed reviews, was a commercial failure, and was out of print at the time of the author's death in 1891. Its reputation as a Great American Novel was established only in the 20th century, after the 1919 centennial of its author's birth. William Faulkner said he wished he had written the book himself, and D. H. Lawrence called it 'one of the strangest and most wonderful books in the world' and 'the greatest book of the sea ever written'. Its opening sentence, 'Call me Ishmael', is among world literature's most famous.",
    summary:
      "Moby-Dick is an 1851 epic novel by Herman Melville, narrated by the sailor Ishmael and centered on the monomaniacal quest of Captain Ahab, captain of the whaling ship Pequod. Ahab is driven by a desire for vengeance against Moby Dick, a giant white sperm whale that previously bit off his leg, viewing the animal as the embodiment of evil. The story follows the Pequod’s voyage around the world as Ahab forces the diverse crew to prioritize his revenge mission over the commercial goal of harvesting whale oil. Despite warnings and omens, the ship eventually locates Moby Dick in the Pacific Ocean, leading to a violent three-day chase. In the climax, Moby Dick attacks the Pequod, sinking the ship and killing nearly everyone aboard, including Ahab, who is dragged to his death by his own harpoon line. Ishmael is the sole survivor, rescued after floating on the coffin of his friend Queequeg.",
    readingTimeMinutes: 1560,
  },
  {
    id: "b_3",
    slug: "frankenstein",
    title: "Frankenstein",
    authorId: "a_4",
    language: "English",
    genre: "Gothic Fiction",
    tags: ["Gothic", "Science Fiction", "Horror", "Romanticism", "Classic Literature"],
    coverImage: "https://imgs.search.brave.com/ZJRsYsSvBB8Rd4pXNaUHgjaz2NE-_mDXvDlIIHebGjc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/YWRhemluZy5jb20v/d3AtY29udGVudC91/cGxvYWRzLzIwMjMv/MDYvZnJhbmtlbnN0/ZWluLTIwMTItaGFy/ZGNvdmVyLmpwZw",
    coverTone: "red",
    pageCount: 105,
    publishedYear: 1818,
    description:
      "Frankenstein; or, The Modern Prometheus is an 1818 Gothic novel written by English author Mary Shelley. It tells the story of Victor Frankenstein, a young scientist who creates a sapient creature from different body parts in an unorthodox scientific experiment. Shelley started writing the story when she was 18 and staying in Bath, and the first edition was published anonymously in London on 1 January 1818, when she was 20. Her name first appeared in a French translation published in Paris in 1821.",
    summary:
      "A young scientist, Victor Frankenstein, becomes obsessed with uncovering the secret of life. After years of study, he succeeds in animating a being he has assembled from dead body parts - but is immediately repulsed by his own creation and abandons it. The Creature, intelligent but monstrous in appearance, is rejected by everyone he encounters. Shaped by loneliness and cruelty, he grows bitter and vows revenge on his maker. Told through a frame narrative (a sailor's letters → Victor's confession → the Creature's own account), the novel explores the consequences of unchecked ambition, the responsibility of a creator, and the cost of isolation. It's considered a founding text of both Gothic fiction and science fiction.",
    readingTimeMinutes: 420,
  },
  {
    id: "b_4",
    slug: "blood_meridian",
    title: "Blood Meridian",
    authorId: "a_8",
    language: "English",
    genre: "Historical Fiction",
    tags: ["War", "Fate", "Mystery", "Atheism", "Existence", "Horror", "Journey", "Violence"],
    coverImage: "https://thumb.wikimedia.org/wikipedia/en/thumb/d/df/Blood_Meridian_Cormac_McCarthy_book_cover.png/250px-Blood_Meridian_Cormac_McCarthy_book_cover.png?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail",
    coverTone: "red",
    pageCount: 557,
    publishedYear: 1985,
    description:
      "Blood Meridian or the Evening Redness in the West (known simply and more commonly as Blood Meridian) is a 1985 epic historical novel by American author Cormac McCarthy, classified as an anti-Western and Gothic Western. McCarthy's fifth book, it was published by Random House.",
    summary:
      "Set in the American frontier with a historical context, the narrative follows a fictional teenager from Tennessee referred to as 'The Kid', with the bulk of the text devoted to his experiences with the Glanton gang, a historical group of scalp hunters who massacred American Indians and others in the United States–Mexico borderlands from 1849 to 1850 for bounty, sadistic pleasure, and eventually out of nihilistic habit. The role of antagonist is gradually filled by Judge Holden, a physically massive, highly educated, preternaturally skilled member of the gang with pale and hairless skin who relishes the destruction and domination of whatever he encounters, including children and docile animals.",
    readingTimeMinutes: 780,
  },
  {
    id: "b_5",
    slug: "adventures-of-sherlock-holmes",
    title: "Adevntures of Sherlock Holmes",
    authorId: "a_5",
    language: "English",
    genre: "Detective Fiction",
    tags: ["Mystery", "Crime", "Short Story", "Classic Literature", "Suspense"],
    coverImage: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b9/Adventures_of_sherlock_holmes.jpg/250px-Adventures_of_sherlock_holmes.jpg?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail",
    coverTone: "blue",
    pageCount: 264,
    publishedYear: 1892,
    description:
      "The Adventures of Sherlock Holmes is a collection of short stories by British writer Arthur Conan Doyle, first published on 14 October 1892. It contains the earliest short stories featuring the consulting detective Sherlock Holmes, which had been published in twelve monthly issues of The Strand Magazine from July 1891 to June 1892. The stories are collected in the same sequence, which is not supported by any fictional chronology. The only characters common to all twelve are Holmes and Dr. Watson, and all are relayed in first-person narrative from Watson's point of view.",
    summary:
      "In general the stories in The Adventures of Sherlock Holmes identify, and try to correct, social injustices. Holmes is portrayed as offering a new, fairer sense of justice. The stories were well received, and boosted the subscriptions figures of The Strand Magazine, prompting Doyle to be able to demand more money for his next set of stories. The first story, 'A Scandal in Bohemia', includes the character of Irene Adler, who, despite being featured only within this one story by Doyle, is a prominent character in modern Sherlock Holmes adaptations, often as a love interest for Holmes. Doyle included four of the stories from this collection in his twelve favourite Sherlock Holmes stories, picking 'The Adventure of the Speckled Band' as his overall favourite.",
    readingTimeMinutes: 420,
  },
  {
    id: "b-6",
    slug: "i-have-no-mouth-and-i-must-scream",
    title: "I Have No Mouth and I Must Scream",
    authorId: "a_9",
    language: "English",
    genre: "Post-Apocalyptic Horror",
    tags: ["Post-Apocalyptic", "Horror", "Short Story", "Sci-Fi", "AI"],
    coverImage: "https://en.wikipedia.org/wiki/Special:FilePath/IHaveNoMouth.jpg",
    coverTone: "black",
    pageCount: 22,
    publishedYear: 1967,
    description:
      "'I Have No Mouth, and I Must Scream' is a post-apocalyptic short story by American writer Harlan Ellison. It was first published in the March 1967 issue of IF: Worlds of Science Fiction.",
    summary:
      "The story depicts an AI uprising in which a military supercomputer named AM gains sentience and eradicates humanity except for five individuals. These survivors are kept alive by AM to endure endless torture as a form of revenge against its creators. The story unfolds through the eyes of Ted, the narrator, detailing their perpetual misery and quest for canned food in AM's vast, underground complex, only to face further despair.",
    readingTimeMinutes: 60,
  },
  {
    id: "b_7",
    slug: "the-metamorphosis",
    title: "The Metamorphosis",
    authorId: "a_3",
    language: "English",
    genre: "Existentialism",
    tags: ["Existentialism", "Absurdism", "Fiction", "Sci-Fi", "Psychological"],
    coverImage: "https://m.media-amazon.com/images/I/71yB9kZByYL._SL1499_.jpg",
    coverTone: "black",
    pageCount: 12,
    publishedYear: 1915,
    description:
      "The Metamorphosis (German: Die Verwandlung, pronounced [dɪ fɛɐ̯ˈvantlʊŋ]), also translated as The Transformation,[2] is a novella by Franz Kafka published in 1915.",
    summary:
      "The story depicts an AI uprising in which a military supercomputer named AM gains sentience and eradicates humanity except for five individuals. These survivors are kept alive by AM to endure endless torture as a form of revenge against its creators. The story unfolds through the eyes of Ted, the narrator, detailing their perpetual misery and quest for canned food in AM's vast, underground complex, only to face further despair.",
    readingTimeMinutes: 180,
  },
  {
    id: "b_8",
    slug: "meditations",
    title: "Meditations",
    authorId: "a_10",
    language: "English",
    genre: "Historic",
    tags: ["Historic"],
    coverImage: "https://i.pinimg.com/1200x/63/aa/41/63aa413e062f83b67e91a1199c60ebaf.jpg",
    coverTone: "black",
    pageCount: 83,
    publishedYear: 1558,
    description:
      "Marcus Aurelius wrote the 12 books of the Meditations in Koine Greek as a source for his own guidance and self-improvement. It is possible that large portions of the work were written at Sirmium (modern-day Sremska Mitrovica, Serbia), where he spent much time planning military campaigns in 170–180 AD. A portion of his work was written while he was on campaign, because internal notes reveal that the first book was 'written in the country of the Quadi, at the Granova' (modern-day Hron River in Slovakia) and the second book was written at Carnuntum",
    summary:
      "A central theme to Meditations is the importance of analyzing one's judgment of self and others and developing a cosmic perspective: 'You have the power to strip away many superfluous troubles located wholly in your judgment, and to possess a large room for yourself embracing in thought the whole cosmos, to consider everlasting time, to think of the rapid change in the parts of each thing, of how short it is from birth until dissolution, and how the void before birth and that after dissolution are equally infinite.'",
    readingTimeMinutes: 820,
  },
  {
    id: "b_9",
    slug: "the-prince",
    title: "The Prince",
    authorId: "a_11",
    language: "English",
    genre: "Political Philosophy",
    tags: ["Historic", "Political"],
    coverImage: "https://m.media-amazon.com/images/I/51KV9QHeUBL._SL1500_.jpg",
    coverTone: "black",
    pageCount: 42,
    publishedYear: 1532,
    description:
      "The Prince (Italian: Il Principe [il ˈprintʃipe]; Latin: De Principatibus) is a 16th-century political treatise written by the Italian diplomat and political philosopher Niccolò Machiavelli in the form of an instruction guide for new princes. Many commentators have viewed that one of the main themes of The Prince is that immoral acts are sometimes necessary to achieve political glory.",
    summary:
      "The Prince by Niccolò Machiavelli is a 16th-century political treatise written in 1513 that offers pragmatic advice on how to acquire, maintain, and consolidate political power. Written during Machiavelli’s exile from Florence, the work is dedicated to Lorenzo de' Medici and focuses primarily on 'new principalities' rather than hereditary states, arguing that rulers must prioritize state security and stability over conventional morality.",
    readingTimeMinutes: 180,
  },
  {
    id: "b_10",
    slug: "a-study-in-scarlet",
    title: "A Study in Scarlet",
    authorId: "a_5",
    language: "English",
    genre: "Detective Fiction",
    tags: ["Mystery", "Crime", "Short Story", "Classic Literature", "Suspense"],
    coverImage: "https://en.wikipedia.org/wiki/Special:FilePath/ArthurConanDoyle_AStudyInScarlet_annual.jpg",
    coverTone: "yellow",
    pageCount: 92,
    publishedYear: 1887,
    description:
      "A Study in Scarlet is a detective novel by British author Arthur Conan Doyle. Published in 1887, the story marks the first appearance of Sherlock Holmes and Dr. Watson, who would go on to become one of the most well-known detective duos in literature.",
    summary:
      "Sherlock Holmes and Dr. Watson investigate the murder of Enoch Drebber in London, deducing that the killer is Jefferson Hope - driven by revenge for the death of his love, Lucy Ferrier, who was coerced into marrying Drebber (and his accomplice Stangerson) by Mormon leaders in Utah decades earlier. Hope tracks both men from Utah to London and kills them, dying himself in the process.",
    readingTimeMinutes: 180,
  },
  {
    id: "b_11",
    slug: "the-hound-of-baskervilles",
    title: "The Hound of Baskervilles",
    authorId: "a_5",
    language: "English",
    genre: "Detective Fiction",
    tags: ["Mystery", "Crime", "Short Story", "Classic Literature", "Suspense"],
    coverImage: "https://en.wikipedia.org/wiki/Special:FilePath/Cover_(Hound_of_Baskervilles,_1902).jpg",
    coverTone: "red",
    pageCount: 154,
    publishedYear: 1901,
    description:
      "The Hound of the Baskervilles is the third of the four crime novels by British writer Arthur Conan Doyle featuring the detective Sherlock Holmes. Originally serialised in The Strand Magazine from August 1901 to April 1902, it is set largely in Dartmoor, Devon, in England's West Country and follows Holmes and Watson investigating the legend of a fearsome, diabolical hound of supernatural origin. This was the first appearance of Holmes since his apparent death in 'The Final Problem', and the success of The Hound of the Baskervilles led to the character's eventual revival.",
    summary:
      "The Hound of the Baskervilles (1902) is a Sherlock Holmes novel by Arthur Conan Doyle. Holmes and Watson investigate the death of Sir Charles Baskerville, who was killed by a terrifying ghostly hound on the Devon moors. Holmes suspects the killer is Jack Stapleton, a relative who uses a real dog painted with phosphorescent paint to impersonate the legendary Baskerville hound and scare victims to death, all to claim the family fortune. Holmes and Watson expose the plot, shoot the hound, and Stapleton drowns in the Grimpen Mire.",
    readingTimeMinutes: 240,
  },
];

export const shelves: ShelfEntry[] = [
  {
    userId: currentUserId,
    bookId: "b_1",
    status: "CURRENTLY_READING",
    currentPage: 184,
    progressPercent: 59,
    startedAt: "2026-08-02",
    finishedAt: null,
  },
];

export const profile: Profile = {
  id: currentUserId,
  username: "m.arlen",
  name: "Marion Arlen",
  bio: "Reads two books at once and finishes neither on schedule. Structural engineer by day.",
  avatarUrl: "",
  favoriteGenres: ["Speculative Fiction", "Literary Fiction", "Fantasy"],
};

export function getBookBySlug(slug: string): Book | undefined {
  return books.find((b) => b.slug === slug);
}

export function getAuthorById(id: string): Author | undefined {
  return authors.find((a) => a.id === id);
}

export function generateBookPages(book: Book): BookPage[] {
  const pages: BookPage[] = [];
  const paragraphs = [
    book.summary,
    book.description,
    "The rest of this chapter is placeholder reading content generated for demo purposes - real book content is stored page-by-page per docs/ARCHITECTURE.md and PRD.md §18 once ingestion is wired.",
  ];
  for (let i = 1; i <= Math.min(book.pageCount, 40); i++) {
    pages.push({
      bookId: book.id,
      pageNumber: i,
      content: `${paragraphs[i % paragraphs.length]} - page ${i} of ${book.pageCount}.`,
    });
  }
  return pages;
}