import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { ReadingPassage, QuestionGroup, ReadingTest } from '../shared/types';
import { validateTestVersion, getTestById, getVersionById } from './readingService';

export function getCambridge21Test1Data(): {
  title: string;
  testType: 'academic';
  category: 'mock';
  timeLimitMinutes: number;
  passages: ReadingPassage[];
  questionGroups: QuestionGroup[];
} {
  const passages: ReadingPassage[] = [
    {
      id: 'c21-t1-p1',
      passageNumber: 1,
      title: 'The Davies Sisters',
      subtitle: 'Between 1908 and 1924, Gwendoline and Margaret Davies amassed one of the largest collections of late-nineteenth and early-twentieth-century French paintings in Britain',
      paragraphs: [
        {
          id: 'c21-t1-p1-1',
          label: '1',
          content: `Gwendoline (1882-1951) and Margaret (1884-1963) Davies were the granddaughters of David Davies, a Welshman who amassed a fortune in the shipping and mining industries. In 1907, when Gwendoline came into her inheritance (Margaret would follow in 1909), the sisters were said to be the wealthiest unmarried women in Britain. Their religious upbringing in rural Wales gave them a deep sense of social responsibility and they chose to use their inheritance for cultural and philanthropic purposes.`,
        },
        {
          id: 'c21-t1-p1-2',
          label: '2',
          content: `While there was no real family history of art collecting, the sisters' education was rigorously geared toward such pursuits. Their London school focused on cultural rather than academic study, and they travelled extensively with their governess, Jane Blaker, visiting art galleries and making extensive notes on the collections there.`,
        },
        {
          id: 'c21-t1-p1-3',
          label: '3',
          content: `The sisters began to make regular art purchases from 1908, which roughly coincided with the dates of their inheritance. They took advice from various people, including the art dealer Hugh Blaker (the brother of Jane Blaker) and David Croal Thompson, who was also an art dealer. While it was long assumed that these men were largely responsible for the nature of the sisters' collection, it has recently been accepted that Gwendoline and Margaret retained a far more active role in the process.`,
        },
        {
          id: 'c21-t1-p1-4',
          label: '4',
          content: `The sisters' journals reveal their preference for Old Master paintings. Yet they initially made very few attempts to secure any such works. While the sisters were wealthy in relative terms, their income was nothing compared to the fortunes of American art collectors of this period, such as J. Pierpont Morgan. Quite simply, high quality Old Master works were, if not beyond their means, then beyond what they were willing to pay for them. Instead, their early purchases were of the fashionable, safe variety, and included, for example, paintings by the French artist Jean-Baptiste-Camille Corot.`,
        },
        {
          id: 'c21-t1-p1-5',
          label: '5',
          content: `However, it was only a few years before their collecting took a new direction and they turned to the work of the French Impressionists. We know that Hugh Blaker, as a champion of contemporary French art had a hand in the decision, and we know also that they would have seen examples on their various trips to Paris. Whatever the precise reason for this change, their first purchases of Impressionist art, made in October 1912, were scenes of Venice by the French artist Claude Monet. Over the next 12 years, the sisters amassed the bulk of their Impressionist collection, including six further works by Monet, two more by Manet, and three by Renoir, including his well-known painting La Parisienne.`,
        },
        {
          id: 'c21-t1-p1-6',
          label: '6',
          content: `The First World War (1914-1918) played a part in the development of the sisters' collection. Their initial response to the war effort was to finance the safe passage of artists from occupied Belgium to Wales, as a humanitarian act, but also with the hope of establishing a vibrant artists' community in the area. Later in the conflict, both sisters decided to volunteer at a canteen for troops at Troyes, in northern France; Gwendoline in 1916, followed by Margaret in 1917.`,
        },
        {
          id: 'c21-t1-p1-7',
          label: '7',
          content: `It was tedious and distressing work, which would have a permanent effect on Gwendoline's health. Yet on one of numerous trips to nearby Paris, she visited the Bernheim-Jeune Gallery. Here she acquired two works by Cézanne - Provençal Landscape and The François Zola Dam. The paintings were shipped directly to Bath, England, where they became the first works by Cézanne to go on display in a public gallery in Britain.`,
        },
        {
          id: 'c21-t1-p1-8',
          label: '8',
          content: `Commentators have often described the sisters as unlikely pioneer collectors. Much is made of their isolation in rural Wales and the fact that they didn't make friends with artists or gallery owners. Yet they didn't feel obliged to follow fashionable tastes and were free to pursue their own preferences. Although they relied on a trusted circle of advisers, they made frequent trips to London and Paris, and also regularly had paintings sent to their home for consideration.`,
        },
        {
          id: 'c21-t1-p1-9',
          label: '9',
          content: `By the early 1920s, Gwendoline felt increasingly uncomfortable buying art works when faced with the poverty and social upheaval created by the First World War. Her philanthropic pursuits then became focused almost exclusively on social causes and the development of the sisters' home at Gregynog Hall into a conference center and venue for the Gregynog Festival of Music and Poetry. Gwendoline made her final art purchase in March 1926. Margaret also stopped collecting around this time, but started again in the 1930s acquiring, on a relatively small scale, work by contemporary British artists.`,
        },
        {
          id: 'c21-t1-p1-10',
          label: '10',
          content: `The sisters collected French Impressionist paintings at a time when such art was routinely ignored by individuals and institutions alike. The Gwendoline and Margaret Davies collection, donated in 1951 and 1963 respectively to the National Museum Wales, contains major examples of work by leading French Impressionists. In collecting paintings that they loved, the sisters created a lasting and meaningful cultural legacy for the people of Wales and beyond.`,
        },
      ],
    },
    {
      id: 'c21-t1-p2',
      passageNumber: 2,
      title: 'Why we need silence',
      subtitle: 'You should spend about 20 minutes on Questions 14-26, which are based on Reading Passage 2 below.',
      paragraphs: [
        {
          id: 'c21-t1-p2-A',
          label: 'A',
          content: `Humans are finely attuned to noise, and for good reason. From an evolutionary perspective, sounds give us vital information, helping us navigate the world and avoid danger. To help ensure loud or unexpected noises get the attention they deserve, our internal chemistry alters in response to them. Our blood pressure goes up, muscles tense and glands release hormones that prepare us for fight or flight. In the short term, this is a good thing. When we are exposed to too much noise over the long term, however, those responses can lead to a multitude of health issues, from sleep disturbance to even cardiovascular disease.`,
        },
        {
          id: 'c21-t1-p2-B',
          label: 'B',
          content: `The World Health Organization has recently designated excessive noise as an 'underestimated threat' to public health, and has said that people living in cities such as Mumbai, Tokyo and Buenos Aires are being exposed to far more than the recommended 40 decibels of noise at night. A report from the European Environment Agency concluded that noise was an ongoing and widespread issue in Europe, with at least 1 in 5 people consistently exposed to levels considered harmful to health. 'There are no "earlids" that can protect your brain from noise,' says Nick Antonio, an acoustic consultant who has contributed to the British and international standards for noise.`,
        },
        {
          id: 'c21-t1-p2-C',
          label: 'C',
          content: `The good news is that several cities have been working to turn the volume down. One of the first to do so was London. 'By providing recommendations for quieter buses, reducing noise from roads and also controlling noise from aircraft, they were able to make the city quieter,' says Antonio. Other cities have introduced noise-reducing road coatings, for instance, alongside greenery that muffles sound. Some solutions are more specific: Washington DC's ban on petrol-powered leaf blowers came into effect recently, while in New York City, legislation has been approved to fine people who modify their vehicles to make them noisier. 'People are seeing the benefits of these more quiet environments in their cities,' Antonio says. 'I expect we will see much more of this in the future.'`,
        },
        {
          id: 'c21-t1-p2-D',
          label: 'D',
          content: `Researchers are also seeking to understand what aspects of silent experiences are most beneficial to our health. One of the best-researched is the flotation tank: a lightproof, soundproof tank of salt water in which a person floats as a form of deep relaxation. While some people experience altered perception in the tanks, involving subtle humming sounds and visual effects, these effects are benign and do not detract from the benefits of the experience, says Justin Feinstein, a clinical neuropsychologist. 'When you don't have external sensory stimuli coming in, the brain tries to fill the void to make sense of this dark and silent world,' he explains. 'In these tanks, some people can even hear the sound of their eyes blinking,' says Feinstein. 'But it is the ability to focus on the breath that helps people reach a relaxed or meditative state.'`,
        },
        {
          id: 'c21-t1-p2-E',
          label: 'E',
          content: `To further explore flotation tanks as a therapeutic tool, Feinstein and his colleagues recruited 50 people with a variety of conditions related to stress and had them answer a questionnaire prior to and following a flotation session. Participants reported decreases in muscle tension, pain and symptoms of their conditions after a single, 1-hour float, alongside an increase in feelings of relaxation and overall wellbeing.
Less is known about what effects sensory deprivation can have on the brain. To investigate, Feinstein's team had 48 people participate in either three 90-minute float sessions or three 90-minute periods of relaxing on a chair which reclined. Participants had their brains scanned using functional magnetic resonance imaging at the beginning and end of the trial. Float sessions uniquely decreased activity in the default mode network (DMN), a collection of brain regions commonly linked with depression. Feinstein says it is an exciting finding, because flotation tanks seem to offer a way of 'resetting' our nervous system to prevent it from getting out of balance.`,
        },
        {
          id: 'c21-t1-p2-F',
          label: 'F',
          content: `Neurobiologist Tai Dotan Ben-Soussan is also an advocate of silence as a therapy. 'When we find ways to be quiet, we are not only quiet in our environment, but quiet in our inner selves,' she explains. 'This allows us to be more aware of what is happening around us and what the situation may require from us so we can provide [a more] adequate response.'
Not everyone will benefit from silence to the same extent, but Ben-Soussan says one characteristic is key: the person must need to want to engage in the experience. 'We see from animal models and human studies that volition and intentionality is important,' she says. 'When people do not want silence, it can be very distressing.'`,
        },
        {
          id: 'c21-t1-p2-G',
          label: 'G',
          content: `Eric Pfeifer, a psychotherapy researcher, also concedes that some people may not benefit from silence, particularly those who are in a heightened state of stress. 'People in these states may not be able to relax or calm down in a silent condition,' he says. Professional guidance can be useful, he adds, allowing people to approach silence slowly so that they can gradually enjoy the benefits. And Pfeifer is convinced that silence is more attainable in everyday life than people think. First, complete silence isn't necessary. In a recent study, he found that participants reported more relaxation and less boredom when they sat quietly in an outdoor garden compared with a completely silent room. Second, Pfeifer believes we don't need a lot of silence to gain benefits. 'You don't need to spend hours in silence,' he says. 'It is likely better to have more frequency of silence for a few minutes at a time than a longer period of silence only once a week. Just finding those places in your daily life where you can find some silence ... can make a big difference.'`,
        },
      ],
    },
    {
      id: 'c21-t1-p3',
      passageNumber: 3,
      title: 'Book review: The World of Sugar by Ulbe Bosma',
      subtitle: 'You should spend about 20 minutes on Questions 27-40, which are based on Reading Passage 3 below.',
      paragraphs: [
        {
          id: 'c21-t1-p3-1',
          label: '1',
          content: `Ulbe Bosma's The World of Sugar is a genuinely global history. Bosma discusses all the sugar-growing places of the world, beginning with Cuba and Java, the largest exporters of the early 20th century. But this is a history not just of cane sugar but also of beet sugar, an equally important form of traded sugar over the last hundred years. Beet sugar is grown mainly in Europe and the United States. It has also been massively subsidised and sold at artificially low prices on world markets, threatening the livelihood of producers of cane sugar.`,
        },
        {
          id: 'c21-t1-p3-2',
          label: '2',
          content: `Bosma's discussion of the sugar market in Britain gives a sense of the book's range. The sweet-toothed British first bought cane sugar from their own slavery-dependent colonial plantations. Following the abolition of slavery in the British Empire, cane sugar was imported to Britain from places which retained the practice, such as Cuba and Brazil. Towards the end of the 19th century, the British started to import beet sugar from continental Europe. Only in the 20th century was there a move to develop a national beet sugar industry.`,
        },
        {
          id: 'c21-t1-p3-3',
          label: '3',
          content: `The book provides a global labour history, investigating the wide range of labour regimes associated with growing sugar. Contrary to popular belief, cane sugar production was never just restricted to large, dedicated plantations owned by rich men. For example, in Java, a huge exporter of sugar in the early 20th century, sugar cane was grown together with rice in an extraordinarily labour-intensive way by small farmers.`,
        },
        {
          id: 'c21-t1-p3-4',
          label: '4',
          content: `The World of Sugar is also a story of similarity and continuity in sugar cultivation. For example, imported labour has been used for much large-scale production. German beet fields employed Polish workers; Mexicans and many others, including Sicilians, were vital to US sugar production. Cane cutting, Bosma shows, remains a poorly paid and brutal business to this day in many places in the world. But as well as this, the book is about the continuity of the use of traditional methods on small farms. In the mid 20th-century, this type of sugar production dominated in South Asia and Latin America.`,
        },
        {
          id: 'c21-t1-p3-5',
          label: '5',
          content: `This is also a history of capitalists and sugar dynasties, as well as corporations that in some cases have remained influential over very long periods. Great firms and great interests have had profound influence on the policies of states. In many places - not just the British Caribbean but Cuba and the Philippines too - a powerful sugar bourgeoisie played a major role in politics and their interests were consequently protected by trade barriers and subsidies. In the battle for control of the industry, it was inevitably the poor countries which came off worse. All this is explored by Bosma with wonderful subtlety and control.`,
        },
        {
          id: 'c21-t1-p3-6',
          label: '6',
          content: `But sugar production was never just a matter of agriculture. It also involved the extraction, close to the place of harvest, of sucrose from the sugar plant, a process which required machinery powered by humans, animals, wind or steam. Further processes involved boiling (from the 19th century, this often involved vacuum systems) and the separation of sugar from other materials in a process known as refinement. From very early on, sugar production was an energy-intensive industrial process, mostly taking place in the countryside and in refineries in centres of consumption, both small and large. The growth of the industry entailed a very rapid diffusion of ideas and techniques from one country to another. Cuba, for example, developed an extraordinarily dense system of railways to transport workers and cane, as well as steam-powered sugar factories. Particular varieties of cane sugar and beet sugar spread very rapidly across the world, in accordance with local needs and demands.`,
        },
        {
          id: 'c21-t1-p3-7',
          label: '7',
          content: `Where once only tiny quantities of sugar could be produced, now new techniques, varieties, fertilisers, irrigation systems and much more have turned gleaming white sugar into a ubiquitous chemical. Over the same time, there has been a massive increase in consumption. Once regarded as a luxury, sugar came to be promoted as a valuable source of energy. But as the consumption of sugar has increased, so has the harm it does, whether to people's teeth or weight. In the face of appalling obstruction from the sugar industry to attempts to reduce consumption, some countries have been forced to tax sugar in order to bring that about. The sugar industry has a history of attacking its critics and, when it comes to obesity, of trying to blame fats, and lack of exercise and self-control. And the recent past has seen worrying new developments in mass sweetening. High-fructose corn syrup made from maize using an enzymatic process invented in Japan in the 1960s has a similar number of calories to table sugar but is far cheaper to produce. It is now widely consumed, having been adopted in the making of soft drinks and a large number of processed foods, and is regarded as a leading cause of obesity.`,
        },
        {
          id: 'c21-t1-p3-8',
          label: '8',
          content: `This is a wonderfully rich book, a model of global history, the history of production and the history of capitalism. Bosma avoids outbursts of emotion, celebratory or critical, even if they might have made his analysis of the multiple tragedies involving sugar all the more powerful. He shows that we could always have done without sugar and that today we have many alternative sources of sweetness. Yet many of the poorest people in the world still depend on it to make a living.`,
        },
      ],
    },
  ];

  const questionGroups: QuestionGroup[] = [
    // Passage 1: Questions 1–7 (Note completion)
    {
      id: 'c21-t1-g1',
      passageId: 'c21-t1-p1',
      questionType: 'note_completion',
      title: 'Questions 1–7',
      instructions: 'Complete the notes below.\nChoose ONE WORD ONLY from the passage for each answer.',
      startQuestionNumber: 1,
      endQuestionNumber: 7,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      contentWithGaps: `Gwendoline and Margaret Davies
Family and early life
• their grandfather's wealth came from [[1]] and transportation businesses
• their upbringing gave them a sense of social responsibility
• their [[2]] was designed to give them an interest in activities such as collecting art
• their governess took them on trips to art galleries
• they took lengthy [[3]] about the things they saw in art galleries
The sisters as art collectors
• their [[4]] showed they liked Old Master paintings, but they were expensive to buy
• their early purchases were safe, popular paintings
• the first Impressionist paintings they bought showed places in [[5]]
Impact of First World War
• they helped bring artists from Belgium to Wales
• they worked in a [[6]] for soldiers in France
Opinions about the sisters as art collectors
• were not considered typical collectors - they lived in isolation in the countryside and did not have any [[7]] who were artists`,
      questions: [
        {
          id: 'c21-t1-q1',
          questionNumber: 1,
          prompt: "their grandfather's wealth came from ________ and transportation businesses",
          answerKey: 'mining',
          acceptedAlternatives: ['mining'],
          explanation: 'Paragraph 1: "granddaughters of David Davies, a Welshman who amassed a fortune in the shipping and mining industries."',
          evidenceQuote: 'amassed a fortune in the shipping and mining industries',
          paragraphRef: '1',
          whyCorrect: 'The passage explicitly lists "shipping and mining" as the source of their grandfather David Davies\' fortune, corresponding to "mining and transportation".',
          whyIncorrect: 'Using any word other than "mining" violates the text fact and the ONE WORD ONLY restriction.',
          commonTrap: 'Paraphrasing: "shipping" is paraphrased as "transportation businesses", leaving "mining" as the exact gap word.',
        },
        {
          id: 'c21-t1-q2',
          questionNumber: 2,
          prompt: 'their ________ was designed to give them an interest in activities such as collecting art',
          answerKey: 'education',
          acceptedAlternatives: ['education'],
          explanation: 'Paragraph 2: "the sisters\' education was rigorously geared toward such pursuits."',
          evidenceQuote: "the sisters' education was rigorously geared toward such pursuits",
          paragraphRef: '2',
          whyCorrect: 'The text states that "the sisters\' education was rigorously geared toward such pursuits" (referring to art collecting).',
          whyIncorrect: 'Words like "school" or "governess" do not fit the grammatical gap or complete the idea of being designed/geared toward pursuits.',
          commonTrap: 'Matching "geared toward" with "designed to give them an interest in".',
        },
        {
          id: 'c21-t1-q3',
          questionNumber: 3,
          prompt: 'they took lengthy ________ about the things they saw in art galleries',
          answerKey: 'notes',
          acceptedAlternatives: ['notes'],
          explanation: 'Paragraph 2: "visiting art galleries and making extensive notes on the collections there."',
          evidenceQuote: 'visiting art galleries and making extensive notes on the collections there',
          paragraphRef: '2',
          whyCorrect: '"Making extensive notes" directly corresponds to taking "lengthy notes".',
          whyIncorrect: '"Journals" refers to what they wrote later, not the specific extensive notes made during gallery visits with their governess.',
          commonTrap: 'Confusing "notes" (made while visiting art galleries) with "journals" (mentioned in Paragraph 4).',
        },
        {
          id: 'c21-t1-q4',
          questionNumber: 4,
          prompt: 'their ________ showed they liked Old Master paintings, but they were expensive to buy',
          answerKey: 'journals',
          acceptedAlternatives: ['journals'],
          explanation: 'Paragraph 4: "The sisters\' journals reveal their preference for Old Master paintings."',
          evidenceQuote: "The sisters' journals reveal their preference for Old Master paintings",
          paragraphRef: '4',
          whyCorrect: 'The text states that their "journals reveal their preference for Old Master paintings", directly matching "showed they liked".',
          whyIncorrect: '"Notes" was already used in Q3; here the source revealing their preference is specifically "journals".',
          commonTrap: 'Look for the exact noun functioning as the subject that reveals ("showed") their preference.',
        },
        {
          id: 'c21-t1-q5',
          questionNumber: 5,
          prompt: 'the first Impressionist paintings they bought showed places in ________',
          answerKey: 'Venice',
          acceptedAlternatives: ['Venice'],
          explanation: 'Paragraph 5: "their first purchases of Impressionist art, made in October 1912, were scenes of Venice by the French artist Claude Monet."',
          evidenceQuote: 'their first purchases of Impressionist art, made in October 1912, were scenes of Venice',
          paragraphRef: '5',
          whyCorrect: 'The text explicitly says their first Impressionist acquisitions "were scenes of Venice".',
          whyIncorrect: '"Paris" was where they saw examples and visited galleries, not what their first purchases depicted.',
          commonTrap: 'Distinguishing the subject depicted ("scenes of Venice") from the place visited ("trips to Paris").',
        },
        {
          id: 'c21-t1-q6',
          questionNumber: 6,
          prompt: 'they worked in a ________ for soldiers in France',
          answerKey: 'canteen',
          acceptedAlternatives: ['canteen'],
          explanation: 'Paragraph 6: "both sisters decided to volunteer at a canteen for troops at Troyes, in northern France"',
          evidenceQuote: 'volunteer at a canteen for troops at Troyes, in northern France',
          paragraphRef: '6',
          whyCorrect: '"Volunteer at a canteen for troops" directly maps to "worked in a canteen for soldiers".',
          whyIncorrect: '"Troyes" is the town name, whereas the prompt asks for "worked in a [noun]".',
          commonTrap: 'Recognizing that "troops" is a synonym for "soldiers".',
        },
        {
          id: 'c21-t1-q7',
          questionNumber: 7,
          prompt: 'did not have any ________ who were artists',
          answerKey: 'friends',
          acceptedAlternatives: ['friends'],
          explanation: 'Paragraph 8: "the fact that they didn\'t make friends with artists or gallery owners."',
          evidenceQuote: "the fact that they didn't make friends with artists or gallery owners",
          paragraphRef: '8',
          whyCorrect: '"didn\'t make friends with artists" translates to "did not have any friends who were artists".',
          whyIncorrect: '"Advisers" or "dealers" contradicts the text, as they did rely on a trusted circle of advisers.',
          commonTrap: 'The negative phrasing "didn\'t make friends with" matches "did not have any friends".',
        },
      ],
    },

    // Passage 1: Questions 8–13 (TRUE / FALSE / NOT GIVEN)
    {
      id: 'c21-t1-g2',
      passageId: 'c21-t1-p1',
      questionType: 'true_false_not_given',
      title: 'Questions 8–13',
      instructions: 'Do the following statements agree with the information given in Reading Passage 1?\nIn boxes 8–13 on your answer sheet, write:\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this',
      startQuestionNumber: 8,
      endQuestionNumber: 13,
      questions: [
        {
          id: 'c21-t1-q8',
          questionNumber: 8,
          prompt: "The Davies sisters' childhood influenced the way they decided to use their wealth.",
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE'],
          explanation: 'Paragraph 1 confirms: "Their religious upbringing in rural Wales gave them a deep sense of social responsibility and they chose to use their inheritance for cultural and philanthropic purposes."',
          evidenceQuote: 'Their religious upbringing in rural Wales gave them a deep sense of social responsibility and they chose to use their inheritance for cultural and philanthropic purposes',
          paragraphRef: '1',
          whyCorrect: '"Religious upbringing in rural Wales" refers to their childhood, which gave them a sense of responsibility directing how they used their wealth.',
          whyIncorrect: 'FALSE contradicts the explicit causal link stated between upbringing and philanthropic choices.',
          commonTrap: '"Upbringing" is a direct synonym for "childhood" influence.',
        },
        {
          id: 'c21-t1-q9',
          questionNumber: 9,
          prompt: "The Jean-Baptiste-Camille Corot paintings in the Davies sisters' collection were purchased from a gallery in France.",
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation: 'Paragraph 4 mentions their early purchases included paintings by Corot, but does not state where or from which gallery they were purchased.',
          evidenceQuote: 'paintings by the French artist Jean-Baptiste-Camille Corot',
          paragraphRef: '4',
          whyCorrect: 'Although Corot was French, the passage never mentions that the paintings were bought from a gallery in France.',
          whyIncorrect: 'Neither TRUE nor FALSE can be verified because the purchase location of the Corot paintings is omitted.',
          commonTrap: 'Assumption trap: assuming that because the artist was French, the paintings must have been bought in France.',
        },
        {
          id: 'c21-t1-q10',
          questionNumber: 10,
          prompt: "Hugh Blaker opposed the Davies sisters' decision to buy art by French Impressionists.",
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE'],
          explanation: 'Paragraph 5 states: "We know that Hugh Blaker, as a champion of contemporary French art had a hand in the decision...", meaning he supported and influenced it, not opposed it.',
          evidenceQuote: 'We know that Hugh Blaker, as a champion of contemporary French art had a hand in the decision',
          paragraphRef: '5',
          whyCorrect: '"champion... had a hand in the decision" directly contradicts the claim that he "opposed" their decision.',
          whyIncorrect: 'Opposed means the opposite of championing and having a hand in the positive decision.',
          commonTrap: 'Overlooking that a "champion" of an art movement advocates and promotes it.',
        },
        {
          id: 'c21-t1-q11',
          questionNumber: 11,
          prompt: 'The exhibition of Cezanne paintings at the Bath gallery was very popular with the public.',
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation: 'Paragraph 7 mentions the paintings became the first works by Cézanne to go on display in a public gallery in Britain, but says nothing about whether the exhibition was popular.',
          evidenceQuote: 'became the first works by Cézanne to go on display in a public gallery in Britain',
          paragraphRef: '7',
          whyCorrect: 'The text confirms it was the first display in a public gallery, but remains completely silent on public popularity or attendance.',
          whyIncorrect: 'There is no evidence confirming or denying whether the public liked or attended it.',
          commonTrap: 'Confusing being historic/first with being popular.',
        },
        {
          id: 'c21-t1-q12',
          questionNumber: 12,
          prompt: 'The impact of the First World War encouraged Gwendoline to reconsider her interest in collecting art.',
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE'],
          explanation: 'Paragraph 9 states: "Gwendoline felt increasingly uncomfortable buying art works when faced with the poverty and social upheaval created by the First World War. Her philanthropic pursuits then became focused almost exclusively on social causes... made her final art purchase in March 1926."',
          evidenceQuote: 'Gwendoline felt increasingly uncomfortable buying art works when faced with the poverty and social upheaval created by the First World War',
          paragraphRef: '9',
          whyCorrect: 'The devastation of WWI directly led Gwendoline to feel uncomfortable buying art, stop purchasing in 1926, and refocus on social causes.',
          whyIncorrect: 'FALSE contradicts the passage\'s explicit explanation of why she shifted away from art collecting.',
          commonTrap: 'Connecting her "uncomfortable feeling" and stopping purchases to "reconsidering her interest".',
        },
        {
          id: 'c21-t1-q13',
          questionNumber: 13,
          prompt: 'The Davies sisters bought French Impressionist art during a period when very few people were doing so.',
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE'],
          explanation: 'Paragraph 10 confirms: "The sisters collected French Impressionist paintings at a time when such art was routinely ignored by individuals and institutions alike."',
          evidenceQuote: 'The sisters collected French Impressionist paintings at a time when such art was routinely ignored by individuals and institutions alike',
          paragraphRef: '10',
          whyCorrect: '"routinely ignored by individuals and institutions alike" means very few people or organizations were buying or paying attention to it.',
          whyIncorrect: 'FALSE contradicts "routinely ignored".',
          commonTrap: 'Paraphrasing: "routinely ignored by individuals" corresponds to "very few people were doing so".',
        },
      ],
    },

    // Passage 2: Questions 14–17 (Matching Information)
    {
      id: 'c21-t1-g3',
      passageId: 'c21-t1-p2',
      questionType: 'matching_information',
      title: 'Questions 14–17',
      instructions: 'Reading Passage 2 has seven sections, A–G.\nWhich section contains the following information?\nWrite the correct letter, A–G, in boxes 14–17 on your answer sheet.',
      startQuestionNumber: 14,
      endQuestionNumber: 17,
      optionsList: [
        { key: 'A', text: 'Section A' },
        { key: 'B', text: 'Section B' },
        { key: 'C', text: 'Section C' },
        { key: 'D', text: 'Section D' },
        { key: 'E', text: 'Section E' },
        { key: 'F', text: 'Section F' },
        { key: 'G', text: 'Section G' },
      ],
      questions: [
        {
          id: 'c21-t1-q14',
          questionNumber: 14,
          prompt: 'examples of strategies to decrease the noise that the public are exposed to',
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation: 'Section C describes city initiatives including London\'s recommendations for quieter buses and aircraft controls, noise-reducing road coatings, Washington DC\'s leaf blower ban, and NYC fines.',
          evidenceQuote: 'By providing recommendations for quieter buses, reducing noise from roads and also controlling noise from aircraft',
          paragraphRef: 'C',
          whyCorrect: 'Section C is dedicated to practical urban strategies and legislation designed to reduce public noise exposure.',
          whyIncorrect: 'Other sections discuss evolutionary biology, medical consequences, or flotation tanks.',
          commonTrap: 'Look for specific municipal policies and engineering solutions.',
        },
        {
          id: 'c21-t1-q15',
          questionNumber: 15,
          prompt: 'data indicating the extent of the problem of excessive noise',
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation: 'Section B presents statistics: WHO night recommendation of 40 decibels exceeded in Mumbai, Tokyo, and Buenos Aires, and the EEA finding that at least 1 in 5 people in Europe are consistently exposed to harmful levels.',
          evidenceQuote: 'at least 1 in 5 people consistently exposed to levels considered harmful to health',
          paragraphRef: 'B',
          whyCorrect: 'Section B contains specific numerical data ("40 decibels", "1 in 5 people") showing the geographic and demographic scale of excessive noise.',
          whyIncorrect: 'Section A discusses the physiological impact without quantitative epidemiological data.',
          commonTrap: '"Data" points specifically to numerical measurements and statistical findings.',
        },
        {
          id: 'c21-t1-q16',
          questionNumber: 16,
          prompt: 'a description of physiological changes in our bodies when we hear sudden noises',
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation: 'Section A describes how "our internal chemistry alters in response to them. Our blood pressure goes up, muscles tense and glands release hormones that prepare us for fight or flight."',
          evidenceQuote: 'Our blood pressure goes up, muscles tense and glands release hormones that prepare us for fight or flight',
          paragraphRef: 'A',
          whyCorrect: 'Section A details the bodily fight-or-flight reactions (blood pressure, muscles, hormonal glands) triggered by unexpected loud sounds.',
          whyIncorrect: 'Section E examines brain scans during flotation, not acute bodily responses to sudden loud noises.',
          commonTrap: 'Distinguish between immediate fight-or-flight physiological changes (Section A) and long-term therapeutic neurological changes (Section E).',
        },
        {
          id: 'c21-t1-q17',
          questionNumber: 17,
          prompt: 'evidence that a relatively quiet environment can be more beneficial than a totally silent one',
          answerKey: 'G',
          acceptedAlternatives: ['G'],
          explanation: 'Section G notes Eric Pfeifer\'s study showing "participants reported more relaxation and less boredom when they sat quietly in an outdoor garden compared with a completely silent room."',
          evidenceQuote: 'reported more relaxation and less boredom when they sat quietly in an outdoor garden compared with a completely silent room',
          paragraphRef: 'G',
          whyCorrect: 'Section G compares an outdoor garden (relatively quiet) directly against a completely silent room, finding the garden more beneficial.',
          whyIncorrect: 'Section D argues for the benefits of flotation tanks (total silence) rather than preferring relative quiet.',
          commonTrap: 'Look for the explicit comparative experiment between partial quiet and absolute silence.',
        },
      ],
    },

    // Passage 2: Questions 18–21 (Summary Completion)
    {
      id: 'c21-t1-g4',
      passageId: 'c21-t1-p2',
      questionType: 'summary_completion_words',
      title: 'Questions 18–21',
      instructions: 'Complete the summary below.\nChoose ONE WORD ONLY from the passage for each answer.',
      startQuestionNumber: 18,
      endQuestionNumber: 21,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      contentWithGaps: `Flotation Tanks
According to Justin Feinstein, flotation tanks allow people to concentrate on their own [[18]], which helps them relax and enables them to meditate.
Feinstein and his colleagues conducted an experiment in which 50 people, who were all suffering from stress and related issues, were given a [[19]] to complete before and after using a flotation tank. Participants reported a reduction in their symptoms after an hour in the tank, together with signs of relaxation and improved general [[20]].
In another experiment, the researchers had 48 people spend periods of 90 minutes either lying back in a chair or floating in a tank. Brain scans then revealed that those people who had been in a tank had decreased activity in parts of the brain associated with [[21]].`,
      questions: [
        {
          id: 'c21-t1-q18',
          questionNumber: 18,
          prompt: 'flotation tanks allow people to concentrate on their own ________',
          answerKey: 'breath',
          acceptedAlternatives: ['breath'],
          explanation: 'Section D: "it is the ability to focus on the breath that helps people reach a relaxed or meditative state."',
          evidenceQuote: 'it is the ability to focus on the breath that helps people reach a relaxed or meditative state',
          paragraphRef: 'D',
          whyCorrect: '"Focus on the breath" directly paraphrases "concentrate on their own breath".',
          whyIncorrect: '"Breathing" is not the exact word in the passage; the text uses the noun "breath".',
          commonTrap: 'Extracting the exact word form ("breath") rather than a grammatical variant.',
        },
        {
          id: 'c21-t1-q19',
          questionNumber: 19,
          prompt: 'were given a ________ to complete before and after using a flotation tank',
          answerKey: 'questionnaire',
          acceptedAlternatives: ['questionnaire'],
          explanation: 'Section E: "recruited 50 people... and had them answer a questionnaire prior to and following a flotation session."',
          evidenceQuote: 'had them answer a questionnaire prior to and following a flotation session',
          paragraphRef: 'E',
          whyCorrect: '"Answer a questionnaire prior to and following" matches "given a questionnaire to complete before and after".',
          whyIncorrect: '"Survey" or "test" does not appear in the text.',
          commonTrap: 'Check spelling: "questionnaire" with double-n.',
        },
        {
          id: 'c21-t1-q20',
          questionNumber: 20,
          prompt: 'signs of relaxation and improved general ________',
          answerKey: 'wellbeing',
          acceptedAlternatives: ['wellbeing', 'well-being'],
          explanation: 'Section E: "alongside an increase in feelings of relaxation and overall wellbeing."',
          evidenceQuote: 'alongside an increase in feelings of relaxation and overall wellbeing',
          paragraphRef: 'E',
          whyCorrect: '"Overall wellbeing" corresponds to "general wellbeing".',
          whyIncorrect: '"Health" is not used in this specific summary sentence.',
          commonTrap: '"Overall" is paraphrased by "general", requiring the noun "wellbeing".',
        },
        {
          id: 'c21-t1-q21',
          questionNumber: 21,
          prompt: 'decreased activity in parts of the brain associated with ________',
          answerKey: 'depression',
          acceptedAlternatives: ['depression'],
          explanation: 'Section E: "decreased activity in the default mode network (DMN), a collection of brain regions commonly linked with depression."',
          evidenceQuote: 'a collection of brain regions commonly linked with depression',
          paragraphRef: 'E',
          whyCorrect: '"commonly linked with depression" directly corresponds to "associated with depression".',
          whyIncorrect: '"Stress" was the condition recruited for in the first study, but the brain regions (DMN) were specifically linked with depression.',
          commonTrap: 'Distinguish between the participants\' conditions (stress) and what the specific brain network is linked with (depression).',
        },
      ],
    },

    // Passage 2: Questions 22–26 (Matching Features)
    {
      id: 'c21-t1-g5',
      passageId: 'c21-t1-p2',
      questionType: 'matching_features',
      title: 'Questions 22–26',
      instructions: 'Look at the following statements (Questions 22–26) and the list of people below.\nMatch each statement with the correct person, A, B, C or D.\nNB You may use any letter more than once.',
      startQuestionNumber: 22,
      endQuestionNumber: 26,
      optionReuseAllowed: true,
      optionsList: [
        { key: 'A', text: 'Nick Antonio' },
        { key: 'B', text: 'Justin Feinstein' },
        { key: 'C', text: 'Tai Dotan Ben-Soussan' },
        { key: 'D', text: 'Eric Pfeifer' },
      ],
      questions: [
        {
          id: 'c21-t1-q22',
          questionNumber: 22,
          prompt: 'It is unpleasant and upsetting for people to be placed in a silent environment against their will.',
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation: 'Section F: Tai Dotan Ben-Soussan states: "When people do not want silence, it can be very distressing."',
          evidenceQuote: 'When people do not want silence, it can be very distressing',
          paragraphRef: 'F',
          whyCorrect: 'Ben-Soussan emphasizes that without volition, silence "can be very distressing" (upsetting/unpleasant against their will).',
          whyIncorrect: 'Pfeifer speaks about highly stressed individuals having difficulty calming down, but Ben-Soussan specifically highlights distress from lack of desire/will for silence.',
          commonTrap: 'Recognizing that "against their will" paraphrases "do not want silence", and "distressing" paraphrases "upsetting".',
        },
        {
          id: 'c21-t1-q23',
          questionNumber: 23,
          prompt: 'The trend towards creating quieter urban locations is likely to increase in the coming years.',
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation: 'Section C: Nick Antonio states: "People are seeing the benefits of these more quiet environments in their cities... I expect we will see much more of this in the future."',
          evidenceQuote: 'I expect we will see much more of this in the future',
          paragraphRef: 'C',
          whyCorrect: 'Nick Antonio predicts ("expect we will see much more... in the future") that quiet city initiatives will expand.',
          whyIncorrect: 'The other experts focus on psychological therapies and flotation, not municipal noise reduction.',
          commonTrap: 'Antonio is the urban acoustic consultant who comments on city-wide noise reduction.',
        },
        {
          id: 'c21-t1-q24',
          questionNumber: 24,
          prompt: "When our body's senses are completely deprived of input, our minds compensate for this by creating the illusion of images and sounds.",
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation: 'Section D: Justin Feinstein explains: "When you don\'t have external sensory stimuli coming in, the brain tries to fill the void to make sense of this dark and silent world... altered perception in the tanks, involving subtle humming sounds and visual effects."',
          evidenceQuote: 'When you don\'t have external sensory stimuli coming in, the brain tries to fill the void to make sense of this dark and silent world',
          paragraphRef: 'D',
          whyCorrect: 'Feinstein discusses sensory deprivation and how the brain "tries to fill the void" by creating visual and sound effects.',
          whyIncorrect: 'Ben-Soussan and Pfeifer do not study flotation tank hallucinations/sensory compensation.',
          commonTrap: '"fill the void" paraphrases "compensate", while subtle humming and visual effects paraphrase "images and sounds".',
        },
        {
          id: 'c21-t1-q25',
          questionNumber: 25,
          prompt: 'Even a short amount of silent time can have a positive impact.',
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation: 'Section G: Eric Pfeifer states: "You don\'t need to spend hours in silence... It is likely better to have more frequency of silence for a few minutes at a time... can make a big difference."',
          evidenceQuote: 'It is likely better to have more frequency of silence for a few minutes at a time than a longer period of silence only once a week. Just finding those places in your daily life where you can find some silence ... can make a big difference',
          paragraphRef: 'G',
          whyCorrect: 'Pfeifer specifically advocates for "a few minutes at a time" making a "big difference" (positive impact).',
          whyIncorrect: 'Feinstein used 1-hour and 90-minute sessions in his studies.',
          commonTrap: '"a few minutes at a time" corresponds to "a short amount of silent time".',
        },
        {
          id: 'c21-t1-q26',
          questionNumber: 26,
          prompt: 'External and internal quietness makes us more conscious of events occurring in our surroundings and helps us react appropriately to these events.',
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation: 'Section F: Tai Dotan Ben-Soussan states: "When we find ways to be quiet, we are not only quiet in our environment, but quiet in our inner selves... This allows us to be more aware of what is happening around us and what the situation may require from us so we can provide [a more] adequate response."',
          evidenceQuote: 'quiet in our environment, but quiet in our inner selves... allows us to be more aware of what is happening around us and what the situation may require from us so we can provide [a more] adequate response',
          paragraphRef: 'F',
          whyCorrect: 'Ben-Soussan explicitly connects environmental and inner quietness with awareness of surroundings and providing an adequate response.',
          whyIncorrect: 'Antonio and Pfeifer do not discuss inner vs outer awareness and behavioral adequacy.',
          commonTrap: '"quiet in our environment, but quiet in our inner selves" matches "External and internal quietness".',
        },
      ],
    },

    // Passage 3: Questions 27–30 (Multiple Choice Single)
    {
      id: 'c21-t1-g6',
      passageId: 'c21-t1-p3',
      questionType: 'multiple_choice_single',
      title: 'Questions 27–30',
      instructions: 'Choose the correct letter, A, B, C or D.\nWrite the correct letter in boxes 27–30 on your answer sheet.',
      startQuestionNumber: 27,
      endQuestionNumber: 30,
      questions: [
        {
          id: 'c21-t1-q27',
          questionNumber: 27,
          prompt: 'What does the reviewer suggest about the cultivation and trading of sugar in the first paragraph?',
          options: [
            { key: 'A', text: 'Sugar has played a major role in international relations.' },
            { key: 'B', text: 'Beet sugar has been made more internationally competitive.' },
            { key: 'C', text: 'Cane sugar is thought to be of superior quality to beet sugar.' },
            { key: 'D', text: 'New locations for cultivating sugar have increased production.' },
          ],
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation: 'Paragraph 1: "It has also been massively subsidised and sold at artificially low prices on world markets, threatening the livelihood of producers of cane sugar." Subsidies and artificially low prices made beet sugar artificially competitive against cane sugar.',
          evidenceQuote: 'It has also been massively subsidised and sold at artificially low prices on world markets, threatening the livelihood of producers of cane sugar',
          paragraphRef: '1',
          whyCorrect: 'Massive subsidies and artificially low prices on world markets directly enhanced beet sugar\'s international competitiveness.',
          whyIncorrect: 'A, C, and D are not asserted in the first paragraph (no mention of cane sugar quality superiority or international diplomacy).',
          commonTrap: 'Look for the explanation of how subsidies and low prices affected market dynamics.',
        },
        {
          id: 'c21-t1-q28',
          questionNumber: 28,
          prompt: 'In the second paragraph, when discussing the sugar market in Britain, the reviewer stresses',
          options: [
            { key: 'A', text: 'how the sources used changed over time.' },
            { key: 'B', text: 'how developments in agriculture affected trade.' },
            { key: 'C', text: 'the increased demand for sugar over the years.' },
            { key: 'D', text: 'the growing support for ethical methods of cultivation.' },
          ],
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation: 'Paragraph 2 traces chronological shifts: first from British slave plantations, then imported from Cuba and Brazil, towards the end of the 19th century from continental Europe (beet), and finally developing a national beet industry in the 20th century.',
          evidenceQuote: 'first bought cane sugar from their own slavery-dependent colonial plantations. Following the abolition... imported from places which retained the practice... Towards the end of the 19th century... Only in the 20th century...',
          paragraphRef: '2',
          whyCorrect: 'The paragraph is organized entirely chronologically around where Britain sourced its sugar as decades and centuries progressed.',
          whyIncorrect: 'B, C, and D are not the focus of paragraph 2; the focus is the geographic and institutional origin of British sugar over time.',
          commonTrap: 'Notice the chronological markers: "first", "Following abolition", "Towards the end of the 19th century", "Only in the 20th century".',
        },
        {
          id: 'c21-t1-q29',
          questionNumber: 29,
          prompt: 'What is the reviewer doing in the third paragraph?',
          options: [
            { key: 'A', text: 'describing an efficient approach to sugar cultivation' },
            { key: 'B', text: 'explaining why the use of sugar plantations declined' },
            { key: 'C', text: 'addressing a misconception about the growing of sugar cane' },
            { key: 'D', text: 'evaluating different approaches to the cultivation of sugar cane' },
          ],
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation: 'Paragraph 3 starts: "Contrary to popular belief, cane sugar production was never just restricted to large, dedicated plantations owned by rich men. For example, in Java... small farmers."',
          evidenceQuote: 'Contrary to popular belief, cane sugar production was never just restricted to large, dedicated plantations owned by rich men',
          paragraphRef: '3',
          whyCorrect: '"Contrary to popular belief" directly signifies that the author is correcting a widespread misconception.',
          whyIncorrect: 'A is incorrect because smallholder cultivation in Java was described as "extraordinarily labour-intensive", not praised for efficiency. B and D misstate the purpose.',
          commonTrap: '"Contrary to popular belief" is the classic IELTS marker for addressing a misconception.',
        },
        {
          id: 'c21-t1-q30',
          questionNumber: 30,
          prompt: "In the final paragraph, what does the reviewer suggest is the overall message of Bosma's book?",
          options: [
            { key: 'A', text: 'Sugar is a harmful and unnecessary product.' },
            { key: 'B', text: 'Economic pressure is needed to control sugar production.' },
            { key: 'C', text: 'Conditions for workers in sugar production should be improved.' },
            { key: 'D', text: 'Intensive marketing of sugar has had disastrous consequences.' },
          ],
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation: 'Paragraph 8 concludes: "He shows that we could always have done without sugar and that today we have many alternative sources of sweetness. Yet many of the poorest people in the world still depend on it to make a living."',
          evidenceQuote: 'He shows that we could always have done without sugar and that today we have many alternative sources of sweetness',
          paragraphRef: '8',
          whyCorrect: '"we could always have done without sugar" and the review\'s description of "multiple tragedies" and health damage point to sugar being harmful and unnecessary.',
          whyIncorrect: 'B, C, and D are specific details or topics mentioned in earlier sections, but not the reviewer\'s synthesis of the book\'s core thesis.',
          commonTrap: '"done without sugar" matches "unnecessary", and the previous references to illness and exploitation match "harmful".',
        },
      ],
    },

    // Passage 3: Questions 31–36 (Summary Completion with Word List)
    {
      id: 'c21-t1-g7',
      passageId: 'c21-t1-p3',
      questionType: 'summary_completion_options',
      title: 'Questions 31–36',
      instructions: 'Complete the summary using the list of words, A–I, below.\nWrite the correct letter, A–I, in boxes 31–36 on your answer sheet.',
      startQuestionNumber: 31,
      endQuestionNumber: 36,
      optionsList: [
        { key: 'A', text: 'national governments' },
        { key: 'B', text: 'agricultural developments' },
        { key: 'C', text: 'less wealthy nations' },
        { key: 'D', text: 'untrained workers' },
        { key: 'E', text: 'small-scale cultivation' },
        { key: 'F', text: 'outdated methods' },
        { key: 'G', text: 'financial controls' },
        { key: 'H', text: 'migrant workers' },
        { key: 'I', text: 'powerful individuals and businesses' },
      ],
      contentWithGaps: `Sugar cultivation and production
The book The World of Sugar points out the similarities in the way that sugar was cultivated around the world. In the big industries in both Germany and the US, sugar farming depended on [[31]]. However, in other parts of the world such as South Asia and Latin America, [[32]] continued.
Sugar production has also involved [[33]] who were eager to protect their markets. In countries such as Cuba the sugar industry therefore had a major influence on [[34]].
To support the interests of sugar producers, [[35]] were established. As a result of this, [[36]] were penalised.`,
      questions: [
        {
          id: 'c21-t1-q31',
          questionNumber: 31,
          prompt: 'In the big industries in both Germany and the US, sugar farming depended on ________',
          answerKey: 'H',
          acceptedAlternatives: ['H'],
          explanation: 'Paragraph 4: "imported labour has been used for much large-scale production. German beet fields employed Polish workers; Mexicans and many others, including Sicilians, were vital to US sugar production." "Imported labour" matches "migrant workers" (H).',
          evidenceQuote: 'German beet fields employed Polish workers; Mexicans and many others, including Sicilians, were vital to US sugar production',
          paragraphRef: '4',
          whyCorrect: 'Polish, Mexican, and Sicilian workers brought in to work fields are migrant workers (H).',
          whyIncorrect: 'D ("untrained workers") is unsupported; the text emphasizes that they were imported from outside the country.',
          commonTrap: '"imported labour" is a textbook paraphrase for "migrant workers" (H).',
        },
        {
          id: 'c21-t1-q32',
          questionNumber: 32,
          prompt: 'in other parts of the world such as South Asia and Latin America, ________ continued.',
          answerKey: 'E',
          acceptedAlternatives: ['E'],
          explanation: 'Paragraph 4: "the continuity of the use of traditional methods on small farms. In the mid 20th-century, this type of sugar production dominated in South Asia and Latin America." Matches "small-scale cultivation" (E).',
          evidenceQuote: 'continuity of the use of traditional methods on small farms. In the mid 20th-century, this type of sugar production dominated in South Asia and Latin America',
          paragraphRef: '4',
          whyCorrect: 'Production on "small farms" corresponds directly to "small-scale cultivation" (E).',
          whyIncorrect: 'F ("outdated methods") has a pejorative connotation not supported by "traditional methods on small farms".',
          commonTrap: '"small farms" equates to "small-scale cultivation" (E).',
        },
        {
          id: 'c21-t1-q33',
          questionNumber: 33,
          prompt: 'Sugar production has also involved ________ who were eager to protect their markets.',
          answerKey: 'I',
          acceptedAlternatives: ['I'],
          explanation: 'Paragraph 5: "This is also a history of capitalists and sugar dynasties, as well as corporations that in some cases have remained influential over very long periods. Great firms and great interests... a powerful sugar bourgeoisie played a major role in politics and their interests were consequently protected..." Matches "powerful individuals and businesses" (I).',
          evidenceQuote: 'capitalists and sugar dynasties, as well as corporations... Great firms and great interests... a powerful sugar bourgeoisie',
          paragraphRef: '5',
          whyCorrect: 'Capitalists, dynasties, corporations, and bourgeoisie are "powerful individuals and businesses" (I).',
          whyIncorrect: 'A refers to governments who were influenced by these actors, not the actors protecting their own commercial markets.',
          commonTrap: 'Look for who possessed the market interests being protected.',
        },
        {
          id: 'c21-t1-q34',
          questionNumber: 34,
          prompt: 'the sugar industry therefore had a major influence on ________',
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation: 'Paragraph 5: "Great firms and great interests have had profound influence on the policies of states. In many places - not just the British Caribbean but Cuba and the Philippines too - a powerful sugar bourgeoisie played a major role in politics..." Matches "national governments" (A).',
          evidenceQuote: 'profound influence on the policies of states... played a major role in politics',
          paragraphRef: '5',
          whyCorrect: '"policies of states" and "politics" refer to "national governments" (A).',
          whyIncorrect: 'B, G, and C do not represent the entity influenced by the industry in Cuba.',
          commonTrap: '"policies of states" is the paraphrase for "national governments" (A).',
        },
        {
          id: 'c21-t1-q35',
          questionNumber: 35,
          prompt: 'To support the interests of sugar producers, ________ were established.',
          answerKey: 'G',
          acceptedAlternatives: ['G'],
          explanation: 'Paragraph 5: "their interests were consequently protected by trade barriers and subsidies." "Trade barriers and subsidies" are "financial controls" (G).',
          evidenceQuote: 'their interests were consequently protected by trade barriers and subsidies',
          paragraphRef: '5',
          whyCorrect: 'Subsidies, tariffs, and trade barriers represent economic and financial controls (G).',
          whyIncorrect: 'B ("agricultural developments") is not what trade barriers and subsidies represent.',
          commonTrap: 'Categorizing tariffs and subsidies under "financial controls" (G).',
        },
        {
          id: 'c21-t1-q36',
          questionNumber: 36,
          prompt: 'As a result of this, ________ were penalised.',
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation: 'Paragraph 5: "In the battle for control of the industry, it was inevitably the poor countries which came off worse." "Poor countries which came off worse" matches "less wealthy nations were penalised" (C).',
          evidenceQuote: 'it was inevitably the poor countries which came off worse',
          paragraphRef: '5',
          whyCorrect: '"came off worse" paraphrases "were penalised", and "poor countries" paraphrases "less wealthy nations" (C).',
          whyIncorrect: 'D ("untrained workers") is not mentioned as the party coming off worse in the international trade battle.',
          commonTrap: '"poor countries" = "less wealthy nations" (C); "came off worse" = "penalised".',
        },
      ],
    },

    // Passage 3: Questions 37–40 (YES / NO / NOT GIVEN)
    {
      id: 'c21-t1-g8',
      passageId: 'c21-t1-p3',
      questionType: 'yes_no_not_given',
      title: 'Questions 37–40',
      instructions: "Do the following statements agree with the views of the writer in Reading Passage 3?\nIn boxes 37–40 on your answer sheet, write:\nYES if the statement agrees with the views of the writer\nNO if the statement contradicts the views of the writer\nNOT GIVEN if it is impossible to say what the writer thinks about this",
      startQuestionNumber: 37,
      endQuestionNumber: 40,
      questions: [
        {
          id: 'c21-t1-q37',
          questionNumber: 37,
          prompt: 'Sugar has now become available in large quantities due to a range of agricultural developments.',
          answerKey: 'YES',
          acceptedAlternatives: ['YES'],
          explanation: 'Paragraph 7 states: "Where once only tiny quantities of sugar could be produced, now new techniques, varieties, fertilisers, irrigation systems and much more have turned gleaming white sugar into a ubiquitous chemical."',
          evidenceQuote: 'Where once only tiny quantities of sugar could be produced, now new techniques, varieties, fertilisers, irrigation systems and much more have turned gleaming white sugar into a ubiquitous chemical',
          paragraphRef: '7',
          whyCorrect: 'The text directly credits "new techniques, varieties, fertilisers, irrigation systems" for turning tiny quantities into a "ubiquitous chemical" (available in large quantities).',
          whyIncorrect: 'NO contradicts the explicit causal link stated between agricultural technologies and vast production.',
          commonTrap: '"ubiquitous chemical" means available everywhere in abundance.',
        },
        {
          id: 'c21-t1-q38',
          questionNumber: 38,
          prompt: 'Advertisers initially marketed sugar as a luxury product.',
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation: 'Paragraph 7 says: "Once regarded as a luxury, sugar came to be promoted as a valuable source of energy." It states sugar was *regarded* as a luxury, but does not state that advertisers *initially marketed* it as such.',
          evidenceQuote: 'Once regarded as a luxury, sugar came to be promoted as a valuable source of energy',
          paragraphRef: '7',
          whyCorrect: 'The text acknowledges public perception ("regarded as a luxury"), but mentions promotion only for its role as an energy source, never confirming initial advertising campaigns.',
          whyIncorrect: 'We cannot verify whether advertisers marketed it as a luxury or whether it was simply scarce and expensive.',
          commonTrap: 'Distinguish between how a society "regards" an item and what "advertisers marketed".',
        },
        {
          id: 'c21-t1-q39',
          questionNumber: 39,
          prompt: 'The invention of high-fructose corn syrup was a positive development.',
          answerKey: 'NO',
          acceptedAlternatives: ['NO'],
          explanation: 'Paragraph 7 states: "And the recent past has seen worrying new developments in mass sweetening. High-fructose corn syrup... is regarded as a leading cause of obesity."',
          evidenceQuote: 'worrying new developments in mass sweetening. High-fructose corn syrup... is regarded as a leading cause of obesity',
          paragraphRef: '7',
          whyCorrect: 'The writer explicitly labels it a "worrying new development" and links it to obesity, contradicting "positive development".',
          whyIncorrect: '"worrying" directly contradicts "positive".',
          commonTrap: 'Look for the author\'s evaluative adjective: "worrying new developments".',
        },
        {
          id: 'c21-t1-q40',
          questionNumber: 40,
          prompt: 'High-fructose corn syrup is an ingredient in many processed foods.',
          answerKey: 'YES',
          acceptedAlternatives: ['YES'],
          explanation: 'Paragraph 7 states: "It is now widely consumed, having been adopted in the making of soft drinks and a large number of processed foods, and is regarded as a leading cause of obesity."',
          evidenceQuote: 'having been adopted in the making of soft drinks and a large number of processed foods',
          paragraphRef: '7',
          whyCorrect: '"adopted in the making of... a large number of processed foods" directly affirms that it is an ingredient in many processed foods.',
          whyIncorrect: 'NO contradicts the clear factual statement in the text.',
          commonTrap: '"a large number of processed foods" = "many processed foods".',
        },
      ],
    },
  ];

  return {
    title: 'Cambridge IELTS 21 Academic Reading Test 1',
    testType: 'academic',
    category: 'mock',
    timeLimitMinutes: 60,
    passages,
    questionGroups,
  };
}

