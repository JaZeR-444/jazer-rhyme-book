import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const wordsData = {
  F: [
    {
      word: "Future",
      meaning: "The time or a period of time following the moment of speaking or writing; time regarded as still to come.",
      rap_meaning: "The vision, the destination. Where the beam is pointing. 2026 and beyond.",
      syllables: "2 (fu-ture)",
      part_of_speech: "noun / adjective",
      synonyms: "destiny, tomorrow, outlook",
      antonyms: "past, history, yesterday",
      rhymes: "END: culture, vulture, sculpture / SLANT: shooter, mover, super / MULTI: new future, true suitor, view cuter",
      examples: [
        "Eyes on the future, I don't look back.",
        "Building a future where the light stays intact.",
        "Future bright, neon glow on the track."
      ],
      punchlines: [
        "Living in tomorrow today",
        "The future is built, not found",
        "My timeline is ahead of yours"
      ],
      tags: "jazer, time, vision"
    },
    {
      word: "Focus",
      meaning: "The center of interest or activity.",
      rap_meaning: "Tunnel vision. Blocking out the noise to lock in on the signal. The grind state.",
      syllables: "2 (fo-cus)",
      part_of_speech: "noun / verb",
      synonyms: "concentration, attention, spotlight",
      antonyms: "distraction, blur, scatter",
      rhymes: "END: locus, hocus, crocus / SLANT: hopeless, notice, lowest / MULTI: stay focused, play hopeless, gray lotus",
      examples: [
        "Lost the noise, found my focus.",
        "Camera flash, but I keep the focus.",
        "Razor sharp focus, cutting through the static."
      ],
      punchlines: [
        "Locked in like a laser",
        "Blurry world, sharp mind",
        "Focus turns pressure to power"
      ],
      tags: "jazer, mindset, grind"
    },
    {
        word: "Frequency",
        meaning: "The rate at which something occurs or is repeated over a particular period of time or in a given sample.",
        rap_meaning: "The vibe, the wavelength. The specific energy channel JaZeR broadcasts on.",
        syllables: "3 (fre-quen-cy)",
        part_of_speech: "noun",
        synonyms: "rate, pulse, wavelength",
        antonyms: "stillness, silence",
        rhymes: "END: see, be, me / SLANT: sequin, speaking, seeking / MULTI: high frequency, my decency, fly scenery",
        examples: [
            "Tune into the frequency, catch the vibe.",
            "Higher frequency, leave the low behind.",
            "Static clears when you find the right frequency."
        ],
        punchlines: [
            "On a wavelength you can't block",
            "Broadcasting live from the future",
            "Vibrating higher than the noise"
        ],
        tags: "jazer, vibe, signal"
    },
    {
        word: "Flare",
        meaning: "A sudden brief burst of bright flame or light.",
        rap_meaning: "The spark, the sudden energy burst. A visual motif of light cutting the dark.",
        syllables: "1 (flare)",
        part_of_speech: "noun / verb",
        synonyms: "flash, burst, glare",
        antonyms: "dim, dull, shadow",
        rhymes: "END: air, dare, stare / SLANT: fear, hear, near / MULTI: solar flare, polar bear, roller chair",
        examples: [
            "Lens flare blinding, the future is bright.",
            "Signal flare in the sky, I'm taking flight.",
            "Watch it flare up, energy unmatched."
        ],
        punchlines: [
            "Lighting up the dark",
            "Sudden impact",
            "A signal they can't ignore"
        ],
        tags: "jazer, light, energy"
    },
    {
        word: "Fade",
        meaning: "Gradually grow faint and disappear.",
        rap_meaning: "The transition. Disappearing into the background or a smooth visual gradient.",
        syllables: "1 (fade)",
        part_of_speech: "verb / noun",
        synonyms: "dim, dissolve, vanish",
        antonyms: "appear, brighten, sharpen",
        rhymes: "END: shade, made, paid / SLANT: said, red, bed / MULTI: slow fade, low grade, no trade",
        examples: [
            "Watch the haters fade into the back.",
            "Black fade to light, that's the intro.",
            "Nothing fades when the legacy is built."
        ],
        punchlines: [
            "You fade out, I fade in",
            "Timeless, never fading",
            "Smooth transition to the top"
        ],
        tags: "jazer, style, contrast"
    },
    {
        word: "Flow",
        meaning: "Move steadily and continuously in a current or stream.",
        rap_meaning: "The delivery, the rhythm, the way the words connect. Water-like movement.",
        syllables: "1 (flow)",
        part_of_speech: "noun / verb",
        synonyms: "stream, current, rhythm",
        antonyms: "stagnation, blockage, stop",
        rhymes: "END: go, show, know / SLANT: door, floor, more / MULTI: sick flow, quick pro, pick slow",
        examples: [
            "Infinite flow, like a beam of light.",
            "Switch the flow, keep 'em guessing.",
            "Let it flow, natural and organic."
        ],
        punchlines: [
            "Water bending with words",
            "Unstoppable current",
            "Rhythm that breathes"
        ],
        tags: "jazer, music, rhythm"
    },
    {
        word: "Foundation",
        meaning: "An underlying basis or principle for something.",
        rap_meaning: "The roots, the base. Built on solid ground (family, values) to support the skyscraper.",
        syllables: "3 (foun-da-tion)",
        part_of_speech: "noun",
        synonyms: "base, basis, groundwork",
        antonyms: "ruin, top, peak",
        rhymes: "END: nation, station, creation / SLANT: patient, ancient / MULTI: strong foundation, wrong location, long vacation",
        examples: [
            "Solid foundation, I can't be moved.",
            "Built this from the foundation up.",
            "Cracks in your foundation, you gonna fall."
        ],
        punchlines: [
            "Built to last forever",
            "Concrete roots",
            "The skyscraper needs the basement"
        ],
        tags: "jazer, building, structure"
    },
    {
        word: "Freedom",
        meaning: "The power or right to act, speak, or think as one wants without hindrance or restraint.",
        rap_meaning: "Breaking the box. No limits on creativity or movement. The ultimate goal.",
        syllables: "2 (free-dom)",
        part_of_speech: "noun",
        synonyms: "liberty, independence, release",
        antonyms: "captivity, restriction, slavery",
        rhymes: "END: kingdom, wisdom / SLANT: reason, season / MULTI: chasing freedom, facing demons, placing legions",
        examples: [
            "Chasing freedom, leaving the cage.",
            "Freedom of speech, freedom of beat.",
            "True freedom is a state of mind."
        ],
        punchlines: [
            "Unchained melody",
            "No borders, just horizons",
            "The price was high but the view is free"
        ],
        tags: "jazer, mindset, release"
    },
    {
        word: "Funky",
        meaning: "Having or using a strong dance rhythm, in particular that of funk.",
        rap_meaning: "The groove, the soul. The 'funky futuristic' element of the JaZeR sound.",
        syllables: "2 (fun-ky)",
        part_of_speech: "adjective",
        synonyms: "groovy, rhythmic, soulful",
        antonyms: "stiff, boring, plain",
        rhymes: "END: monkey, chunky / SLANT: hungry, country / MULTI: getting funky, betting lucky",
        examples: [
            "Keep it funky, keep it fresh.",
            "Funky bassline driving the track.",
            "Futuristic but we stay funky."
        ],
        punchlines: [
            "Soul in the machine",
            "Groove you can feel",
            "Not just noise, it's funk"
        ],
        tags: "jazer, music, style"
    },
    {
        word: "Fog",
        meaning: "A thick cloud of tiny water droplets suspended in the atmosphere.",
        rap_meaning: "The confusion, the 'heavy fog' I came out of. The obstacle before the clarity.",
        syllables: "1 (fog)",
        part_of_speech: "noun",
        synonyms: "mist, haze, smog",
        antonyms: "clarity, sunshine, clear",
        rhymes: "END: dog, log, jog / SLANT: god, rod, nod / MULTI: through the fog, new dialog, true catalog",
        examples: [
            "Lost in the fog, found my own way.",
            "Fog clears when the sun rises.",
            "Cutting through the fog with a high beam."
        ],
        punchlines: [
            "Visibility zero, vision infinite",
            "The gray before the gold",
            "Clearing the air"
        ],
        tags: "jazer, weather, metaphor"
    }
  ],
  G: [
    {
        word: "Glow",
        meaning: "Give out steady light without flame.",
        rap_meaning: "The aura, the vibe. Inner light shining outward. A core visual element.",
        syllables: "1 (glow)",
        part_of_speech: "verb / noun",
        synonyms: "shine, beam, radiate",
        antonyms: "darken, fade, dull",
        rhymes: "END: show, know, low / SLANT: door, floor / MULTI: inner glow, winner flow, dinner show",
        examples: [
            "Dashboard glow in the night drive.",
            "Let your spirit glow in the dark.",
            "Neon glow against the black sky."
        ],
        punchlines: [
            "Bioluminescent soul",
            "Lighting up the room without a switch",
            "The darker it gets, the brighter I glow"
        ],
        tags: "jazer, light, visuals"
    },
    {
        word: "Gradient",
        meaning: "An inclined part of a road or railway; a slope.",
        rap_meaning: "The smooth transition of colors. A visual style—sunset bands, color fades.",
        syllables: "3 (gra-di-ent)",
        part_of_speech: "noun",
        synonyms: "slope, incline, fade",
        antonyms: "flat, abruptness",
        rhymes: "END: radiant, obedient / SLANT: alien, stadium / MULTI: color gradient, duller variant",
        examples: [
            "Life is a gradient, not black and white.",
            "Purple to blue gradient on the horizon.",
            "Smooth gradient, no hard lines."
        ],
        punchlines: [
            "Blending the lanes",
            "Spectrum of success",
            "From dark to light"
        ],
        tags: "jazer, visuals, style"
    },
    {
        word: "Glassy",
        meaning: "Resembling glass in smoothness or appearance.",
        rap_meaning: "Texture word. Smooth, reflective, premium. The water or the surface.",
        syllables: "2 (glass-y)",
        part_of_speech: "adjective",
        synonyms: "smooth, clear, shiny",
        antonyms: "rough, opaque, dull",
        rhymes: "END: classy, sassy / SLANT: past me, last week / MULTI: stay classy, way flashy",
        examples: [
            "Glassy surface, reflecting the stars.",
            "Flow so glassy it slides.",
            "Keep the finish glassy and clean."
        ],
        punchlines: [
            "Reflection perfection",
            "Smooth operator",
            "Ice cold finish"
        ],
        tags: "jazer, texture, visuals"
    },
    {
        word: "Grounded",
        meaning: "Well balanced and sensible.",
        rap_meaning: "Staying humble, remembering roots (VW culture, Austin). Not floating away.",
        syllables: "2 (ground-ed)",
        part_of_speech: "adjective",
        synonyms: "sensible, down-to-earth, stable",
        antonyms: "flighty, unstable, arrogant",
        rhymes: "END: ounded, founded, pounded / SLANT: mountains, counting / MULTI: stay grounded, way rounded, play sounded",
        examples: [
            "Head in the stars, feet stayed grounded.",
            "Grounded by the people I love.",
            "Stay grounded when the money piles up."
        ],
        punchlines: [
            "Roots deep, branches high",
            "Gravity check",
            "Humble flex"
        ],
        tags: "jazer, values, mindset"
    },
    {
        word: "Glide",
        meaning: "Move with a smooth continuous motion, typically with little noise or effort.",
        rap_meaning: "Movement word. Effortless progress. The car on the highway.",
        syllables: "1 (glide)",
        part_of_speech: "verb",
        synonyms: "slide, coast, drift",
        antonyms: "stumble, crash, halt",
        rhymes: "END: ride, side, pride / SLANT: light, night / MULTI: smooth glide, truth hide, booth side",
        examples: [
            "Watch me glide past the hate.",
            "Gliding through the city lights.",
            "Effortless glide, no friction."
        ],
        punchlines: [
            "Zero friction success",
            "Floating on the beat",
            "Ghost ride the whip"
        ],
        tags: "jazer, motion, travel"
    },
    {
        word: "Growth",
        meaning: "The process of developing or maturing physically, mentally, or spiritually.",
        rap_meaning: "The core theme. Leveling up. Turning lessons into strength.",
        syllables: "1 (growth)",
        part_of_speech: "noun",
        synonyms: "development, expansion, progress",
        antonyms: "decline, shrinking, stagnation",
        rhymes: "END: oath, loath, both / SLANT: loaf, ghost / MULTI: personal growth, terminal oath",
        examples: [
            "Pain fuels the growth.",
            "Focus on growth, not just the check.",
            "You see the glory, I see the growth."
        ],
        punchlines: [
            "Growing pains pay off",
            "Level up every season",
            "Bigger than yesterday"
        ],
        tags: "jazer, theme, mindset"
    },
    {
        word: "Grind",
        meaning: "Hard dull work.",
        rap_meaning: "The work ethic. The 'Competition Mindset'. Doing what needs to be done.",
        syllables: "1 (grind)",
        part_of_speech: "noun / verb",
        synonyms: "hustle, labor, toil",
        antonyms: "rest, laziness, sloth",
        rhymes: "END: mind, find, kind / SLANT: time, line / MULTI: daily grind, failing mind",
        examples: [
            "Respect the grind, it pays the bills.",
            "On the grind from sun up to sun down.",
            "The grind never stops, it just evolves."
        ],
        punchlines: [
            "Work while they sleep",
            "Embrace the suck",
            "Diamond maker"
        ],
        tags: "jazer, theme, work"
    },
    {
        word: "Game",
        meaning: "A form of play or sport, especially a competitive one played according to rules and decided by skill, strength, or luck.",
        rap_meaning: "Life as a sport. The music industry. Chicago sports energy.",
        syllables: "1 (game)",
        part_of_speech: "noun",
        synonyms: "sport, match, competition",
        antonyms: "reality, work",
        rhymes: "END: name, fame, same / SLANT: rain, pain / MULTI: whole game, soul flame, goal aim",
        examples: [
            "Student of the game, aiming for the hall of fame.",
            "Change the game, don't just play it.",
            "Game face on, it's crunch time."
        ],
        punchlines: [
            "MVP status",
            "Rewriting the rulebook",
            "Playing for keeps"
        ],
        tags: "jazer, sports, metaphor"
    },
    {
        word: "Goodbyes",
        meaning: "An expression of good wishes when parting.",
        rap_meaning: "Letting go of what holds you back. Song title reference.",
        syllables: "2 (good-byes)",
        part_of_speech: "noun",
        synonyms: "farewells, partings, adieus",
        antonyms: "hellos, greetings, welcomes",
        rhymes: "END: rise, skies, lies / SLANT: ice, price / MULTI: no goodbyes, low supplies, slow rise",
        examples: [
            "No long goodbyes, just moving on.",
            "Goodbyes are hard but necessary.",
            "Saying goodbye to the old me."
        ],
        punchlines: [
            "Closing the chapter",
            "Rearview mirror view",
            "Exiting the stage"
        ],
        tags: "jazer, song, theme"
    },
    {
        word: "Ghost",
        meaning: "An apparition of a dead person which is believed to appear or become manifest to the living.",
        rap_meaning: "Disappearing. 'Ghost Ride'. Being present but unseen. The past haunting.",
        syllables: "1 (ghost)",
        part_of_speech: "noun",
        synonyms: "spirit, phantom, specter",
        antonyms: "body, being, person",
        rhymes: "END: most, post, coast / SLANT: close, rose / MULTI: holy ghost, lonely post",
        examples: [
            "Moving like a ghost in the machine.",
            "Ghost ride the whip, let it glide.",
            "Ghost of the past trying to pull me back."
        ],
        punchlines: [
            "Invisible moves",
            "Haunting the beat",
            "Now you see me, now you don't"
        ],
        tags: "jazer, song, metaphor"
    }
  ],
  H: [
    {
        word: "Home",
        meaning: "The place where one lives permanently, especially as a member of a family or household.",
        rap_meaning: "Core Mission: 'Music that feels like home'. Belonging. A safe space.",
        syllables: "1 (home)",
        part_of_speech: "noun",
        synonyms: "house, residence, dwelling",
        antonyms: "foreign, away, office",
        rhymes: "END: dome, roam, foam / SLANT: zone, bone, phone / MULTI: finding home, blinding dome, grinding foam",
        examples: [
            "Welcome home, to the JaZeR zone.",
            "Built a home out of bass and melody.",
            "Far from home but I feel it here."
        ],
        punchlines: [
            "Sanctuary in sound",
            "Where the heart is",
            "Keys to the kingdom"
        ],
        tags: "jazer, core, theme"
    },
    {
        word: "Horizon",
        meaning: "The line at which the earth's surface and the sky appear to meet.",
        rap_meaning: "The future limit. Looking forward. The visual boundary of the 'beam'.",
        syllables: "3 (ho-ri-zon)",
        part_of_speech: "noun",
        synonyms: "skyline, vista, prospect",
        antonyms: "center, close-up",
        rhymes: "END: eyes on, wise on, prize on / SLANT: rising, sizing / MULTI: new horizon, true prize on",
        examples: [
            "Eyes on the horizon, never down.",
            "Chasing the horizon, infinite drive.",
            "Bright horizon, the storm is behind."
        ],
        punchlines: [
            "Limitless view",
            "Meeting point of earth and sky",
            "Always expanding"
        ],
        tags: "jazer, visuals, future"
    },
    {
        word: "Halo",
        meaning: "A disk or circle of light shown surrounding or above the head of a saint or holy person to represent their holiness.",
        rap_meaning: "Light imagery. The glow around a person or object. Divine energy.",
        syllables: "2 (ha-lo)",
        part_of_speech: "noun",
        synonyms: "aura, ring, corona",
        antonyms: "shadow, darkness",
        rhymes: "END: solo, polo / SLANT: hollow, swallow / MULTI: broken halo, spoken solo",
        examples: [
            "Neon halo in the dark night.",
            "No angel, but I got a halo of light.",
            "Halo effect, everything I touch glows."
        ],
        punchlines: [
            "Crowned in light",
            "Circle of power",
            "Glowing reviews"
        ],
        tags: "jazer, light, imagery"
    },
    {
        word: "Hum",
        meaning: "Make a low, steady continuous sound like that of a bee.",
        rap_meaning: "Sound texture. The background noise of technology or a car engine. 'Steady hum'.",
        syllables: "1 (hum)",
        part_of_speech: "verb / noun",
        synonyms: "drone, purr, buzz",
        antonyms: "silence, shout",
        rhymes: "END: drum, numb, sum / SLANT: run, fun / MULTI: steady hum, ready drum",
        examples: [
            "The steady hum of the engine.",
            "Studio hum, waiting for the beat.",
            "Life's a hum, find your melody."
        ],
        punchlines: [
            "Background radiation",
            "The sound of power",
            "Quiet intensity"
        ],
        tags: "jazer, sound, texture"
    },
    {
        word: "Hiss",
        meaning: "Make a sharp sibilant sound as of the letter s.",
        rap_meaning: "Sound texture. Tape hiss, static, release of pressure (air brakes, hydraulics).",
        syllables: "1 (hiss)",
        part_of_speech: "verb / noun",
        synonyms: "fizz, whistle, wheeze",
        antonyms: "silence, boom",
        rhymes: "END: miss, kiss, abyss / SLANT: list, fist / MULTI: snake hiss, fake kiss",
        examples: [
            "Tape hiss, vintage vibe.",
            "Hiss of the brakes, we arrived.",
            "Cut the hiss, clear the vocal."
        ],
        punchlines: [
            "Pressure release",
            "Analog warmth",
            "Silence the snakes"
        ],
        tags: "jazer, sound, texture"
    },
    {
        word: "High",
        meaning: "Of great vertical extent.",
        rap_meaning: "Direction. 'Keep My Head High'. Elevation. High frequency.",
        syllables: "1 (high)",
        part_of_speech: "adjective",
        synonyms: "tall, lofty, elevated",
        antonyms: "low, deep",
        rhymes: "END: sky, fly, lie / SLANT: night, sight / MULTI: aiming high, claiming sky",
        examples: [
            "Keep my head high through the low times.",
            "High hopes, higher work ethic.",
            "Flying high, no turbulence."
        ],
        punchlines: [
            "Altitude attitude",
            "Above the clouds",
            "Top floor vision"
        ],
        tags: "jazer, direction, mindset"
    },
    {
        word: "Heat",
        meaning: "The quality of being hot; high temperature.",
        rap_meaning: "Intensity. The fire. 'Warmth' of the sound.",
        syllables: "1 (heat)",
        part_of_speech: "noun",
        synonyms: "warmth, passion, fire",
        antonyms: "cold, chill",
        rhymes: "END: beat, street, meet / SLANT: deep, keep / MULTI: bring the heat, swing the beat",
        examples: [
            "Bringing the heat to the winter.",
            "Feel the heat of the spotlight.",
            "Summer heat in every bar."
        ],
        punchlines: [
            "Fire hazard",
            "Cooking up",
            "Temperature rising"
        ],
        tags: "jazer, sensation, energy"
    },
    {
        word: "Heart",
        meaning: "The muscle that pumps blood; the center of emotion.",
        rap_meaning: "Emotion. 'From the Heart'. Authenticity. The core.",
        syllables: "1 (heart)",
        part_of_speech: "noun",
        synonyms: "soul, core, spirit",
        antonyms: "mind, logic",
        rhymes: "END: start, art, part / SLANT: dark, mark / MULTI: pure heart, sure start",
        examples: [
            "Spoke from the heart, they felt it.",
            "Heart on my sleeve, mic in my hand.",
            "The beat matches my heart rate."
        ],
        punchlines: [
            "Pulse of the project",
            "Real recognizes real",
            "Emotional engine"
        ],
        tags: "jazer, theme, emotion"
    },
    {
        word: "Highway",
        meaning: "A main road, especially one connecting major towns or cities.",
        rap_meaning: "Imagery: Night drive. The journey. Movement. Escape.",
        syllables: "2 (high-way)",
        part_of_speech: "noun",
        synonyms: "freeway, road, interstate",
        antonyms: "path, dead end",
        rhymes: "END: my way, friday / SLANT: driveway, sideways / MULTI: dark highway, spark my way",
        examples: [
            "Empty highway, mind racing.",
            "Life is a highway, I'm in the fast lane.",
            "Highway lights blurring like memories."
        ],
        punchlines: [
            "Road to redemption",
            "Full speed ahead",
            "Asphalt therapy"
        ],
        tags: "jazer, imagery, travel"
    },
    {
        word: "Hook",
        meaning: "A piece of metal or other material, curved or bent back at an angle, for catching or holding things.",
        rap_meaning: "The catchy part of the song. 'Hook-first'. The lesson inside the melody.",
        syllables: "1 (hook)",
        part_of_speech: "noun",
        synonyms: "chorus, refrain, catch",
        antonyms: "verse, intro",
        rhymes: "END: book, look, took / SLANT: luck, duck / MULTI: catchy hook, scratchy book",
        examples: [
            "Wrote the hook first, the rest followed.",
            "Life needs a hook to keep you listening.",
            "Got 'em on the hook."
        ],
        punchlines: [
            "The part you can't forget",
            "Reeling them in",
            "Ear candy"
        ],
        tags: "jazer, music, craft"
    }
  ],
  I: [
    {
        word: "Imagery",
        meaning: "Visually descriptive or figurative language.",
        rap_meaning: "The system: 'JaZeR Imagery System'. Visual storytelling. Painting with words.",
        syllables: "3 (im-age-ry)",
        part_of_speech: "noun",
        synonyms: "symbolism, description, pictures",
        antonyms: "fact, plainness",
        rhymes: "END: misery, history / SLANT: injury, industry / MULTI: vivid imagery, lived in misery",
        examples: [
            "Painting imagery with every verse.",
            "Lost in the imagery of the night.",
            "Strong imagery, clearer vision."
        ],
        punchlines: [
            "Cinema in audio",
            "Seeing is believing",
            "Visual language"
        ],
        tags: "jazer, system, writing"
    },
    {
        word: "Identity",
        meaning: "The fact of being who or what a person or thing is.",
        rap_meaning: "Theme: Who am I? Authenticity. 'Sound DNA'.",
        syllables: "4 (i-den-ti-ty)",
        part_of_speech: "noun",
        synonyms: "self, character, personality",
        antonyms: "anonymity, disguise",
        rhymes: "END: entity, serenity / SLANT: enemy, remedy / MULTI: true identity, new entity",
        examples: [
            "Found my identity in the noise.",
            "Sonic identity, unmistakable.",
            "Protect your identity, stay real."
        ],
        punchlines: [
            "Fingerprint flow",
            "Know thyself",
            "Signature sound"
        ],
        tags: "jazer, theme, self"
    },
    {
        word: "Internal",
        meaning: "Of or situated on the inside.",
        rap_meaning: "Section B. The private self. 'Internal-Only Operating System'.",
        syllables: "3 (in-ter-nal)",
        part_of_speech: "adjective",
        synonyms: "inner, inside, interior",
        antonyms: "external, outer, public",
        rhymes: "END: journal, kernel / SLANT: inferno, eternal / MULTI: internal fight, eternal light",
        examples: [
            "Internal monologue turned up loud.",
            "Keep the circle internal and tight.",
            "Internal growth leads to external shine."
        ],
        punchlines: [
            "Inside job",
            "Behind the curtain",
            "Core processing"
        ],
        tags: "jazer, system, privacy"
    },
    {
        word: "Influence",
        meaning: "The capacity to have an effect on the character, development, or behavior of someone or something.",
        rap_meaning: "What shapes the sound: Jazz, Trap-soul, Rock, Austin.",
        syllables: "3 (in-flu-ence)",
        part_of_speech: "noun / verb",
        synonyms: "impact, effect, sway",
        antonyms: "irrelevance, weakness",
        rhymes: "END: confluence / SLANT: instruments, increments / MULTI: under influence, thunder instruments",
        examples: [
            "Under the influence of the greats.",
            "Influence the game, don't let it play you.",
            "Positive influence, spreading light."
        ],
        punchlines: [
            "Moving the needle",
            "Ripple effect",
            "Shaping the future"
        ],
        tags: "jazer, theme, music"
    },
    {
        word: "Intentional",
        meaning: "Done on purpose; deliberate.",
        rap_meaning: "Mindset: 'Move with intention'. Every beat, every word matters.",
        syllables: "4 (in-ten-tion-al)",
        part_of_speech: "adjective",
        synonyms: "deliberate, calculated, planned",
        antonyms: "accidental, random",
        rhymes: "END: dimensional, conventional / SLANT: sensational / MULTI: stay intentional, multi-dimensional",
        examples: [
            "Living intentional, no wasted days.",
            "Every move intentional, chess not checkers.",
            "Intentional design, built to last."
        ],
        punchlines: [
            "On purpose",
            "By design",
            "No accidents"
        ],
        tags: "jazer, mindset, values"
    },
    {
        word: "Infinite",
        meaning: "Limitless or endless in space, extent, or size.",
        rap_meaning: "Description: 'infinite beam of light'. The potential. Cosmic scale.",
        syllables: "3 (in-fi-nite)",
        part_of_speech: "adjective",
        synonyms: "boundless, endless, eternal",
        antonyms: "finite, limited, small",
        rhymes: "END: definite, intimate / SLANT: limit, minute / MULTI: infinite space, win in it race",
        examples: [
            "Infinite potential, unlocking the code.",
            "Staring at the infinite sky.",
            "My grind is infinite."
        ],
        punchlines: [
            "No ceiling",
            "Forever expanding",
            "To infinity and beyond"
        ],
        tags: "jazer, cosmic, scale"
    },
    {
        word: "Insight",
        meaning: "The capacity to gain an accurate and deep intuitive understanding of a person or thing.",
        rap_meaning: "Growth: Learning from the past. 'What I learned'. Clarity.",
        syllables: "2 (in-sight)",
        part_of_speech: "noun",
        synonyms: "understanding, vision, wisdom",
        antonyms: "ignorance, blindness",
        rhymes: "END: light, bright, night / SLANT: inside, invite / MULTI: gain insight, brain ignite",
        examples: [
            "Flash of insight in the dark.",
            "Hindsight is 20/20, insight is 2026.",
            "Sharing insight to help you grow."
        ],
        punchlines: [
            "Seeing through walls",
            "The aha moment",
            "Deep vision"
        ],
        tags: "jazer, growth, wisdom"
    },
    {
        word: "Inspiration",
        meaning: "The process of being mentally stimulated to do or feel something, especially to do something creative.",
        rap_meaning: "The spark. Where the songs come from. 'Life experiences'.",
        syllables: "4 (in-spi-ra-tion)",
        part_of_speech: "noun",
        synonyms: "creativity, muse, motivation",
        antonyms: "block, boredom",
        rhymes: "END: nation, creation, station / SLANT: patience / MULTI: pure inspiration, cure stagnation",
        examples: [
            "Searching for inspiration in the city.",
            "You are the inspiration for the track.",
            "Inspiration strikes like lightning."
        ],
        punchlines: [
            "Fuel for the fire",
            "Breathing in life",
            "The muse speaks"
        ],
        tags: "jazer, creativity, process"
    },
    {
        word: "Impact",
        meaning: "The action of one object coming forcibly into contact with another.",
        rap_meaning: "Mission: 'Listeners leave with more light'. Making a difference.",
        syllables: "2 (im-pact)",
        part_of_speech: "noun / verb",
        synonyms: "collision, effect, influence",
        antonyms: "avoidance, miss",
        rhymes: "END: act, fact, pact / SLANT: intact, track / MULTI: sudden impact, cousin in fact",
        examples: [
            "Making an impact, not just a noise.",
            "Brace for impact, the beat drops.",
            "Impact the world, one song at a time."
        ],
        punchlines: [
            "Leaving a mark",
            "Heavy hitter",
            "Crater maker"
        ],
        tags: "jazer, mission, power"
    },
    {
        word: "Idea",
        meaning: "A thought or suggestion as to a possible course of action.",
        rap_meaning: "The start of everything. 'Internal ideation'. The seed.",
        syllables: "3 (i-de-a)",
        part_of_speech: "noun",
        synonyms: "concept, thought, plan",
        antonyms: "fact, reality",
        rhymes: "END: see a, be a / SLANT: dear, near / MULTI: bright idea, light appear",
        examples: [
            "Just an idea until you build it.",
            "Ideas floating like dust motes.",
            "One good idea can change a life."
        ],
        punchlines: [
            "The spark of creation",
            "Mind over matter",
            "From thought to thing"
        ],
        tags: "jazer, creativity, mind"
    }
  ],
  J: [
    {
        word: "JaZeR",
        meaning: "A focused beam of energy designed to cut through the noise.",
        rap_meaning: "The persona. J-Laser. The artist. 'Infinite beam of light'.",
        syllables: "2 (ja-zer)",
        part_of_speech: "proper noun",
        synonyms: "Jay, J-Laser, The Beam",
        antonyms: "The Noise, The Dark",
        rhymes: "END: laser, razor, blazer / SLANT: major, flavor / MULTI: call me JaZeR, wall see laser",
        examples: [
            "JaZeR in the building, lights up.",
            "Tune in to JaZeR frequency.",
            "More than a name, JaZeR is a mission."
        ],
        punchlines: [
            "J-Laser cutting through",
            "Beam me up",
            "The man, the myth, the light"
        ],
        tags: "jazer, identity, core"
    },
    {
        word: "Joy",
        meaning: "A feeling of great pleasure and happiness.",
        rap_meaning: "Value: 'Joy and focus living in the same room'. Uplifting energy.",
        syllables: "1 (joy)",
        part_of_speech: "noun",
        synonyms: "happiness, delight, bliss",
        antonyms: "misery, sadness, sorrow",
        rhymes: "END: boy, toy, coy / SLANT: noise, voice / MULTI: spread joy, bread boy",
        examples: [
            "Spread joy like a virus.",
            "Focus on the joy, ignore the pain.",
            "Joy is the ultimate rebellion."
        ],
        punchlines: [
            "Happy warrior",
            "Smile through the grind",
            "Lighthearted heavy hitter"
        ],
        tags: "jazer, values, emotion"
    },
    {
        word: "Journey",
        meaning: "An act of traveling from one place to another.",
        rap_meaning: "Theme: 'Grateful for the journey'. The process. The road.",
        syllables: "2 (jour-ney)",
        part_of_speech: "noun / verb",
        synonyms: "trip, voyage, travel",
        antonyms: "stay, stop",
        rhymes: "END: gurney, attorney / SLANT: burning, turning / MULTI: long journey, strong yearning",
        examples: [
            "Trust the journey, enjoy the ride.",
            "My journey is just beginning.",
            "Every step of the journey matters."
        ],
        punchlines: [
            "Miles to go",
            "The road is the destination",
            "Travel log"
        ],
        tags: "jazer, theme, life"
    },
    {
        word: "Jazz",
        meaning: "A type of music of black American origin characterized by improvisation.",
        rap_meaning: "Influence: 'Late-night jazz textures'. The soulful root.",
        syllables: "1 (jazz)",
        part_of_speech: "noun",
        synonyms: "blues, swing, soul",
        antonyms: "classical, silence",
        rhymes: "END: razz, has, as / SLANT: pass, gas / MULTI: smooth jazz, groove has",
        examples: [
            "Jazz chords in a trap beat.",
            "Life is like jazz, improvise.",
            "Smooth like jazz, hard like rock."
        ],
        punchlines: [
            "Improvisation is key",
            "Blue notes",
            "Swing state"
        ],
        tags: "jazer, influence, music"
    },
    {
        word: "Jersey",
        meaning: "A knitted garment with long sleeves.",
        rap_meaning: "Sports Imagery: 'Jersey' in Metaphor Bank. Team identity.",
        syllables: "2 (jer-sey)",
        part_of_speech: "noun",
        synonyms: "shirt, uniform, kit",
        antonyms: "suit, skin",
        rhymes: "END: mercy, hersey / SLANT: thirsty, worthy / MULTI: wear the jersey, share the mercy",
        examples: [
            "Put the jersey on, it's game time.",
            "Retire the jersey, legend status.",
            "New team, new jersey."
        ],
        punchlines: [
            "Uniform of the day",
            "Repping the squad",
            "Number on my back"
        ],
        tags: "jazer, sports, metaphor"
    },
    {
        word: "Jetlag",
        meaning: "Extreme tiredness and other physical effects felt by a person after a long flight.",
        rap_meaning: "Song Title. Travel. The feeling of being out of sync or time.",
        syllables: "2 (jet-lag)",
        part_of_speech: "noun",
        synonyms: "fatigue, exhaustion",
        antonyms: "energy, pep",
        rhymes: "END: bag, drag, flag / SLANT: back, track / MULTI: get lag, set flag",
        examples: [
            "Jetlag from chasing dreams.",
            "No time for jetlag, keep moving.",
            "Living in different time zones, jetlag life."
        ],
        punchlines: [
            "Time traveler",
            "Body clock broken",
            "Waking up in tomorrow"
        ],
        tags: "jazer, song, travel"
    },
    {
        word: "Joke",
        meaning: "A thing that someone says to cause amusement or laughter.",
        rap_meaning: "Song: 'No Joke'. Seriousness. 'No petty shots'.",
        syllables: "1 (joke)",
        part_of_speech: "noun / verb",
        synonyms: "gag, jest, prank",
        antonyms: "seriousness, tragedy",
        rhymes: "END: smoke, broke, choke / SLANT: hope, rope / MULTI: no joke, slow poke",
        examples: [
            "This grind is no joke.",
            "Life's a joke if you don't take it serious.",
            "They thought it was a joke until I won."
        ],
        punchlines: [
            "Dead serious",
            "Laughing to the bank",
            "Not playing around"
        ],
        tags: "jazer, song, mindset"
    },
    {
        word: "Jaguar",
        meaning: "A large, heavily built cat that has a yellowish-brown coat with black spots.",
        rap_meaning: "School Mascot: Cedar Park Middle School Jaguars. Origin story.",
        syllables: "2 (jag-uar)",
        part_of_speech: "noun",
        synonyms: "panther, cat, feline",
        antonyms: "prey",
        rhymes: "END: car, star, far / SLANT: radar / MULTI: fast jaguar, past radar",
        examples: [
            "Jaguar spirit, born to hunt.",
            "Fast like a jaguar, silent moves.",
            "From the Jaguars to the big leagues."
        ],
        punchlines: [
            "Apex predator",
            "Spots don't change",
            "Jungle king"
        ],
        tags: "jazer, origin, symbol"
    },
    {
        word: "Jump",
        meaning: "Push oneself off a surface and into the air by using the muscles in one's legs and feet.",
        rap_meaning: "Action. Sports. 'Jumpman' (Jordan). Making a leap of faith.",
        syllables: "1 (jump)",
        part_of_speech: "verb / noun",
        synonyms: "leap, bound, spring",
        antonyms: "fall, sit",
        rhymes: "END: bump, pump, dump / SLANT: dunk, trunk / MULTI: high jump, sky bump",
        examples: [
            "Take the jump, trust the wings.",
            "Jump shot water, net swish.",
            "Jump levels, skip the stairs."
        ],
        punchlines: [
            "Leap of faith",
            "Air time",
            "Vertical limit"
        ],
        tags: "jazer, action, sports"
    },
    {
        word: "Jam",
        meaning: "Squeeze or pack tightly into a specified space.",
        rap_meaning: "Music. 'Jam session'. To play music with others.",
        syllables: "1 (jam)",
        part_of_speech: "verb / noun",
        synonyms: "cram, press, improvise",
        antonyms: "empty, silence",
        rhymes: "END: slam, dam, ham / SLANT: man, plan / MULTI: summer jam, drummer slam",
        examples: [
            "This is my jam, turn it up.",
            "Late night jam session in the studio.",
            "Traffic jam on the road to success."
        ],
        punchlines: [
            "Pump up the jam",
            "Sticky situation",
            "Sweet sound"
        ],
        tags: "jazer, music, fun"
    }
  ]
};

