// ===================== HISTORICAL SCENARIOS =====================
// Effects are from the point of view of the side making the choice, in polling points.
// Regions in historical races: NE Northeast, MW Industrial Midwest, SO South, WE West.
// Home states and running mates are already reflected in the real results, so historical races add no home-state bonus.
// h: true marks the choice the real candidate made. Notes describe what actually happened.
const HIST_REGIONS = { NE: 'the Northeast', MW: 'the industrial Midwest', SO: 'the South', WE: 'the West' };
const HIST_REGIONS_SHORT = { NE: 'Northeast', MW: 'Midwest', SO: 'South', WE: 'West' };

const HISTORY = {
  1960: {
    vehicle: 'plane', year: 1960, election: '1960-11-08', inaugural: 'January 20, 1961', ordinal: '35th',
    odds: { D: 'Slight favorite', R: 'Underdog' }, tagline: 'Kennedy vs. Nixon', blurb: 'Kennedy and Nixon meet in the first televised presidential debates.',
    open: 'Labor Day, 1960. Vice President Richard Nixon and Sen. John F. Kennedy are about even in the polls. Nixon has served eight years under a popular president. Kennedy is 43, would be the first Catholic president, and is very good on television.',
    startNat: -1.2, tide: [0.05, 0.15, 0.45, 0.05, 0, 0.05, 0.1, 0.3, 0.1, 0.12],
    locked: { label: 'Unpledged electors', short: 'Unpledged', who: 'unpledged electors, who voted for Sen. Harry F. Byrd', note: 'Fourteen Southern electors, all 8 in Mississippi and 6 of 11 in Alabama, were pledged to neither candidate and later voted for Sen. Harry F. Byrd of Virginia.' },
    actual: { D: 303, R: 219, other: 15, otherName: 'Byrd', pvD: 49.72, pvR: 49.55, winner: 'D',
      note: 'Kennedy won 303 electoral votes to Nixon\'s 219, with 15 going to Harry F. Byrd (including one faithless Oklahoma elector). Kennedy\'s popular-vote margin was about 113,000 votes out of 68.8 million.' },
    cands: {
      D: { id: 'kennedy', first: 'John F.', last: 'Kennedy', ini: 'JFK', title: 'U.S. Senator from Massachusetts', home: 'MA', perk: 'debate', perkText: 'Made for television: bigger wins in debates',
        bio: '43-year-old Navy veteran who would be the first Catholic president.' },
      R: { id: 'nixon', first: 'Richard', last: 'Nixon', ini: 'RN', title: 'Vice President of the United States', home: 'CA', perk: 'visits', perkText: 'Relentless campaigner: every stop counts 25% more',
        bio: 'Eisenhower\'s two-term vice president, famous for his 1959 Kitchen Debate with Khrushchev.' }
    },
    vps: {
      D: { id: 'johnson', first: 'Lyndon B.', last: 'Johnson', ini: 'LBJ', title: 'Senate Majority Leader from Texas', home: 'TX' },
      R: { id: 'lodge', first: 'Henry Cabot', last: 'Lodge Jr.', ini: 'HCL', title: 'U.S. Ambassador to the United Nations', home: 'MA' }
    },
    turns: [
      { date: '1960-09-05', cat: 'Labor Day', title: 'Launching the fall campaign',
        body: { D: 'Labor Day is the traditional start of the fall campaign. Organized labor is waiting to hear from you, and Lyndon Johnson wants you in the South.', R: 'You are spending Labor Day in Walter Reed hospital with an infected knee. Before your illness you pledged to campaign in all 50 states.' },
        options: {
          D: [
            { t: 'Rally with union members in Detroit\'s Cadillac Square', s: 'Detroit', fx: { MW: .7 }, h: true },
            { t: 'Tour the South with Lyndon Johnson', s: 'the Southern tour', fx: { SO: .6, MW: -.1 } },
            { t: 'Hold a homecoming rally in Boston', s: 'Boston', fx: { NE: .5, home: .6 } }],
          R: [
            { t: 'Keep the 50-state pledge once you are released', s: 'the 50-state pledge', fx: { WE: .25, SO: .15, nat: .1, MW: -.1 }, h: true },
            { t: 'Drop the pledge and concentrate on the big industrial states', s: 'the big-state plan', fx: { MW: .5, NE: .2, WE: -.25 } },
            { t: 'Ask President Eisenhower to stand in for you this week', s: 'Eisenhower', fx: { nat: .25 } }]
        },
        hist: { D: 'Kennedy opened his fall campaign before a huge Labor Day crowd in Detroit\'s Cadillac Square.', R: 'Nixon was hospitalized from late August until Sept. 9. He kept his promise to visit all 50 states, a decision that pulled him to Alaska on the final weekend.' } },
      { date: '1960-09-12', cat: 'Religion', title: 'Can a Catholic be president?',
        body: 'Protestant ministers and national groups are openly asking whether a Catholic president would answer to the Vatican. No Catholic has ever won the presidency, and the issue is cutting through the South and rural Midwest.',
        options: {
          D: [
            { t: 'Speak directly to the Greater Houston Ministerial Association', s: 'Houston', fx: { nat: .15, NE: .3, MW: .3, SO: .1 }, h: true },
            { t: 'Avoid the subject and talk about the economy', s: 'avoiding it', fx: { nat: -.2, SO: -.1 } },
            { t: 'Let surrogates and church leaders answer for you', s: 'surrogates', fx: { NE: .2, SO: -.2 } }],
          R: [
            { t: 'Declare religion off-limits and keep your campaign out of it', s: 'calling it off-limits', fx: { nat: .2, NE: .1 }, h: true },
            { t: 'Stay silent while allied ministers raise doubts', s: 'staying silent', fx: { SO: .35, MW: -.25, NE: -.3 } },
            { t: 'Speak about your own Quaker faith and tolerance', s: 'the Quaker speech', fx: { nat: .15 } }]
        },
        hist: { D: 'On Sept. 12, Kennedy told the Houston ministers he believed in an absolute separation of church and state. The speech blunted the issue, though it never went away.', R: 'Nixon said publicly that religion should not be an issue and told his campaign not to raise it.' } },
      { date: '1960-09-26', kind: 'debate', cat: 'First debate', debName: 'first',
        q: 'This first debate is on domestic policy. Which of you will keep the economy growing and get the country moving?', fit: 'plan',
        hist: { D: 'Some 70 million Americans watched in Chicago. Kennedy looked rested and confident; Nixon, still recovering from his hospital stay, looked pale and tired on camera. Kennedy is widely seen as having won the television audience.', R: 'Some 70 million Americans watched in Chicago. Nixon, still recovering from his hospital stay, looked pale and tired on camera. Kennedy is widely seen as having won the television audience.' } },
      { date: '1960-10-03', cat: 'Defense', topic: 'the missile gap', title: 'The missile gap',
        body: 'Kennedy has charged that the Eisenhower administration let the Soviet Union pull ahead in long-range missiles. Since Sputnik, voters are uneasy about Soviet power.',
        options: {
          D: [
            { t: 'Keep pressing the missile gap and promise a defense buildup', s: 'the missile gap', fx: { nat: .2, MW: .15, SO: .15 }, h: true },
            { t: 'Pivot to jobs and the sluggish economy', s: 'jobs', fx: { MW: .3, nat: .05 } },
            { t: 'Call for new arms-control talks with Moscow', s: 'arms talks', fx: { NE: .2, SO: -.2 } }],
          R: [
            { t: 'Defend the administration\'s defense record with confidence', s: 'defending the record', fx: { nat: .2 }, h: true },
            { t: 'Promise a defense buildup of your own', s: 'a buildup', fx: { SO: .2, MW: .1, NE: -.1 } },
            { t: 'Accuse Kennedy of talking down America', s: 'going after Kennedy', fx: { SO: .2, nat: .05 } }]
        },
        hist: { D: 'Kennedy hammered the missile gap all fall. In fact the United States was well ahead, as classified intelligence showed.', R: 'Nixon defended the record but could not cite the classified intelligence showing the United States was well ahead.' } },
      { date: '1960-10-08', cat: 'Foreign policy', topic: 'Quemoy and Matsu', title: 'Quemoy and Matsu',
        body: 'In the second debate, the candidates clashed over two small islands off the Chinese coast held by Taiwan\'s Nationalist government. Should America fight to defend them?',
        options: {
          D: [
            { t: 'Say the islands are not worth a war and draw the line at Taiwan', s: 'drawing the line at Taiwan', fx: { NE: .2, nat: .05, SO: -.15 }, h: true },
            { t: 'Back off and promise to defend the islands too', s: 'defending the islands', fx: { nat: .1, SO: .1 } },
            { t: 'Change the subject to the economy', s: 'changing the subject', fx: { nat: -.05, MW: .1 } }],
          R: [
            { t: 'Insist America must not give up an inch of free territory', s: 'standing firm', fx: { nat: .25, SO: .15 }, h: true },
            { t: 'Agree with Kennedy to avoid looking reckless', s: 'agreeing', fx: { nat: .05, NE: .1 } },
            { t: 'Say it is a matter for President Eisenhower\'s judgment', s: 'deferring to Ike', fx: { nat: .1 } }]
        },
        hist: { D: 'Kennedy argued the islands were not essential to Taiwan\'s defense. The fight carried over into the third debate.', R: 'Nixon called Kennedy\'s position a dangerous retreat. The fight carried over into the third debate.' } },
      { date: '1960-10-12', cat: 'Civil rights', title: 'A pledge in Harlem',
        body: 'Campaigning in Harlem, Henry Cabot Lodge promised that a Nixon administration would appoint a Black American to the Cabinet. Southern Republicans are furious, and both campaigns are being pressed on civil rights.',
        options: {
          D: [
            { t: 'Promise to end discrimination in federal housing by executive order', s: 'the executive order', fx: { NE: .25, MW: .2, SO: -.3 }, h: true },
            { t: 'Talk about economic opportunity and avoid specifics', s: 'staying general', fx: { nat: .1 } },
            { t: 'Reassure Southern Democrats that change will be gradual', s: 'reassuring the South', fx: { SO: .3, NE: -.2, MW: -.15 } }],
          R: [
            { t: 'Stand by Lodge\'s pledge', s: 'backing Lodge', fx: { NE: .2, MW: .2, SO: -.35 } },
            { t: 'Say appointments will be made on merit, without a racial pledge', s: 'the merit answer', fx: { SO: .2, NE: -.15, MW: -.1 }, h: true },
            { t: 'Say nothing and let the story fade', s: 'saying nothing', fx: { nat: -.05 } }]
        },
        hist: { D: 'Kennedy said discrimination in federally funded housing could be ended with the stroke of a pen. He signed that order in November 1962.', R: 'Nixon distanced himself from Lodge\'s pledge, saying he would appoint the best people regardless of race.' } },
      { date: '1960-10-21', kind: 'debate', cat: 'Fourth debate', debName: 'final',
        q: 'Fidel Castro has turned Cuba toward Moscow, 90 miles from Florida. What should the United States do about it?', fit: 'attack',
        hist: { D: 'Kennedy had called for helping Cuban exiles fight Castro. Nixon, who knew of secret invasion planning, attacked the idea as reckless. Many observers felt Nixon had the better of the later debates.', R: 'Nixon, who knew of secret invasion planning, attacked Kennedy\'s call to aid Cuban exiles as reckless and illegal. Many observers felt he had the better of the later debates.' } },
      { date: '1960-10-26', cat: 'Civil rights', topic: 'Dr. King\'s arrest', title: 'Dr. King is jailed',
        body: 'Martin Luther King Jr. has been sentenced to four months of hard labor in a Georgia state prison after a sit-in arrest in Atlanta. His family fears for his life, and his supporters are asking both candidates to speak up.',
        options: {
          D: [
            { t: 'Call Coretta Scott King to offer your sympathy', s: 'calling Mrs. King', fx: { MW: .35, NE: .2, SO: -.15 }, h: true },
            { t: 'Have aides issue a careful statement', s: 'a statement', fx: { nat: .05 } },
            { t: 'Stay silent to protect support in the South', s: 'staying silent', fx: { SO: .2, MW: -.2, NE: -.1 } }],
          R: [
            { t: 'Publicly call for Dr. King\'s release', s: 'calling for his release', fx: { MW: .3, NE: .2, SO: -.3 } },
            { t: 'Decline to comment', s: 'no comment', fx: { SO: .1, MW: -.25, NE: -.1 }, h: true },
            { t: 'Ask the Justice Department to look into the case', s: 'the Justice Department', fx: { MW: .15, nat: .05 } }]
        },
        hist: { D: 'Kennedy phoned Coretta Scott King, and his brother Robert called the judge. King was released the next day, word spread through Black churches, and Black voters swung toward Kennedy.', R: 'Nixon declined to comment publicly, and a draft White House statement was never released. Kennedy\'s call to Coretta Scott King swung Black voters his way.' } },
      { date: '1960-11-03', cat: 'Final push', title: 'The last five days',
        body: { D: 'The race is a dead heat. You have the money and the crowds; the question is where to spend the last days.', R: 'President Eisenhower, still enormously popular, is eager to campaign hard. Your 50-state pledge still requires a trip to Alaska.' },
        options: {
          D: [
            { t: 'A final swing through the big industrial states', s: 'the industrial swing', fx: { MW: .35, NE: .1 } },
            { t: 'Blanket the airwaves with television', s: 'television', fx: { nat: .2 } },
            { t: 'Close in New England with a rally at Boston Garden', s: 'Boston Garden', fx: { NE: .3, home: .4 }, h: true }],
          R: [
            { t: 'Send Eisenhower barnstorming through the big states', s: 'Eisenhower', fx: { nat: .25, NE: .1 } },
            { t: 'Fly to Alaska to complete the 50-state pledge', s: 'Alaska', fx: { WE: .25, nat: .05 }, h: true },
            { t: 'Host a four-hour election-eve telethon', s: 'the telethon', fx: { nat: .2 } }]
        },
        hist: { D: 'Kennedy closed with a swing through the big Northern states and an election-eve rally at Boston Garden.', R: 'Nixon flew to Anchorage on Nov. 6 to keep his 50-state pledge, then hosted a four-hour telethon on election eve. Eisenhower campaigned for him in the final week.' } },
      { date: '1960-11-07', cat: 'Closing argument', title: 'The final message',
        body: 'Election eve. Tens of millions will see your final television appeal. What do you leave them with?',
        options: {
          D: [
            { t: 'A new generation will get the country moving again', s: 'getting moving again', fx: { nat: .3 }, h: true },
            { t: 'Warn about Republican recessions and lost jobs', s: 'jobs', fx: { MW: .3, SO: .1 } },
            { t: 'Stress your war record and toughness on Moscow', s: 'toughness', fx: { nat: .15, SO: .15 } }],
          R: [
            { t: 'Experience: who can stand up to Khrushchev?', s: 'experience', fx: { nat: .3 }, h: true },
            { t: 'Peace and prosperity: don\'t change course now', s: 'staying the course', fx: { nat: .2, WE: .1 } },
            { t: 'Question whether Kennedy is too young and untested', s: 'Kennedy\'s youth', fx: { SO: .2, nat: .05 } }]
        },
        hist: { D: 'Kennedy\'s closing theme was that he would get the country moving again.', R: 'Nixon closed on his experience, especially in standing up to the Soviet Union.' } }
    ]
  },

  1976: {
    incumbent: 'R', incTerm: 'a full term', incHead: 'Ford wins a full term', year: 1976, election: '1976-11-02', inaugural: 'January 20, 1977', ordinal: '39th',
    odds: { D: 'Favorite', R: 'Underdog' }, tagline: 'Carter vs. Ford', blurb: 'Ford, who was never elected, faces a Georgia governor most voters had not heard of a year ago.',
    open: 'Labor Day, 1976. Jimmy Carter, a former governor of Georgia, leads President Gerald Ford by double digits. Ford became president when Richard Nixon resigned in 1974, and many voters still hold his pardon of Nixon against him. Unemployment is close to 8 percent.',
    startNat: 10.0, tide: [-0.5, -1.2, -1.2, -0.9, 0.6, -0.6, -1.0, -0.8, -1.0, -1.34],
    actual: { D: 297, R: 240, other: 1, otherName: 'Reagan', pvD: 50.06, pvR: 48.00, winner: 'D',
      note: 'Carter won 297 electoral votes to Ford\'s 240; one Washington elector voted for Ronald Reagan. Carter won the popular vote by about two points after leading by more than 30 in midsummer.' },
    cands: {
      D: { id: 'carter', first: 'Jimmy', last: 'Carter', ini: 'JC', title: 'Former Governor of Georgia', home: 'GA', perk: 'visits', perkText: 'Retail campaigner: every stop counts 25% more',
        bio: 'Peanut farmer, Navy veteran and one-term governor running as a Washington outsider.' },
      R: { id: 'ford', first: 'Gerald', last: 'Ford', ini: 'GF', title: 'President of the United States', home: 'MI', perk: 'incumbent', perkText: 'The power of the office: your opponent\'s good weeks hurt you less',
        bio: 'Longtime House Republican leader from Grand Rapids who became president when Nixon resigned in 1974.' }
    },
    vps: {
      D: { id: 'mondale', first: 'Walter', last: 'Mondale', ini: 'WM', title: 'U.S. Senator from Minnesota', home: 'MN' },
      R: { id: 'dole', first: 'Bob', last: 'Dole', ini: 'BD', title: 'U.S. Senator from Kansas', home: 'KS' }
    },
    turns: [
      { date: '1976-09-06', cat: 'Labor Day', title: 'How do you open?',
        body: { D: 'You lead comfortably, but much of the country still doesn\'t know you. Labor Day is your chance to set the tone for the fall.', R: 'You trail badly. Your advisers are split between looking presidential at the White House and hitting the road.' },
        options: {
          D: [
            { t: 'Open at Warm Springs, Ga., where Franklin Roosevelt kept his Little White House', s: 'Warm Springs', fx: { SO: .4, MW: .1, home: .3 }, h: true },
            { t: 'Kick off in the industrial North with union leaders', s: 'the union kickoff', fx: { MW: .5 } },
            { t: 'Hold a big rally in New York City', s: 'New York', fx: { NE: .45 } }],
          R: [
            { t: 'Stay in the Rose Garden, sign bills and look presidential', s: 'the Rose Garden', fx: { nat: .25 }, h: true },
            { t: 'Hit the road in Michigan and the Midwest', s: 'the Midwest swing', fx: { MW: .5 } },
            { t: 'Barnstorm the South to cut into Carter\'s base', s: 'the Southern raid', fx: { SO: .35, nat: -.05 } }]
        },
        hist: { D: 'Carter opened his fall campaign at Warm Springs, Ga., where Franklin Roosevelt had kept his Little White House.', R: 'Ford ran a "Rose Garden" strategy through much of September, staying at the White House and acting presidential, and formally opened his campaign at the University of Michigan on Sept. 15.' } },
      { date: '1976-09-20', cat: 'The press', title: 'The Playboy interview',
        body: 'Excerpts of a Playboy magazine interview show Carter, a devout Baptist, admitting he had felt lust for women other than his wife. The story is everywhere, and religious voters are uneasy.',
        options: {
          D: [
            { t: 'Explain it as an honest statement of your faith', s: 'explaining your faith', fx: { nat: .05, SO: -.1 } },
            { t: 'Say you regret giving the interview to Playboy', s: 'expressing regret', fx: { nat: .1, SO: .15, NE: -.05 } },
            { t: 'Refuse to discuss it any further', s: 'refusing to discuss it', fx: { nat: -.15 } }],
          R: [
            { t: 'Stay presidential and let the story speak for itself', s: 'staying above it', fx: { nat: .2 } },
            { t: 'Have surrogates question Carter\'s judgment', s: 'surrogate attacks', fx: { SO: .25, nat: -.05 } },
            { t: 'Use the moment to pivot to the economy', s: 'the economy', fx: { nat: .1, MW: .1 } }]
        },
        hist: { D: 'Carter later said he regretted giving the interview to Playboy. The story contributed to the erosion of his lead.', R: 'The interview dominated coverage for days and contributed to the erosion of Carter\'s lead.' } },
      { date: '1976-09-23', kind: 'debate', cat: 'First debate', debName: 'first',
        q: 'This debate is on the economy. Unemployment is near 8 percent. What would you do to put Americans back to work?', fit: 'plan',
        hist: { D: 'In Philadelphia, the first presidential debate since 1960, a 27-minute audio failure left both men standing silently at their lecterns. Ford was widely seen as the winner.', R: 'In Philadelphia, the first presidential debate since 1960, a 27-minute audio failure left both men standing silently at their lecterns. Ford was widely seen as the winner.' } },
      { date: '1976-10-04', cat: 'Scandal', title: 'The Butz affair',
        body: 'Agriculture Secretary Earl Butz has been exposed for telling a crude racist joke, reported in Rolling Stone. Civil rights leaders and newspapers are demanding that he go.',
        options: {
          D: [
            { t: 'Demand that Ford fire Butz', s: 'demanding his firing', fx: { NE: .15, MW: .15, SO: -.05 } },
            { t: 'Let the story play out on its own', s: 'letting it play out', fx: { nat: .05 } },
            { t: 'Tie it to hard times on the farm', s: 'the farm angle', fx: { WE: .2, MW: .1 } }],
          R: [
            { t: 'Force Butz out right away', s: 'forcing him out', fx: { nat: .2, MW: .1 } },
            { t: 'Reprimand him but keep him on', s: 'a reprimand', fx: { SO: .1, nat: -.3, MW: -.1 }, h: true },
            { t: 'Call it a private matter', s: 'calling it private', fx: { nat: -.35 } }]
        },
        hist: { D: 'Ford at first only reprimanded Butz. The secretary resigned on Oct. 4 as the uproar grew.', R: 'Ford at first only reprimanded Butz. The secretary resigned on Oct. 4 as the uproar grew.' } },
      { date: '1976-10-06', kind: 'debate', cat: 'Second debate', debName: 'second',
        q: 'This debate is on foreign policy. Has America lost ground to the Soviet Union, and what would you do about it?', fit: 'plan',
        hist: { D: 'In San Francisco, Ford said there was no Soviet domination of Eastern Europe. He took days to clarify, and the gaffe stalled his comeback.', R: 'In San Francisco, Ford said there was no Soviet domination of Eastern Europe. He took days to clarify, and the gaffe stalled his comeback.' } },
      { date: '1976-10-15', cat: 'Running mates', title: 'The first vice presidential debate',
        body: 'Walter Mondale and Bob Dole meet in Houston for the first vice presidential debate ever held. Your running mate wants to know what you need from tonight.',
        options: {
          D: [
            { t: 'Have Mondale tie Ford to Watergate and the Nixon pardon', s: 'the pardon attack', fx: { nat: .15, NE: .1 } },
            { t: 'Keep Mondale on jobs and the economy', s: 'jobs', fx: { MW: .25, nat: .1 } },
            { t: 'Have Mondale stay calm and presidential', s: 'staying calm', fx: { nat: .2 }, h: true }],
          R: [
            { t: 'Turn Dole loose on the attack', s: 'the attack', fx: { SO: .15, nat: -.2 }, h: true },
            { t: 'Keep Dole on farm prices and taxes', s: 'farm country', fx: { WE: .2, MW: .1 } },
            { t: 'Have Dole defend the administration\'s record', s: 'the record', fx: { nat: .1 } }]
        },
        hist: { D: 'Dole blamed the century\'s wars on Democrats, and Mondale said Dole had lived up to his reputation as a hatchet man. Most viewers felt Mondale won.', R: 'Dole blamed the century\'s wars on Democrats, and Mondale said Dole had lived up to his reputation as a hatchet man. Most viewers felt Mondale won.' } },
      { date: '1976-10-19', cat: 'Trust', title: 'The shadow of Watergate',
        body: 'Two years after Ford pardoned Richard Nixon, voters still ask about Watergate. Carter is running as an outsider who promises honesty in government.',
        options: {
          D: [
            { t: 'Promise you will never lie to the American people', s: 'the honesty pledge', fx: { nat: .25 }, h: true },
            { t: 'Hammer the Nixon pardon directly', s: 'the pardon', fx: { NE: .2, nat: -.05 } },
            { t: 'Talk about competence and reorganizing government', s: 'competence', fx: { nat: .1 } }],
          R: [
            { t: 'Defend the pardon as the right way to heal the nation', s: 'defending the pardon', fx: { nat: .1 }, h: true },
            { t: 'Avoid the subject entirely', s: 'avoiding it', fx: { nat: -.1 } },
            { t: 'Stress the calm and decency you restored to the White House', s: 'decency', fx: { nat: .2 } }]
        },
        hist: { D: 'Carter\'s central promise was that he would never lie to the American people.', R: 'Ford stood by the pardon as necessary to put Watergate behind the country. Many analysts believe it cost him the election.' } },
      { date: '1976-10-22', kind: 'debate', cat: 'Third debate', debName: 'third',
        q: 'This is the final debate. Why should Americans trust you with the presidency for the next four years?', fit: 'story',
        hist: { D: 'The final debate, at Williamsburg, Va., was a quieter affair, and neither candidate gained much ground.', R: 'The final debate, at Williamsburg, Va., was a quieter affair, and neither candidate gained much ground.' } },
      { date: '1976-10-27', cat: 'Economy', title: 'The recovery stalls',
        body: 'Unemployment is stuck near 8 percent and inflation has not gone away. The final economic reports before the election are coming in soft.',
        options: {
          D: [
            { t: 'Attack the "misery index" of inflation plus unemployment', s: 'the misery index', fx: { MW: .3, nat: .15 }, h: true },
            { t: 'Promise a jobs program for the cities', s: 'a jobs program', fx: { NE: .25, MW: .1, SO: -.1 } },
            { t: 'Promise to balance the budget', s: 'a balanced budget', fx: { nat: .1, SO: .1 } }],
          R: [
            { t: 'Promise steady, inflation-fighting restraint', s: 'restraint', fx: { nat: .2 }, h: true },
            { t: 'Propose a new tax cut', s: 'a tax cut', fx: { nat: .15, WE: .1 } },
            { t: 'Warn that Carter\'s promises would revive inflation', s: 'warning on inflation', fx: { SO: .15, nat: .1 } }]
        },
        hist: { D: 'Carter popularized the "misery index," the sum of inflation and unemployment, to attack the Ford economy.', R: 'Ford stressed falling inflation and warned against new federal spending.' } },
      { date: '1976-10-30', cat: 'Closing argument', title: 'The final weekend',
        body: 'The polls have closed to within a few points. One last push.',
        options: {
          D: [
            { t: 'Return to trust, competence and a fresh start', s: 'a fresh start', fx: { nat: .25 }, h: true },
            { t: 'A final push through the industrial North', s: 'the Northern push', fx: { MW: .35 } },
            { t: 'Rally the South one last time', s: 'the South', fx: { SO: .4 } }],
          R: [
            { t: 'Close with folksy TV conversations alongside baseball broadcaster Joe Garagiola', s: 'the Garagiola ads', fx: { nat: .3 }, h: true },
            { t: 'A final swing through the big Northern states', s: 'the Northern swing', fx: { MW: .3, NE: .1 } },
            { t: 'Run hard against Carter\'s inexperience', s: 'inexperience', fx: { SO: .2, nat: .05 } }]
        },
        hist: { D: 'Carter\'s once-enormous lead shrank to about two points by Election Day.', R: 'Ford closed with relaxed television conversations with Joe Garagiola and nearly erased Carter\'s lead.' } }
    ]
  },

  1980: {
    incumbent: 'D', incTerm: 'a second term', incHead: 'Carter re-elected', year: 1980, election: '1980-11-04', inaugural: 'January 20, 1981', ordinal: '40th',
    odds: { D: 'Nearly impossible', R: 'Heavy favorite' }, tagline: 'Reagan vs. Carter', blurb: 'Carter wants a second term. Inflation is in double digits and 52 Americans are hostages in Iran.',
    open: 'Labor Day, 1980. Inflation is in double digits, and 52 Americans have been held hostage in Iran since last November. President Carter is running about even with Ronald Reagan, the former governor of California. John Anderson, a Republican congressman from Illinois running as an independent, is pulling moderates from both.',
    startNat: -2.0, tide: [-0.2, -0.3, -0.3, -0.2, -0.3, -0.3, -2.6, -0.8, -1.53, -1.2],
    actual: { D: 49, R: 489, other: 0, pvD: 41.01, pvR: 50.75, winner: 'R', third: 'Anderson and others',
      note: 'Reagan won 489 electoral votes to Carter\'s 49 and 44 states. Independent John Anderson took 6.6% of the vote. The race broke sharply toward Reagan in the final week.' },
    cands: {
      D: { id: 'carter80', first: 'Jimmy', last: 'Carter', ini: 'JC', title: 'President of the United States', home: 'GA', perk: 'incumbent', perkText: 'The power of the office: your opponent\'s good weeks hurt you less',
        bio: 'Incumbent president fighting double-digit inflation and the Iran hostage crisis.' },
      R: { id: 'reagan', first: 'Ronald', last: 'Reagan', ini: 'RR', title: 'Former Governor of California', home: 'CA', perk: 'debate', perkText: 'At ease on camera: bigger wins in debates',
        bio: 'Two-term California governor and former actor promising tax cuts and a stronger defense.' }
    },
    vps: {
      D: { id: 'mondale80', first: 'Walter', last: 'Mondale', ini: 'WM', title: 'Vice President of the United States', home: 'MN' },
      R: { id: 'bush', first: 'George H. W.', last: 'Bush', ini: 'GB', title: 'Former Director of Central Intelligence', home: 'TX' }
    },
    turns: [
      { date: '1980-09-01', cat: 'Labor Day', title: 'Where do you open?',
        body: { D: 'Your campaign wants to lock down the South, which you swept in 1976, before turning north.', R: 'You want a kickoff that says your campaign is about working Americans, not just the conservative base.' },
        options: {
          D: [
            { t: 'Open in Tuscumbia, Ala., to shore up the South', s: 'Tuscumbia', fx: { SO: .45 }, h: true },
            { t: 'Rally union workers in the industrial Midwest', s: 'the union rally', fx: { MW: .45 } },
            { t: 'Stay at the White House and look presidential', s: 'the White House', fx: { nat: .2 } }],
          R: [
            { t: 'Speak at Liberty State Park with the Statue of Liberty behind you', s: 'Liberty State Park', fx: { NE: .3, MW: .15, nat: .05 }, h: true },
            { t: 'Rally blue-collar Democrats in Michigan', s: 'Michigan', fx: { MW: .45 } },
            { t: 'Challenge Carter on his home turf in the South', s: 'the South', fx: { SO: .4 } }]
        },
        hist: { D: 'Carter opened in Tuscumbia, Ala., and denounced the Ku Klux Klan, whose members were protesting nearby.', R: 'Reagan opened at Liberty State Park with the Statue of Liberty behind him. Later that day in Michigan he wrongly linked Carter\'s kickoff to the Klan and had to apologize.' } },
      { date: '1980-09-21', cat: 'Debates', title: 'A three-way debate',
        body: 'The League of Women Voters has invited independent John Anderson to debate in Baltimore. Carter refuses to share a stage with Anderson; Reagan has accepted.',
        options: {
          D: [
            { t: 'Skip the debate rather than legitimize Anderson', s: 'skipping it', fx: { nat: -.1, SO: .05 }, h: true },
            { t: 'Show up and debate both of them', s: 'showing up', fx: { nat: .1, NE: .1 } },
            { t: 'Demand a one-on-one with Reagan first', s: 'the one-on-one demand', fx: { nat: .05 } }],
          R: [
            { t: 'Debate Anderson anyway and look presidential', s: 'debating anyway', fx: { nat: .2, NE: .1 }, h: true },
            { t: 'Skip it too', s: 'skipping it', fx: { nat: -.1 } },
            { t: 'Mock Carter\'s empty podium', s: 'the empty podium', fx: { SO: .1, nat: .05 } }]
        },
        hist: { D: 'Carter stayed away, and Reagan and Anderson debated alone in Baltimore. Carter was criticized for ducking, and the debate did little for Anderson.', R: 'Reagan and Anderson debated alone in Baltimore. Reagan held his own, and the debate did little for Anderson.' } },
      { date: '1980-09-29', cat: 'Economy', title: 'Inflation in double digits',
        body: 'Prices are rising at double-digit rates and mortgage interest rates are soaring. Voters rank the economy far above every other issue.',
        options: {
          D: [
            { t: 'Warn that Reagan\'s tax cut would make inflation worse', s: 'warning on inflation', fx: { nat: .1, NE: .1 } },
            { t: 'Push your plan to revitalize American industry', s: 'the revitalization plan', fx: { MW: .3 }, h: true },
            { t: 'Blame oil prices and OPEC', s: 'blaming OPEC', fx: { nat: -.1 } }],
          R: [
            { t: 'Champion a 30% cut in income-tax rates over three years', s: 'the 30% tax cut', fx: { MW: .2, WE: .2, SO: .1, NE: -.1 }, h: true },
            { t: 'Promise to balance the budget first', s: 'a balanced budget', fx: { nat: .15 } },
            { t: 'Blame Carter\'s leadership for the economy', s: 'blaming Carter', fx: { nat: .15, SO: .1 } }]
        },
        hist: { D: 'Carter unveiled an economic revitalization program in late August and warned that Reagan\'s tax cut would feed inflation.', R: 'Reagan ran on the Kemp-Roth plan to cut income-tax rates by 30% over three years.' } },
      { date: '1980-10-08', cat: 'Tone', title: 'The "meanness" issue',
        body: 'Reporters say Carter\'s warnings that Reagan would divide the country and risk war have turned personal. Even some supporters are wincing.',
        options: {
          D: [
            { t: 'Promise to tone down the attacks', s: 'toning it down', fx: { nat: .2 }, h: true },
            { t: 'Keep warning about Reagan\'s judgment on war and peace', s: 'keeping it up', fx: { NE: .15, nat: -.05 } },
            { t: 'Let surrogates carry the attacks instead', s: 'surrogates', fx: { nat: .1 } }],
          R: [
            { t: 'Answer with good humor and stay above it', s: 'good humor', fx: { nat: .25 }, h: true },
            { t: 'Hit back hard at Carter\'s record', s: 'hitting back', fx: { SO: .2, nat: .05 } },
            { t: 'Give a speech on peace to reassure voters', s: 'a peace speech', fx: { nat: .15, NE: .1 } }]
        },
        hist: { D: 'After days of stories about his "meanness," Carter promised to stop his personal attacks on Reagan.', R: 'Reagan mostly let Carter\'s attacks roll off him, answering with humor.' } },
      { date: '1980-10-14', cat: 'Gaffes', topic: 'the pollution flap', title: 'Trees and pollution',
        body: 'Reagan\'s offhand claims, including that trees and volcanoes cause much of the nation\'s air pollution, are drawing ridicule. His staff wants him on a tighter script.',
        options: {
          D: [
            { t: 'Mock the slips as proof Reagan isn\'t ready', s: 'mocking the slips', fx: { NE: .15, nat: .05 } },
            { t: 'Ignore them and stay on the economy', s: 'staying on the economy', fx: { nat: .1 } },
            { t: 'Run ads questioning his grasp of facts', s: 'the ads', fx: { NE: .2, WE: .1, nat: -.05 } }],
          R: [
            { t: 'Stick to the script and take fewer press questions', s: 'the tighter script', fx: { nat: .15 }, h: true },
            { t: 'Laugh it off with self-deprecating humor', s: 'laughing it off', fx: { nat: .2 } },
            { t: 'Defend the claim on the merits', s: 'defending it', fx: { WE: -.2, nat: -.15 } }]
        },
        hist: { D: 'Reagan\'s remarks about trees and pollution became a running joke, but they did little lasting damage.', R: 'Reagan\'s staff kept him on a tighter script with fewer unscripted questions through much of October.' } },
      { date: '1980-10-21', cat: 'Independents', title: 'The Anderson voters',
        body: 'John Anderson\'s support has faded from its summer high, but millions of moderates are still with him. Where do they go?',
        options: {
          D: [
            { t: 'Tell them a vote for Anderson is a vote for Reagan', s: 'the wasted-vote pitch', fx: { NE: .25, WE: .1 }, h: true },
            { t: 'Court them with a moderate economic message', s: 'a moderate pitch', fx: { nat: .15 } },
            { t: 'Ignore Anderson and focus on Reagan', s: 'ignoring Anderson', fx: { nat: .05 } }],
          R: [
            { t: 'Reassure moderates you will govern from the center', s: 'reassurance', fx: { NE: .2, nat: .1 } },
            { t: 'Ignore Anderson and keep hitting Carter', s: 'ignoring Anderson', fx: { nat: .1 }, h: true },
            { t: 'Court Anderson\'s backers on taxes', s: 'taxes', fx: { WE: .15, NE: .05 } }]
        },
        hist: { D: 'Carter\'s campaign argued that a vote for Anderson would help elect Reagan.', R: 'Reagan largely ignored Anderson, whose support kept sliding.' } },
      { date: '1980-10-28', kind: 'debate', cat: 'The Cleveland debate', debName: 'only',
        q: 'This is the only debate between you, one week before the election. Are Americans better off than they were four years ago?', fit: 'story',
        hist: { D: 'In Cleveland, Reagan asked voters whether they were better off than four years earlier. He was widely judged the winner, and the race broke his way in the final week.', R: 'In Cleveland, Reagan asked voters whether they were better off than four years earlier. He was widely judged the winner, and the race broke his way in the final week.' } },
      { date: '1980-10-31', cat: 'Coalitions', title: 'The blue-collar vote',
        body: 'Millions of union and Catholic Democrats in the industrial states are wavering. Polls suggest they could decide Ohio, Pennsylvania and Michigan.',
        options: {
          D: [
            { t: 'Remind them of the New Deal and what Democrats built', s: 'the New Deal', fx: { MW: .35 }, h: true },
            { t: 'Campaign with union leaders at plant gates', s: 'the plant gates', fx: { MW: .3, NE: .05 } },
            { t: 'Warn that Reagan would cut Social Security', s: 'Social Security', fx: { nat: .2 } }],
          R: [
            { t: 'Make a direct appeal to working-class Democrats', s: 'the direct appeal', fx: { MW: .35, NE: .1 }, h: true },
            { t: 'Stress patriotism and strength abroad', s: 'patriotism', fx: { nat: .15, SO: .1 } },
            { t: 'Promise to protect Social Security', s: 'Social Security', fx: { nat: .2 } }]
        },
        hist: { D: 'Carter leaned on the old Democratic coalition, but millions of blue-collar "Reagan Democrats" crossed over.', R: 'Reagan made open appeals to blue-collar Democrats, and millions of them crossed over.' } },
      { date: '1980-11-02', cat: 'Iran', title: 'News from Tehran',
        body: 'Iran\'s parliament has set conditions for releasing the 52 American hostages. Election Day falls on the first anniversary of the embassy seizure.',
        options: {
          D: [
            { t: 'Fly back to Washington to manage the crisis', s: 'returning to Washington', fx: { nat: -.1 }, h: true },
            { t: 'Keep campaigning and say a deal may be near', s: 'signaling a deal', risk: { p: .35, win: { nat: .6 }, lose: { nat: -.5 }, winNote: 'Voters gave you credit for progress.', loseNote: 'No deal came, and the hopes you raised turned into frustration.' } },
            { t: 'Say nothing until there is real news', s: 'saying nothing', fx: { nat: -.05 } }],
          R: [
            { t: 'Say you hope for their safe return and stay out of it', s: 'staying out of it', fx: { nat: .2 }, h: true },
            { t: 'Warn Carter not to pay ransom', s: 'the ransom warning', fx: { SO: .15, nat: -.05 } },
            { t: 'Point out it has been a full year', s: 'the anniversary', fx: { nat: .15 } }]
        },
        hist: { D: 'Carter flew back to Washington before dawn on Nov. 2. No deal came, and the anniversary of the hostage-taking fell on Election Day.', R: 'Reagan said little. No deal came, and the anniversary of the hostage-taking fell on Election Day.' } },
      { date: '1980-11-03', cat: 'Closing argument', title: 'Election eve',
        body: 'Your final television address goes out tonight. What is the last thing voters should hear?',
        options: {
          D: [
            { t: 'Warn that Reagan is too risky for the Oval Office', s: 'the risk warning', fx: { NE: .15, nat: .1 } },
            { t: 'Ask for patience to finish what you started', s: 'patience', fx: { nat: .15 }, h: true },
            { t: 'Speak about peace and keeping America out of war', s: 'peace', fx: { nat: .2 } }],
          R: [
            { t: 'Ask voters whether they are better off than four years ago', s: 'the better-off question', fx: { nat: .35 }, h: true },
            { t: 'Paint a hopeful picture of a renewed America', s: 'renewal', fx: { nat: .25 } },
            { t: 'Hammer the hostage crisis and weakness abroad', s: 'the hostages', fx: { SO: .2, nat: .05 } }]
        },
        hist: { D: 'Carter\'s pollster told him on election eve that the race had collapsed. Carter conceded before polls closed on the West Coast.', R: 'Reagan closed on the question he had asked in Cleveland: are you better off than you were four years ago?' } }
    ]
  }
};
