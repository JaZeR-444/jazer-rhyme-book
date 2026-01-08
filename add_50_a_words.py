#!/usr/bin/env python3
import os
import sys
from pathlib import Path

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

ROOT_PATH = r"C:\Users\JaZeR\OneDrive\Desktop\2026 → JaZeR Mainframe\2026 → JaZeR Master Flow Knowledge Hub\Rap_Dictionary_Master_Hub\A\01_Words"

# 50 A-words with full data
WORDS = [
    {
        "name": "ambition",
        "word": "Ambition",
        "meaning": "A strong desire and determination to achieve success",
        "rap_meaning": "The hunger and drive to rise to the top, chase dreams, get rich, dominate the game",
        "syllables": "3 (am-bi-tion)",
        "pos": "Noun",
        "synonyms": "Drive, hunger, hustle, grind, determination, motivation",
        "antonyms": "Apathy, laziness, complacency, contentment",
        "rhymes": "END: mission, vision, decision, position, condition, ignition / SLANT: wishing, fishing, listing / MULTI: ammunition, competition, recognition",
        "bars": [
            "Ambition in my veins, I'm addicted to the mission",
            "Got ambition like a rocket, ain't no stopping my ascension",
            "My ambition is the fuel when they told me that I couldn't"
        ],
        "punchlines": [
            "Use it to contrast with those who lack drive (haters stuck while you move)",
            "Stack it with hunger metaphors (starving for success, feast on wins)",
            "Flip it as both blessing and curse (ambition made me ruthless)"
        ],
        "tags": "motivation, success, hustle, mindset, determination"
    },
    {
        "name": "apex",
        "word": "Apex",
        "meaning": "The highest point, peak, or top of something",
        "rap_meaning": "Being at the top of the game, the highest level of success, peak performance",
        "syllables": "2 (a-pex)",
        "pos": "Noun",
        "synonyms": "Peak, summit, top, pinnacle, zenith, crown",
        "antonyms": "Bottom, base, nadir, low point",
        "rhymes": "END: checks, flex, next, complex, reflex / SLANT: decks, necks, wrecks / MULTI: perplex, convex, latex",
        "bars": [
            "I'm at the apex while you stuck at the bottom of the steps",
            "Reached the apex, now I'm looking down at all my competition",
            "Apex predator, I'm hunting while you prey on my position"
        ],
        "punchlines": [
            "Use apex predator imagery (top of food chain, hunting)",
            "Contrast apex with those climbing (you're arriving, they're still trying)",
            "Geometric wordplay (apex of triangle, sharp and pointed)"
        ],
        "tags": "success, top, peak, winning, dominance"
    },
    {
        "name": "astronomical",
        "word": "Astronomical",
        "meaning": "Extremely large, relating to astronomy or outer space",
        "rap_meaning": "Massive numbers (money, success, stats), out of this world, unreachable levels",
        "syllables": "5 (as-tro-nom-i-cal)",
        "pos": "Adjective",
        "synonyms": "Massive, enormous, cosmic, huge, immense, galactic",
        "antonyms": "Small, tiny, minimal, microscopic",
        "rhymes": "END: logical, chronological, phenomenal / SLANT: comical, topical / MULTI: economical, astronomical",
        "bars": [
            "My numbers astronomical, you can't even fathom the stats",
            "Astronomical rise, I went from Earth straight to the stars",
            "Bank account astronomical, NASA couldn't calculate it"
        ],
        "punchlines": [
            "Pair with space/galaxy imagery (orbit, stars, universe)",
            "Use for money/success metrics (counts so high they're cosmic)",
            "Flip the scale (microscopic haters vs astronomical wins)"
        ],
        "tags": "money, success, large, space, cosmic, flex"
    },
    {
        "name": "architect",
        "word": "Architect",
        "meaning": "A person who designs buildings; a planner or creator",
        "rap_meaning": "The designer of your own life/empire, mastermind, the one who built it from scratch",
        "syllables": "3 (ar-chi-tect)",
        "pos": "Noun",
        "synonyms": "Designer, builder, creator, mastermind, planner, engineer",
        "antonyms": "Destroyer, follower, imitator",
        "rhymes": "END: intellect, disrespect, connect, protect, reflect / SLANT: direct, select / MULTI: disconnect, circumspect",
        "bars": [
            "Architect of my fate, I designed this whole empire",
            "I'm the architect, you just living in the building I created",
            "Call me architect, I blueprint the vision then I build it"
        ],
        "punchlines": [
            "Building metaphors (foundation, blueprint, construction)",
            "Control narrative (you design, others follow your plans)",
            "Matrix reference (architect of reality)"
        ],
        "tags": "building, creation, mastermind, designer, control"
    },
    {
        "name": "authentic",
        "word": "Authentic",
        "meaning": "Genuine, real, not fake or copied",
        "rap_meaning": "Keeping it real, staying true to yourself, not fake or manufactured",
        "syllables": "3 (au-then-tic)",
        "pos": "Adjective",
        "synonyms": "Real, genuine, true, legitimate, original, pure",
        "antonyms": "Fake, phony, counterfeit, artificial, fraud",
        "rhymes": "END: frantic, Atlantic, gigantic, romantic / SLANT:antic, mantic / MULTI: pedantic, semantic",
        "bars": [
            "Everything authentic, I don't need to fake the image",
            "They selling dreams, I'm selling authentic, check the difference",
            "Authentic to the core, what you see is what you getting"
        ],
        "punchlines": [
            "Contrast real vs fake (authentic gold vs fool's gold)",
            "Brand/product wordplay (authentic vs knockoff)",
            "Certificate of authenticity (prove you're the real one)"
        ],
        "tags": "real, genuine, truth, honest, original"
    },
    {
        "name": "adversary",
        "word": "Adversary",
        "meaning": "An opponent, enemy, or rival",
        "rap_meaning": "Your competition, haters, anyone standing in your way",
        "syllables": "4 (ad-ver-sar-y)",
        "pos": "Noun",
        "synonyms": "Enemy, opponent, rival, foe, competition, challenger",
        "antonyms": "Ally, friend, partner, supporter",
        "rhymes": "END: necessary, scary, temporary, legendary, contrary / SLANT: berry, merry, very / MULTI: unnecessary, contemporary",
        "bars": [
            "My adversary thought they had me, but I flipped it legendary",
            "I turn every adversary into cautionary tales",
            "Adversaries plotting but they moves is temporary"
        ],
        "punchlines": [
            "Biblical angles (David vs Goliath, defeat the giant)",
            "Chess metaphors (adversary is opponent, you checkmate)",
            "Convert adversary to motivation (they push you higher)"
        ],
        "tags": "enemy, rival, competition, opponent, conflict"
    },
    {
        "name": "audacious",
        "word": "Audacious",
        "meaning": "Bold, daring, willing to take risks",
        "rap_meaning": "Fearless moves, doing what others won't, bold and unapologetic",
        "syllables": "3 (au-da-cious)",
        "pos": "Adjective",
        "synonyms": "Bold, daring, fearless, brave, gutsy, brazen",
        "antonyms": "Timid, cautious, afraid, careful, hesitant",
        "rhymes": "END: gracious, spacious, courageous / SLANT: vicious, precious / MULTI: tenacious, vivacious",
        "bars": [
            "Audacious with the moves, I'm the boldest in the room",
            "They play it safe, I play audacious, that's the difference",
            "Audacious ambition got me reaching for the impossible"
        ],
        "punchlines": [
            "Risk-taking imagery (gambler, leap of faith)",
            "Contrast with cautious competitors (they hesitate, you dominate)",
            "Historical figures (audacious like conquerors)"
        ],
        "tags": "bold, fearless, daring, brave, risky"
    },
    {
        "name": "affluent",
        "word": "Affluent",
        "meaning": "Wealthy, rich, having a lot of money",
        "rap_meaning": "Rich, well-off, living the luxury lifestyle, got money",
        "syllables": "3 (af-flu-ent)",
        "pos": "Adjective",
        "synonyms": "Wealthy, rich, prosperous, loaded, paid, well-off",
        "antonyms": "Poor, broke, struggling, impoverished",
        "rhymes": "END: fluent, truant, congruent / SLANT: student, prudent / MULTI: influent, effluent",
        "bars": [
            "Affluent living, I went from struggle to the top floor",
            "Neighborhood affluent, we don't know what struggle is",
            "Affluent mindset, I attract money with my energy"
        ],
        "punchlines": [
            "Water metaphors (affluent = flowing with wealth)",
            "Contrast poor past with affluent present",
            "Neighborhood transformation (block went affluent)"
        ],
        "tags": "wealth, rich, money, luxury, success"
    },
    {
        "name": "articulate",
        "word": "Articulate",
        "meaning": "Able to speak clearly and effectively",
        "rap_meaning": "Speak with precision, word choice on point, communicate powerfully",
        "syllables": "4 (ar-tic-u-late)",
        "pos": "Adjective/Verb",
        "synonyms": "Eloquent, clear, expressive, well-spoken, precise, fluent",
        "antonyms": "Inarticulate, unclear, mumbling, confused",
        "rhymes": "END: late, great, fate, state, calculate / SLANT: gate, hate, wait / MULTI: manipulate, elaborate",
        "bars": [
            "Articulate the vision so precise they feel the picture",
            "I articulate my pain and turn it into poetry",
            "Too articulate to argue with the ignorant"
        ],
        "punchlines": [
            "Wordsmith imagery (precision with language)",
            "Contrast articulate vs mumble rappers",
            "Lawyer/speaker reference (argue cases articulately)"
        ],
        "tags": "speaking, communication, clarity, words, expression"
    },
    {
        "name": "ascend",
        "word": "Ascend",
        "meaning": "To rise or move upward",
        "rap_meaning": "Rising to the top, leveling up, climbing the ranks",
        "syllables": "2 (a-scend)",
        "pos": "Verb",
        "synonyms": "Rise, climb, elevate, soar, advance, level up",
        "antonyms": "Descend, fall, drop, decline, sink",
        "rhymes": "END: end, bend, send, defend, pretend, transcend / SLANT: friend, spend, lend / MULTI: comprehend, recommend",
        "bars": [
            "I ascend while my competition descends into nothing",
            "Watch me ascend to the throne, this is destiny calling",
            "Started from the bottom, now I'm ascending to the heavens"
        ],
        "punchlines": [
            "Heaven/angel imagery (ascending to higher planes)",
            "Throne/royalty (ascending to power)",
            "Elevator/stairs wordplay (they take steps, you ascend)"
        ],
        "tags": "rising, climbing, success, elevation, growth"
    },
    {
        "name": "assassin",
        "word": "Assassin",
        "meaning": "A killer hired to murder someone, usually for political reasons",
        "rap_meaning": "Killing the competition, executing the game perfectly, lethal with the craft",
        "syllables": "3 (as-sas-sin)",
        "pos": "Noun",
        "synonyms": "Killer, hitman, executioner, slayer, murderer",
        "antonyms": "Protector, savior, guardian, defender",
        "rhymes": "END: passing, asking, masking, grasping / SLANT: dancing, glancing / MULTI: harassing, surpassing",
        "bars": [
            "Move like an assassin, silent but I'm deadly with the craft",
            "Assassin on the beat, I murder every track I'm passing",
            "Trained assassin mentality, I execute with precision"
        ],
        "punchlines": [
            "Video game references (Assassin's Creed stealth)",
            "Silent killer imagery (move quiet, strike loud)",
            "Precision/execution wordplay (calculated kills)"
        ],
        "tags": "killer, deadly, precision, execution, competition"
    },
    {
        "name": "almighty",
        "word": "Almighty",
        "meaning": "All-powerful, having unlimited power",
        "rap_meaning": "Supreme power, god-like, untouchable, having all the control",
        "syllables": "3 (al-migh-ty)",
        "pos": "Adjective",
        "synonyms": "All-powerful, supreme, omnipotent, godlike, divine",
        "antonyms": "Powerless, weak, helpless, mortal",
        "rhymes": "END: mighty, flighty, whitey / SLANT:ighty,ighty / MULTI: high and mighty",
        "bars": [
            "Almighty with the pen, I write scripture when I'm rhyming",
            "Feel almighty when I step, like I'm god of my domain",
            "Almighty dollar what they worship, I just stack it to the ceiling"
        ],
        "punchlines": [
            "Religious imagery (god-like power, worship)",
            "Almighty dollar reference (money is power)",
            "Supreme being angles (untouchable, divine)"
        ],
        "tags": "power, god, supreme, divine, control"
    },
    {
        "name": "abyss",
        "word": "Abyss",
        "meaning": "A deep, bottomless pit; a void",
        "rap_meaning": "Rock bottom, the depths of struggle, the void, a dangerous low point",
        "syllables": "2 (a-byss)",
        "pos": "Noun",
        "synonyms": "Void, pit, chasm, depths, bottomless, darkness",
        "antonyms": "Peak, summit, heights, top",
        "rhymes": "END: miss, bliss, kiss, diss, dismissed, persist / SLANT: hiss, fist, list / MULTI: reminisce, coexist",
        "bars": [
            "Stared into the abyss, then I climbed up from the bottom",
            "Don't fall into the abyss where dreams go to die",
            "The abyss tried to pull me down but I refused to drown"
        ],
        "punchlines": [
            "Nietzsche reference (gaze into abyss, it gazes back)",
            "Depth metaphors (fell in abyss, climbed out stronger)",
            "Void/emptiness imagery (filled the abyss with success)"
        ],
        "tags": "depth, darkness, struggle, void, bottomless"
    },
    {
        "name": "aftermath",
        "word": "Aftermath",
        "meaning": "The consequences or results following an event",
        "rap_meaning": "What's left after you dominate, the results of your actions, legacy",
        "syllables": "3 (af-ter-math)",
        "pos": "Noun",
        "synonyms": "Consequence, result, outcome, fallout, wake, residue",
        "antonyms": "Beginning, prelude, start, before",
        "rhymes": "END: path, wrath, bath, laugh / SLANT: staff, half, craft / MULTI: psychopath, photograph",
        "bars": [
            "Aftermath of my grind is empire building, no rebuilding",
            "Survey the aftermath when I'm done, ain't nothing left standing",
            "In the aftermath of war, I'm the one still on the throne"
        ],
        "punchlines": [
            "Dr. Dre reference (Aftermath label)",
            "War imagery (battlefield aftermath, total destruction)",
            "Before/after transformation (aftermath shows the change)"
        ],
        "tags": "consequences, results, legacy, aftermath, outcome"
    },
    {
        "name": "alliance",
        "word": "Alliance",
        "meaning": "A union or association formed for mutual benefit",
        "rap_meaning": "The squad, your team, partnership for power and success",
        "syllables": "3 (al-li-ance)",
        "pos": "Noun",
        "synonyms": "Partnership, coalition, union, team, crew, affiliation",
        "antonyms": "Division, separation, opposition, enemy",
        "rhymes": "END: defiance, reliance, compliance, science / SLANT: giants, clients / MULTI: appliance, self-reliance",
        "bars": [
            "Built alliance with the realest, now we all eating together",
            "Alliance so strong, you can't break the bond we created",
            "Form alliance with success, cut off anyone who's toxic"
        ],
        "punchlines": [
            "Political wordplay (strategic alliances for power)",
            "Game of Thrones references (alliances for the throne)",
            "Business merger imagery (alliance for dominance)"
        ],
        "tags": "team, partnership, squad, unity, collaboration"
    },
    {
        "name": "anarchy",
        "word": "Anarchy",
        "meaning": "Absence of government or order; chaos",
        "rap_meaning": "Chaos, breaking all rules, rebellion, operating outside the system",
        "syllables": "3 (an-ar-chy)",
        "pos": "Noun",
        "synonyms": "Chaos, disorder, mayhem, lawlessness, rebellion, pandemonium",
        "antonyms": "Order, control, law, structure, peace",
        "rhymes": "END:archy, monarchy, hierarchy / SLANT: parky, sharky / MULTI: oligarchy, patriarchy",
        "bars": [
            "Anarchy in motion when I break up in the function",
            "Created anarchy in the game, I don't follow no rules",
            "It's pure anarchy when we move, structure turned to chaos"
        ],
        "punchlines": [
            "Symbol reference (anarchy logo, rebellion)",
            "System destroyer (bring anarchy to the establishment)",
            "Organized chaos (controlled anarchy, chaos with purpose)"
        ],
        "tags": "chaos, rebellion, disorder, rules, breaking"
    },
    {
        "name": "arsenal",
        "word": "Arsenal",
        "meaning": "A collection of weapons or resources",
        "rap_meaning": "Your full set of skills/weapons/resources, everything you got in the tank",
        "syllables": "3 (ar-se-nal)",
        "pos": "Noun",
        "synonyms": "Weapons, tools, resources, ammunition, stockpile, armory",
        "antonyms": "Emptiness, lack, nothing, defenseless",
        "rhymes": "END: personal, universal, commercial / SLANT: colonel, journal / MULTI: controversial, unrehearsed",
        "bars": [
            "Arsenal so deep, I got weapons you ain't even seen yet",
            "Pull from my arsenal whenever competition getting bold",
            "Arsenal of skills, I'm equipped for any situation"
        ],
        "punchlines": [
            "Soccer team reference (Arsenal FC)",
            "Military stockpile imagery (stacked with ammunition)",
            "Video game loadout (arsenal of different weapons)"
        ],
        "tags": "weapons, tools, skills, resources, equipped"
    },
    {
        "name": "asylum",
        "word": "Asylum",
        "meaning": "Protection from danger; a place of refuge or safety",
        "rap_meaning": "Safe haven, refuge from the chaos, or going crazy (mental asylum)",
        "syllables": "3 (a-sy-lum)",
        "pos": "Noun",
        "synonyms": "Refuge, sanctuary, shelter, haven, safety, protection",
        "antonyms": "Danger, exposure, threat, open",
        "rhymes": "END:ylum, silum / SLANT: them, gem, hem / MULTI: style 'em, trial 'em",
        "bars": [
            "Need asylum from the madness that this fame brings",
            "Running to asylum but the demons in my head follow",
            "This game an asylum, everybody here insane"
        ],
        "punchlines": [
            "Mental asylum wordplay (crazy with success)",
            "Refugee imagery (seeking asylum from struggle)",
            "Dual meaning (safe place vs crazy place)"
        ],
        "tags": "safety, refuge, crazy, protection, haven"
    },
    {
        "name": "aura",
        "word": "Aura",
        "meaning": "A distinctive atmosphere or quality that surrounds someone",
        "rap_meaning": "The energy you give off, your presence, the vibe people feel from you",
        "syllables": "2 (au-ra)",
        "pos": "Noun",
        "synonyms": "Energy, presence, vibe, essence, atmosphere, glow",
        "antonyms": "Emptiness, void, absence, nothing",
        "rhymes": "END: flora, Dora, Torah / SLANT: more, door, pour / MULTI: aurora, angora",
        "bars": [
            "Aura so strong when I walk in, everybody feel the shift",
            "My aura different, I emit success before I even speak",
            "Golden aura shining bright, they can see I'm something special"
        ],
        "punchlines": [
            "Color imagery (golden aura = wealth, dark aura = dangerous)",
            "Energy field wordplay (magnetic aura attracts success)",
            "Spiritual angles (cleanse your aura, protect your energy)"
        ],
        "tags": "energy, presence, vibe, atmosphere, essence"
    },
    {
        "name": "avalanche",
        "word": "Avalanche",
        "meaning": "A large mass of snow falling rapidly down a mountain",
        "rap_meaning": "Unstoppable force, overwhelming success/pressure, momentum that can't be stopped",
        "syllables": "3 (av-a-lanche)",
        "pos": "Noun",
        "synonyms": "Deluge, flood, torrent, cascade, overwhelming force",
        "antonyms": "Trickle, drought, shortage, lack",
        "rhymes": "END: advance, enhance, dance, chance, glance / SLANT: stance, trance, lance / MULTI: romance, finance",
        "bars": [
            "Success came like avalanche, unstoppable and freezing cold",
            "Avalanche of problems tried to bury me, I dug out stronger",
            "I bring the avalanche of pressure, watch opponents crumble under"
        ],
        "punchlines": [
            "Force of nature imagery (unstoppable momentum)",
            "Burial wordplay (avalanche buries competition)",
            "Cold/ice extensions (cold-blooded, ice in veins)"
        ],
        "tags": "force, unstoppable, overwhelming, momentum, powerful"
    },
    {
        "name": "alchemy",
        "word": "Alchemy",
        "meaning": "Transforming base metals into gold; magical transformation",
        "rap_meaning": "Turning nothing into something, transforming struggle into success, making magic",
        "syllables": "3 (al-che-my)",
        "pos": "Noun",
        "synonyms": "Transformation, magic, transmutation, chemistry, conversion",
        "antonyms": "Stagnation, sameness, unchanged",
        "rhymes": "END: enemy, remedy, Hennessy, melody / SLANT: memory, felony / MULTI: potentially, essentially",
        "bars": [
            "Alchemy in motion, turn the struggle into gold",
            "Master of alchemy, I transform pain into profit",
            "Like alchemy, I change the elements and make it magical"
        ],
        "punchlines": [
            "Fullmetal Alchemist reference (equivalent exchange)",
            "Chemistry wordplay (mixing elements for success)",
            "Gold transformation (turn lead to gold = broke to rich)"
        ],
        "tags": "transformation, magic, change, success, chemistry"
    },
    {
        "name": "anomaly",
        "word": "Anomaly",
        "meaning": "Something that deviates from what is normal or expected",
        "rap_meaning": "Being different, unique, one of a kind, breaking the mold",
        "syllables": "4 (a-nom-a-ly)",
        "pos": "Noun",
        "synonyms": "Outlier, exception, irregularity, oddity, unique, different",
        "antonyms": "Normal, typical, standard, ordinary, common",
        "rhymes": "END: commonly, honestly, policy, probably / SLANT: comedy, odyssey / MULTI: quality, poverty",
        "bars": [
            "I'm an anomaly, they never seen nothing like me",
            "Anomaly status, I don't fit in any category",
            "Call me anomaly cause I defy the expectations"
        ],
        "punchlines": [
            "Statistical outlier (you're the one data point that breaks trends)",
            "Glitch in the matrix (anomaly in the system)",
            "Science wordplay (unexplained phenomenon)"
        ],
        "tags": "unique, different, outlier, special, rare"
    },
    {
        "name": "arrogant",
        "word": "Arrogant",
        "meaning": "Having an exaggerated sense of one's abilities or importance",
        "rap_meaning": "Confident to the point of cocky, know you're better and show it",
        "syllables": "3 (ar-ro-gant)",
        "pos": "Adjective",
        "synonyms": "Cocky, conceited, proud, boastful, egotistical, superior",
        "antonyms": "Humble, modest, meek, self-effacing",
        "rhymes": "END: ignorant, tolerant, militant / SLANT: elephant, relevant / MULTI: belligerent, different",
        "bars": [
            "Arrogant with reason, I got every right to stunt",
            "They call it arrogant, I call it confidence in what I built",
            "Arrogant demeanor but the results back up the talk"
        ],
        "punchlines": [
            "Earned arrogance (you can be cocky when you're winning)",
            "Confidence vs arrogance debate (thin line)",
            "Backup your arrogance (receipts to prove it)"
        ],
        "tags": "confidence, cocky, proud, ego, superior"
    },
    {
        "name": "adrenaline",
        "word": "Adrenaline",
        "meaning": "Hormone released in stressful situations; excitement rush",
        "rap_meaning": "The rush, the thrill, the high energy feeling when you're in the zone",
        "syllables": "4 (a-dren-a-line)",
        "pos": "Noun",
        "synonyms": "Rush, thrill, excitement, energy, surge, boost",
        "antonyms": "Calm, lethargy, relaxation, stillness",
        "rhymes": "END: in the scene, gasoline, magazine, guillotine / SLANT: everything, medicine / MULTI: never been, better than",
        "bars": [
            "Adrenaline pumping when I step up in the booth",
            "Running on adrenaline, I don't need sleep to dominate",
            "Adrenaline junkie, I'm addicted to the thrill of winning"
        ],
        "punchlines": [
            "Drug comparison (addicted to the adrenaline rush)",
            "Sports imagery (clutch moments, adrenaline kicks in)",
            "Fight or flight (adrenaline makes you dangerous)"
        ],
        "tags": "energy, rush, excitement, thrill, intensity"
    },
    {
        "name": "agenda",
        "word": "Agenda",
        "meaning": "A list of items to be discussed or accomplished; a plan",
        "rap_meaning": "Your plan, your mission, what you're focused on accomplishing",
        "syllables": "3 (a-gen-da)",
        "pos": "Noun",
        "synonyms": "Plan, schedule, program, mission, objective, itinerary",
        "antonyms": "Aimless, unplanned, random, chaotic",
        "rhymes": "END: defender, sender, gender, tender, lender / SLANT: remember, surrender / MULTI: contender, offender",
        "bars": [
            "My agenda simple: get the bag and feed my family",
            "Hidden agendas everywhere, I trust nobody round me",
            "Stick to my agenda, I don't get distracted by the noise"
        ],
        "punchlines": [
            "Political wordplay (push your agenda, control narrative)",
            "Hidden agenda expose (reveal fake friends' motives)",
            "Focus comparison (your agenda vs their distractions)"
        ],
        "tags": "plan, mission, focus, goals, objective"
    },
    {
        "name": "aggressive",
        "word": "Aggressive",
        "meaning": "Forceful, hostile, or attacking in nature",
        "rap_meaning": "Going hard, attacking the game/competition, no holding back",
        "syllables": "3 (ag-gres-sive)",
        "pos": "Adjective",
        "synonyms": "Forceful, fierce, intense, hostile, militant, attacking",
        "antonyms": "Passive, gentle, calm, peaceful, mild",
        "rhymes": "END: impressive, possessive, excessive, progressive / SLANT: festive, restive / MULTI: depressive, oppressive",
        "bars": [
            "Aggressive with the hustle, I attack every opportunity",
            "My flow aggressive, hitting harder than a heavyweight",
            "Aggressive mentality, I don't know how to play it safe"
        ],
        "punchlines": [
            "Fighting imagery (aggressive like a pit bull)",
            "Sales wordplay (aggressively pursue the bag)",
            "Nature comparison (aggressive predator hunting)"
        ],
        "tags": "intense, forceful, attacking, fierce, hard"
    },
    {
        "name": "amplify",
        "word": "Amplify",
        "meaning": "To increase the volume or strength; to make bigger",
        "rap_meaning": "Making it bigger, louder, more intense; elevating everything",
        "syllables": "3 (am-pli-fy)",
        "pos": "Verb",
        "synonyms": "Increase, boost, enhance, magnify, strengthen, intensify",
        "antonyms": "Reduce, diminish, lower, decrease, quiet",
        "rhymes": "END: testify, justify, clarify, simplify, verify / SLANT: terrify, certify / MULTI: exemplify, identify",
        "bars": [
            "Amplify the message till the whole world hear my voice",
            "I amplify success, turn small wins to empires",
            "Amplify the grind, make noise they can't ignore"
        ],
        "punchlines": [
            "Sound system wordplay (turn up the amplifier)",
            "Magnifying glass imagery (amplify to see details)",
            "Echo/loudspeaker references (amplify the message)"
        ],
        "tags": "increase, boost, louder, enhance, elevate"
    },
    {
        "name": "anchor",
        "word": "Anchor",
        "meaning": "A heavy object used to keep a ship in place; something that provides stability",
        "rap_meaning": "What keeps you grounded, your foundation, or what's holding you back",
        "syllables": "2 (an-chor)",
        "pos": "Noun/Verb",
        "synonyms": "Foundation, stability, ground, base, support, hold",
        "antonyms": "Freedom, release, float, drift",
        "rhymes": "END: banker, tanker, ranker / SLANT: anger, danger, stranger / MULTI: thanks her, pranks her",
        "bars": [
            "Family my anchor when the storm of life gets heavy",
            "Cut the anchor loose, I refuse to let nothing hold me back",
            "She my anchor in the chaos, keeps me grounded through it all"
        ],
        "punchlines": [
            "Dual meaning (stability vs burden, depends on context)",
            "Ship metaphor (anchor keeps you safe or keeps you stuck)",
            "News anchor wordplay (you're the main story)"
        ],
        "tags": "stability, grounded, foundation, holding, support"
    },
    {
        "name": "angelic",
        "word": "Angelic",
        "meaning": "Like an angel; pure, beautiful, innocent",
        "rap_meaning": "Pure, heavenly, blessed, beautiful, or ironically contrasting with devil imagery",
        "syllables": "3 (an-gel-ic)",
        "pos": "Adjective",
        "synonyms": "Heavenly, divine, pure, beautiful, innocent, celestial",
        "antonyms": "Demonic, evil, devilish, corrupt, dark",
        "rhymes": "END: relic,elic / SLANT: epic, septic, skeptic / MULTI: angelic, paraplegic",
        "bars": [
            "Face angelic but my hustle got a devilish side",
            "Angelic in appearance, demons dancing in my thoughts",
            "She look angelic till she stunt, then it's hell on earth"
        ],
        "punchlines": [
            "Angel/devil contrast (look angelic, move demonic)",
            "Halo imagery (angelic glow, blessed energy)",
            "Fallen angel reference (started pure, became ruthless)"
        ],
        "tags": "pure, heavenly, angel, divine, beautiful"
    },
    {
        "name": "antagonist",
        "word": "Antagonist",
        "meaning": "An opponent or enemy; someone who opposes the main character",
        "rap_meaning": "The villain in someone's story, the opposition, the one causing problems",
        "syllables": "4 (an-tag-o-nist)",
        "pos": "Noun",
        "synonyms": "Villain, opponent, enemy, adversary, rival, foe",
        "antonyms": "Protagonist, hero, ally, supporter, friend",
        "rhymes": "END: communist, columnist, optimist / SLANT: palms and fists, qualms exist / MULTI:agonist, modernist",
        "bars": [
            "I'm the antagonist in everybody else's success story",
            "Play antagonist to the game, I'm the villain they all need",
            "Cast me as antagonist but I'm the hero of my own plot"
        ],
        "punchlines": [
            "Movie/story structure (protagonist vs antagonist)",
            "Perspective flip (their antagonist, your protagonist)",
            "Embrace the villain role (best antagonist in the game)"
        ],
        "tags": "villain, opponent, enemy, opposition, rival"
    },
    {
        "name": "anthem",
        "word": "Anthem",
        "meaning": "A song of celebration or identity, usually for a group or nation",
        "rap_meaning": "Your signature song, a track that represents you or your movement",
        "syllables": "2 (an-them)",
        "pos": "Noun",
        "synonyms": "Song, hymn, theme, melody, signature, chant",
        "antonyms": "Silence, quiet, whisper",
        "rhymes": "END: them, gem, hem, stem, condemn / SLANT: same, blame, fame / MULTI: phlegm, requiem",
        "bars": [
            "This the anthem for the hustlers grinding through the struggle",
            "Anthem for my city, everybody know the words",
            "Created anthems that outlive me, that's legacy"
        ],
        "punchlines": [
            "National anthem imagery (respected universally)",
            "Movement builder (anthem unites the people)",
            "Sing-along reference (everybody knows your anthem)"
        ],
        "tags": "song, signature, celebration, movement, identity"
    },
    {
        "name": "apocalypse",
        "word": "Apocalypse",
        "meaning": "The end of the world; complete destruction",
        "rap_meaning": "Total destruction, end times, bringing chaos, wiping everything out",
        "syllables": "4 (a-poc-a-lypse)",
        "pos": "Noun",
        "synonyms": "Armageddon, end times, destruction, catastrophe, doomsday, ruin",
        "antonyms": "Beginning, creation, genesis, birth",
        "rhymes": "END: eclipse, lips, tips, scripts, grips / SLANT: flips, ships, trips / MULTI: ellipse, relationships",
        "bars": [
            "Bring apocalypse to the game, watch the whole thing burn",
            "Apocalypse now when I enter, total annihilation",
            "Surviving the apocalypse while others couldn't take the heat"
        ],
        "punchlines": [
            "Biblical imagery (four horsemen of apocalypse)",
            "Movie references (Apocalypse Now)",
            "Survivor angle (after apocalypse, you're still standing)"
        ],
        "tags": "destruction, end, chaos, catastrophe, annihilation"
    },
    {
        "name": "appetite",
        "word": "Appetite",
        "meaning": "A desire or craving for food; strong desire for something",
        "rap_meaning": "Hunger for success, desire for more, craving victory and wealth",
        "syllables": "3 (ap-pe-tite)",
        "pos": "Noun",
        "synonyms": "Hunger, craving, desire, want, yearning, thirst",
        "antonyms": "Satisfaction, fullness, contentment, apathy",
        "rhymes": "END: night, sight, fight, right, might, flight / SLANT: bite, bright, tight / MULTI: dynamite, oversight",
        "bars": [
            "Appetite for success so strong I'll never be satisfied",
            "Voracious appetite, I feast while you nibble on crumbs",
            "Lost my appetite for average, I only hunger for the greatest"
        ],
        "punchlines": [
            "Guns N' Roses reference (Appetite for Destruction)",
            "Hunger metaphor (appetite = ambition)",
            "Feast imagery (big appetite, eat everything)"
        ],
        "tags": "hunger, desire, craving, ambition, want"
    },
    {
        "name": "arbitrary",
        "word": "Arbitrary",
        "meaning": "Random, based on personal whim rather than logic",
        "rap_meaning": "Random, following no rules, doing what you want when you want",
        "syllables": "4 (ar-bi-trar-y)",
        "pos": "Adjective",
        "synonyms": "Random, capricious, whimsical, unpredictable, unreasonable",
        "antonyms": "Systematic, logical, reasoned, planned, deliberate",
        "rhymes": "END: scary, vary, necessary, temporary / SLANT: berry, merry, very / MULTI: extraordinary,ionary",
        "bars": [
            "Moves arbitrary, they can't predict my next position",
            "Success ain't arbitrary, I calculated every step",
            "Arbitrary rules don't apply when you create the game"
        ],
        "punchlines": [
            "Unpredictable advantage (arbitrary moves confuse opponents)",
            "Challenge arbitrary limits (break random rules)",
            "Pattern disruption (arbitrary = can't be tracked)"
        ],
        "tags": "random, unpredictable, whimsical, rules, choice"
    },
    {
        "name": "armor",
        "word": "Armor",
        "meaning": "Protective covering; defense against attack",
        "rap_meaning": "Your protection, defense mechanism, thick skin, what guards you",
        "syllables": "2 (ar-mor)",
        "pos": "Noun",
        "synonyms": "Protection, shield, defense, guard, covering, barrier",
        "antonyms": "Vulnerability, exposure, weakness, openness",
        "rhymes": "END: farmer, charmer, warmer / SLANT: former, performer / MULTI: disarmer, alarmer",
        "bars": [
            "Built armor so thick that your words can't penetrate",
            "Emotional armor on, I don't let nothing hurt me",
            "Suit up in my armor every morning, ready for war"
        ],
        "punchlines": [
            "Knight imagery (shining armor, medieval warrior)",
            "Emotional protection (armor against pain)",
            "Video game reference (armor rating, damage reduction)"
        ],
        "tags": "protection, defense, shield, guard, covering"
    },
    {
        "name": "arrogance",
        "word": "Arrogance",
        "meaning": "Exaggerated sense of importance or abilities",
        "rap_meaning": "Extreme confidence, cocky attitude, knowing you're better",
        "syllables": "3 (ar-ro-gance)",
        "pos": "Noun",
        "synonyms": "Cockiness, pride, conceit, hubris, ego, superiority",
        "antonyms": "Humility, modesty, meekness, self-doubt",
        "rhymes": "END: ignorance, tolerance, dominance / SLANT: confidence, providence / MULTI: intolerance, reconnaissance",
        "bars": [
            "Arrogance dripping when I talk cause I earned every flex",
            "Confuse my arrogance for confidence, same energy",
            "Arrogance on display but I got the wins to back it"
        ],
        "punchlines": [
            "Earned vs unearned arrogance (you have the receipts)",
            "Thin line between confidence and arrogance",
            "Arrogance as armor (protect yourself with ego)"
        ],
        "tags": "confidence, pride, ego, cocky, superiority"
    },
    {
        "name": "artillery",
        "word": "Artillery",
        "meaning": "Large-caliber guns used in warfare; heavy weaponry",
        "rap_meaning": "Your heavy weapons, biggest bars, most powerful ammunition",
        "syllables": "4 (ar-til-ler-y)",
        "pos": "Noun",
        "synonyms": "Weapons, firepower, ammunition, arms, cannons, arsenal",
        "antonyms": "Defense, shield, protection, peaceful",
        "rhymes": "END:illery, distillery / SLANT: literally, miserably / MULTI: militarily, necessarily",
        "bars": [
            "Artillery so heavy when I fire, leave the whole game shook",
            "Verbal artillery loaded, I'm bout to bomb the whole track",
            "Brought the artillery out, this ain't no regular battle"
        ],
        "punchlines": [
            "War imagery (bring out heavy artillery for big battles)",
            "Caliber wordplay (artillery = biggest guns = best bars)",
            "Overkill reference (artillery for small opponent)"
        ],
        "tags": "weapons, firepower, heavy, ammunition, warfare"
    },
    {
        "name": "assassinate",
        "word": "Assassinate",
        "meaning": "To murder someone for political or monetary reasons",
        "rap_meaning": "Destroy the competition, kill it on the track, execute perfectly",
        "syllables": "4 (as-sas-si-nate)",
        "pos": "Verb",
        "synonyms": "Kill, eliminate, execute, murder, destroy, terminate",
        "antonyms": "Protect, save, preserve, defend, guard",
        "rhymes": "END: dominate, nominate, contemplate, calculate / SLANT: late, hate, fate / MULTI: exterminate, discriminate",
        "bars": [
            "Assassinate the competition with precision and no trace",
            "I assassinate beats, leave no survivors on the track",
            "Came to assassinate the game, call it premeditated"
        ],
        "punchlines": [
            "Political murder imagery (take out leaders)",
            "Clean execution (assassinate = perfect kill)",
            "Character assassination (destroy reputation)"
        ],
        "tags": "kill, destroy, execute, eliminate, competition"
    },
    {
        "name": "atomic",
        "word": "Atomic",
        "meaning": "Relating to atoms; extremely powerful like a nuclear weapon",
        "rap_meaning": "Explosive power, nuclear-level impact, massive energy",
        "syllables": "3 (a-tom-ic)",
        "pos": "Adjective",
        "synonyms": "Nuclear, explosive, powerful, devastating, massive, bomb",
        "antonyms": "Weak, small, powerless, insignificant",
        "rhymes": "END: comic, economic, chronic / SLANT: vomit, comet / MULTI: subatomic, anatomic",
        "bars": [
            "Atomic when I blow, leave fallout on the whole industry",
            "Energy atomic, I'm explosive when I'm in my zone",
            "Atomic level bars, I'm splitting atoms with the syllables"
        ],
        "punchlines": [
            "Nuclear explosion imagery (atomic bomb devastation)",
            "Science wordplay (atomic structure, split the atom)",
            "Power levels (atomic = highest energy)"
        ],
        "tags": "explosive, powerful, nuclear, energy, massive"
    },
    {
        "name": "atrocious",
        "word": "Atrocious",
        "meaning": "Horrifyingly bad; extremely cruel or wicked",
        "rap_meaning": "Terrible, horrible, or doing terrible things to the competition",
        "syllables": "3 (a-tro-cious)",
        "pos": "Adjective",
        "synonyms": "Horrible, terrible, awful, heinous, brutal, wicked",
        "antonyms": "Excellent, wonderful, great, kind, gentle",
        "rhymes": "END: ferocious, precocious / SLANT: vicious, precious, spacious / MULTI: atrocious, ferocious",
        "bars": [
            "Atrocious what I do to beats, it's criminal how I kill it",
            "Competition atrocious, that's why I stay on top",
            "Atrocious with the flow, I'm committing lyrical murder"
        ],
        "punchlines": [
            "Double meaning (bad vs doing bad things)",
            "Crime imagery (atrocious acts, heinous crimes)",
            "Contrast (they're atrocious = bad, you're atrocious = deadly)"
        ],
        "tags": "terrible, brutal, wicked, extreme, cruel"
    },
    {
        "name": "authority",
        "word": "Authority",
        "meaning": "The power or right to give orders and enforce obedience",
        "rap_meaning": "Power, control, being in charge, having the final say",
        "syllables": "4 (au-thor-i-ty)",
        "pos": "Noun",
        "synonyms": "Power, control, command, dominance, jurisdiction, rule",
        "antonyms": "Powerlessness, submission, subordination, weakness",
        "rhymes": "END: majority, minority, priority,ority / SLANT: sorority, inferiority / MULTI: superiority, seniority",
        "bars": [
            "Authority in my voice when I speak, you better listen",
            "Question my authority and find out who really run this",
            "I got authority in the game, crowned myself king"
        ],
        "punchlines": [
            "Power structure wordplay (authority figure)",
            "Respect imagery (authority commands respect)",
            "Question authority (rebel vs establish your own)"
        ],
        "tags": "power, control, command, dominance, leadership"
    },
    {
        "name": "autonomous",
        "word": "Autonomous",
        "meaning": "Self-governing; independent; not controlled by others",
        "rap_meaning": "Independent, self-sufficient, not needing anyone, making your own rules",
        "syllables": "4 (au-ton-o-mous)",
        "pos": "Adjective",
        "synonyms": "Independent, self-governing, self-sufficient, free, sovereign",
        "antonyms": "Dependent, controlled, governed, reliant",
        "rhymes": "END: monotonous, anonymous, synonymous / SLANT: ominous, promise / MULTI: autonomous, promise us",
        "bars": [
            "Autonomous in my grind, I don't need no co-sign",
            "Move autonomous, no strings attached to my success",
            "Autonomous entity, I'm self-made from the ground"
        ],
        "punchlines": [
            "Robot/AI wordplay (autonomous vehicle, self-driving)",
            "Independence imagery (autonomous = free from control)",
            "Self-made angle (autonomous success, no help needed)"
        ],
        "tags": "independent, self-sufficient, free, autonomous, control"
    },
    {
        "name": "avarice",
        "word": "Avarice",
        "meaning": "Extreme greed for wealth or material gain",
        "rap_meaning": "Greed for money and success, insatiable desire for more",
        "syllables": "3 (av-a-rice)",
        "pos": "Noun",
        "synonyms": "Greed, cupidity, covetousness, acquisitiveness, materialism",
        "antonyms": "Generosity, selflessness, charity, contentment",
        "rhymes": "END: Paris, embarrass, harass / SLANT: various, hilarious / MULTI: nefarious, precarious",
        "bars": [
            "Avarice in my heart, I want it all and then some more",
            "Fueled by avarice, I chase the bag with no apologies",
            "Avarice is the engine, greed become my motivation"
        ],
        "punchlines": [
            "Seven deadly sins reference (avarice = greed)",
            "Insatiable hunger (never satisfied, always want more)",
            "Contrast with generosity (avarice vs giving back)"
        ],
        "tags": "greed, money, desire, materialism, hunger"
    },
    {
        "name": "avenue",
        "word": "Avenue",
        "meaning": "A wide street; a way of approaching a problem or making progress",
        "rap_meaning": "A path to success, multiple options/routes, street you're from",
        "syllables": "3 (av-e-nue)",
        "pos": "Noun",
        "synonyms": "Street, road, path, route, way, boulevard",
        "antonyms": "Dead end, obstacle, barrier, blockage",
        "rhymes": "END: revenue, rendezvous, déjà vu, residue / SLANT: value, rescue, venue / MULTI: interview, overview",
        "bars": [
            "Explore every avenue till I find the one that pay",
            "Multiple avenues to success, I'm taking all of them",
            "From the avenue where dreams die, I made it out alive"
        ],
        "punchlines": [
            "Revenue wordplay (avenue to revenue)",
            "Street reference (what avenue you from)",
            "Multiple paths imagery (explore all avenues)"
        ],
        "tags": "path, route, street, options, way"
    },
    {
        "name": "awaken",
        "word": "Awaken",
        "meaning": "To wake up; to become aware or conscious",
        "rap_meaning": "Waking up to the truth, becoming conscious, realizing your potential",
        "syllables": "3 (a-wak-en)",
        "pos": "Verb",
        "synonyms": "Wake, arise, rouse, activate, enlighten, realize",
        "antonyms": "Sleep, slumber, ignore, suppress, dormant",
        "rhymes": "END: taken, shaken, mistaken, forsaken, bacon / SLANT: breakin', makin', fakin' / MULTI: reawaken, overtaken",
        "bars": [
            "Awaken the beast inside, unleash what I been hiding",
            "I awaken to my purpose, now I'm moving with intention",
            "They tried to keep me sleep, but I awaken to the game"
        ],
        "punchlines": [
            "Sleeping giant imagery (awaken the monster)",
            "Woke/consciousness wordplay (awaken to truth)",
            "Power activation (awaken dormant abilities)"
        ],
        "tags": "wake, awareness, consciousness, realize, activate"
    },
    {
        "name": "acknowledge",
        "word": "Acknowledge",
        "meaning": "To accept or admit the existence or truth of something",
        "rap_meaning": "Recognize game, give props, admit the truth, respect what's real",
        "syllables": "3 (ac-knowl-edge)",
        "pos": "Verb",
        "synonyms": "Recognize, admit, accept, respect, validate, confirm",
        "antonyms": "Deny, ignore, reject, dismiss, disregard",
        "rhymes": "END: knowledge, college, polish / SLANT: homage, bondage / MULTI: acknowledge, rock the ledge",
        "bars": [
            "Acknowledge the realest when you see me, show respect",
            "They refuse to acknowledge greatness standing right in front",
            "I acknowledge all my blessings, gratitude is how I move"
        ],
        "punchlines": [
            "Respect imagery (acknowledge = give recognition)",
            "Truth acceptance (acknowledge what's real)",
            "Credit where due (acknowledge who paved the way)"
        ],
        "tags": "recognize, respect, admit, accept, validate"
    },
    {
        "name": "acrobatic",
        "word": "Acrobatic",
        "meaning": "Involving spectacular gymnastic feats; agile and flexible",
        "rap_meaning": "Flexible flow, gymnastic wordplay, flipping styles effortlessly",
        "syllables": "4 (ac-ro-bat-ic)",
        "pos": "Adjective",
        "synonyms": "Gymnastic, agile, flexible, nimble, athletic, dynamic",
        "antonyms": "Stiff, rigid, clumsy, awkward, inflexible",
        "rhymes": "END: automatic, dramatic, static, emphatic / SLANT:matic, attic / MULTI: cinematic, systematic",
        "bars": [
            "Acrobatic with the flow, I'm flipping through the syllables",
            "Wordplay acrobatic, watch me flip the whole perspective",
            "Acrobatic on the beat, I somersault through every bar"
        ],
        "punchlines": [
            "Gymnastics imagery (flips, tricks, flexibility)",
            "Flow switching (acrobatic = change styles mid-verse)",
            "Mental gymnastics (acrobatic thinking, flip concepts)"
        ],
        "tags": "flexible, agile, gymnastic, dynamic, flow"
    },
    {
        "name": "adamant",
        "word": "Adamant",
        "meaning": "Refusing to change one's mind; unshakeable",
        "rap_meaning": "Firm in your position, unshakeable resolve, won't back down",
        "syllables": "3 (ad-a-mant)",
        "pos": "Adjective",
        "synonyms": "Firm, resolute, determined, stubborn, unwavering, steadfast",
        "antonyms": "Flexible, uncertain, wavering, compromising, weak",
        "rhymes": "END: planet, granite, man it / SLANT: damage, manage, vanish / MULTI: can it, plan it",
        "bars": [
            "Adamant about success, you couldn't change my mind if you tried",
            "I'm adamant in my pursuit, no negotiating with the vision",
            "Adamant stance, I plant my feet and never back down"
        ],
        "punchlines": [
            "Unmovable object imagery (adamant like stone)",
            "Negotiation wordplay (adamant = non-negotiable)",
            "Adamantium reference (X-Men, unbreakable)"
        ],
        "tags": "firm, determined, unshakeable, stubborn, resolute"
    },
    {
        "name": "abstract",
        "word": "Abstract",
        "meaning": "Existing in thought or as an idea but not having physical form",
        "rap_meaning": "Conceptual, deep thoughts, artistic, non-literal wordplay",
        "syllables": "2 (ab-stract)",
        "pos": "Adjective/Noun",
        "synonyms": "Conceptual, theoretical, intangible, complex, artistic, vague",
        "antonyms": "Concrete, literal, physical, simple, clear",
        "rhymes": "END: impact, contact, exact, intact, react / SLANT: attract, distract / MULTI: counteract, interact",
        "bars": [
            "Abstract thoughts manifested into concrete reality",
            "My wordplay abstract, you need a degree to decode it",
            "Paint abstract pictures with words, call it verbal art"
        ],
        "punchlines": [
            "Art reference (abstract painting, interpret differently)",
            "Concrete vs abstract (ideas become real)",
            "Complexity flex (too abstract for simple minds)"
        ],
        "tags": "conceptual, artistic, complex, deep, theoretical"
    }
]