const baseDir = path.resolve(__dirname, 'public', 'dictionary');

Object.keys(wordsData).forEach(letter => {
  const words = wordsData[letter];
  words.forEach(wordObj => {
    const safeWord = wordObj.word.toLowerCase().replace(/[^a-z0-9]/g, '');
    const wordDir = path.join(baseDir, letter, '01_Words', safeWord);

    // Create directory
    if (!fs.existsSync(wordDir)) {
      fs.mkdirSync(wordDir, { recursive: true });
    }

    // Create MD content
    const content = `# WORD: ${wordObj.word}

## Meaning (plain):
${wordObj.meaning}

## Rap meaning (how I'd say it):
${wordObj.rap_meaning}

## Syllables:
${wordObj.syllables}

## Part of speech:
${wordObj.part_of_speech}

## Synonyms:
${wordObj.synonyms}

## Antonyms:
${wordObj.antonyms}

## Rhyme ideas (end / slant / multi):
${wordObj.rhymes}

## 3 bar-ready examples:
${wordObj.examples.map((ex, i) => `${i + 1}. ${ex}`).join('\n')}

## 3 punchline angles:
${wordObj.punchlines.map((pl, i) => `${i + 1}. ${pl}`).join('\n')}

## Tags:
${wordObj.tags}
`;

    // Write file
    fs.writeFileSync(path.join(wordDir, 'word.md'), content);
    console.log(`Created ${wordObj.word}`);
  });
});
