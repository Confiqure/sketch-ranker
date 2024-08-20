/* eslint-disable no-console */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const sketches = [
    {
      collection: 'Season 1, Episode 1: Has This Ever Happened to You?',
      title: 'Both Ways',
      description: 'A prospective employee exits a job interview.',
    },
    {
      collection: 'Season 1, Episode 1: Has This Ever Happened to You?',
      title: 'Has This Ever Happened to You?',
      description: 'A lawyer solicits clients with plumbing problems.',
    },
    {
      collection: 'Season 1, Episode 1: Has This Ever Happened to You?',
      title: 'Baby of the Year',
      description: 'A cute baby competition has setbacks.',
    },
    {
      collection: 'Season 1, Episode 1: Has This Ever Happened to You?',
      title: 'Instagram',
      description: 'Women at brunch disagree about captions on social media.',
    },
    {
      collection: 'Season 1, Episode 1: Has This Ever Happened to You?',
      title: 'Gift Receipt',
      description: 'A gifter asks for his receipt back, then swallows it.',
    },
    {
      collection: 'Season 1, Episode 2: Thanks for Thinking They Are Cool',
      title: 'Biker Guy',
      description: 'A city traveler is delighted by the roadways’ motor vehicles.',
    },
    {
      collection: 'Season 1, Episode 2: Thanks for Thinking They Are Cool',
      title: 'River Mountain High',
      description:
        'TC Topps TC Tuggers, “the only shirt with a tugging knob,” sponsors a high school TV drama.',
    },
    {
      collection: 'Season 1, Episode 2: Thanks for Thinking They Are Cool',
      title: 'Wilson’s Toupees',
      description: 'A brand offers a “natural hair loss” hairpiece set.',
    },
    {
      collection: 'Season 1, Episode 2: Thanks for Thinking They Are Cool',
      title: 'Pink Bag',
      description: 'A whoopee cushion prank misfires.',
    },
    {
      collection: 'Season 1, Episode 2: Thanks for Thinking They Are Cool',
      title: 'River Mountain High (Continued)',
      description: 'Continued.',
    },
    {
      collection: 'Season 1, Episode 2: Thanks for Thinking They Are Cool',
      title: 'The Man',
      description: 'Two men reunite on an international flight.',
    },
    {
      collection:
        'Season 1, Episode 3: It’s the Cigars You Smoke That Are Going to Give You Cancer',
      title: 'Which Hand',
      description: 'A magician prompts a couple’s discord.',
    },
    {
      collection:
        'Season 1, Episode 3: It’s the Cigars You Smoke That Are Going to Give You Cancer',
      title: 'Focus Group',
      description: 'A member of an automotive focus group feels he has a good idea for a car.',
    },
    {
      collection:
        'Season 1, Episode 3: It’s the Cigars You Smoke That Are Going to Give You Cancer',
      title: 'Laser Spine Specialists',
      description: 'A spinal procedure allows patients to get back to what they love.',
    },
    {
      collection:
        'Season 1, Episode 3: It’s the Cigars You Smoke That Are Going to Give You Cancer',
      title: 'New Joe',
      description: 'An organist plays a funeral.',
    },
    {
      collection:
        'Season 1, Episode 3: It’s the Cigars You Smoke That Are Going to Give You Cancer',
      title: 'Game Night',
      description: 'A jazz fan joins a party game.',
    },
    {
      collection: 'Season 1, Episode 4: Oh Crap, a Bunch More Bad Stuff Just Happened',
      title: 'Lifetime Achievement',
      description: 'Herbie Hancock gets an award.',
    },
    {
      collection: 'Season 1, Episode 4: Oh Crap, a Bunch More Bad Stuff Just Happened',
      title: 'A Christmas Carol',
      description: 'Scrooge is enlisted in a sci-fi plot.',
    },
    {
      collection: 'Season 1, Episode 4: Oh Crap, a Bunch More Bad Stuff Just Happened',
      title: 'Nachos',
      description: 'Daters dine at a Mexican restaurant.',
    },
    {
      collection: 'Season 1, Episode 4: Oh Crap, a Bunch More Bad Stuff Just Happened',
      title: 'Traffic',
      description:
        'A bumper sticker leads to a road incident and ends with a eulogy of “Friday Night.”',
    },
    {
      collection: 'Season 1, Episode 5: I’m Wearing One of Their Belts Right Now',
      title: 'Brooks Brothers',
      description: 'The search for whoever crashed their hot dog car into a Brooks Brothers.',
    },
    {
      collection: 'Season 1, Episode 5: I’m Wearing One of Their Belts Right Now',
      title: 'Choking',
      description: 'A diner downplays a hazard.',
    },
    {
      collection: 'Season 1, Episode 5: I’m Wearing One of Their Belts Right Now',
      title: 'New Printer',
      description: 'Santa Claus is thanked around the office.',
    },
    {
      collection: 'Season 1, Episode 5: I’m Wearing One of Their Belts Right Now',
      title: 'The Day Robert Palins Murdered Me',
      description: 'A music executive attends a recording session.',
    },
    {
      collection: 'Season 1, Episode 5: I’m Wearing One of Their Belts Right Now',
      title: 'Babysitter',
      description: 'A babysitter’s excuse backfires.',
    },
    {
      collection: 'Season 1, Episode 6: We Used to Watch This at My Old Work',
      title: 'Fenton’s Stables and Horse Farm',
      description: 'A horse ranch offers a solution to riders’ emasculation.',
    },
    {
      collection: 'Season 1, Episode 6: We Used to Watch This at My Old Work',
      title: 'Chunky',
      description: 'A game show mascot takes the spotlight.',
    },
    {
      collection: 'Season 1, Episode 6: We Used to Watch This at My Old Work',
      title: 'Bozo',
      description: 'Colleagues search for funny videos.',
    },
    {
      collection: 'Season 1, Episode 6: We Used to Watch This at My Old Work',
      title: 'Baby Shower',
      description: 'A dad has suggestions.',
    },
    {
      collection: 'Season 1, Episode 6: We Used to Watch This at My Old Work',
      title: 'Bozo (Continued)',
      description: 'Continued.',
    },
    {
      collection: 'Season 1, Episode 6: We Used to Watch This at My Old Work',
      title: 'Party House',
      description: 'An intervention is staged.',
    },
    {
      collection: 'Season 2, Episode 1: They said that to me at a dinner.',
      title: 'H.D. Vac Part II',
      description: 'A work meeting is moved up, but it’s lunchtime.',
    },
    {
      collection: 'Season 2, Episode 1: They said that to me at a dinner.',
      title: 'Corncob TV',
      description:
        'A channel head protests Spectrum dropping his channel and fan favorite show Coffin Flop.',
    },
    {
      collection: 'Season 2, Episode 1: They said that to me at a dinner.',
      title: 'Prank Show',
      description: 'Host Karl Havoc’s prosthetics go awry.',
    },
    {
      collection: 'Season 2, Episode 1: They said that to me at a dinner.',
      title: 'Little Buff Boys',
      description: 'Kids compete in a body competition.',
    },
    {
      collection: 'Season 2, Episode 1: They said that to me at a dinner.',
      title: 'Ghost Tour',
      description: 'Visitors to a haunted house learn about apparitions.',
    },
    {
      collection:
        'Season 2, Episode 2: They have a cake shop there, Susan, where the cakes just look stunning.',
      title: 'The Capital Room',
      description: 'Investor moguls explain themselves.',
    },
    {
      collection:
        'Season 2, Episode 2: They have a cake shop there, Susan, where the cakes just look stunning.',
      title: 'Dan Flashes',
      description: 'A retailer sells patterned shirts.',
    },
    {
      collection:
        'Season 2, Episode 2: They have a cake shop there, Susan, where the cakes just look stunning.',
      title: 'Diner Wink',
      description: 'A neighboring diner chimes in.',
    },
    {
      collection:
        'Season 2, Episode 2: They have a cake shop there, Susan, where the cakes just look stunning.',
      title: 'The Shops at the Creeks',
      description: 'A mall advertises coveted wares.',
    },
    {
      collection:
        'Season 2, Episode 2: They have a cake shop there, Susan, where the cakes just look stunning.',
      title: 'Baby Cries',
      description:
        'A man who holds a crying baby is determined to change, while trying to enjoy a sloppy steak.',
    },
    {
      collection: 'Season 2, Episode 3: You sure about that? You sure about that, that’s why?',
      title: 'Grambles Lorelei Lounge',
      description: 'Former business school students have dinner with their professor.',
    },
    {
      collection: 'Season 2, Episode 3: You sure about that? You sure about that, that’s why?',
      title: 'Crashmore – Trailer',
      description: 'Santa Claus stars in an action film.',
    },
    {
      collection: 'Season 2, Episode 3: You sure about that? You sure about that, that’s why?',
      title: 'H.D. Vac Commercial',
      description: 'A man promotes a hot dog vacuum, based on personal experience.',
    },
    {
      collection: 'Season 2, Episode 3: You sure about that? You sure about that, that’s why?',
      title: 'Crashmore – Junket',
      description: 'Santa Claus takes issue with a reporter’s questions.',
    },
    {
      collection: 'Season 2, Episode 3: You sure about that? You sure about that, that’s why?',
      title: 'Qualstarr Trial',
      description: 'Financial crimes and more come to light.',
    },
    {
      collection: 'Season 2, Episode 4: Everyone just needs to be more in the moment.',
      title: 'Wife Joke',
      description: 'Jamie Taco comes up during a poker night.',
    },
    {
      collection: 'Season 2, Episode 4: Everyone just needs to be more in the moment.',
      title: 'Friend’s Weekend',
      description: 'Not everyone enjoys the Blues Brothers.',
    },
    {
      collection: 'Season 2, Episode 4: Everyone just needs to be more in the moment.',
      title: 'Calico Cut Pants',
      description: 'Pants come in handy.',
    },
    {
      collection:
        'Season 2, Episode 5: Didn’t you say there was gonna be five people at this table?',
      title: 'Parking Lot',
      description: 'Driving ability becomes an issue.',
    },
    {
      collection:
        'Season 2, Episode 5: Didn’t you say there was gonna be five people at this table?',
      title: 'Del Frisco’s Double Eagle',
      description: 'Hal starts credit card roulette.',
    },
    {
      collection:
        'Season 2, Episode 5: Didn’t you say there was gonna be five people at this table?',
      title: 'Joanie’s Birthday',
      description:
        'A gift arrives in the form of a Johnny Carson impersonator at a “low, low, low price point.”',
    },
    {
      collection:
        'Season 2, Episode 5: Didn’t you say there was gonna be five people at this table?',
      title: 'Little Buff Boys Competition',
      description: 'A corporate convention attends a body building competition.',
    },
    {
      collection:
        'Season 2, Episode 5: Didn’t you say there was gonna be five people at this table?',
      title: 'Mars Restaurant',
      description: 'Dates have complaints at a galactic restaurant.',
    },
    {
      collection: 'Season 2, Episode 6: I need a wet paper towel.',
      title: 'Dave Suit',
      description:
        'Coworkers have a stern meeting about a bathroom incident involving “huge, embarrassing dumps.”',
    },
    {
      collection: 'Season 2, Episode 6: I need a wet paper towel.',
      title: 'Driver’s Ed',
      description: 'An instructional video causes confusion.',
    },
    {
      collection: 'Season 2, Episode 6: I need a wet paper towel.',
      title: 'Tammy Craps',
      description: 'A doll has accidents.',
    },
    {
      collection: 'Season 2, Episode 6: I need a wet paper towel.',
      title: 'Big Wave',
      description: 'An employee pretends to surf.',
    },
    {
      collection: 'Season 2, Episode 6: I need a wet paper towel.',
      title: 'Claire’s',
      description: 'A girl is scared to get her ears pierced.',
    },
    {
      collection:
        'Season 3, Episode 1: That was the Earth telling me I’m supposed to be doing something great.',
      title: 'Barley Tonight',
      description:
        'A talk show host loves to start fights, but also has no problem going on his phone.',
    },
    {
      collection:
        'Season 3, Episode 1: That was the Earth telling me I’m supposed to be doing something great.',
      title: 'Mortal Enemies',
      description: 'A team-building exercise creates bitterness between Rick and Stan.',
    },
    {
      collection:
        'Season 3, Episode 1: That was the Earth telling me I’m supposed to be doing something great.',
      title: 'Summer Loving',
      description:
        'Eligible men spend summer break with one beautiful woman to see if a summer fling will turn into summer love. There’s also a zip line by the pool.',
    },
    {
      collection:
        'Season 3, Episode 1: That was the Earth telling me I’m supposed to be doing something great.',
      title: 'Dad Video',
      description: 'A father fails to give his nasty kids a lesson.',
    },
    {
      collection:
        'Season 3, Episode 1: That was the Earth telling me I’m supposed to be doing something great.',
      title: 'Designated Driver',
      description: 'The Driving Crooner offers help to those who have had too much to drink.',
    },
    {
      collection: 'Season 3, Episode 2: I can do whatever I want.',
      title: 'Supermarket Swap',
      description: 'A game show contestant’s VR shopping spree results in problems.',
    },
    {
      collection: 'Season 3, Episode 2: I can do whatever I want.',
      title: 'Darmine Doggy Door',
      description: 'Darmine Devices sells a more advanced pet door that also keeps out more.',
    },
    {
      collection: 'Season 3, Episode 2: I can do whatever I want.',
      title: 'Ponytail',
      description: 'A man gets caught under a car that shouldn’t have been parked over a sidewalk.',
    },
    {
      collection: 'Season 3, Episode 2: I can do whatever I want.',
      title: 'Eggman Game',
      description: 'A computer game gets an employee in trouble.',
    },
    {
      collection: 'Season 3, Episode 2: I can do whatever I want.',
      title: 'Sitcom Taping',
      description: 'A man’s limo-related dating trauma resurfaces during a live sitcom filming.',
    },
    {
      collection: 'Season 3, Episode 3: Cut to: We’re chatting about this at your bachelor party.',
      title: 'Silent Show',
      description: 'Richard Brecky brings his mastery of silent theater to the stage.',
    },
    {
      collection: 'Season 3, Episode 3: Cut to: We’re chatting about this at your bachelor party.',
      title: 'First Date',
      description: 'A man on a date has a dog haircut.',
    },
    {
      collection: 'Season 3, Episode 3: Cut to: We’re chatting about this at your bachelor party.',
      title: 'ABX Heart Monitor',
      description: 'A cardiac event at Club Aqua leads a contractor to implant a heart tracker.',
    },
    {
      collection: 'Season 3, Episode 3: Cut to: We’re chatting about this at your bachelor party.',
      title: 'Drive Thru',
      description: 'A fast-food customer finds out a way to order 55 of everything.',
    },
    {
      collection: 'Season 3, Episode 3: Cut to: We’re chatting about this at your bachelor party.',
      title: 'Robert’s Christmas Birthday',
      description: 'Tensions are settled between colleagues.',
    },
    {
      collection:
        'Season 3, Episode 4: So now every time I’m about to do something I really want to do, I ask myself, ‘Wait a minute, what is this?’',
      title: 'Jenna’s Bad Day',
      description: 'Coworkers’ discussion of friend groups is interrupted.',
    },
    {
      collection:
        'Season 3, Episode 4: So now every time I’m about to do something I really want to do, I ask myself, ‘Wait a minute, what is this?’',
      title: 'Pacific Proposal Park',
      description: 'An entrepreneur’s matrimony-friendly grounds are overtaken by wrestlers.',
    },
    {
      collection:
        'Season 3, Episode 4: So now every time I’m about to do something I really want to do, I ask myself, ‘Wait a minute, what is this?’',
      title: 'Gelutol',
      description: 'A hair-growth formula causes tension.',
    },
    {
      collection:
        'Season 3, Episode 4: So now every time I’m about to do something I really want to do, I ask myself, ‘Wait a minute, what is this?’',
      title: 'Summer Loving Farewell Package',
      description: 'Ronnie says goodbye.',
    },
    {
      collection:
        'Season 3, Episode 4: So now every time I’m about to do something I really want to do, I ask myself, ‘Wait a minute, what is this?’',
      title: 'Children’s Choir',
      description: '“Shirt brothers” at a kids’ concert are inspired by the lyrics of a song.',
    },
    {
      collection: 'Season 3, Episode 5: Don’t just say ‘relax,’ actually relax.',
      title: 'Bloody Eyeball',
      description: 'Randall thinks he hears a volcano.',
    },
    {
      collection: 'Season 3, Episode 5: Don’t just say ‘relax,’ actually relax.',
      title: 'Photo Booth',
      description: 'The bride’s dad at a wedding photo area is distracted by business deals.',
    },
    {
      collection: 'Season 3, Episode 5: Don’t just say ‘relax,’ actually relax.',
      title: 'Talk About My Kids',
      description: 'In trying to do a good deed, a guy becomes the most popular guy at the party.',
    },
    {
      collection:
        'Season 3, Episode 6: When I first thought of this, you didn’t even have hands up there — you were just walking straight up the wall.',
      title: 'Banana Breath',
      description: 'An employee at sensitivity training has a great idea for a T-shirt.',
    },
    {
      collection:
        'Season 3, Episode 6: When I first thought of this, you didn’t even have hands up there — you were just walking straight up the wall.',
      title: 'Metal Motto Search',
      description: 'A game show rests on the capabilities of the Metaloid Maniac.',
    },
    {
      collection:
        'Season 3, Episode 6: When I first thought of this, you didn’t even have hands up there — you were just walking straight up the wall.',
      title: 'Don Bondarley',
      description: 'A party entertainer performs dirty songs.',
    },
    {
      collection:
        'Season 3, Episode 6: When I first thought of this, you didn’t even have hands up there — you were just walking straight up the wall.',
      title: 'Tasty Time Vids',
      description: 'Draven obsesses over his Instagram videos.',
    },
  ]

  for (const sketch of sketches) {
    await prisma.sketch.create({
      data: sketch,
    })
  }
}

main()
  .then(() => {
    console.log('Seed data loaded successfully')
  })
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