def create_word(word_data):
    """Create a word folder with filled template"""
    word_folder = Path(ROOT_PATH) / word_data["name"]
    word_folder.mkdir(exist_ok=True)

    # Create the word.md file with filled template
    template = f"""# WORD: {word_data["word"]}

## Meaning (plain):
{word_data["meaning"]}

## Rap meaning (how I'd say it):
{word_data["rap_meaning"]}

## Syllables:
{word_data["syllables"]}

## Part of speech:
{word_data["pos"]}

## Synonyms:
{word_data["synonyms"]}

## Antonyms:
{word_data["antonyms"]}

## Rhyme ideas (end / slant / multi):
{word_data["rhymes"]}

## 3 bar-ready examples:
1. {word_data["bars"][0]}
2. {word_data["bars"][1]}
3. {word_data["bars"][2]}

## 3 punchline angles:
1. {word_data["punchlines"][0]}
2. {word_data["punchlines"][1]}
3. {word_data["punchlines"][2]}

## Tags:
{word_data["tags"]}
"""

    word_file = word_folder / "word.md"
    word_file.write_text(template, encoding='utf-8')
    print(f"[+] Created: {word_data['name']}")

def main():
    print(f"\nAdding 50 A-words to Rap Dictionary Master Hub...\n")

    for word_data in WORDS:
        create_word(word_data)

    print(f"\n[✓] Successfully added 50 words to the A folder!")
    print(f"[✓] Location: {ROOT_PATH}\n")

if __name__ == "__main__":
    main()
