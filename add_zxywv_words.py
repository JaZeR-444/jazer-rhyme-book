#!/usr/bin/env python3
import os
import sys
from pathlib import Path

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

BASE_PATH = r"C:\Users\JaZeR\OneDrive\Desktop\2026 → JaZeR Mainframe\2026 → JaZeR Master Flow Knowledge Hub\Rap_Dictionary_Master_Hub"

WORDS = [
    # --- Z WORDS ---
    {
        "name": "zenith", "word": "Zenith", "letter": "Z",
        "meaning": "The highest point reached by a celestial body; a peak or climax",
        "rap_meaning": "The absolute top of the rap game, the peak of success, highest level possible",
        "syllables": "2 (ze-nith)", "pos": "Noun",
        "synonyms": "Peak, summit, apex, pinnacle, height, top",
        "antonyms": "Nadir, bottom, base, low",
        "rhymes": "END: teeth, beneath, sheath, wreath / SLANT: finish, diminish / MULTI: replenish, tennis",
        "bars": [
            "Reached the zenith, look down on the clouds from my view",
            "My career at the zenith, yours grounded and stuck",
            "Zenith of the culture, I represent the highest form"
        ],
        "punchlines": [
            "Astronomical imagery (sun at zenith)",
            "Height comparison (you're at base, I'm at zenith)",
            "Unreachable status (too high to touch)"
        ],
        "tags": "peak, top, success, height, climax"
    },
    {
        "name": "zero", "word": "Zero", "letter": "Z",
        "meaning": "The numerical value 0; nothing",
        "rap_meaning": "Starting from nothing (ground zero), having zero tolerance, or adding zeros to the bank account",
        "syllables": "2 (ze-ro)", "pos": "Noun/Number",
        "synonyms": "Naught, nil, nothing, void, cipher",
        "antonyms": "Infinity, plenty, all, everything",
        "rhymes": "END: hero, nero, bureau / SLANT: arrow, marrow / MULTI: dinero, sombrero",
        "bars": [
            "Started from zero, now the bank account got six of 'em",
            "Zero tolerance for the fake, I cut 'em off quick",
            "From ground zero to the skyline, watch the elevation"
        ],
        "punchlines": [
            "Bank account math (adding zeros)",
            "Origin story (from zero to hero)",
            "Tolerance level (zero patience)"
        ],
        "tags": "money, start, nothing, tolerance, numbers"
    },
    {
        "name": "zone", "word": "Zone", "letter": "Z",
        "meaning": "An area or stretch of land; a state of focused attention",
        "rap_meaning": "In the zone (flow state), your hood/territory, or blocking people out",
        "syllables": "1 (zone)", "pos": "Noun",
        "synonyms": "Area, region, sector, territory, district",
        "antonyms": "Distracted, scattered, everywhere",
        "rhymes": "END: bone, tone, stone, throne, phone, alone / SLANT: dawn, gone / MULTI: unknown, cyclone",
        "bars": [
            "I'm in my zone, don't disturb the process",
            "Locked in the zone, everything else fades to black",
            "This a no-fly zone for the snakes and the rats"
        ],
        "punchlines": [
            "Basketball reference (zone defense)",
            "Mental state (deep focus, locked in)",
            "Territorial claim (this is my zone)"
        ],
        "tags": "focus, territory, flow, state, area"
    },
    {
        "name": "zeal", "word": "Zeal", "letter": "Z",
        "meaning": "Great energy or enthusiasm in pursuit of a cause",
        "rap_meaning": "Inense passion for the grind, energy that can't be stopped, hustle spirit",
        "syllables": "1 (zeal)", "pos": "Noun",
        "synonyms": "Passion, enthusiasm, loops, energy, fire, drive",
        "antonyms": "Apathy, indifference, lethargy, coolness",
        "rhymes": "END: real, feel, deal, steel, meal, heal / SLANT: still, fill / MULTI: ideal, reveal, appeal",
        "bars": [
            "Attack the beat with zeal, you can feel the hunger",
            "Lost the deal but kept the zeal, made it back double",
            "Moving with zeal, my energy real, yours is synthetic"
        ],
        "punchlines": [
            "Religious zealot comparison (fanatical about success)",
            "Energy contrast (zeal vs laziness)",
            "Fire imagery (burning with zeal)"
        ],
        "tags": "passion, energy, drive, enthusiasm, fire"
    },
    {
        "name": "zigzag", "word": "Zigzag", "letter": "Z",
        "meaning": "A line or course having abrupt alternate right and left turns",
        "rap_meaning": "Moving evasively, dodging the law or haters, unpredictable path to success",
        "syllables": "2 (zig-zag)", "pos": "Verb/Noun",
        "synonyms": "Weave, snake, meander, dodge, twist",
        "antonyms": "Straight, direct, linear",
        "rhymes": "END: bag, flag, drag, swag, tag / SLANT: back, track / MULTI: jet lag, toe tag",
        "bars": [
            "Zigzag through the traffic, racing to the money",
            "Move in a zigzag so the ops can't track the pattern",
            "Life went zigzag but I still found the straight line"
        ],
        "punchlines": [
            "Evasion tactics (dodging bullets/hate)",
            "Non-linear path (success isn't a straight line)",
            "Pattern disruption (confusing the enemy)"
        ],
        "tags": "movement, evasion, unpredictable, path, dodge"
    },
    {
        "name": "zombie", "word": "Zombie", "letter": "Z",
        "meaning": "A corpse said to be revived; a person who is dispirited or mindless",
        "rap_meaning": "Mindless followers, drug addicts (fiends), or being up all night grinding (zombie mode)",
        "syllables": "2 (zom-bie)", "pos": "Noun",
        "synonyms": "Undead, walker, mindless, drone, sleepless",
        "antonyms": "Alive, awake, conscious, alert",
        "rhymes": "END: lobby, hobby, copy / SLANT: body, nobody / MULTI: tsunami, origami",
        "bars": [
            "Zombie mode in the studio, sleep when I'm dead",
            "Walking zombies in the streets chasing that venom",
            "Brain dead competition, they moving like zombies"
        ],
        "punchlines": [
            "Walking Dead references",
            "Sleep deprivation (grinding like a zombie)",
            "Mindlessness (following trends blindly)"
        ],
        "tags": "grind, mindless, followers, sleep, scary"
    },
    {
        "name": "zoo", "word": "Zoo", "letter": "Z",
        "meaning": "Establishment where wild animals are kept; a state of confusion/chaos",
        "rap_meaning": "The hood (wild animals), chaos, prison, or a crazy party environment",
        "syllables": "1 (zoo)", "pos": "Noun",
        "synonyms": "Menagerie, jungle, chaos, bedlam, madhouse",
        "antonyms": "Sanctuary, library, order, peace",
        "rhymes": "END: do, who, true, crew, new, blue / SLANT: through, view / MULTI: bamboo, canoe",
        "bars": [
            "Welcome to the zoo, where the lions eat the weak",
            "Trapped in this zoo, bars keeping us from current",
            "My life a zoo, wild animals watching my every move"
        ],
        "punchlines": [
            "Animal metaphors (lions, apes, cages)",
            "Prison slang (the zoo)",
            "Chaotic environment description"
        ],
        "tags": "chaos, wild, hood, prison, animals"
    },
    {
        "name": "zoom", "word": "Zoom", "letter": "Z",
        "meaning": "Move or travel very quickly; focus with a camera",
        "rap_meaning": "Moving fast (cars, money), focusing in on the target, leaving people behind",
        "syllables": "1 (zoom)", "pos": "Verb",
        "synonyms": "Speed, rush, dash, focus, magnify",
        "antonyms": "Crawl, slow, blur, pan out",
        "rhymes": "END: room, boom, gloom, tomb, bloom / SLANT: fume, tune / MULTI: consume, perfume",
        "bars": [
            "Zoom past the haters in a foreign, catch the blur",
            "Lens zoom in, I see the fear in your eyes clearly",
            "Zoom to the top, skipped the stairs took the rocket"
        ],
        "punchlines": [
            "Car/Speed noises/onomatopoeia",
            "Camera lens imagery (zoom in on details)",
            "Video call reference (meeting on Zoom vs in person)"
        ],
        "tags": "speed, focus, fast, cars, vision"
    },
    {
        "name": "zodiac", "word": "Zodiac",
        "meaning": "Belt of the heavens divided into twelve signs",
        "rap_meaning": "Destiny, stars aligning, personality traits, reading people",
        "letter": "Z",
        "syllables": "3 (zo-di-ac)", "pos": "Noun",
        "synonyms": "Horoscope, astrology, signs, stars, destiny",
        "antonyms": "Chaos, random, earth",
        "rhymes": "END: maniac, cardiac, cadillac / SLANT: back, track / MULTI: aphrodisiac, insomniac",
        "bars": [
            "Written in the zodiac, my success was destined",
            "What's your zodiac? I can tell you a snake by the sign",
            "Aligned like the zodiac, stars pointing to the crown"
        ],
        "punchlines": [
            "Astrology references (Leo, Scorpio, etc.)",
            "Killer reference (Zodiac killer - unnamed, dangerous)",
            "Destiny/writte in stars imagery"
        ],
        "tags": "destiny, stars, signs, astrology, fate"
    },
    {
        "name": "zen", "word": "Zen", "letter": "Z",
        "meaning": "A state of calm attentiveness; intuition",
        "rap_meaning": "Inner peace amidst chaos, cool under pressure, enlightened mindset",
        "syllables": "1 (zen)", "pos": "Adjective/Noun",
        "synonyms": "Calm, peace, balance, enlightenment, tranquility",
        "antonyms": "Chaos, stress, panic, frenzy",
        "rhymes": "END: pen, ten, den, men, when / SLANT: in, pin / MULTI: again, amen",
        "bars": [
            "Found my zen in the middle of the war zone",
            "Protect my zen, bad energy gets blocked at the door",
            "Mastering the zen, stay calm while I execute the plan"
        ],
        "punchlines": [
            "Meditation imagery",
            "Martial arts focus",
            "Contrast (chaos around, zen inside)"
        ],
        "tags": "peace, calm, balance, mind, focus"
    },

    # --- X WORDS ---
    {
        "name": "xenon", "word": "Xenon", "letter": "X",
        "meaning": "A chemical element; a heavy noble gas used in lights",
        "rap_meaning": "Bright lights, headlights on luxury cars, noble/elite status, invisible but heavy",
        "syllables": "2 (xe-non)", "pos": "Noun",
        "synonyms": "Gas, light, element, noble gas",
        "antonyms": "Darkness, solid",
        "rhymes": "END: phenomenon, dawn, gone / SLANT: venom, denim / MULTI: armageddon, pentagon",
        "bars": [
            "Xenon lights blinding when I pull up in the wraith",
            "Noble like xenon, I react to nothing, stable flow",
            "Bright as xenon, shine through the darkest nights"
        ],
        "punchlines": [
            "Car headlight flex (blue xenon lights)",
            "Chemistry reference (noble gas = untoucheable)",
            "Flash/brightness imagery"
        ],
        "tags": "lights, cars, bright, science, elite"
    },
    {
        "name": "x-ray", "word": "X-ray", "letter": "X",
        "meaning": "Electromagnetic wave used to see inside solid objects",
        "rap_meaning": "Seeing through the fake, inner vision, exposing the real, deep insight",
        "syllables": "2 (x-ray)", "pos": "Noun/Verb",
        "synonyms": "Radiograph, scan, vision, insight, expose",
        "antonyms": "Blindness, cover, mask",
        "rhymes": "END: day, play, say, way, gray / SLANT: high, eye / MULTI: essay, display, betray",
        "bars": [
            "Got x-ray vision, I see right through the facade",
            "X-ray the game, all I see is broken bones and fakes",
            "See the heart with the x-ray, yours pumpin' fear"
        ],
        "punchlines": [
            "Superman vision reference",
            "Medical metaphors (broken, scanning)",
            "Exposing truth (seeing what's hidden)"
        ],
        "tags": "vision, truth, expose, see, insight"
    },
    {
        "name": "x-factor", "word": "X-factor", "letter": "X",
        "meaning": "A variable in a given situation that could have the most significant impact",
        "rap_meaning": "That special something, undefinable talent, the game changer",
        "syllables": "3 (x-fac-tor)", "pos": "Noun",
        "synonyms": "Talent, variable, special, unique, key",
        "antonyms": "Average, standard, known, boring",
        "rhymes": "END: tractor, actor, reactor / SLANT: after, master / MULTI: contractor, protractor",
        "bars": [
            "I got the x-factor, you can't teach this level of cool",
            "Variable X, I'm the factor that changes the whole equation",
            "Looking for the x-factor but I'm the only one who has it"
        ],
        "punchlines": [
            "TV Show reference (The X Factor)",
            "Math variable (solve for X)",
            "Unexplainable appeal"
        ],
        "tags": "talent, special, unique, star, game-changer"
    },
    {
        "name": "xerox", "word": "Xerox",
        "letter": "X",
        "meaning": "To copy a document; a photocopy",
        "rap_meaning": "Copycats, biters, people stealing flows, not original",
        "syllables": "2 (xe-rox)", "pos": "Verb/Noun",
        "synonyms": "Copy, duplicate, clone, replicate, bite",
        "antonyms": "Original, create, unique, prototype",
        "rhymes": "END: blocks, stocks, box, fox, locks / SLANT: rocks, talks / MULTI: paradox, orthodox",
        "bars": [
            "You just a xerox copy of a copy, fading out",
            "Try to xerox the style but the quality degrades",
            "No xerox in my DNA, one of one, no duplicates"
        ],
        "punchlines": [
            "Office machine imagery (jamming, running out of toner)",
            "Fading quality of copies",
            "Identity theft/biting flows"
        ],
        "tags": "copy, fake, clone, bite, original"
    },
    {
        "name": "xenophobia", "word": "Xenophobia", "letter": "X",
        "meaning": "Dislike of or prejudice against people from other countries",
        "rap_meaning": "Fear of the outsider/alien (you being the alien), people scared of what they don't know",
        "syllables": "5 (xen-o-pho-bi-a)", "pos": "Noun",
        "synonyms": "Prejudice, fear, intolerance, bigotry",
        "antonyms": "Acceptance, tolerance, welcome, love",
        "rhymes": "END: phobia, utopia / SLANT: area, malaria / MULTI: claustrophobia, cornucopia",
        "bars": [
            "Their xenophobia showing, they scared of the foreign whip",
            "Alien to this world, treated with xenophobia",
            "Conquer the fear, crush the xenophobia with success"
        ],
        "punchlines": [
            "Alien/ET metaphors (being different scares locals)",
            "Social commentary",
            "Foreign car wordplay"
        ],
        "tags": "fear, different, foreign, alien, hate"
    },
    {
        "name": "xylophone", "word": "Xylophone", "letter": "X",
        "meaning": "Musical instrument played by striking wooden bars",
        "rap_meaning": "Playing the game like an instrument, hitting the right notes, ribcage imagery (skeleton)",
        "syllables": "3 (xy-lo-phone)", "pos": "Noun",
        "synonyms": "Instrument, bars, music, bones",
        "antonyms": "Silence, noise",
        "rhymes": "END: tone, bone, phone, zone, alone / SLANT: gone, dawn / MULTI: microphone, megaphone",
        "bars": [
            "Play your ribcage like a xylophone, stick to the beat",
            "Hitting notes like a xylophone, colorful melody",
            "Basic like a kid playing xylophone, I'm the symphony"
        ],
        "punchlines": [
            "Skeleton/Ribs visually look like xylophone bars",
            "Child's toy contrast vs Pro instrument",
            "Striking bars (musical and lyrical)"
        ],
        "tags": "music, instrument, body, bones, play"
    },
    {
        "name": "x", "word": "X", "letter": "X",
        "meaning": "The unknown quantity; the mark used to sign or cross out",
        "rap_meaning": "Malcolm X (revolution), X marks the spot (treasure/target), crossing people out",
        "syllables": "1 (x)", "pos": "Noun",
        "synonyms": "Cross, ten, mark, unknown, target",
        "antonyms": "Check, known, blank",
        "rhymes": "END: sex, flex, checks, next, hex / SLANT: wrecks, specs / MULTI: complex, reflex",
        "bars": [
            "X marks the spot where the treasure gets buried deep",
            "Cross 'em out with a big X, you are not valid",
            "Like Malcolm X, I stand for the cause by any means"
        ],
        "punchlines": [
            "Malcolm X reference",
            "Pirate map (X marks the spot)",
            "Roman numeral 10 (Ten toes down)"
        ],
        "tags": "mark, target, cross, unknown, revolution"
    },
    {
        "name": "xl", "word": "XL", "letter": "X",
        "meaning": "Extra Large",
        "rap_meaning": "Living large, big money, oversize clothes, huge impact",
        "syllables": "2 (x-l)", "pos": "Adjective",
        "synonyms": "Huge, big, large, giant, massive",
        "antonyms": "Small, tiny, petite, xs",
        "rhymes": "END: hell, well, sell, bell, tell / SLANT: fail, mail / MULTI: excel, rebel",
        "bars": [
            "Living life XL, everything I do is oversize",
            "Money bags XL, can't fit 'em in the safe no more",
            "Ego XL, I barely allow room for yours"
        ],
        "punchlines": [
            "Clothing size metaphors",
            "Roman numeral 40 (XL)",
            "Living larger than life"
        ],
        "tags": "big, large, size, money, massive"
    },
    {
        "name": "x-rated", "word": "X-rated",
        "meaning": "Pornographic; suitable only for adults",
        "rap_meaning": "Explicit, raw, uncensored, too real for TV, hardcore",
        "letter": "X",
        "syllables": "3 (x-ra-ted)", "pos": "Adjective",
        "synonyms": "Explicit, adult, raw, dirty, uncensored",
        "antonyms": "Clean, pg, family, censored",
        "rhymes": "END: faded, hated, dated, waited / SLANT: made it, trade it / MULTI: overrated, complicated",
        "bars": [
            "My life is X-rated, scenes too graphic for the screen",
            "Lyrics X-rated but the truth is always naked",
            "Flow disgusting and X-rated, cover your children's ears"
        ],
        "punchlines": [
            "Movie rating metaphor",
            "Naked truth",
            "Explicit content warning"
        ],
        "tags": "raw, explicit, adult, real, hardcore"
    },
    {
        "name": "x-coordinate", "word": "X-coordinate", "letter": "X",
        "meaning": "Horizontal position on a graph",
        "rap_meaning": "Knowing your position, mapping the game, staying horizontal (sleeping/dead) vs vertical",
        "syllables": "4 (x-co-or-di-nate)", "pos": "Noun",
        "synonyms": "Position, location, axis, point",
        "antonyms": "Y-coordinate, vertical",
        "rhymes": "END: subordinate, inordinate / SLANT: wait, gate / MULTI: coordinate, unfortunate",
        "bars": [
            "Check my X-coordinate, I'm miles ahead of the start",
            "Plotting on the map, X-coordinate set to the stash",
            "You functional like whitespace, I'm the coordinate that matters"
        ],
        "punchlines": [
            "Graph/Math imagery",
            "Mapping success",
            "Targeting systems"
        ],
        "tags": "math, map, position, location, plan"
    },

    # --- Y WORDS ---
    {
        "name": "yearn", "word": "Yearn", "letter": "Y",
        "meaning": "Have an intense feeling of loss or lack and longing for something",
        "rap_meaning": "Deep hunger for success, missing the fallen, desperate want",
        "syllables": "1 (yearn)", "pos": "Verb",
        "synonyms": "Long, crave, desire, want, hunger",
        "antonyms": "Hate, loathe, dislike, reject",
        "rhymes": "END: burn, turn, learn, earn, urn / SLANT: firm, term / MULTI: return, concern",
        "bars": [
            "Yearn for the crown so bad I can taste the gold",
            "Make the streets yearn for my return like a savior",
            "I don't yearn for attention, I demand respect"
        ],
        "punchlines": [
            "Burning desire (yearn/burn)",
            "Nostalgia vs Ambition",
            "Addiction metaphor"
        ],
        "tags": "desire, want, hunger, missing, longing"
    },
    {
        "name": "yield", "word": "Yield", "letter": "Y",
        "meaning": "To produce or provide; to give way to arguments, demands, or pressure",
        "rap_meaning": "Investments yielding profit, never yielding to pressure (no surrender)",
        "syllables": "1 (yield)", "pos": "Verb/Noun",
        "synonyms": "Produce, give, surrender, submit, generate",
        "antonyms": "Resist, keep, withhold, fight",
        "rhymes": "END: field, shield, sealed, healed, peeled / SLANT: build, filled / MULTI: revealed, concealed",
        "bars": [
            "High yield returns on every risk I computed",
            "Never yield to the pressure, diamonds form in the stress",
            "I make the game yield to my will, total control"
        ],
        "punchlines": [
            "Traffic sign (Yield sign - I don't stop)",
            "Financials (Yielding profit)",
            "Warfare (Never surrender/yield)"
        ],
        "tags": "money, profit, surrender, pressure, control"
    },
    {
        "name": "young", "word": "Young", "letter": "Y",
        "meaning": "Having lived or existed for only a short time",
        "rap_meaning": "Young money, youth energy, young OG, dying young mythos",
        "syllables": "1 (young)", "pos": "Adjective",
        "synonyms": "Youthful, new, fresh, junior, early",
        "antonyms": "Old, mature, ancient, senior",
        "rhymes": "END: hung, lung, sung, tongue, rung / SLANT: gun, run / MULTI: among, unsung",
        "bars": [
            "Young soul but the mind is ancient with wisdom",
            "Die a hero or live long, I'm forever young",
            "Young kings taking over, the old guard expiring"
        ],
        "punchlines": [
            "Age vs Experience paradox",
            "Forever Young references",
            "Prince/King dynamic"
        ],
        "tags": "youth, age, new, fresh, energy"
    },
    {
        "name": "yesterday", "word": "Yesterday", "letter": "Y",
        "meaning": "The day before today",
        "rap_meaning": "The past, old news, moving on quickly, forgetting struggles",
        "syllables": "3 (yes-ter-day)", "pos": "Noun",
        "synonyms": "Past, history, before, bygone",
        "antonyms": "Tomorrow, today, future",
        "rhymes": "END: play, say, way, spray, gray / SLANT: holiday, far away / MULTI: resume, cast away",
        "bars": [
            "Yesterday's price is not today's price",
            "Live like there's no yesterday, no regrets in the rear",
            "You stuck in yesterday, I'm living in 3025"
        ],
        "punchlines": [
            "Fat Joe reference (Yesterday's price)",
            "Time travel imagery",
            "Memory loss (forgot yesterday)"
        ],
        "tags": "time, past, history, old, news"
    },
    {
        "name": "yellow", "word": "Yellow", "letter": "Y",
        "meaning": "A color; cowardly",
        "rap_meaning": "Yellow gold, yellow diamonds (canary), caution tape, or being scared",
        "syllables": "2 (yel-low)", "pos": "Adjective/Noun",
        "synonyms": "Gold, blonde, amber, scared, chicken",
        "antonyms": "Brave, bold",
        "rhymes": "END: fellow, mellow, cello, bellow / SLANT: shallow, hollow / MULTI: marshmallow, bordello",
        "bars": [
            "Yellow diamonds dancing like they pissing on your watch",
            "No yellow streak in my spine, heart made of iron",
            "Yellow tape the scene, homicide on the beat"
        ],
        "punchlines": [
            "Jewelry flex (Yellow diamonds/gold)",
            "Crime scene (Yellow tape)",
            "Cowardice (Yellow belly)"
        ],
        "tags": "color, gold, diamonds, caution, scared"
    },
    {
        "name": "yell", "word": "Yell", "letter": "Y",
        "meaning": "Give a loud, sharp cry",
        "rap_meaning": "Speaking up, getting loud, aggression, making noise in the game",
        "syllables": "1 (yell)", "pos": "Verb",
        "synonyms": "Shout, scream, cry, roar, holler",
        "antonyms": "Whisper, murmur, mute",
        "rhymes": "END: hell, bell, cell, sell, tell / SLANT: bail, fail / MULTI: excel, rebel",
        "bars": [
            "Money talk, I don't gotta yell to be heard",
            "Yell my name in the stadium, thousands of fans",
            "Don't yell at the boss, lower your tone"
        ],
        "punchlines": [
            "Volume vs Power (quiet power vs loud weakness)",
            "Echo effect",
            "Crowd reaction"
        ],
        "tags": "sound, loud, voice, shout, noise"
    },
    {
        "name": "yard", "word": "Yard", "letter": "Y",
        "meaning": "A piece of ground adjoining a building; 3 feet",
        "rap_meaning": "Prison yard, the hood/block, football progress (yards), territory",
        "syllables": "1 (yard)", "pos": "Noun",
        "synonyms": "Grounds, garden, lawn, court, enclosure",
        "antonyms": "Inside, sky",
        "rhymes": "END: hard, card, guard, scarred, barred / SLANT: heart, part / MULTI: backyard, disregard",
        "bars": [
            "Earned stripes in the yard, not the backyard",
            "Fighting for every yard like it's fourth and goal",
            "Own the whole yard, big dog off the leash"
        ],
        "punchlines": [
            "Prison reference (The Yard)",
            "Football metaphor (gaining yards)",
            "Dog barking imagery"
        ],
        "tags": "prison, territory, football, ground, measurement"
    },
    {
        "name": "yoke", "word": "Yoke",
        "meaning": "A wooden crosspiece fastening beasts of burden; something that oppresses",
        "rap_meaning": "Oppression, slavery chains, breaking free from control, or carrying weight",
        "letter": "Y",
        "syllables": "1 (yoke)", "pos": "Noun/Verb",
        "synonyms": "Burden, chain, bond, tie, oppression",
        "antonyms": "Freedom, liberty, release",
        "rhymes": "END: joke, smoke, broke, spoke, choke / SLANT: lock, rock / MULTI: provoke, revoke",
        "bars": [
            "Break the yoke off my neck, born to be free",
            "Carried the yoke of the whole city on my back",
            "No yoke can hold me, I'm a beast untamed"
        ],
        "punchlines": [
            "Slavery/Oppression imagery",
            "Egg wordplay (yolk vs yoke)",
            "Weightlifting (carrying the load)"
        ],
        "tags": "burden, oppression, chains, weight, control"
    },
    {
        "name": "yes-man", "word": "Yes-man", "letter": "Y",
        "meaning": "A weak person who always agrees with their superior",
        "rap_meaning": "Fake friends, followers, people who won't tell you the truth, entourage",
        "syllables": "2 (yes-man)", "pos": "Noun",
        "synonyms": "Sycophant, follower, puppet, kiss-up",
        "antonyms": "Leader, rebel, critic, boss",
        "rhymes": "END: can, plan, fan, scan, van / SLANT: hand, band / MULTI: lifespan, divan",
        "bars": [
            "Circle small, no yes-men allowed in the VIP",
            "A yes-man will watch you fail and clap his hands",
            "I need honest loyalty, not a yes-man collecting a check"
        ],
        "punchlines": [
            "Loyalty verification (honest enemy > fake friend)",
            "Puppet imagery",
            "Echo chamber critique"
        ],
        "tags": "fake, follower, weak, entourage, loyalty"
    },
    {
        "name": "youthful", "word": "Youthful", "letter": "Y",
        "meaning": "Young or seeming young",
        "rap_meaning": "Staying fresh, energy, looking good, timeless swag",
        "syllables": "2 (youth-ful)", "pos": "Adjective",
        "synonyms": "Young, fresh, spry, active, vibrant",
        "antonyms": "Old, aged, withered, tired",
        "rhymes": "END: truthful, fruitful, useful / SLANT: beautiful, dutiful / MULTI: unuseful",
        "bars": [
            "Youthful energy but the bank account look elderly",
            "Stay youthful in the spirit, never let the game jaded me",
            "Youthful appearance, they card me while I buy the bar"
        ],
        "punchlines": [
            "Benjamin Button reference",
            "Money age vs Physical age",
            "Freshness metaphor"
        ],
        "tags": "fresh, energy, appearance, age, timeless"
    },

    # --- W WORDS ---
    {
        "name": "win", "word": "Win", "letter": "W",
        "meaning": "To be successful or victorious",
        "rap_meaning": "The ultimate goal, Ws in the chat, success, victory lap",
        "syllables": "1 (win)", "pos": "Verb/Noun",
        "synonyms": "Victory, triumph, success, conquest, score",
        "antonyms": "Lose, fail, defeat, loss",
        "rhymes": "END: sin, skin, tin, in, spin, grin / SLANT: when, pen / MULTI: begin, within",
        "bars": [
            "All I do is win, it's becoming a habit",
            "Take the W, hold it up like a trophy",
            "Losses turned to lessons, now everything is a win"
        ],
        "punchlines": [
            "DJ Khaled reference",
            "W vs L (alphabet play)",
            "Scoreboard check"
        ],
        "tags": "success, victory, goal, triumph, score"
    },
    {
        "name": "wealth", "word": "Wealth", "letter": "W",
        "meaning": "An abundance of valuable possessions or money",
        "rap_meaning": "Generational money, assets, freedom, not just cash but power",
        "syllables": "1 (wealth)", "pos": "Noun",
        "synonyms": "Riches, fortune, assets, prosperity, capital",
        "antonyms": "Poverty, debt, lack, need",
        "rhymes": "END: health, stealth, self, shelf / SLANT: well, fell / MULTI: itself, oneself",
        "bars": [
            "Health is wealth so I take care of the temple",
            "Generational wealth, my grandkids gonna eat good",
            "Hide the wealth in stealth, silent moves earn most"
        ],
        "punchlines": [
            "Health/Wealth connection",
            "Stealth wealth (quiet luxury)",
            "Legacy imagery"
        ],
        "tags": "money, rich, power, assets, legacy"
    },
    {
        "name": "war", "word": "War", "letter": "W",
        "meaning": "A state of armed conflict",
        "rap_meaning": "Street conflict, beef, mental battles, prepared for violence",
        "syllables": "1 (war)", "pos": "Noun",
        "synonyms": "Conflict, battle, combat, fight, strife",
        "antonyms": "Peace, truce, harmony",
        "rhymes": "END: scar, car, star, bar, far / SLANT: more, door / MULTI: radar, guitar",
        "bars": [
            "Prepare for war in times of peace to stay ready",
            "This implies war, ain't no talking it out now",
            "War wounds tell the story of a survivor"
        ],
        "punchlines": [
            "Art of War (Sun Tzu) reference",
            "Battle scars as medals",
            "Soldier mentality"
        ],
        "tags": "conflict, battle, fight, violence, struggle"
    },
    {
        "name": "wisdom", "word": "Wisdom", "letter": "W",
        "meaning": "The quality of having experience, knowledge, and good judgment",
        "rap_meaning": "Street smarts plus book smarts, OG status, knowing how to move",
        "syllables": "2 (wis-dom)", "pos": "Noun",
        "synonyms": "Knowledge, insight, sagacity, sense, prudence",
        "antonyms": "Folly, stupidity, ignorance",
        "rhymes": "END: system, rhythm, prism, schism / SLANT: vision, mission / MULTI: catechism, cynicism",
        "bars": [
            "Pay for the wisdom with the pain of the past",
            "Wisdom tooth pulled but I still speak the truth",
            "Move with wisdom, rookie mistakes get you killed"
        ],
        "punchlines": [
            "Age/Experience tradeoff",
            "King Solomon reference",
            "Value of knowledge vs money"
        ],
        "tags": "knowledge, smarts, experience, truth, mind"
    },
    {
        "name": "witness", "word": "Witness", "letter": "W",
        "meaning": "A person who sees an event take place",
        "rap_meaning": "Seeing history, no witnesses to the crime, testifying (snitching)",
        "syllables": "2 (wit-ness)", "pos": "Noun/Verb",
        "synonyms": "Observer, spectator, onlooker, see, watch",
        "antonyms": "Participant, ignore, blind",
        "rhymes": "END: fitness, sickness, thickness / SLANT: business, list this / MULTI: forgiveness, ambitious",
        "bars": [
            "Witness greatness in the flesh, take a picture",
            "Leave no witness when I kill the microphone",
            "Can I get a witness? The flow is miraculous"
        ],
        "punchlines": [
            "Courtroom/Snitch imagery (no witnesses)",
            "Church call and response (Can I get a witness)",
            "History in making (bear witness)"
        ],
        "tags": "see, observe, history, crime, court"
    },
    {
        "name": "world", "word": "World", "letter": "W",
        "meaning": "The earth, together with all of its countries and peoples",
        "rap_meaning": "Global dominance, yours for the taking, world tour, universal",
        "syllables": "1 (world)", "pos": "Noun",
        "synonyms": "Earth, globe, planet, universe, sphere",
        "antonyms": "Local, home",
        "rhymes": "END: curled, hurled, swirled, pearl / SLANT: girl, earl / MULTI: underworld, otherworldly",
        "bars": [
            "The world is yours, Scarface blimp in the sky",
            "World tour status, different zip code every night",
            "Weight of the world on my shoulders, I squat it"
        ],
        "punchlines": [
            "Scarface reference (The World is Yours)",
            "Atlas mythology (holding up the world)",
            "Global vs Local reach"
        ],
        "tags": "global, earth, big, everything, travel"
    },
    {
        "name": "work", "word": "Work", "letter": "W",
        "meaning": "Activity involving mental or physical effort",
        "rap_meaning": "The grind, the hustle, selling drugs (putting in work), effort",
        "syllables": "1 (work)", "pos": "Noun/Verb",
        "synonyms": "Labor, toil, job, grind, hustle, effort",
        "antonyms": "Rest, play, sleep, lazy",
        "rhymes": "END: jerk, lurk, perk, murk / SLANT: dark, park / MULTI: network, artwork",
        "bars": [
            "Put in the work when nobody watching, that's the key",
            "Work ethic insane, I lap ‘em while they sleeping",
            "Nice watch but did you put in the work for the time?"
        ],
        "punchlines": [
            "Rihanna reference (Work work work)",
            "Drug slang (moving work)",
            "Physics definition (Force x Distance)"
        ],
        "tags": "grind, hustle, job, effort, labor"
    },
    {
        "name": "worth", "word": "Worth", "letter": "W",
        "meaning": "The value equivalent to someone or something",
        "rap_meaning": "Net worth, self-worth, value in the game, expensive taste",
        "syllables": "1 (worth)", "pos": "Noun/Adjective",
        "synonyms": "Value, price, cost, merit, importance",
        "antonyms": "Worthless, cheap, trash",
        "rhymes": "END: birth, earth, girth, mirth / SLANT: forth, north / MULTI: rebirth, unearth",
        "bars": [
            "Know your worth, then add tax to the price",
            "Net worth climbing, self worth priceless",
            "What's it worth to sell your soul? I kept mine"
        ],
        "punchlines": [
            "Tax addition (add tax to worth)",
            "Price vs Value",
            "Net worth vs Self worth contrast"
        ],
        "tags": "value, money, price, self, cost"
    },
    {
        "name": "wrath", "word": "Wrath", "letter": "W",
        "meaning": "Extreme anger",
        "rap_meaning": "Divine punishment, unstoppable rage, dangerous anger, consequences",
        "syllables": "1 (wrath)", "pos": "Noun",
        "synonyms": "Anger, rage, fury, ire, vengeance",
        "antonyms": "Love, peace, calm, mercy",
        "rhymes": "END: path, bath, math / SLANT: half, staff / MULTI: aftermath, psychopath",
        "bars": [
            "Unleash the wrath upon the beat, I'm furious",
            "Feel the wrath of a god when I drop the hammer",
            "Grapes of wrath, I crush 'em into fine wine"
        ],
        "punchlines": [
            "Biblical reference (Wrath of God)",
            "Literature reference (Grapes of Wrath)",
            "Storm imagery"
        ],
        "tags": "anger, rage, fury, dangerous, punishment"
    },
    {
        "name": "wolf", "word": "Wolf", "letter": "W",
        "meaning": "A wild carnivorous mammal of the dog family",
        "rap_meaning": "Lone wolf (independent), predatory nature, hunger, sheep in wolf clothing",
        "syllables": "1 (wolf)", "pos": "Noun",
        "synonyms": "Predator, beast, hunter, canine",
        "antonyms": "Sheep, prey",
        "rhymes": "END: golf, gulf / SLANT: off, cough / MULTI: werewolf, engulf",
        "bars": [
            "Lone wolf mentality, I don't need a pack to hunt",
            "Throw me to the wolves, I come back leading the pack",
            "Wolf in sheep's clothing, I see the zipper on your suit"
        ],
        "punchlines": [
            "Market reference (Wolf of Wall Street)",
            "Pack dynamics (Alpha wolf)",
            "Fairytale twist (Big Bad Wolf)"
        ],
        "tags": "animal, predator, wild, hunt, leader"
    },

    # --- V WORDS ---
    {
        "name": "victory", "word": "Victory", "letter": "V",
        "meaning": "An act of defeating an enemy or opponent",
        "rap_meaning": "Winning, overcoming struggle, the championship, success",
        "syllables": "3 (vic-to-ry)", "pos": "Noun",
        "synonyms": "Win, triumph, success, conquest, glory",
        "antonyms": "Defeat, loss, failure",
        "rhymes": "END: history, mystery, misery, blistery / SLANT: factory / MULTI: contradictory, trajectory",
        "bars": [
            "Taste of victory is sweet, washed down with champagne",
            "Victory lap around the city, I run this town",
            "Write history with every victory, legendary moves"
        ],
        "punchlines": [
            "Nike reference (Goddess of Victory)",
            "V for Victory hand sign",
            "Battle outcome"
        ],
        "tags": "win, success, triumph, glory, champ"
    },
    {
        "name": "valor", "word": "Valor", "letter": "V",
        "meaning": "Great courage in the face of danger",
        "rap_meaning": "Street bravery, heart, standing tall against odds, warrior spirit",
        "syllables": "2 (val-or)", "pos": "Noun",
        "synonyms": "Courage, bravery, heroism, guts, heart",
        "antonyms": "Cowardice, fear",
        "rhymes": "END: pallor, caller, taller / SLANT: power, hour / MULTI: rockefeller, interstellar",
        "bars": [
            "Stolen valor, you claiming stripes you ain't earn",
            "Move with valor, heart of a lion in the jungle",
            "Medal of valor for survival in the trenches"
        ],
        "punchlines": [
            "Military play (Medal of Valor)",
            "Stolen valor (faking toughness)",
            "Knightly virtue"
        ],
        "tags": "brave, courage, heart, warrior, hero"
    },
    {
        "name": "vision", "word": "Vision", "letter": "V",
        "meaning": "The faculty or state of being able to see; ability to think about future",
        "rap_meaning": "Seeing the plan before it happens, foresight, long-term goals, clarity",
        "syllables": "2 (vi-sion)", "pos": "Noun",
        "synonyms": "Sight, foresight, dream, plan, perception",
        "antonyms": "Blindness, short-sighted",
        "rhymes": "END: mission, decision, precision, collision, division / SLANT: wishing / MULTI: superstition, inhibition",
        "bars": [
            "Tunnel vision on the bag, I don't see distractions",
            "My vision 20/20, I saw the snake in the grass",
            "Trust the vision even when the picture is blurry"
        ],
        "punchlines": [
            "Eyesight stats (20/20 vision)",
            "Prophet imagery (having visions)",
            "Marvel reference (The Vision)"
        ],
        "tags": "sight, plan, goal, future, see"
    },
    {
        "name": "vibe", "word": "Vibe", "letter": "V",
        "meaning": "A person's emotional state or the atmosphere of a place",
        "rap_meaning": "Energy, feeling, wave, atmosphere, connection",
        "syllables": "1 (vibe)", "pos": "Noun/Verb",
        "synonyms": "Mood, atmosphere, energy, feeling, aura",
        "antonyms": "Buzzkill, static",
        "rhymes": "END: tribe, bribe, scribe, prescribe / SLANT: live, five / MULTI: subscribe, diatribe",
        "bars": [
            "Vibe check, you don't pass the inspection",
            "Kill the vibe and you get evicted from the section",
            "Whole tribe on the same vibe, frequency matched"
        ],
        "punchlines": [
            "Frequency/Radio metaphor",
            "Vibe check (security)",
            "Tribal connection"
        ],
        "tags": "energy, feeling, mood, atmosphere, cool"
    },
    {
        "name": "venom", "word": "Venom", "letter": "V",
        "meaning": "A poisonous substance secreted by animals",
        "rap_meaning": "Toxic words, haters' speech, dangerous flow, spitting poison",
        "syllables": "2 (ven-om)", "pos": "Noun",
        "synonyms": "Poison, toxin, malice, spite, hate",
        "antonyms": "Antidote, cure, love, honey",
        "rhymes": "END: denim, lemon / SLANT: rhythm, women / MULTI: millennium, momentum",
        "bars": [
            "Spit venom on the mic, paralyze the competition",
            "They speak with venom, snake tongues flicking",
            "Got the antidote for your venom, I'm immune"
        ],
        "punchlines": [
            "Spider-Man reference (Venom symbiote)",
            "Snake imagery",
            "Toxic toxicity"
        ],
        "tags": "poison, toxic, dangerous, hate, snake"
    },
    {
        "name": "vicious", "word": "Vicious", "letter": "V",
        "meaning": "Deliberately cruel or violent",
        "rap_meaning": "Ruthless, savage, no mercy, heavy hitting delivery",
        "syllables": "2 (vi-cious)", "pos": "Adjective",
        "synonyms": "Cruel, savage, fierce, brutal, violent",
        "antonyms": "Gentle, kind, nice, tame",
        "rhymes": "END: suspicious, delicious, ambitious, superstitious / SLANT: wishes, disses / MULTI: fictitious, malicious",
        "bars": [
            "Vicious cycle of the streets, hard to break the loop",
            "Flow vicious like a pitbull off the leash",
            "Rumors are vicious but the truth is undefeated"
        ],
        "punchlines": [
            "Sid Vicious reference (Punk rock)",
            "Animal attack imagery",
            "Cycle metaphor (vicious circle)"
        ],
        "tags": "cruel, savage, hard, ruthless, intense"
    },
    {
        "name": "vital", "word": "Vital", "letter": "V",
        "meaning": "Absolutely necessary or important; essential",
        "rap_meaning": "Critical for survival, essential to the game, heartbeat (vital signs)",
        "syllables": "2 (vi-tal)", "pos": "Adjective",
        "synonyms": "Essential, critical, crucial, key, alive",
        "antonyms": "Useless, dead, trivial, optional",
        "rhymes": "END: title, recital, idol / SLANT: idle, rifle / MULTI: suicidal, homicidal",
        "bars": [
            "Check the vitals, the game is dead on arrival",
            "Loyalty is vital, without it you got nothing",
            "Vital organ of the operation, cut me out you die"
        ],
        "punchlines": [
            "Medical monitor (flatline vs vital signs)",
            "Title/Vital rhyme scheme",
            "Organ metaphor (heart/brain is vital)"
        ],
        "tags": "important, essential, life, critical, key"
    },
    {
        "name": "voice", "word": "Voice", "letter": "V",
        "meaning": "The sound produced in a person's larynx",
        "rap_meaning": "Your instrument, your message, speaking for the voiceless, influence",
        "syllables": "1 (voice)", "pos": "Noun",
        "synonyms": "Sound, tone, speech, expression, say",
        "antonyms": "Silence, mute",
        "rhymes": "END: choice, rolls-royce, rejoice / SLANT: noise, boys / MULTI: invoice, equipoise",
        "bars": [
            "Voice of the people, I speak what they afraid to say",
            "Found my voice in the silence of the struggle",
            "Rolls-Royce ambitions, voice distinct and expensive"
        ],
        "punchlines": [
            "Instrument metaphor",
            "Democracy (having a voice)",
            "The Voice (TV show competition)"
        ],
        "tags": "sound, speech, message, influence, talk"
    },
    {
        "name": "void", "word": "Void", "letter": "V",
        "meaning": "A completely empty space",
        "rap_meaning": "Emptiness to fill, null and void (invalid), dark place",
        "syllables": "1 (void)", "pos": "Noun/Adjective",
        "synonyms": "Empty, nothing, vacuum, gap, invalid",
        "antonyms": "Full, valid, solid",
        "rhymes": "END: avoid, destroy, paranoid, android / SLANT: boy, toy / MULTI: asteroid, hemorrhoid",
        "bars": [
            "Fill the void with material things but still empty",
            "Contract null and void, I need a new negotiation",
            "Stare into the void long enough it becomes home"
        ],
        "punchlines": [
            "Legal term (null and void)",
            "Space imagery (black hole/void)",
            "Emotional emptiness"
        ],
        "tags": "empty, nothing, space, gap, legal"
    },
    {
        "name": "volume", "word": "Volume", "letter": "V",
        "meaning": "Quantity or power of sound; degree of loudness",
        "rap_meaning": "Loudness, amount (volume of sales), turning up",
        "syllables": "2 (vol-ume)", "pos": "Noun",
        "synonyms": "Loudness, amount, quantity, capacity, book",
        "antonyms": "Silence, quiet, smallness",
        "rhymes": "END: costume, fume, bloom / SLANT: room, tomb / MULTI: vacuum, resume",
        "bars": [
            "Turn the volume up, let the neighbors feel the bass",
            "High volume sales, we moving weight by the ton",
            "This speaks volumes about your character"
        ],
        "punchlines": [
            "Knob/Fader imagery",
            "Book reference (Volume 1, Volume 2)",
            "Speaking without words (speaks volumes)"
        ],
        "tags": "loud, sound, amount, quantity, size"
    }
]

def create_word(word_data):
    """Create a word folder with filled template in the correct letter directory"""
    
    # Determine the letter directory based on the word's letter attribute
    letter = word_data["letter"]
    
    # Construct paths
    # Letter folder (e.g., .../Z)
    letter_path = Path(BASE_PATH) / letter
    
    # Words subfolder (e.g., .../Z/01_Words)
    words_base_path = letter_path / "01_Words"
    
    # Create the words base path if it implies (it should exist based on structure, but safe to mkdir)
    words_base_path.mkdir(parents=True, exist_ok=True)
    
    # Specific word folder (e.g. .../Z/01_Words/zenith)
    word_folder = words_base_path / word_data["name"]
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
    print(f"[+] Created: {letter}/{word_data['name']}")

def main():
    print(f"\nAdding 50 Z, X, Y, W, V words to Rap Dictionary Master Hub...\n")

    for word_data in WORDS:
        create_word(word_data)

    print(f"\n[✓] Successfully added 50 words to Z, X, Y, W, V folders!")
    print(f"[✓] Location: {BASE_PATH}\n")

if __name__ == "__main__":
    main()
