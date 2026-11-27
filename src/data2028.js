// ===================== 2028 (FICTIONAL CANDIDATES) =====================
// id|name|EV|2024 margin (D minus R)|2024 votes (millions)|region|parent
const RAW_2028 = `
AL|Alabama|9|-30.5|2.27|SO|
AK|Alaska|3|-13.1|0.34|WE|
AZ|Arizona|11|-5.5|3.39|SB|
AR|Arkansas|6|-30.6|1.18|SO|
CA|California|54|20.2|15.86|WE|
CO|Colorado|10|11.0|3.19|SB|
CT|Connecticut|7|14.5|1.76|NE|
DE|Delaware|3|14.7|0.51|NE|
DC|District of Columbia|3|83.7|0.32|NE|
FL|Florida|30|-13.1|10.89|SB|
GA|Georgia|16|-2.2|5.25|SB|
HI|Hawaii|4|23.1|0.52|WE|
ID|Idaho|4|-36.5|0.90|WE|
IL|Illinois|19|10.9|5.63|RB|
IN|Indiana|11|-19.0|2.94|RB|
IA|Iowa|6|-13.2|1.67|RB|
KS|Kansas|6|-16.2|1.33|WE|
KY|Kentucky|8|-30.6|2.07|SO|
LA|Louisiana|8|-22.0|2.03|SO|
ME|Maine|2|6.9|0.83|NE|
ME1|Maine 1st District|1|20.0|0.42|NE|ME
ME2|Maine 2nd District|1|-9.2|0.41|NE|ME
MD|Maryland|10|28.5|3.04|NE|
MA|Massachusetts|11|25.2|3.47|NE|
MI|Michigan|15|-1.4|5.66|RB|
MN|Minnesota|10|4.2|3.25|RB|
MS|Mississippi|6|-22.9|1.23|SO|
MO|Missouri|10|-18.4|3.03|RB|
MT|Montana|4|-19.9|0.60|WE|
NE|Nebraska|2|-20.4|0.95|WE|
NE1|Nebraska 1st District|1|-13.5|0.32|WE|NE
NE2|Nebraska 2nd District|1|4.6|0.33|WE|NE
NE3|Nebraska 3rd District|1|-51.0|0.30|WE|NE
NV|Nevada|6|-3.1|1.48|SB|
NH|New Hampshire|4|2.8|0.83|NE|
NJ|New Jersey|14|5.9|4.27|NE|
NM|New Mexico|5|6.0|0.92|SB|
NY|New York|28|12.6|8.26|NE|
NC|North Carolina|16|-3.2|5.70|SB|
ND|North Dakota|3|-36.5|0.37|WE|
OH|Ohio|17|-11.2|5.77|RB|
OK|Oklahoma|7|-34.3|1.57|SO|
OR|Oregon|8|14.3|2.24|WE|
PA|Pennsylvania|19|-1.7|7.06|RB|
RI|Rhode Island|4|13.7|0.51|NE|
SC|South Carolina|9|-17.8|2.55|SO|
SD|South Dakota|3|-29.2|0.43|WE|
TN|Tennessee|11|-29.7|3.06|SO|
TX|Texas|40|-13.6|11.39|SB|
UT|Utah|6|-21.6|1.49|WE|
VT|Vermont|3|31.5|0.37|NE|
VA|Virginia|13|5.8|4.49|NE|
WA|Washington|12|18.2|3.92|WE|
WV|West Virginia|4|-41.9|0.76|SO|
WI|Wisconsin|10|-0.9|3.42|RB|
WY|Wyoming|3|-45.8|0.27|WE|
`;
const CLOSE = { GA: 19, IN: 19, KY: 19, SC: 19, VT: 19, VA: 19, NC: 19.5, OH: 19.5, WV: 19.5,
  AL: 20, CT: 20, DE: 20, DC: 20, FL: 20, IL: 20, ME: 20, MD: 20, MA: 20, MS: 20, MO: 20, NH: 20, NJ: 20, OK: 20, PA: 20, RI: 20, TN: 20, AR: 20.5,
  AZ: 21, CO: 21, IA: 21, KS: 21, LA: 21, MI: 21, MN: 21, NE: 21, NM: 21, NY: 21, ND: 21, SD: 21, TX: 21, WI: 21, WY: 21,
  ID: 22, MT: 22, NV: 22, UT: 22, CA: 23, OR: 23, WA: 23, HI: 23, AK: 25 };
