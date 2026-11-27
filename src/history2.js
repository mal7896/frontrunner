// ===================== MORE HISTORICAL SCENARIOS =====================
// Same conventions as history.js. Effects are from the chooser's point of view; h marks the real candidate's choice.
Object.assign(HISTORY, {
  1948: {
    incumbent: 'D', incTerm: 'a full term', incHead: 'Truman wins', vehicle: 'train',
    year: 1948, election: '1948-11-02', inaugural: 'January 20, 1949', ordinal: '34th',
    odds: { D: 'Underdog in the polls', R: 'Favorite in the polls' }, tagline: 'Truman vs. Dewey',
    blurb: 'Truman is behind in every poll, and his party has split three ways.',
    open: 'Labor Day, 1948. President Truman trails in every major poll. Southern Democrats walked out of his convention to back Strom Thurmond, and former vice president Henry Wallace is running on the left. Gov. Thomas Dewey of New York, who ran against Roosevelt four years ago, is campaigning as if the race is already won.',
    startNat: -5.0, tide: [0.4, 0.6, 0.8, 0.8, 0.9, 1.0, 1.1, 1.1, 1.2, 1.5],
    actual: { D: 303, R: 189, other: 39, otherName: 'Thurmond', pvD: 49.51, pvR: 45.12, winner: 'D', third: 'Thurmond, Wallace and others',
      note: 'Truman won 303 electoral votes to Dewey\'s 189. Thurmond won 39, including one Tennessee elector who had been pledged to Truman. Nearly every poll had predicted a Dewey win.' },
    cands: {
      D: { id: 'truman', first: 'Harry S.', last: 'Truman', ini: 'HST', title: 'President of the United States', home: 'MO', perk: 'visits', perkText: 'Whistle-stop campaigner: every stop counts 25% more',
        bio: 'Former Missouri senator who became president when Franklin Roosevelt died in 1945.' },
      R: { id: 'dewey', first: 'Thomas E.', last: 'Dewey', ini: 'TD', title: 'Governor of New York', home: 'NY', perk: 'steady', perkText: 'Disciplined campaign: risky moves backfire less often',
        bio: 'Former racket-busting prosecutor and the 1944 Republican nominee.' }
    },
    vps: {
      D: { id: 'barkley', first: 'Alben W.', last: 'Barkley', ini: 'AB', title: 'Senate Minority Leader from Kentucky', home: 'KY' },
      R: { id: 'warren', first: 'Earl', last: 'Warren', ini: 'EW', title: 'Governor of California', home: 'CA' }
    },
    turns: [
      { date: '1948-09-06', cat: 'Labor Day', title: 'Opening the campaign',
        body: { D: 'Union members are angry about the Taft-Hartley Act, which the Republican Congress passed over your veto. Your staff wants a big labor crowd to start the fall.', R: 'You lead comfortably. Your advisers say the safest campaign is a dignified one that offends nobody.' },
        options: {
          D: [
            { t: 'Speak to a union crowd in Detroit\'s Cadillac Square', s: 'Detroit', fx: { MW: .6 }, h: true },
            { t: 'Start with a farm speech in Iowa', s: 'the farm speech', fx: { MW: .3, WE: .2 } },
            { t: 'Give a radio address from the White House', s: 'the radio address', fx: { nat: .2 } }],
          R: [
            { t: 'Stay in Albany and open the campaign later in September', s: 'waiting', fx: { nat: .1 }, h: true },
            { t: 'Barnstorm the industrial Midwest right away', s: 'the Midwest tour', fx: { MW: .45 } },
            { t: 'Give a hard-hitting speech on the Truman record', s: 'the attack speech', fx: { nat: .15, NE: .1 } }]
        },
        hist: { D: 'Truman opened his fall campaign with a Labor Day speech in Detroit\'s Cadillac Square.', R: 'Dewey waited, and opened his campaign with a speech in Des Moines on Sept. 20.' } },
      { date: '1948-09-18', cat: 'Farm vote', topic: 'farm prices', title: 'Grain prices are falling',
        body: 'Crop prices are dropping, and farmers are short of government storage bins, so they cannot hold their grain off the market until prices recover. Democrats blame the Republican Congress, which limited the government\'s power to provide storage.',
        options: {
          D: [
            { t: 'Tell a farm crowd the Republican Congress stuck a pitchfork in the farmer\'s back', s: 'the pitchfork line', fx: { MW: .4, WE: .3, NE: -.05 }, h: true },
            { t: 'Promise higher price supports', s: 'price supports', fx: { MW: .3, WE: .2 } },
            { t: 'Leave farm policy to the Agriculture Department', s: 'staying out of it', fx: { nat: -.05 } }],
          R: [
            { t: 'Say little about farm policy. The farm states are safely yours', s: 'staying quiet', fx: { MW: -.2, WE: -.15, nat: .05 }, h: true },
            { t: 'Promise to fix the storage shortage', s: 'the storage promise', fx: { MW: .35, WE: .2 } },
            { t: 'Blame the administration for falling prices', s: 'blaming Truman', fx: { MW: .15, WE: .1 } }]
        },
        hist: { D: 'At the National Plowing Match in Dexter, Iowa, on Sept. 18, Truman said the Republican Congress had "stuck a pitchfork in the farmer\'s back." He went on to carry Iowa, which Dewey had won in 1944.', R: 'Dewey mostly took the farm vote for granted. Truman carried Iowa, Ohio and Wisconsin, all states Dewey had won in 1944.' } },
      { date: '1948-09-27', cat: 'The train', topic: 'the train tour', title: 'Crossing the country by rail',
        body: 'Both campaigns are traveling the country by train. The question is how to use the stops.',
        options: {
          D: [
            { t: 'Stop everywhere and talk plainly from the back platform', s: 'the whistle-stops', fx: { nat: .2, MW: .2, WE: .2 }, h: true },
            { t: 'Fewer stops, with longer formal speeches in big cities', s: 'big-city speeches', fx: { NE: .2, MW: .1 } },
            { t: 'Send surrogates to the small towns and stay in Washington', s: 'staying in Washington', fx: { nat: -.1 } }],
          R: [
            { t: 'Keep speeches calm and general, and avoid specifics', s: 'staying general', fx: { nat: .05 }, h: true },
            { t: 'Match Truman stop for stop', s: 'matching Truman', fx: { MW: .2, WE: .15 } },
            { t: 'Make sharp attacks on the administration from the platform', s: 'sharper attacks', fx: { NE: .1, MW: .15, nat: -.05 } }]
        },
        hist: { D: 'Truman crossed the country by train that fall and gave hundreds of short talks from the rear platform. Crowds shouted "Give \'em hell, Harry."', R: 'Dewey\'s speeches were polished and deliberately vague. He talked about national unity and avoided specific promises.' } },
      { date: '1948-10-04', cat: 'Congress', topic: 'the Republican Congress', title: 'The "do-nothing" Congress',
        body: 'The Republican 80th Congress cut taxes over Truman\'s veto and passed the Taft-Hartley labor law. During a special session this summer, it ignored most of what Truman asked for.',
        options: {
          D: [
            { t: 'Run against the Republican Congress at every stop', s: 'running against Congress', fx: { nat: .2, MW: .2 }, h: true },
            { t: 'Run on the New Deal and Roosevelt\'s memory', s: 'the New Deal', fx: { nat: .15, SO: .1 } },
            { t: 'Go after Dewey personally', s: 'attacking Dewey', fx: { nat: -.05, NE: .1 } }],
          R: [
            { t: 'Don\'t defend Congress. Talk about unity instead', s: 'unity', fx: { nat: .1 }, h: true },
            { t: 'Defend the Congress on taxes and spending', s: 'defending Congress', fx: { MW: .1, WE: .1, NE: -.05 } },
            { t: 'Promise to work with Congress to clean up Washington', s: 'cleaning up Washington', fx: { nat: .15 } }]
        },
        hist: { D: 'Attacks on the "do-nothing" Republican Congress became the theme of Truman\'s campaign.', R: 'Dewey rarely defended the Republican Congress, so Truman\'s attacks mostly went unanswered.' } },
      { date: '1948-10-09', cat: 'Berlin', topic: 'Berlin', title: 'The Berlin airlift',
        body: 'Soviet forces have blockaded West Berlin since June, and American planes are flying in food and coal. Some of Truman\'s advisers want to send Chief Justice Fred Vinson to Moscow to talk with Stalin directly.',
        options: {
          D: [
            { t: 'Send Vinson to Moscow', s: 'the Vinson mission', note: 'A gamble', risk: { p: .35, win: { nat: .5 }, lose: { nat: -.4 }, winNote: 'Voters welcomed the peace effort.', loseNote: 'Allies and your own State Department objected, and the plan looked improvised.' } },
            { t: 'Drop the idea and stand firm behind the airlift', s: 'standing firm', fx: { nat: .3 }, h: true },
            { t: 'Give a speech on peace through strength', s: 'the peace speech', fx: { nat: .15, SO: .1 } }],
          R: [
            { t: 'Back the airlift and keep foreign policy bipartisan', s: 'backing the airlift', fx: { nat: .2 }, h: true },
            { t: 'Call Truman\'s handling of Moscow erratic', s: 'the erratic charge', fx: { nat: .05, NE: .1 } },
            { t: 'Promise a tougher line on the Soviets', s: 'a tougher line', fx: { nat: .1, MW: .1 } }]
        },
        hist: { D: 'Truman dropped the Vinson mission after Secretary of State George Marshall objected, but the plan leaked and made the administration look disorganized. The blockade lasted until May 1949.', R: 'Dewey backed the airlift and kept foreign policy largely out of the campaign, as his adviser John Foster Dulles recommended.' } },
      { date: '1948-10-12', cat: 'On the train', topic: 'the engineer flap', title: 'The engineer',
        body: { D: 'At a stop in Beaucoup, Ill., Dewey\'s train jerked backward toward the crowd. Dewey told the crowd over the loudspeaker that the engineer was a lunatic who ought to be shot at sunrise. Railroad workers are not amused.', R: 'At a stop in Beaucoup, Ill., your train jerked backward toward the crowd. You said into the microphone that the engineer was a lunatic who ought to be shot at sunrise. Reporters wrote it down.' },
        options: {
          D: [
            { t: 'Joke about it from the back of your own train', s: 'the joke', fx: { nat: .2, MW: .1 } },
            { t: 'Have union allies remind workers what Dewey said', s: 'the union reminder', fx: { MW: .25 } },
            { t: 'Let it go', s: 'letting it go', fx: { nat: 0 } }],
          R: [
            { t: 'Laugh it off and move on', s: 'laughing it off', fx: { nat: -.05 } },
            { t: 'Apologize to the engineer and the railroad unions', s: 'the apology', fx: { nat: .2, MW: .05 } },
            { t: 'Say nothing', s: 'saying nothing', fx: { nat: -.15 } }]
        },
        hist: { D: 'The remark became one of the most repeated stories of the campaign. Democrats used it to paint Dewey as cold.', R: 'The remark became one of the most repeated stories of the campaign and fed Dewey\'s image as stiff and aloof.' } },
      { date: '1948-10-18', cat: 'The polls', topic: 'the poll gap', title: 'The pollsters call it',
        body: 'Most national polls show Dewey well ahead. One leading pollster stopped polling in September, saying the race was over. Newspapers are speculating about Dewey\'s Cabinet.',
        options: {
          D: [
            { t: 'Tell every crowd the polls are wrong, and keep up the pace', s: 'ignoring the polls', fx: { nat: .2 }, h: true },
            { t: 'Ease up and save your voice for the last week', s: 'easing up', fx: { nat: -.1 } },
            { t: 'Travel less and buy more radio time', s: 'radio time', fx: { nat: .1, NE: .1 } }],
          R: [
            { t: 'Coast. Avoid mistakes and protect the lead', s: 'coasting', fx: { nat: -.05 }, h: true },
            { t: 'Campaign hard anyway', s: 'campaigning hard', fx: { nat: .2, MW: .1 } },
            { t: 'Start talking about your Cabinet', s: 'naming a Cabinet', fx: { nat: -.2 } }]
        },
        hist: { D: 'Truman kept telling crowds the polls were wrong. Pollsters later found that many voters made up their minds in the final two weeks, after most polling had stopped.', R: 'Dewey\'s campaign played it safe. Pollster Elmo Roper had stopped polling in September, calling Dewey\'s election all but certain.' } },
      { date: '1948-10-22', cat: 'The left', topic: 'Henry Wallace', title: 'Henry Wallace',
        body: 'Former Vice President Henry Wallace\'s Progressive Party is drawing liberal and union voters, especially in New York and Michigan. The Communist Party backs him, and critics say it has too much say in his campaign.',
        options: {
          D: [
            { t: 'Tell liberals that a vote for Wallace is a vote for Dewey', s: 'the wasted-vote pitch', fx: { NE: .2, MW: .15 } },
            { t: 'Attack the Communist support behind Wallace', s: 'attacking his backers', fx: { nat: .15, NE: .1 }, h: true },
            { t: 'Ignore Wallace', s: 'ignoring him', fx: { NE: -.15 } }],
          R: [
            { t: 'Let Wallace split the Democratic vote', s: 'staying out of it', fx: { NE: .15 }, h: true },
            { t: 'Say Truman is soft on Communism', s: 'the soft-on-Communism charge', fx: { nat: .05, MW: .1 } },
            { t: 'Court liberal Republicans tempted by Wallace', s: 'courting liberals', fx: { NE: .1, WE: .1 } }]
        },
        hist: { D: 'Truman attacked the Communist support behind Wallace. Wallace won 2.4 percent nationally, enough to tip New York, Michigan and Maryland to Dewey.', R: 'Wallace won 2.4 percent nationally and drew enough votes in New York, Michigan and Maryland to tip them to Dewey.' } },
      { date: '1948-10-29', cat: 'Civil rights', topic: 'civil rights', title: 'Civil rights and the cities',
        body: 'In July, Truman ordered the armed forces desegregated, and his civil rights program helped split the party. Black voters in Northern cities could decide close states like New York, Illinois and Ohio.',
        options: {
          D: [
            { t: 'Campaign in Harlem and defend your civil rights program', s: 'Harlem', fx: { NE: .3, MW: .3, SO: -.2 }, h: true },
            { t: 'Talk about the economy and avoid civil rights', s: 'avoiding it', fx: { SO: .2, NE: -.15, MW: -.15 } },
            { t: 'Promise new civil rights laws in a second term', s: 'new laws', fx: { NE: .2, MW: .15, SO: -.25 } }],
          R: [
            { t: 'Point to the Republican civil rights platform', s: 'the platform', fx: { NE: .2, MW: .2, SO: -.1 } },
            { t: 'Stay quiet on civil rights', s: 'staying quiet', fx: { nat: -.05 } },
            { t: 'Court Southern Democrats unhappy with Truman', s: 'the Southern pitch', fx: { SO: .3, NE: -.15, MW: -.1 } }]
        },
        hist: { D: 'On Oct. 29 Truman spoke in Harlem, the first president to campaign there. Black voters gave him crucial margins in Ohio, Illinois and California.', R: 'Dewey, who had signed a state anti-discrimination law in New York, said little about civil rights during the fall campaign.' } },
      { date: '1948-11-01', cat: 'Closing argument', title: 'Election eve',
        body: { D: 'Tonight you\'ll speak to the country by radio from your home in Independence, Missouri.', R: 'Tonight is your last radio appeal. Some papers are already writing about your Cabinet.' },
        options: {
          D: [
            { t: 'Ask working families not to let the Republicans undo the New Deal', s: 'protecting the New Deal', fx: { nat: .3, MW: .1 }, h: true },
            { t: 'A short, plain thank-you and a request for their trust', s: 'the thank-you', fx: { nat: .2 } },
            { t: 'One last swing at the Republican Congress', s: 'the last swing', fx: { MW: .2, nat: .1 } }],
          R: [
            { t: 'A dignified call for national unity', s: 'unity', fx: { nat: .2 }, h: true },
            { t: 'A plan for your first hundred days', s: 'the hundred days', fx: { nat: .15 } },
            { t: 'A warning about inflation under Truman', s: 'inflation', fx: { nat: .15, MW: .1 } }]
        },
        hist: { D: 'Truman spoke by radio from Independence, then went to bed early on election night. He woke up to the news that he had won.', R: 'Dewey closed on unity and confidence. The Chicago Daily Tribune went to press with the headline "Dewey Defeats Truman."' } }
    ]
  },

  1968: {
    incumbent: null, vehicle: 'plane',
    year: 1968, election: '1968-11-05', inaugural: 'January 20, 1969', ordinal: '37th',
    odds: { D: 'Nearly impossible', R: 'Heavy favorite' }, tagline: 'Nixon vs. Humphrey',
    blurb: 'Humphrey starts far behind Nixon, and George Wallace is strong in the Deep South.',
    open: 'Labor Day, 1968. The Democratic convention in Chicago ended last week with police clubbing protesters in the streets. Vice President Hubert Humphrey won the nomination but is tied to President Johnson\'s war in Vietnam, and he trails Richard Nixon by double digits. George Wallace, the segregationist former governor of Alabama, is running as a third-party candidate and polling near 20 percent.',
    startNat: -12.0, tide: [-0.5, -0.8, 1.2, 1.6, 1.6, 1.7, 1.7, 1.9, 1.8, 1.1],
    actual: { D: 191, R: 301, other: 46, otherName: 'Wallace', pvD: 42.72, pvR: 43.42, winner: 'R', third: 'Wallace and others',
      note: 'Nixon won 301 electoral votes to Humphrey\'s 191. Wallace won 46, including one North Carolina elector who had been pledged to Nixon. Nixon\'s popular-vote margin was less than one point.' },
    cands: {
      D: { id: 'humphrey', first: 'Hubert H.', last: 'Humphrey', ini: 'HHH', title: 'Vice President of the United States', home: 'MN', perk: 'visits', perkText: 'Tireless talker: every stop counts 25% more',
        bio: 'Former Minneapolis mayor and senator who fought for the 1948 civil rights plank.' },
      R: { id: 'nixon68', first: 'Richard', last: 'Nixon', ini: 'RN', title: 'Former Vice President', home: 'NY', perk: 'steady', perkText: 'Disciplined campaign: risky moves backfire less often',
        bio: 'Eisenhower\'s vice president, back eight years after losing to Kennedy.' }
    },
    vps: {
      D: { id: 'muskie', first: 'Edmund', last: 'Muskie', ini: 'EM', title: 'U.S. Senator from Maine', home: 'ME' },
      R: { id: 'agnew', first: 'Spiro', last: 'Agnew', ini: 'SA', title: 'Governor of Maryland', home: 'MD' }
    },
    turns: [
      { date: '1968-09-02', cat: 'Labor Day', title: 'Opening the campaign',
        body: { D: 'Your campaign is broke and your party is divided after Chicago. Labor Day is the traditional start of the fall campaign.', R: 'You lead comfortably. Your staff wants big, controlled events and as few unscripted moments as possible.' },
        options: {
          D: [
            { t: 'March in New York City\'s Labor Day parade', s: 'the parade', fx: { NE: .3, nat: .05 }, h: true },
            { t: 'Open in the industrial Midwest with union leaders', s: 'the union kickoff', fx: { MW: .45 } },
            { t: 'Go home to Minnesota and regroup', s: 'regrouping', fx: { nat: .1, MW: .1 } }],
          R: [
            { t: 'Open with a big motorcade through Chicago', s: 'the Chicago motorcade', fx: { MW: .35, nat: .05 }, h: true },
            { t: 'Hold televised question-and-answer sessions with selected voters', s: 'the TV panels', fx: { nat: .25 } },
            { t: 'Start in the South to keep voters from drifting to Wallace', s: 'the Southern start', fx: { SO: .4, NE: -.1 } }]
        },
        hist: { D: 'Humphrey opened his campaign in New York\'s Labor Day parade. His campaign was so short of money that it went weeks without television ads.', R: 'Nixon opened his campaign on Sept. 4 with a motorcade through downtown Chicago, a week after the Democrats\' convention there.' } },
      { date: '1968-09-16', cat: 'Protest', topic: 'the protests', title: 'Hecklers at every stop',
        body: { D: 'Antiwar protesters follow you from city to city and chant through your speeches. They want you to break with President Johnson on Vietnam.', R: 'Antiwar protesters are drowning out Humphrey\'s speeches. Your crowds are calm and your schedule runs on time.' },
        options: {
          D: [
            { t: 'Keep defending the administration and wait for it to pass', s: 'waiting it out', fx: { nat: -.2 }, h: true },
            { t: 'Take on the hecklers directly from the stage', s: 'taking them on', note: 'A gamble', risk: { p: .5, win: { nat: .3 }, lose: { nat: -.3 }, winNote: 'The crowd rallied behind you.', loseNote: 'The shouting match led the evening news.' } },
            { t: 'Cancel outdoor rallies for now', s: 'canceling rallies', fx: { nat: -.05 } }],
          R: [
            { t: 'Stay on your law-and-order message', s: 'law and order', fx: { nat: .2, SO: .1 }, h: true },
            { t: 'Stay quiet and let Humphrey\'s troubles speak for themselves', s: 'staying quiet', fx: { nat: .15 } },
            { t: 'Reach out to younger voters', s: 'courting young voters', fx: { NE: .1, WE: .1, nat: -.05 } }]
        },
        hist: { D: 'Through September, protesters dogged Humphrey\'s appearances and his poll numbers stayed low.', R: 'Nixon\'s campaign relied on controlled events and paid television, and his law-and-order message drew strong support.' } },
      { date: '1968-09-30', cat: 'Vietnam', topic: 'Vietnam', title: 'The speech on the war',
        body: { D: 'Your aides are drafting a nationally televised speech on Vietnam. The question is whether to break, even partly, with President Johnson.', R: 'Humphrey is about to give a major speech on Vietnam. You have said you will end the war but have not given details.' },
        options: {
          D: [
            { t: 'Say you would stop bombing North Vietnam as an acceptable risk for peace', s: 'the bombing halt', fx: { nat: .5, NE: .2, WE: .1 }, h: true },
            { t: 'Stand firmly with President Johnson', s: 'standing with Johnson', fx: { nat: -.2, SO: .1 } },
            { t: 'Call for a cease-fire without breaking from Johnson', s: 'a cease-fire', fx: { nat: .2 } }],
          R: [
            { t: 'Promise to end the war with honor, without giving details', s: 'no details', fx: { nat: .2 }, h: true },
            { t: 'Say Humphrey is undercutting the negotiations', s: 'the undercutting charge', fx: { nat: .1, SO: .1 } },
            { t: 'Call for a tougher military approach', s: 'a tougher war', fx: { SO: .25, NE: -.2 } }]
        },
        hist: { D: 'In Salt Lake City on Sept. 30, Humphrey said he would stop the bombing as "an acceptable risk for peace." Antiwar Democrats started coming back, and so did his donors.', R: 'Nixon said he would end the war and "win the peace" but would not give specifics, saying he did not want to undercut the talks in Paris.' } },
      { date: '1968-10-03', cat: 'Wallace', topic: 'Wallace', title: 'Wallace picks a running mate',
        body: 'George Wallace has chosen retired Air Force Gen. Curtis LeMay as his running mate. At their first news conference, LeMay said Americans have a "phobia" about nuclear weapons.',
        options: {
          D: [
            { t: 'Warn that Wallace and LeMay would be reckless with nuclear weapons', s: 'the nuclear warning', fx: { nat: .2, MW: .1 } },
            { t: 'Send union leaders after Wallace voters in the factories', s: 'the union push', fx: { MW: .35 } },
            { t: 'Ignore Wallace and stay on Nixon', s: 'staying on Nixon', fx: { nat: .05 } }],
          R: [
            { t: 'Argue that a vote for Wallace only helps Humphrey', s: 'the wasted-vote pitch', fx: { SO: .35, nat: .05 }, h: true },
            { t: 'Borrow Wallace\'s themes', s: 'borrowing his themes', fx: { SO: .3, NE: -.15 } },
            { t: 'Ignore Wallace', s: 'ignoring him', fx: { SO: -.1, nat: .05 } }]
        },
        hist: { D: 'LeMay\'s remarks hurt Wallace, whose support began a slow decline in October.', R: 'With help from Strom Thurmond in the South, Nixon argued that a vote for Wallace was a wasted vote. LeMay\'s remarks hurt Wallace\'s campaign.' } },
      { date: '1968-10-09', cat: 'Unions', topic: 'union voters', title: 'The factory floor',
        body: 'Polls show many union members in the industrial Midwest are drawn to George Wallace. Union leaders are alarmed.',
        options: {
          D: [
            { t: 'Back an all-out union drive to bring members home', s: 'the union drive', fx: { MW: .45, NE: .1 }, h: true },
            { t: 'Campaign at plant gates yourself', s: 'the plant gates', fx: { MW: .3 } },
            { t: 'Stand on civil rights and accept the losses', s: 'standing on principle', fx: { NE: .2, MW: -.1, SO: -.2 } }],
          R: [
            { t: 'Speak to the "forgotten Americans"', s: 'the forgotten Americans', fx: { MW: .3, nat: .05 }, h: true },
            { t: 'Stay on law and order', s: 'law and order', fx: { nat: .15, SO: .1 } },
            { t: 'Talk about inflation and taxes', s: 'inflation', fx: { MW: .15, nat: .1 } }]
        },
        hist: { D: 'The AFL-CIO and the United Auto Workers ran a huge drive aimed at union members leaning toward Wallace, and many came back to Humphrey.', R: 'Nixon kept speaking to the "forgotten Americans," the "non-shouters," a theme from his acceptance speech.' } },
      { date: '1968-10-15', cat: 'Debates', topic: 'the debate fight', title: 'A challenge to debate',
        body: { D: 'Nixon won\'t debate you. Your campaign could keep pressing, or put its scarce money elsewhere.', R: 'Humphrey keeps challenging you to debate. You lost ground after the debates in 1960.' },
        options: {
          D: [
            { t: 'Keep challenging Nixon at every stop', s: 'pressing the challenge', fx: { nat: .15 }, h: true },
            { t: 'Buy television time for a one-man show', s: 'the TV special', fx: { nat: .2 } },
            { t: 'Drop it and campaign', s: 'dropping it', fx: { nat: .05 } }],
          R: [
            { t: 'Decline to debate', s: 'declining', fx: { nat: .05 }, h: true },
            { t: 'Agree to debate', s: 'agreeing', note: 'A gamble', risk: { p: .5, win: { nat: .4 }, lose: { nat: -.4 }, winNote: 'You looked confident and in command.', loseNote: 'Humphrey got the exposure he badly needed.' } },
            { t: 'Agree only if Wallace is included', s: 'the Wallace condition', fx: { nat: .1, SO: .1 } }]
        },
        hist: { D: 'Humphrey challenged Nixon to debate all fall. Nixon never agreed, and there were no presidential debates in 1968.', R: 'Nixon declined, and there were no presidential debates in 1968. The equal-time law, which would have required including Wallace, was never suspended.' } },
      { date: '1968-10-21', cat: 'Running mates', topic: 'the running mates', title: 'Muskie and Agnew',
        body: 'Polls show voters like Edmund Muskie a lot more than Spiro Agnew, whose offhand remarks have given Nixon several bad news days.',
        options: {
          D: [
            { t: 'Make the running mates an issue in your ads', s: 'the Agnew ads', fx: { nat: .2 }, h: true },
            { t: 'Send Muskie to talk with student protesters', s: 'Muskie and the students', fx: { NE: .2, nat: .05 } },
            { t: 'Stay on Nixon', s: 'staying on Nixon', fx: { nat: .1 } }],
          R: [
            { t: 'Keep Agnew on a tighter script', s: 'a tighter script', fx: { nat: .15 } },
            { t: 'Send Agnew to the border states and suburbs', s: 'the border states', fx: { SO: .2, nat: -.1 } },
            { t: 'Defend Agnew forcefully', s: 'defending Agnew', fx: { nat: -.05, SO: .1 } }]
        },
        hist: { D: 'Humphrey\'s campaign ran a television ad of a man laughing harder and harder at the words "Agnew for Vice President?"', R: 'Muskie was widely seen as the stronger running mate, and Humphrey\'s campaign made Agnew\'s gaffes an issue in its ads.' } },
      { date: '1968-10-25', cat: 'Crime', topic: 'law and order', title: 'Law and order',
        body: 'After a year of assassinations, riots in dozens of cities and campus unrest, voters rank crime and disorder near the top of their worries.',
        options: {
          D: [
            { t: 'Pair order with justice: more police and more help for the cities', s: 'order and justice', fx: { nat: .2, NE: .1 }, h: true },
            { t: 'Defend the Johnson record', s: 'the Johnson record', fx: { NE: .15, MW: -.1, SO: -.15 } },
            { t: 'Talk tough on crime', s: 'talking tough', fx: { MW: .2, SO: .15, NE: -.15 } }],
          R: [
            { t: 'Make law and order the center of your campaign', s: 'law and order', fx: { MW: .2, SO: .25, NE: -.1 }, h: true },
            { t: 'Promise a new attorney general', s: 'a new attorney general', fx: { nat: .2 } },
            { t: 'Talk about jobs and investment in the cities', s: 'urban jobs', fx: { NE: .15, nat: .05 } }]
        },
        hist: { D: 'Humphrey argued that order and justice had to go together, but crime was an issue that favored Nixon and Wallace.', R: 'Law and order was a central theme of Nixon\'s campaign. He also promised to replace Attorney General Ramsey Clark.' } },
      { date: '1968-10-31', cat: 'Vietnam', topic: 'the bombing halt', title: 'The bombing halt',
        body: 'President Johnson has announced a halt to the bombing of North Vietnam and expanded peace talks in Paris. Polls show the race closing fast.',
        options: {
          D: [
            { t: 'Welcome the halt and let it speak for itself', s: 'welcoming it', fx: { nat: .3 }, h: true },
            { t: 'Remind voters you called for it in Salt Lake City', s: 'claiming credit', fx: { nat: .15, NE: .1 } },
            { t: 'Stay on domestic issues', s: 'domestic issues', fx: { nat: .05 } }],
          R: [
            { t: 'Say you support the halt and hope for peace', s: 'supporting it', fx: { nat: .15 }, h: true },
            { t: 'Question the timing', s: 'questioning the timing', fx: { nat: -.05, SO: .15 } },
            { t: 'Say nothing', s: 'saying nothing', fx: { nat: 0 } }]
        },
        hist: { D: 'Johnson announced the halt on Oct. 31. Two days later, South Vietnam\'s president said his government would not take part in the Paris talks, and Humphrey\'s momentum stalled.', R: 'Nixon said he supported the halt. Two days later South Vietnam said it would not join the talks, which blunted the boost for Humphrey.' } },
      { date: '1968-11-04', cat: 'Closing argument', title: 'Election eve',
        body: 'Both campaigns have bought hours of television for election-eve telethons. The polls say it is too close to call.',
        options: {
          D: [
            { t: 'An unscripted telethon with Muskie taking viewers\' calls', s: 'the telethon', fx: { nat: .3 }, h: true },
            { t: 'One last warning about Nixon and Wallace', s: 'the last warning', fx: { nat: .1, MW: .15 } },
            { t: 'A final appeal to Kennedy and McCarthy supporters', s: 'the appeal to the left', fx: { NE: .25, WE: .1 } }],
          R: [
            { t: 'A controlled telethon answering viewers\' questions', s: 'the telethon', fx: { nat: .25 }, h: true },
            { t: 'A final appeal on law and order', s: 'law and order', fx: { SO: .2, MW: .1 } },
            { t: 'A promise to bring the country together', s: 'bringing us together', fx: { nat: .25 } }]
        },
        hist: { D: 'Humphrey and Muskie hosted an election-eve telethon. The race ended up the closest since 1960.', R: 'Nixon answered viewers\' questions in his own election-eve telethon. He won the popular vote by less than one point.' } }
    ]
  },

  1992: {
    incumbent: 'R', incTerm: 'a second term', incHead: 'Bush re-elected', vehicle: 'bus',
    year: 1992, election: '1992-11-03', inaugural: 'January 20, 1993', ordinal: '42nd',
    odds: { D: 'Heavy favorite', R: 'Nearly impossible' }, tagline: 'Clinton vs. Bush',
    blurb: 'A weak economy has put President Bush behind Bill Clinton, and Ross Perot may get back in.',
    open: 'Labor Day, 1992. Eighteen months after the Gulf War, President Bush\'s approval rating has fallen with the economy. Bill Clinton, the governor of Arkansas, leads after a strong convention. Ross Perot, the Texas billionaire who dropped out in July, is hinting that he may get back in.',
    startNat: 11.0, tide: [-0.2, -0.4, -0.6, -0.4, -0.3, -0.5, -0.6, -0.8, -0.8, -0.8],
    actual: { D: 370, R: 168, other: 0, pvD: 43.01, pvR: 37.45, winner: 'D', third: 'Perot and others',
      note: 'Clinton won 370 electoral votes to Bush\'s 168. Ross Perot won 18.9 percent of the popular vote, the most for a third-party candidate since 1912, but no electoral votes.' },
    cands: {
      D: { id: 'clinton', first: 'Bill', last: 'Clinton', ini: 'BC', title: 'Governor of Arkansas', home: 'AR', perk: 'debate', perkText: 'Town-hall natural: bigger wins in debates',
        bio: 'Five-term governor, Rhodes scholar and a New Democrat who calls himself the candidate of change.' },
      R: { id: 'bush41', first: 'George H. W.', last: 'Bush', ini: 'GB', title: 'President of the United States', home: 'TX', perk: 'incumbent', perkText: 'The power of the office: your opponent\'s good weeks hurt you less',
        bio: 'Former vice president and CIA director who led the coalition in the Gulf War.' }
    },
    vps: {
      D: { id: 'gore92', first: 'Al', last: 'Gore', ini: 'AG', title: 'U.S. Senator from Tennessee', home: 'TN' },
      R: { id: 'quayle', first: 'Dan', last: 'Quayle', ini: 'DQ', title: 'Vice President of the United States', home: 'IN' }
    },
    turns: [
      { date: '1992-09-07', cat: 'Labor Day', title: 'Opening the fall campaign',
        body: { D: 'You lead. Your campaign\'s war room in Little Rock has one rule taped to the wall: keep talking about the economy.', R: 'You trail by double digits. Your advisers are split between running on your foreign policy record and laying out a new economic plan.' },
        options: {
          D: [
            { t: 'Another bus tour through the industrial Midwest with Al Gore', s: 'the bus tour', fx: { MW: .45 } },
            { t: 'Open in the South to cut into Bush\'s base', s: 'the Southern start', fx: { SO: .4 } },
            { t: 'Give a national speech on the economy', s: 'the economy speech', fx: { nat: .25 } }],
          R: [
            { t: 'Run on your foreign policy record', s: 'foreign policy', fx: { nat: .1, NE: .05 } },
            { t: 'Lay out an economic agenda for a second term', s: 'the economic agenda', fx: { nat: .2, MW: .1 }, h: true },
            { t: 'Go after Clinton\'s record in Arkansas', s: 'the Arkansas record', fx: { SO: .2, nat: .05 } }]
        },
        hist: { D: 'Clinton\'s campaign kept a tight focus on the economy. A sign in its Little Rock headquarters read "The economy, stupid."', R: 'On Sept. 10 Bush laid out an "Agenda for American Renewal" in a speech to the Detroit Economic Club.' } },
      { date: '1992-09-14', cat: 'Vietnam', topic: 'the draft', title: 'The draft question',
        body: 'Questions about how Clinton avoided the draft during the Vietnam War are back in the news. The Bush campaign says it is a matter of honesty.',
        options: {
          D: [
            { t: 'Answer the questions and steer back to the economy', s: 'answering and moving on', fx: { nat: .1 }, h: true },
            { t: 'Call it mudslinging', s: 'the mudslinging charge', fx: { nat: .05, NE: .1 } },
            { t: 'Refuse to discuss it further', s: 'refusing to discuss it', fx: { nat: -.15 } }],
          R: [
            { t: 'Make it a question of character and trust', s: 'character and trust', fx: { nat: .1, SO: .15 }, h: true },
            { t: 'Let surrogates raise it while you talk about the economy', s: 'surrogates', fx: { nat: .15 } },
            { t: 'Drop the subject', s: 'dropping it', fx: { nat: .05 } }]
        },
        hist: { D: 'Clinton answered the questions and kept steering back to the economy. The issue never cost him the lead.', R: 'Bush made trust and character central to his campaign, but the economy stayed voters\' top concern.' } },
      { date: '1992-10-01', cat: 'Ross Perot', topic: 'Perot', title: 'Perot is back',
        body: 'Ross Perot has re-entered the race eleven weeks after quitting. He is paying for his campaign himself, and his message is the federal deficit.',
        options: {
          D: [
            { t: 'Court Perot voters on the deficit and on change', s: 'courting Perot voters', fx: { nat: .15, WE: .15 }, h: true },
            { t: 'Ignore him and stay on Bush', s: 'staying on Bush', fx: { nat: .05 } },
            { t: 'Call Perot a quitter', s: 'the quitter line', fx: { nat: -.1 } }],
          R: [
            { t: 'Court Perot voters on spending and the deficit', s: 'courting Perot voters', fx: { nat: .15, WE: .1 }, h: true },
            { t: 'Hope Perot splits the vote against you', s: 'waiting', fx: { nat: .05 } },
            { t: 'Go after Perot', s: 'attacking Perot', fx: { nat: -.1 } }]
        },
        hist: { D: 'Both campaigns had sent teams to Dallas to court Perot before he re-entered. Clinton welcomed him back and kept courting his voters.', R: 'Both campaigns had sent teams to Dallas to court Perot. Exit polls later suggested he drew about evenly from Bush and Clinton.' } },
      { date: '1992-10-11', kind: 'debate', cat: 'First debate', debName: 'first',
        q: 'This is the first debate, in St. Louis, with Ross Perot on stage too. Why should voters trust you with the economy?', fit: 'plan',
        hist: { D: 'At the first three-way presidential debate, Perot\'s one-liners drew the biggest laughs, and his support began to climb.', R: 'At the first three-way presidential debate, Perot\'s one-liners drew the biggest laughs, and his support began to climb.' } },
      { date: '1992-10-13', cat: 'Running mates', topic: 'the running mates', title: 'The vice presidential debate',
        body: 'Al Gore, Dan Quayle and Perot\'s running mate, retired Adm. James Stockdale, meet in Atlanta tonight.',
        options: {
          D: [
            { t: 'Have Gore hammer the economic record', s: 'the economic record', fx: { nat: .15, MW: .1 } },
            { t: 'Have Gore talk about the environment and the future', s: 'the future', fx: { WE: .2, NE: .1 } },
            { t: 'Have Gore stay calm and above it', s: 'staying calm', fx: { nat: .15 } }],
          R: [
            { t: 'Have Quayle go after Clinton\'s trustworthiness', s: 'the trust attack', fx: { nat: .1, SO: .15 }, h: true },
            { t: 'Have Quayle defend the record', s: 'the record', fx: { nat: .05 } },
            { t: 'Have Quayle talk about family values', s: 'family values', fx: { SO: .25, NE: -.1 } }]
        },
        hist: { D: 'Gore and Quayle traded attacks for most of the night. Stockdale\'s opening, "Who am I? Why am I here?", was the line most viewers remembered.', R: 'Quayle went on the attack, pressing Gore on Clinton\'s trustworthiness. Stockdale\'s opening, "Who am I? Why am I here?", was the line most viewers remembered.' } },
      { date: '1992-10-15', kind: 'debate', cat: 'Town-hall debate', debName: 'town-hall',
        q: 'A woman in the audience asks how the national debt has affected each of you personally.', fit: 'story',
        hist: { D: 'In Richmond, Bush was caught glancing at his watch and stumbled on the debt question. Clinton walked toward the woman and talked about people he knew in Arkansas who had lost their jobs.', R: 'In Richmond, Bush was caught glancing at his watch and stumbled on the debt question. Clinton walked toward the woman and answered with stories from Arkansas.' } },
      { date: '1992-10-20', cat: 'Taxes', topic: 'taxes', title: '"Read my lips"',
        body: 'In 1988 Bush promised, "Read my lips: no new taxes." In 1990 he agreed to a budget deal that raised them. Clinton\'s ads are replaying the promise.',
        options: {
          D: [
            { t: 'Keep replaying the broken promise', s: 'replaying the promise', fx: { nat: .2 }, h: true },
            { t: 'Promise a middle-class tax cut', s: 'the tax cut', fx: { nat: .15, MW: .1 } },
            { t: 'Talk about your own plan to cut the deficit', s: 'the deficit plan', fx: { nat: .1, WE: .1 } }],
          R: [
            { t: 'Call the 1990 deal a mistake and promise tax cuts', s: 'the apology', fx: { nat: .1, MW: .05 } },
            { t: 'Warn that Clinton will raise middle-class taxes', s: 'the tax warning', fx: { nat: .2, SO: .1 }, h: true },
            { t: 'Defend the budget deal', s: 'defending the deal', fx: { nat: -.1, NE: .05 } }]
        },
        hist: { D: 'Clinton\'s campaign used the 1988 tax pledge against Bush all fall.', R: 'Bush had said in March that agreeing to the tax increase was a mistake. In the fall he warned that Clinton would raise taxes on the middle class.' } },
      { date: '1992-10-27', cat: 'Economy', topic: 'the economy', title: 'A good economic report',
        body: 'The government says the economy grew at a 2.7 percent annual rate over the summer, much faster than expected. Bush says the recovery is here.',
        options: {
          D: [
            { t: 'Say most families don\'t feel it yet', s: 'not feeling it yet', fx: { nat: .15 }, h: true },
            { t: 'Welcome the news but stay on jobs', s: 'staying on jobs', fx: { nat: .1, MW: .1 } },
            { t: 'Ignore it', s: 'ignoring it', fx: { nat: -.05 } }],
          R: [
            { t: 'Make the report the center of your closing campaign', s: 'the good numbers', fx: { nat: .25 }, h: true },
            { t: 'Pair it with a warning about Clinton\'s spending', s: 'the spending warning', fx: { nat: .15, SO: .1 } },
            { t: 'Hold a rally to celebrate', s: 'the celebration', fx: { nat: .1 } }]
        },
        hist: { D: 'Clinton argued that most families hadn\'t felt the recovery yet. The race tightened in the last week.', R: 'Bush seized on the report as proof the economy had turned. The race tightened in the last week.' } },
      { date: '1992-10-30', cat: 'Iran-contra', topic: 'Iran-contra', title: 'A new indictment',
        body: 'Four days before the election, the Iran-contra prosecutor has filed a new indictment of former Defense Secretary Caspar Weinberger. A note in the filing suggests Bush knew more about the arms-for-hostages deal than he has said.',
        options: {
          D: [
            { t: 'Say it raises questions about Bush\'s honesty', s: 'the honesty question', fx: { nat: .2 }, h: true },
            { t: 'Leave it to the press', s: 'leaving it alone', fx: { nat: .1 } },
            { t: 'Stay on the economy', s: 'the economy', fx: { nat: .05 } }],
          R: [
            { t: 'Call it a partisan attack timed for the election', s: 'the partisan charge', fx: { nat: .05, SO: .1 }, h: true },
            { t: 'Release your own records to answer it', s: 'releasing records', note: 'A gamble', risk: { p: .5, win: { nat: .3 }, lose: { nat: -.3 }, winNote: 'The records backed you up.', loseNote: 'The records raised new questions.' } },
            { t: 'Say nothing', s: 'saying nothing', fx: { nat: -.15 } }]
        },
        hist: { D: 'The indictment stalled Bush\'s late gains, and Clinton\'s campaign used it to question his credibility.', R: 'Bush\'s campaign called the indictment politically motivated, and many on his staff believed it stopped his late momentum. Bush pardoned Weinberger that December.' } },
      { date: '1992-11-02', cat: 'Closing argument', title: 'The last day',
        body: { D: 'You are planning one final push: more than a day of nonstop rallies across the country.', R: 'The race has tightened. One day left to make the case.' },
        options: {
          D: [
            { t: 'A final nonstop marathon through the battleground states', s: 'the marathon', fx: { nat: .2, MW: .1 }, h: true },
            { t: 'A closing ad about change', s: 'the change ad', fx: { nat: .25 } },
            { t: 'Close on the economy', s: 'the economy', fx: { nat: .2, MW: .1 } }],
          R: [
            { t: 'Close on trust: who do you want in the White House in a crisis?', s: 'trust', fx: { nat: .2 }, h: true },
            { t: 'Close on the recovering economy', s: 'the recovery', fx: { nat: .2 } },
            { t: 'Finish with a rally at home in Texas', s: 'the Texas rally', fx: { SO: .2 } }]
        },
        hist: { D: 'Clinton ended with a cross-country marathon of rallies and won with 43 percent of the vote.', R: 'Bush closed on trust and experience. He won 37.4 percent, the lowest share for a sitting president since William Howard Taft in 1912.' } }
    ]
  },

  2000: {
    incumbent: null, vehicle: 'plane',
    year: 2000, election: '2000-11-07', inaugural: 'January 20, 2001', ordinal: '43rd',
    odds: { D: 'Toss-up', R: 'Toss-up' }, tagline: 'Bush vs. Gore',
    blurb: 'Vice President Al Gore and Texas Gov. George W. Bush are close all fall.',
    open: 'Labor Day, 2000. The economy has grown for nine straight years and the federal budget is in surplus. Vice President Al Gore came out of his convention with a small lead over Gov. George W. Bush of Texas. Ralph Nader, running for the Green Party, is drawing liberal voters in the West and upper Midwest.',
    startNat: 3.0, tide: [-0.1, -0.3, -0.6, -0.5, -0.4, -0.3, -0.2, 0.1, 0.0, -0.2],
    actual: { D: 266, R: 271, other: 1, otherName: 'blank ballot', pvD: 48.38, pvR: 47.87, winner: 'R', third: 'Nader and others',
      note: 'Bush won 271 electoral votes to Gore\'s 266. One Gore elector from Washington, D.C., left her ballot blank. Florida was decided by 537 votes after a 36-day recount that the Supreme Court ended. Gore won the national popular vote by about half a point.' },
    cands: {
      D: { id: 'gore', first: 'Al', last: 'Gore', ini: 'AG', title: 'Vice President of the United States', home: 'TN', perk: 'debate', perkText: 'Seasoned debater: bigger wins in debates',
        bio: 'Two-term vice president and former Tennessee senator running on eight years of prosperity.' },
      R: { id: 'bush43', first: 'George W.', last: 'Bush', ini: 'GWB', title: 'Governor of Texas', home: 'TX', perk: 'visits', perkText: 'At home on the trail: every stop counts 25% more',
        bio: 'Two-term Texas governor running as a "compassionate conservative."' }
    },
    vps: {
      D: { id: 'lieberman', first: 'Joe', last: 'Lieberman', ini: 'JL', title: 'U.S. Senator from Connecticut', home: 'CT' },
      R: { id: 'cheney', first: 'Dick', last: 'Cheney', ini: 'DC', title: 'Former Secretary of Defense', home: 'WY' }
    },
    turns: [
      { date: '2000-09-04', cat: 'Labor Day', title: 'The final stretch begins',
        body: { D: 'For the first time this year, you lead in most polls. Labor Day starts the final stretch.', R: 'Gore has pulled ahead since his convention. Your campaign wants the momentum back.' },
        options: {
          D: [
            { t: 'Open with union workers in the industrial Midwest', s: 'the union kickoff', fx: { MW: .4 } },
            { t: 'Run on "the people versus the powerful"', s: 'the people versus the powerful', fx: { nat: .2, MW: .1 } },
            { t: 'Start in Florida', s: 'Florida', fx: { SO: .3 } }],
          R: [
            { t: 'Hit the road in the Midwest battlegrounds', s: 'the Midwest', fx: { MW: .4 } },
            { t: 'Argue over the debate schedule', s: 'the debate fight', fx: { nat: .05 } },
            { t: 'Talk about schools and "compassionate conservatism"', s: 'compassionate conservatism', fx: { nat: .2 } }]
        },
        hist: { D: 'Gore came out of his convention with his first lead of the year in most polls.', R: 'Bush spent early September arguing over the debate schedule while trying to win back the momentum he had lost after the Democratic convention.' } },
      { date: '2000-09-12', cat: 'Advertising', topic: 'the "RATS" ad', title: 'The "RATS" ad',
        body: 'A Republican ad attacking Gore\'s prescription drug plan briefly flashed the word "RATS" on screen. Democrats call it a subliminal message.',
        options: {
          D: [
            { t: 'Call it a dirty trick and demand it be pulled', s: 'the dirty-trick charge', fx: { nat: .15 } },
            { t: 'Laugh it off', s: 'laughing it off', fx: { nat: .1 } },
            { t: 'Use the attention to talk about your drug plan', s: 'the drug plan', fx: { nat: .2, SO: .1 } }],
          R: [
            { t: 'Say it was unintentional and pull the ad', s: 'pulling the ad', fx: { nat: .1 }, h: true },
            { t: 'Defend the ad', s: 'defending the ad', fx: { nat: -.15 } },
            { t: 'Joke about it', s: 'joking about it', fx: { nat: -.05 } }]
        },
        hist: { D: 'Democrats seized on the ad, but the story faded within days.', R: 'Bush said the effect was not intentional, and the ad was taken off the air.' } },
      { date: '2000-09-18', cat: 'Health care', topic: 'drug prices', title: 'Prescription drug costs',
        body: 'Seniors are paying more every year for prescription drugs. Gore wants to add a drug benefit to Medicare. Bush wants to help seniors buy private coverage.',
        options: {
          D: [
            { t: 'Tell personal stories about families struggling with drug costs', s: 'the personal stories', note: 'A gamble', risk: { p: .55, win: { nat: .35 }, lose: { nat: -.25 }, winNote: 'The stories landed with older voters.', loseNote: 'Reporters found that one of your stories had its facts wrong.' }, h: true },
            { t: 'Walk through the numbers in your Medicare plan', s: 'the numbers', fx: { nat: .2, SO: .1 } },
            { t: 'Go after the drug companies', s: 'the drug companies', fx: { nat: .15, MW: .05 } }],
          R: [
            { t: 'Promise to help seniors buy the coverage they choose', s: 'choice', fx: { nat: .2, SO: .1 }, h: true },
            { t: 'Say Gore wants Washington choosing your medicine', s: 'the Washington charge', fx: { nat: .15 } },
            { t: 'Accuse Gore of exaggerating', s: 'the exaggeration charge', fx: { nat: .1, SO: .05 } }]
        },
        hist: { D: 'Gore said his mother-in-law\'s arthritis medicine cost more than the same drug for his dog. Reporters found he had used figures from a study rather than her bills, which fed a Republican theme that he exaggerated.', R: 'Bush proposed helping seniors buy private drug coverage, and his campaign kept accusing Gore of exaggerating.' } },
      { date: '2000-10-03', kind: 'debate', cat: 'First debate', debName: 'first',
        q: 'This is the first debate, in Boston. What would you do with the federal budget surplus?', fit: 'plan',
        hist: { D: 'In Boston, Gore knew his material cold but sighed audibly while Bush talked. The sighs, replayed for days on television, did him more harm than anything either man said.', R: 'In Boston, Gore knew his material cold but sighed audibly while Bush talked. The sighs, replayed for days on television, did him more harm than anything either man said.' } },
      { date: '2000-10-07', cat: 'Social Security', topic: 'Social Security', title: 'Social Security',
        body: 'Bush wants to let younger workers put part of their Social Security taxes into personal accounts. Gore promises to put the program\'s money in a "lockbox."',
        options: {
          D: [
            { t: 'Warn that the accounts would drain money promised to retirees', s: 'the warning', fx: { nat: .15, SO: .1 }, h: true },
            { t: 'Repeat the lockbox promise', s: 'the lockbox', fx: { nat: .1 } },
            { t: 'Offer savings accounts on top of Social Security', s: 'savings accounts', fx: { nat: .15, WE: .05 } }],
          R: [
            { t: 'Defend personal accounts as giving people control', s: 'personal accounts', fx: { WE: .15, nat: .05 }, h: true },
            { t: 'Promise that today\'s retirees won\'t lose a dime', s: 'the promise to retirees', fx: { nat: .2, SO: .1 } },
            { t: 'Avoid the subject', s: 'avoiding it', fx: { nat: -.1 } }]
        },
        hist: { D: 'Gore warned that Bush\'s plan would take money promised to retirees. "Lockbox" became a running joke on late-night television.', R: 'Bush defended personal accounts and promised that benefits for current retirees would not change.' } },
      { date: '2000-10-17', kind: 'debate', cat: 'Town-hall debate', debName: 'final',
        q: 'At a town hall in St. Louis, a voter asks what you would do to make health care affordable for her family.', fit: 'story',
        hist: { D: 'At the town hall in St. Louis, Gore walked toward Bush while Bush was answering a question, and Bush gave him a nod. Most viewers called the debate close.', R: 'At the town hall in St. Louis, Gore walked toward Bush mid-answer, and Bush gave him a nod. Most viewers called the debate close.' } },
      { date: '2000-10-20', cat: 'Ralph Nader', topic: 'Nader voters', title: 'The Nader vote',
        body: 'Ralph Nader is polling around 5 percent nationally, and more in Oregon, Washington, Minnesota and Wisconsin. Democrats worry he could cost Gore close states.',
        options: {
          D: [
            { t: 'Ask Nader voters not to waste their votes', s: 'the wasted-vote pitch', fx: { WE: .2, MW: .1 }, h: true },
            { t: 'Campaign on the environment to win them back', s: 'the environment', fx: { WE: .25, MW: .05 } },
            { t: 'Ignore Nader', s: 'ignoring him', fx: { WE: -.15 } }],
          R: [
            { t: 'Stay out of it and let Nader split the left', s: 'staying out of it', fx: { WE: .05 }, h: true },
            { t: 'Quietly boost Nader\'s criticisms of Gore', s: 'boosting Nader', fx: { WE: .15, MW: .05 } },
            { t: 'Court moderates instead', s: 'courting moderates', fx: { nat: .15 } }]
        },
        hist: { D: 'Gore\'s campaign and its allies urged Nader voters to come home in the last weeks. Nader still won 2.7 percent nationally, including about 97,000 votes in Florida.', R: 'Bush mostly left Nader alone, though a Republican group ran ads featuring Nader\'s attacks on Gore.' } },
      { date: '2000-10-26', cat: 'The president', topic: 'Bill Clinton', title: 'What to do with Bill Clinton',
        body: 'President Clinton is popular on the economy but tarnished by the Lewinsky scandal and his impeachment. He wants to campaign for Gore.',
        options: {
          D: [
            { t: 'Keep Clinton mostly off the trail', s: 'keeping him off the trail', fx: { nat: .05, MW: .05, SO: .05 }, h: true },
            { t: 'Send Clinton to rally Democrats in the cities', s: 'the city rallies', fx: { NE: .2, MW: .15, SO: .05 } },
            { t: 'Campaign side by side with Clinton', s: 'campaigning together', note: 'A gamble', risk: { p: .45, win: { nat: .3 }, lose: { nat: -.3 }, winNote: 'The crowds were huge and the coverage was about the economy.', loseNote: 'The coverage was about the scandal.' } }],
          R: [
            { t: 'Promise to restore honor and dignity to the White House', s: 'honor and dignity', fx: { nat: .2, SO: .1 }, h: true },
            { t: 'Tie Gore directly to the scandals', s: 'the scandal attack', fx: { SO: .2, nat: -.05 } },
            { t: 'Leave Clinton out of it', s: 'leaving Clinton out', fx: { nat: .05 } }]
        },
        hist: { D: 'Gore kept Clinton at a distance and used him mostly in Democratic strongholds. Gore went on to lose Arkansas and his home state of Tennessee.', R: 'Bush promised to "restore honor and dignity" to the White House, a line aimed at Clinton without naming him.' } },
      { date: '2000-11-02', cat: 'Late news', topic: 'the old arrest', title: 'An old arrest',
        body: 'A Maine TV station reports that Bush was arrested for drunken driving in 1976. Bush has said he quit drinking in 1986.',
        options: {
          D: [
            { t: 'Let it play out without comment', s: 'staying quiet', fx: { nat: .1 }, h: true },
            { t: 'Have allies raise questions about honesty', s: 'the honesty questions', fx: { nat: .05 } },
            { t: 'Use it to question Bush\'s judgment', s: 'the judgment attack', fx: { nat: -.05 } }],
          R: [
            { t: 'Confirm it quickly and say you learned from it', s: 'owning it', fx: { nat: .1 }, h: true },
            { t: 'Call it a dirty trick', s: 'the dirty-trick charge', fx: { SO: .1, nat: -.05 } },
            { t: 'Say nothing', s: 'saying nothing', fx: { nat: -.2 } }]
        },
        hist: { D: 'Gore\'s campaign stayed largely silent. The race tightened in the final days.', R: 'Bush confirmed the arrest the same night, saying he had made mistakes and learned from them. His advisers later believed the story cost him votes.' } },
      { date: '2000-11-06', cat: 'Closing argument', title: 'One day left',
        body: 'Polls show a dead heat. Florida, where Bush\'s brother Jeb is governor, could decide it.',
        options: {
          D: [
            { t: 'An all-night marathon through the swing states', s: 'the marathon', fx: { nat: .15, MW: .15 } },
            { t: 'Close in Florida', s: 'Florida', fx: { SO: .3 } },
            { t: 'Close on the economy: don\'t risk the good times', s: 'the economy', fx: { nat: .25 } }],
          R: [
            { t: 'Close in Florida and Tennessee', s: 'Florida and Tennessee', fx: { SO: .3 } },
            { t: 'Close on trust and a fresh start', s: 'a fresh start', fx: { nat: .25 } },
            { t: 'Make a play for California', s: 'California', fx: { WE: .1, nat: -.05 } }]
        },
        hist: { D: 'Gore ended with a marathon that ran through the night. He won the popular vote by about half a point.', R: 'Bush spent part of the final days in California, which he lost by nearly 12 points. Florida, decided by 537 votes after a 36-day recount, gave him the presidency.' } }
    ]
  }
});