export function ingestCambridge21Test1(authorId?: string): {
  testId: string;
  versionId: string;
  status: 'published';
  totalQuestions: number;
} {
  const data = getCambridge21Test1Data();
  const errors = validateTestVersion(data.passages, data.questionGroups);
  if (errors.length > 0) {
    throw new Error(`Cambridge 21 Reading Test 1 validation failed:\n- ${errors.join('\n- ')}`);
  }

  const resolvedAuthorId =
    authorId ||
    (db.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get() as any)?.id ||
    uuidv4();

  const now = new Date().toISOString();

  const existingTest = db
    .prepare('SELECT id, current_version_number FROM reading_tests WHERE title = ?')
    .get(data.title) as any;

  let testId: string;
  let versionId: string;

  if (existingTest) {
    testId = existingTest.id;
    const existingVersion = db
      .prepare('SELECT id FROM reading_test_versions WHERE test_id = ? AND version_number = 1')
      .get(testId) as any;

    if (existingVersion) {
      versionId = existingVersion.id;
      db.prepare(`
        UPDATE reading_test_versions
        SET passages_json = ?,
            question_groups_json = ?,
            total_questions = 40,
            status = 'published',
            published_at = ?
        WHERE id = ?
      `).run(
        JSON.stringify(data.passages),
        JSON.stringify(data.questionGroups),
        now,
        versionId
      );
    } else {
      versionId = uuidv4();
      db.prepare(`
        INSERT INTO reading_test_versions (
          id, test_id, version_number, status, passages_json,
          question_groups_json, total_questions, validation_errors_json, published_at, created_at
        ) VALUES (?, ?, 1, 'published', ?, ?, 40, '[]', ?, ?)
      `).run(
        versionId,
        testId,
        JSON.stringify(data.passages),
        JSON.stringify(data.questionGroups),
        now,
        now
      );
    }

    db.prepare(`
      UPDATE reading_tests
      SET status = 'published',
          is_free_tier = 1,
          updated_at = ?
      WHERE id = ?
    `).run(now, testId);
  } else {
    testId = uuidv4();
    versionId = uuidv4();

    db.prepare(`
      INSERT INTO reading_tests (
        id, title, test_type, category, time_limit_minutes,
        current_version_number, status, created_by_id, is_free_tier, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, 1, 'published', ?, 1, ?, ?)
    `).run(
      testId,
      data.title,
      data.testType,
      data.category,
      data.timeLimitMinutes,
      resolvedAuthorId,
      now,
      now
    );

    db.prepare(`
      INSERT INTO reading_test_versions (
        id, test_id, version_number, status, passages_json,
        question_groups_json, total_questions, validation_errors_json, published_at, created_at
      ) VALUES (?, ?, 1, 'published', ?, ?, 40, '[]', ?, ?)
    `).run(
      versionId,
      testId,
      JSON.stringify(data.passages),
      JSON.stringify(data.questionGroups),
      now,
      now
    );
  }

  return {
    testId,
    versionId,
    status: 'published',
    totalQuestions: 40,
  };
}