// how fast each state counts (hours) and which way its early count leans (D minus R) before late ballots arrive
const COUNT = { PA: [2.2, -4], MI: [1.8, -3], WI: [1.6, -4], GA: [1.0, 3], NC: [1.0, 4], AZ: [3.5, 2], NV: [3.5, 1], OH: [1.0, 4], FL: [.6, 3], VA: [1.0, -4], CA: [4.5, 2], OR: [2.4, 1], WA: [2.4, 1], AK: [3, 0], UT: [2, 0], NY: [1.3, -1], MN: [1.2, -1], NH: [1.2, -1], TX: [1.2, 2], IL: [1.4, -2], NJ: [1.6, 2], MD: [1.6, 5] };
const REGION_2028 = { RB: 'the Rust Belt', SB: 'the Sun Belt', NE: 'the Northeast', SO: 'the South', WE: 'the West and Plains' };
const REGION_2028_SHORT = { RB: 'Rust Belt', SB: 'Sun Belt', NE: 'Northeast', SO: 'South', WE: 'West' };
const PARTY = { D: 'Democratic', R: 'Republican' };

const CANDS = [
  { id: 'hoffman', party: 'D', first: 'Claire', last: 'Hoffman', title: 'Governor of Michigan', home: 'MI', perk: 'region', reg: 'RB', perkText: 'Rust Belt roots: +1 point across the Rust Belt', bio: 'Two-term governor who rebuilt Flint\'s water system and won Michigan by 11.' },
  { id: 'reyes', party: 'D', first: 'Daniel', last: 'Reyes', title: 'U.S. Senator from Nevada', home: 'NV', perk: 'region', reg: 'SB', perkText: 'Sun Belt appeal: +1 point across the Sun Belt', bio: 'Former Las Vegas union organizer and the son of a casino cook.' },
  { id: 'avery', party: 'D', first: 'Jordan', last: 'Avery', title: 'U.S. Senator from Georgia', home: 'GA', perk: 'debate', perkText: 'Debate star: bigger wins in debates', bio: 'Former federal prosecutor famous for live-TV cross-examinations.' },
  { id: 'callahan', party: 'R', first: 'Brett', last: 'Callahan', title: 'Governor of Ohio', home: 'OH', perk: 'region', reg: 'RB', perkText: 'Rust Belt roots: +1 point across the Rust Belt', bio: 'Former steel-plant manager who cut Ohio\'s income tax twice.' },
  { id: 'ortega', party: 'R', first: 'Isabel', last: 'Ortega', title: 'U.S. Senator from Arizona', home: 'AZ', perk: 'region', reg: 'SB', perkText: 'Sun Belt appeal: +1 point across the Sun Belt', bio: 'Daughter of Mexican immigrants and a former Border Patrol attorney.' },
  { id: 'whitmore', party: 'R', first: 'Grant', last: 'Whitmore', title: 'Governor of North Carolina', home: 'NC', perk: 'visits', perkText: 'Retail politician: every stop counts 25% more', bio: 'Former college football coach who visits all 100 counties every year.' }
];
const VPS = [
  { id: 'okafor', party: 'D', first: 'Ruth', last: 'Okafor', title: 'U.S. Senator from Pennsylvania', home: 'PA', bio: 'Philadelphia pediatrician turned senator.' },
  { id: 'lindqvist', party: 'D', first: 'Tom', last: 'Lindqvist', title: 'Governor of Wisconsin', home: 'WI', bio: 'Dairy farmer with rare bipartisan approval.' },
  { id: 'vargas', party: 'D', first: 'Elena', last: 'Vargas', title: 'U.S. Representative from Arizona', home: 'AZ', bio: 'Marine veteran from a Phoenix swing district.' },
  { id: 'brandt', party: 'R', first: 'Wes', last: 'Brandt', title: 'U.S. Senator from Pennsylvania', home: 'PA', bio: 'Army veteran and Pittsburgh businessman.' },
  { id: 'holloway', party: 'R', first: 'Dana', last: 'Holloway', title: 'Governor of Wisconsin', home: 'WI', bio: 'Former sheriff from the Fox River Valley.' },
  { id: 'serrano', party: 'R', first: 'Luis', last: 'Serrano', title: 'Lieutenant Governor of Nevada', home: 'NV', bio: 'Reno restaurant owner and first-term officeholder.' }
];
const TURNS_2028 = [
  { date: '2028-09-04', kind: 'kickoff' }, { date: '2028-09-12', kind: 'issue' }, { date: '2028-09-19', kind: 'issue' },
  { date: '2028-09-28', kind: 'debate', name: 'First debate', debName: 'first' }, { date: '2028-10-04', kind: 'issue' },
  { date: '2028-10-11', kind: 'debate', name: 'Second debate', debName: 'second' }, { date: '2028-10-17', kind: 'issue' },
  { date: '2028-10-24', kind: 'issue' }, { date: '2028-10-30', kind: 'surprise' }, { date: '2028-11-04', kind: 'closing' }
];

// Effects are from the player's point of view, in polling points.
const KICKOFF = {
  cat: 'Labor Day', title: 'Where do you launch the general election?',
  body: 'Labor Day is the traditional start of the fall campaign. The networks will carry your kickoff live, and everyone will read the location as a signal of your strategy.',
  options: [
    { t: 'A union hall in Detroit with striking autoworkers', s: 'Detroit', fx: { RB: .8, SB: -.1 } },
    { t: 'A rally in Phoenix, then a late-night stop in Las Vegas', s: 'Phoenix and Vegas', fx: { SB: .8, RB: -.1 } },
    { t: 'A homecoming rally in {HOME}', s: 'the homecoming', fx: { home: 1.2, nat: .15 } },
    { t: 'A primetime speech to the nation from Philadelphia', s: 'Philadelphia', fx: { nat: .3, RB: .15 } }
  ]
};
const CLOSING = {
  cat: 'Closing argument', title: 'How do you close the campaign?',
  body: 'Four days to go. Your team is cutting the final ad that will run in every battleground state through Tuesday. What is the message?',
  options: [
    { t: 'Turn the page: a unifying message about bringing the country together', s: 'unity', fx: { nat: .35, NE: .1 } },
    { t: 'Raise the stakes: warn voters what the other side would do with power', s: 'raising the stakes', fx: { nat: .05, RB: .25, SO: .3, NE: -.1 } },
    { t: 'Kitchen table: prices, paychecks and the cost of a home', s: 'the kitchen table', fx: { nat: .2, RB: .2, SB: .2 } }
  ]
};
const ISSUES = [
  { id: 'economy', cat: 'Economy', title: 'Prices are still climbing',
    body: 'A new report shows consumer prices up 4.1% from a year ago, the fastest rise in three years. Reporters at your next stop want to hear your plan.',
    options: {
      D: [
        { t: 'A middle-class tax cut paired with a crackdown on price gouging', s: 'the tax cut', fx: { nat: .4, RB: .15 } },
        { t: 'Raise corporate taxes to pay for child care and housing', s: 'the corporate tax', fx: { nat: .1, NE: .3, SB: .15, RB: -.2 } },
        { t: 'Blame tariffs and the other party for higher prices', s: 'blaming tariffs', fx: { nat: -.05, NE: .2, RB: -.25 } }],
      R: [
        { t: 'Cut taxes and red tape and unleash American energy', s: 'the tax-and-energy plan', fx: { nat: .4, RB: .1, SB: .1 } },
        { t: 'Promise new tariffs to bring factories home', s: 'tariffs', fx: { RB: .55, SB: -.15, NE: -.3 } },
        { t: 'Blame runaway federal spending by the other party', s: 'blaming spending', fx: { nat: -.05, SO: .3, NE: -.2 } }]
    } },
  { id: 'border', cat: 'Immigration', title: 'Border crossings surge',
    body: 'Monthly border crossings just hit a two-year high, and video of an overcrowded processing center is leading every newscast.',
    options: {
      D: [
        { t: 'Back a bipartisan bill with more agents and faster asylum rulings', s: 'the bipartisan bill', fx: { nat: .4, SB: .15 } },
        { t: 'Defend Dreamers and legal immigration', s: 'defending Dreamers', fx: { SB: .4, NE: .2, RB: -.35 } },
        { t: 'Change the subject to the economy', s: 'changing the subject', fx: { nat: -.2 } }],
      R: [
        { t: 'Pledge mass deportations and to finish the wall', s: 'the wall', fx: { SO: .4, RB: .25, SB: -.25, NE: -.3 } },
        { t: 'Pair tough enforcement with more legal work visas', s: 'enforcement plus visas', fx: { nat: .3, SB: .35, SO: -.1 } },
        { t: 'Accuse the other side of running an open border', s: 'the open-border attack', fx: { nat: .1, RB: .15, NE: -.2 } }]
    } },
  { id: 'health', cat: 'Health care', title: 'Premiums jump 11%',
    body: 'Insurers just announced an average 11% premium increase for next year. Seniors are anxious about drug prices.',
    options: {
      D: [
        { t: 'Cap drug prices and protect the Affordable Care Act', s: 'capping drug prices', fx: { nat: .4, SB: .1 } },
        { t: 'Offer a public health-insurance option to everyone', s: 'the public option', fx: { NE: .35, WE: .3, RB: -.15, SB: -.1 } },
        { t: 'Promise Medicare for All', s: 'Medicare for All', fx: { NE: .25, nat: -.3 } }],
      R: [
        { t: 'Push price transparency and more competition among insurers', s: 'competition', fx: { nat: .3 } },
        { t: 'Protect Medicare and cap seniors\' drug costs', s: 'protecting Medicare', fx: { nat: .35, SB: .2 } },
        { t: 'Repeal and replace the Affordable Care Act', s: 'repeal and replace', fx: { SO: .35, nat: -.3 } }]
    } },
  { id: 'pacific', cat: 'Foreign policy', title: 'Crisis in the Pacific',
    body: 'A hostile power has blockaded an American ally in the Pacific. Markets are falling and cable news is running war-game maps.',
    options: [
      { t: 'Announce sanctions and send a carrier group', s: 'the carrier group', fx: { nat: .3, RB: .1 } },
      { t: 'Urge calm and convene allies for emergency talks', s: 'the allied talks', fx: { nat: .2, NE: .2 } },
      { t: 'Say your opponent would look weak to adversaries', s: 'the weakness attack', fx: { nat: -.1, SO: .25 } }
    ] },
  { id: 'ai', cat: 'Jobs', title: 'AI layoffs spread',
    body: 'Banks, call centers and trucking firms are laying off thousands of workers and blaming automation. Voters now rank it a top-five worry.',
    options: [
      { t: 'Fund worker retraining and an AI transition plan', s: 'retraining', fx: { nat: .3, RB: .2 } },
      { t: 'Champion American innovation and oppose heavy regulation', s: 'innovation', fx: { WE: .35, SB: .1, RB: -.3 } },
      { t: 'Tax companies that replace workers with AI', s: 'the automation tax', fx: { RB: .5, NE: -.1, WE: -.25 } }
    ] },
  { id: 'rights', cat: 'Abortion', title: 'A court ruling reignites the abortion fight',
    body: 'A state supreme court ruling has pushed abortion back to the top of the news, and activists on both sides are flooding phone banks.',
    options: {
      D: [
        { t: 'Make reproductive rights the centerpiece of your campaign', s: 'making it the centerpiece', fx: { nat: .2, NE: .25, SB: .2, SO: -.25 } },
        { t: 'Promise to restore Roe, then pivot back to the economy', s: 'restore and pivot', fx: { nat: .35 } },
        { t: 'Avoid the subject', s: 'avoiding it', fx: { nat: -.2 } }],
      R: [
        { t: 'Say the issue belongs to the states', s: 'leaving it to the states', fx: { nat: .35 } },
        { t: 'Back a national 15-week limit', s: 'the 15-week limit', fx: { SO: .4, nat: -.25, NE: -.3 } },
        { t: 'Avoid the subject', s: 'avoiding it', fx: { nat: -.1 } }]
    } },
  { id: 'strike', cat: 'Labor', title: 'Autoworkers walk out',
    body: 'Forty thousand autoworkers in Michigan and Ohio have gone on strike after contract talks collapsed. Both campaigns are being asked to pick a side.',
    options: [
      { t: 'Join the picket line in Detroit', s: 'the picket line', fx: { RB: .7, SB: -.1 } },
      { t: 'Urge both sides back to the bargaining table', s: 'the bargaining table', fx: { nat: .2 } },
      { t: 'Warn that the strike is hurting the economy', s: 'the economic warning', fx: { RB: -.5, SB: .2, nat: .05 } }
    ] },
  { id: 'crime', cat: 'Public safety', title: 'A crime wave makes headlines',
    body: 'A string of violent carjackings in a major city has set off a national debate about crime and policing.',
    options: {
      D: [
        { t: 'Fund the police and violence-prevention programs', s: 'funding the police', fx: { nat: .35 } },
        { t: 'Focus on root causes like housing, jobs and mental health', s: 'root causes', fx: { NE: .2, nat: -.05 } },
        { t: 'Push for stricter gun laws', s: 'gun laws', fx: { NE: .3, SB: .1, RB: -.3 } }],
      R: [
        { t: 'Back the police and call for tougher sentences', s: 'backing the police', fx: { nat: .25, RB: .15 } },
        { t: 'Send federal task forces into high-crime cities', s: 'federal task forces', fx: { nat: .15, SO: .2, NE: -.1 } },
        { t: 'Blame the city\'s leaders and prosecutors', s: 'blaming city leaders', fx: { SO: .3, nat: -.15 } }]
    } },
  { id: 'housing', cat: 'Housing', title: 'Home prices hit a record',
    body: 'The median home price just hit $440,000, and first-time buyers say they have been shut out of the market.',
    options: [
      { t: 'Build 3 million homes by cutting red tape', s: 'building homes', fx: { nat: .35, SB: .15 } },
      { t: 'Offer $25,000 in down-payment help', s: 'down-payment help', fx: { nat: .25, SB: .2 } },
      { t: 'Ban Wall Street firms from buying up single-family homes', s: 'the Wall Street ban', fx: { RB: .3, nat: .1 } }
    ] },
  { id: 'gas', cat: 'Energy', title: 'Gas tops $4.30 a gallon',
    body: 'Refinery outages and an OPEC production cut have pushed gas above $4.30 a gallon nationwide.',
    options: [
      { t: 'Expand drilling and fracking', s: 'drilling', fx: { RB: .3, SO: .2, SB: .1, NE: -.3, WE: -.15 } },
      { t: 'Invest in clean-energy manufacturing jobs', s: 'clean-energy jobs', fx: { NE: .3, WE: .3, RB: -.2 } },
      { t: 'Call for a federal gas-tax holiday', s: 'the gas-tax holiday', fx: { nat: .2 } }
    ] },
  { id: 'podcast', cat: 'Media', title: 'The three-hour podcast',
    body: 'The country\'s most popular podcaster, whose 30 million listeners skew young and male, invites you for an unscripted three-hour conversation.',
    options: [
      { t: 'Do the full three hours, no notes', s: 'the full three hours', note: 'High risk, high reward', risk: { p: .55, win: { nat: .5, RB: .2 }, lose: { nat: -.4 },
        winNote: 'Clips of you laughing and talking shop went viral for the right reasons.', loseNote: 'A rambling answer in hour three became a meme.' } },
      { t: 'Offer a tight 45-minute segment', s: 'the short segment', fx: { nat: .15 } },
      { t: 'Decline and do a network town hall instead', s: 'the town hall', fx: { nat: .05, NE: .1 } }
    ] }
];
const DEBATE_Q = [
  { topic: 'The economy', q: 'Families say they cannot keep up with the cost of living. What will you do in your first year?', fit: 'plan' },
  { topic: 'Character', q: 'Your opponent says you lack the judgment to be president. Why should voters trust you?', fit: 'story' },
  { topic: 'The record', q: 'Your opponent has attacked your record all fall. What is wrong with theirs?', fit: 'attack' },
  { topic: 'Health care', q: 'A voter in this hall lost her coverage after a layoff. What would you do for her?', fit: 'story' },
  { topic: 'Immigration', q: 'How would you secure the border while dealing with the millions of people already here?', fit: 'plan' },
  { topic: 'Leadership', q: 'Name one thing your opponent has gotten wrong that should disqualify them.', fit: 'attack' }
];
const DEBATE_A = {
  plan: { t: 'Lay out a detailed plan', s: 'a detailed plan', note: 'Steady and safe', base: .40, sd: .25 },
  attack: { t: 'Go on the attack', s: 'going on the attack', note: 'Biggest swings, either way', base: .36, sd: .7 },
  story: { t: 'Tell a personal story', s: 'a personal story', note: 'Warm, a little risky', base: .40, sd: .42 }
};
const SURPRISE = {
  self: [
    { title: 'Leaked tax records', body: 'A newspaper has published leaked records showing your family business used offshore shelters to cut its taxes by millions.', hit: -.8,
      options: [
        { t: 'Release ten years of tax returns tonight', s: 'releasing the returns', risk: { p: .65, win: { nat: .6 }, lose: { nat: .1 }, winNote: 'The returns showed nothing illegal, and the story fizzled.', loseNote: 'Reporters found new questions in the returns.' } },
        { t: 'Call it a smear timed for the election', s: 'calling it a smear', fx: { nat: .15, SO: .3, NE: -.2 } },
        { t: 'Say nothing and keep campaigning', s: 'saying nothing', fx: { nat: 0 } }] },
    { title: 'An aide caught on tape', body: 'Hidden-camera video shows your deputy campaign manager mocking swing-state voters and calling your platform "whatever polls best."', hit: -.7,
      options: [
        { t: 'Fire the aide and apologize the same day', s: 'firing the aide', fx: { nat: .5 } },
        { t: 'Defend the aide and question the video\'s source', s: 'defending the aide', fx: { nat: .1, SO: .25 } },
        { t: 'Distance yourself but keep the aide on staff', s: 'keeping the aide', fx: { nat: .2 } }] }
  ],
  opp: [
    { title: 'Scandal hits your opponent', body: 'Reports allege that a top donor to {OPP} steered no-bid state contracts to a family company. {OPPL} denies any wrongdoing.', hit: .8,
      options: [
        { t: 'Hammer it with a wave of new ads', s: 'the ad wave', risk: { p: .6, win: { nat: .4 }, lose: { nat: -.2 }, winNote: 'The ads kept the story alive for a week.', loseNote: 'Voters saw the ads as piling on, and it backfired.' } },
        { t: 'Stay above the fray and keep your message positive', s: 'staying positive', fx: { nat: .2 } },
        { t: 'Call for an independent investigation', s: 'an investigation', fx: { nat: .15, NE: .1 } }] },
    { title: 'Your opponent\'s old remarks resurface', body: 'Audio from a decade-old speech shows {OPP} calling Social Security "a program we can\'t afford to keep." Seniors\' groups are furious.', hit: .6,
      options: [
        { t: 'Air ads aimed at seniors in Florida, Arizona and Pennsylvania', s: 'the seniors ads', fx: { SB: .35, RB: .2 } },
        { t: 'Hold a town hall with retirees', s: 'the retiree town hall', fx: { nat: .25 } },
        { t: 'Let it play out without comment', s: 'staying quiet', fx: { nat: .05 } }] }
  ]
};

// ===================== PEOPLE AND PRESS =====================
const STAFF = {
  D: [{ name: 'Marisol Vega', role: 'Campaign manager' }, { name: 'Ben Adler', role: 'Pollster' }],
  R: [{ name: 'Clay Hollister', role: 'Campaign manager' }, { name: 'Erin Pace', role: 'Pollster' }]
};
// Fictional voters. st = state used to place them.
// Fictional voters. st places them on the map. PEOPLE is used for 1992 onward, PEOPLE_OLD for 1948 to 1980.
const PEOPLE = [
  { n: 'Denise Kowalski', a: 54, j: 'hospital nurse', t: 'Erie, Pa.', st: 'PA' }, { n: 'Frank DiMarco', a: 67, j: 'retired steelworker', t: 'Johnstown, Pa.', st: 'PA' },
  { n: 'Luis Ortiz', a: 41, j: 'auto plant electrician', t: 'Warren, Mich.', st: 'MI' }, { n: 'Carol Haynes', a: 59, j: 'school bus driver', t: 'Saginaw, Mich.', st: 'MI' },
  { n: 'Tom Brekke', a: 48, j: 'dairy farmer', t: 'Eau Claire, Wis.', st: 'WI' }, { n: 'Angela Price', a: 36, j: 'bank teller', t: 'Kenosha, Wis.', st: 'WI' },
  { n: 'Ray Sutton', a: 62, j: 'machinist', t: 'Canton, Ohio', st: 'OH' }, { n: 'Michelle Dunn', a: 44, j: 'pharmacist', t: 'Dayton, Ohio', st: 'OH' },
  { n: 'Karen Lindgren', a: 52, j: 'librarian', t: 'Duluth, Minn.', st: 'MN' }, { n: 'Gene Hartley', a: 71, j: 'retired grain elevator manager', t: 'Ames, Iowa', st: 'IA' },
  { n: 'Calvin Brooks', a: 33, j: 'mail carrier', t: 'St. Louis', st: 'MO' }, { n: 'Pat Walsh', a: 57, j: 'union electrician', t: 'Joliet, Ill.', st: 'IL' },
  { n: 'Dorothy Owens', a: 38, j: 'middle-school teacher', t: 'Macon, Ga.', st: 'GA' }, { n: 'Bill Hammond', a: 66, j: 'hardware store owner', t: 'Valdosta, Ga.', st: 'GA' },
  { n: 'Ruth Greene', a: 45, j: 'textile worker', t: 'Gastonia, N.C.', st: 'NC' }, { n: 'Jim Ashby', a: 57, j: 'tobacco farmer', t: 'Wilson, N.C.', st: 'NC' },
  { n: 'Maria Espinoza', a: 50, j: 'restaurant owner', t: 'Tucson, Ariz.', st: 'AZ' }, { n: 'Doug Keller', a: 69, j: 'retired Air Force mechanic', t: 'Mesa, Ariz.', st: 'AZ' },
  { n: 'Joan Marsh', a: 34, j: 'blackjack dealer', t: 'Henderson, Nev.', st: 'NV' }, { n: 'Ed Kaplan', a: 74, j: 'retired accountant', t: 'Boca Raton, Fla.', st: 'FL' },
  { n: 'Yolanda Perez', a: 29, j: 'hotel housekeeper', t: 'Kissimmee, Fla.', st: 'FL' }, { n: 'Joe Salinas', a: 55, j: 'oil field welder', t: 'Odessa, Texas', st: 'TX' },
  { n: 'Ana Lucero', a: 37, j: 'steel mill clerk', t: 'Pueblo, Colo.', st: 'CO' }, { n: 'Linda Carver', a: 47, j: 'insurance agent', t: 'Nashua, N.H.', st: 'NH' },
  { n: 'Paul Ouellette', a: 63, j: 'paper mill worker', t: 'Lewiston, Maine', st: 'ME' }, { n: 'Angela Russo', a: 51, j: 'diner owner', t: 'Paterson, N.J.', st: 'NJ' },
  { n: 'Marcus Webb', a: 39, j: 'police officer', t: 'Norfolk, Va.', st: 'VA' }, { n: 'Hank Mills', a: 58, j: 'coal miner', t: 'Beckley, W.Va.', st: 'WV' },
  { n: 'Della Jackson', a: 46, j: 'nurse\'s aide', t: 'Jackson, Miss.', st: 'MS' }, { n: 'Sam Erickson', a: 44, j: 'cattle rancher', t: 'Billings, Mont.', st: 'MT' },
  { n: 'Mark Olsen', a: 53, j: 'wheat farmer', t: 'Hays, Kan.', st: 'KS' }, { n: 'Jenny Moore', a: 31, j: 'dental hygienist', t: 'Sacramento, Calif.', st: 'CA' },
  { n: 'Gary Novak', a: 60, j: 'shipyard foreman', t: 'Tacoma, Wash.', st: 'WA' }, { n: 'Rita Sandoval', a: 42, j: 'school cafeteria manager', t: 'Las Cruces, N.M.', st: 'NM' },
  { n: 'Earl Whitley', a: 68, j: 'retired trucker', t: 'Knoxville, Tenn.', st: 'TN' }, { n: 'Nora Boyle', a: 49, j: 'court stenographer', t: 'Albany, N.Y.', st: 'NY' },
  { n: 'Dwayne Fowler', a: 40, j: 'poultry plant supervisor', t: 'Springdale, Ark.', st: 'AR' }, { n: 'Becky Thibodeaux', a: 35, j: 'nursing student', t: 'Lafayette, La.', st: 'LA' },
  { n: 'Glen Rasmussen', a: 61, j: 'grain trucker', t: 'Grand Island, Neb.', st: 'NE' }, { n: 'Teresa Kim', a: 43, j: 'software tester', t: 'Beaverton, Ore.', st: 'OR' }
];
const PEOPLE_OLD = [
  { n: 'Walter Kowalczyk', a: 46, j: 'steelworker', t: 'Homestead, Pa.', st: 'PA' }, { n: 'Edna Burke', a: 38, j: 'telephone operator', t: 'Scranton, Pa.', st: 'PA' },
  { n: 'Joe Szymanski', a: 41, j: 'assembly-line worker', t: 'Hamtramck, Mich.', st: 'MI' }, { n: 'Hazel Pruitt', a: 55, j: 'boardinghouse keeper', t: 'Flint, Mich.', st: 'MI' },
  { n: 'Arnold Lindquist', a: 52, j: 'dairy farmer', t: 'Fond du Lac, Wis.', st: 'WI' }, { n: 'Rose Kaminski', a: 33, j: 'brewery bottler', t: 'Milwaukee', st: 'WI' },
  { n: 'Harold Bates', a: 58, j: 'tool-and-die maker', t: 'Akron, Ohio', st: 'OH' }, { n: 'Marjorie Lyle', a: 44, j: 'schoolteacher', t: 'Zanesville, Ohio', st: 'OH' },
  { n: 'Elmer Haugen', a: 63, j: 'wheat farmer', t: 'Fergus Falls, Minn.', st: 'MN' }, { n: 'Clarence Vos', a: 49, j: 'hog farmer', t: 'Pella, Iowa', st: 'IA' },
  { n: 'Lucille Turner', a: 36, j: 'seamstress', t: 'Kansas City, Mo.', st: 'MO' }, { n: 'Tom Mahoney', a: 50, j: 'railroad brakeman', t: 'Decatur, Ill.', st: 'IL' },
  { n: 'Cora Whitfield', a: 41, j: 'textile mill worker', t: 'LaGrange, Ga.', st: 'GA' }, { n: 'Roy Pickett', a: 57, j: 'peanut farmer', t: 'Americus, Ga.', st: 'GA' },
  { n: 'Lester Hines', a: 47, j: 'tobacco farmer', t: 'Rocky Mount, N.C.', st: 'NC' }, { n: 'Opal Ferguson', a: 39, j: 'hosiery mill worker', t: 'Burlington, N.C.', st: 'NC' },
  { n: 'Virgil Combs', a: 52, j: 'coal miner', t: 'Logan, W.Va.', st: 'WV' }, { n: 'Ida Mae Porter', a: 44, j: 'church secretary', t: 'Memphis, Tenn.', st: 'TN' },
  { n: 'Beau Landry', a: 35, j: 'shrimp boat captain', t: 'Houma, La.', st: 'LA' }, { n: 'Ernest Cole', a: 60, j: 'cotton gin operator', t: 'Pine Bluff, Ark.', st: 'AR' },
  { n: 'Bud Henley', a: 48, j: 'oil field roughneck', t: 'Midland, Texas', st: 'TX' }, { n: 'Pearl Gutierrez', a: 34, j: 'cannery worker', t: 'San Antonio', st: 'TX' },
  { n: 'Frank Delvecchio', a: 45, j: 'longshoreman', t: 'Hoboken, N.J.', st: 'NJ' }, { n: 'Agnes Mulcahy', a: 53, j: 'bookkeeper', t: 'Worcester, Mass.', st: 'MA' },
  { n: 'Sol Weinstein', a: 61, j: 'garment cutter', t: 'Brooklyn, N.Y.', st: 'NY' }, { n: 'Dorothy Pratt', a: 42, j: 'grocer', t: 'Utica, N.Y.', st: 'NY' },
  { n: 'Leon Dubois', a: 57, j: 'shoe factory foreman', t: 'Lewiston, Maine', st: 'ME' }, { n: 'Charles Byrd', a: 39, j: 'Navy veteran and mail carrier', t: 'Baltimore', st: 'MD' },
  { n: 'Floyd Jessup', a: 55, j: 'cattle rancher', t: 'Miles City, Mont.', st: 'MT' }, { n: 'Mabel Unruh', a: 50, j: 'farm wife and 4-H leader', t: 'Newton, Kan.', st: 'KS' },
  { n: 'Gus Petrakis', a: 47, j: 'diner owner', t: 'Salt Lake City', st: 'UT' }, { n: 'Helen Yoshida', a: 37, j: 'truck farmer', t: 'Fresno, Calif.', st: 'CA' },
  { n: 'Ole Bjornstad', a: 59, j: 'lumber mill sawyer', t: 'Aberdeen, Wash.', st: 'WA' }, { n: 'Juanita Baca', a: 45, j: 'schoolteacher', t: 'Albuquerque', st: 'NM' },
  { n: 'Earl Pettibone', a: 66, j: 'retired railroad conductor', t: 'Cheyenne, Wyo.', st: 'WY' }, { n: 'Nell Atwood', a: 40, j: 'switchboard operator', t: 'Pocatello, Idaho', st: 'ID' },
  { n: 'Wade Simmons', a: 52, j: 'citrus grower', t: 'Lakeland, Fla.', st: 'FL' }, { n: 'Grady Hollis', a: 43, j: 'sawmill worker', t: 'Hattiesburg, Miss.', st: 'MS' },
  { n: 'Ruby Calloway', a: 38, j: 'domestic worker', t: 'Birmingham, Ala.', st: 'AL' }, { n: 'Vernon Shaw', a: 56, j: 'Kentucky tobacco farmer', t: 'Owensboro, Ky.', st: 'KY' }
];
// Short, plain reactions. No relatives with a gender, so any name can say any line.
const QUOTES = {
  pos: ['I drove forty minutes to hear that. I\'d do it again.', 'Straight answer. We don\'t get many of those around here.',
    'My brother-in-law has voted the other way his whole life. He didn\'t change the channel.', 'Half the people on my shift were talking about it at lunch.',
    'I\'m still not sold. But I\'m listening now, which is more than I could say last week.', 'They talked about prices like somebody who actually buys groceries.',
    'First answer all year I could repeat at the dinner table.', 'Sounded like somebody who\'s had a bad year and gotten through it.',
    'Practical. I don\'t need a sermon, I need a plan.', 'I put the sign back up in my yard.'],
  neg: ['Nice speech. Doesn\'t change my rent.', 'They lost me about halfway through.', 'Felt like it was written for the people on television, not the people here.',
    'I wanted to like it. I really did.', 'Everybody on my shift thinks it was a dodge.', 'Not one word about the things that keep me up at night.',
    'That\'s going to cost them out here. I\'d bet my truck on it.', 'I\'ve heard that one before. Twice.', 'My neighbor took the sign out of the yard this morning.'],
  debWin: ['Calm. Knew the numbers. That\'s what I wanted to see.', 'We had it on at the bar and people actually stopped talking.',
    'I\'ve been undecided since the summer. Not anymore.', 'Looked like they\'d done this before. The other one looked like they wanted to go home.'],
  debLose: ['The other one owned that stage.', 'Too many numbers. I stopped following.', 'They kept dodging, and everybody in my living room noticed.', 'I wanted a fight and didn\'t get one.']
};
const HEADLINES = {
  strong: ['{L}\'s message lands in {R}', '{L} wins over {R}', 'Strong week for {L} in {R}', '{L} scores on {topic}', 'Big week for {L} on {topic}'],
  good: ['Good week for {L} on {topic}', 'Praise for {L} on {topic}', '{L} plays to {R}'],
  even: ['Mixed reviews for {L} on {topic}', 'Quiet week for {L} on {topic}'],
  hurt: ['{L} stumbles on {topic}', '{L} loses ground in {W}', 'Rough week for {L} on {topic}'],
  debWin: ['{L} wins {nthD}, snap poll finds', '{L} gets the better of {O} in {nthD}', 'Strong night for {L} in {nthD}'],
  debLose: ['{O} edges {L} in {nthD}', '{L} struggles as {O} lands blows in {nthD}', 'Snap poll gives {nthD} to {O}'],
  debDraw: ['{NthD} ends without a knockout', 'No clear winner in {nthD}']
};
const TRAIL = [
  { p: .12, k: 'crowd', m: 1.5, txt: 'An overflow crowd of {N} packed the rally.' },
  { p: .08, k: 'rain', m: .6, txt: 'Rain kept the crowd to a few hundred.' },
  { p: .07, k: 'endorse', m: 1.35, txt: 'A popular local mayor endorsed you onstage.' },
  { p: .06, k: 'hecklers', m: .8, txt: 'Hecklers got more airtime than the speech.' },
  { p: .05, k: 'viral', m: 1.4, txt: 'A chat with a diner owner made every newscast.' }
];
