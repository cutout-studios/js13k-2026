# <mark>\[DRAFT\]</mark> DARKWHITE Postmortem

My goals with JS13K this year were simple:
[learn how to build a game](./APPENDIX.md#3d-rotation-bestiary),
[learn WebGPU](./APPENDIX.md#architecture), make it as fun as I possibly can as
concisely as possible and get to know the community a little bit. In this
respect, I consider my JS13K a success!

## First-time observations

I _did_ enter the event assuming that, because everything was so small, people
would be a bit more patient when it came to the individual games - this isn't
the case, and with a record number of entries to review this year, that
explainability is even _more_ important!

I was thinking "hell yeah, I can proceduralize whatever I want" -
<mark><b>unfortunately, this strategy does not extend to making your game
accessible.</b></mark>

I'd now recommend the following exercise in hindsight: embrace
"[documentation driven development](https://gist.github.com/zsup/9434452)" here.
Write out the entire design of your game in **full detail** to the degree that
someone else can completely visualize your intent by reading it and _reserve
space_ for that text in your bundle until it's time to tutorialize. I would have
spent that budget on more depth cues, redundant visual indicators and maybe even
a "shooting gallery" - things I had to drop at the last minute.

Speaking of depth cues, a side observation: I'd been led to believe my spatial
intelligence is oddly, annoyingly high, and expected there to be some difference
between how I found this game from others (meaning - what came naturally for me
might be challenging otherwise), but the nature of that difference came as a
pleasant surprise. People showed me where their perception broke down with
screenshots, explained in detail what was and wasn't working for them, and yet
I'd say roughly half of the people who playtested took to it anyway!!

I feel that because I stuck with the choices I made, I now understand the nature
of this difference a lot better and will improve as a designer as a result.
Heed: your strength can also be your weakness! But it's also probably not as
strong as you think!

A couple quick tips on the JS13K format itself that might not occur to a
veteran:

- **You can push updates to your project description at any time throughout the
  review period.** - Director's Cut is not your only recourse for catching
  issues. Consider
  [syncing your description to feedback](https://github.com/js13kGames/mission-darkwhite/pull/3)
  as it comes in, I definitely noticed players having a better time after I did
  so.

- Obvious in retrospect, but post-submission you should start reviewing games if
  you want yours to be reviewed. This is the unspoken contract I didn't
  understand until I received my first review. I would have started reviewing
  immediately, instead of eventually, had I realized. It's the right thing to
  do!

## Regrets

### 1. **Taking on a bit more than my current body could handle.**

I've been a full-time informal caretaker for a couple years now and didn't quite
realize how much my own health had slipped. My ambitious nature has been
tempered by age, but my barometer was off. I initially thought "oh surely I'll
run out of space in the first couple weeks" - I ended up working right up to the
deadline, and I probably could have kept scraping against the byte limit for
another few days.

I still managed to complete ~90% of what I'd initially planned (with the
remaining 10% still being fairly important), but don't be fooled -
<mark><b>Despite the month-long window, JS13k is just as much about energy and
time management as it is byte management.</b></mark>

### 2. **Not writing more devtools more sooner.**

I admittedly over-focused on the things that were relatively new to me - the 3D
programming and the golfing.

It is difficult, though, to justify tests or tools for things you're not even
sure you can fit. This led to a lot of "running ahead" with imperfect logic to
get a rough idea of how much code it would be or compress to. I also found that
one line of sketch code ultimately averaged to ~5 bytes in the bundle, but YMMV
(the final ratio was 1 line:3 bytes).

I also didn't realize how painful debugging that same "sketch logic" would be.
Logging from the game loop crashes Safari, and debugging is too tedious. Do we
really need a separate widget to confirm our games work? A previous boss of mine
[works with internet standards bodies](https://datatracker.ietf.org/doc/rfc9460/)
and I'm curious to get his thoughts on why things are in their current state.

Overall JS13K kinda forces you to choose small software over your own developer
experience and I got stuck a bit too long in the mindset that I couldn't have
ANYTHING nice, to my detriment.

When I did break that mentality, the lion's share of my total LLM use was in
service of [spitting out crappy devtools](./devtools/) to make it easier to work
with my custom formats in the final days. At time of writing they're decent at
that, pretty much everything else was hit or miss.

### 3. **Deciding against an event-driven architecture.**

This is minor and a bit technical, but I initially ruled out an
[event-driven architecture](https://en.wikipedia.org/wiki/Event-driven_architecture)
for fear that it would be too heavy. But, as I slowly eroded the quality of my
codebase to shave bytes, I began to realize that such a structure would have
likely been more resistant to tangling,
[easier to debug](https://github.com/whatwg/console/issues/255), and likely
similar in byteweight. I'd recommend this to anyone attempting JS13K now.

That said, in my own work I will likely continue to
[lean heavily on a core loop](https://github.com/cutout-studios/toolbox/tree/main/jsx),
so I at least gave myself a preview of that.

## In Closing

Thank you very much for reading! I also wanna thank Steve, Alexandra and Thomas
for advising and playtesting DARKWHITE throughout its development.

If you haven't already, you should
[certainly give it a try](https://js13kgames.com/games/mission-darkwhite)!

Also, if you'd like to support future endeavors, I encourage you do any of the
following:

1. [Follow on Bluesky](https://bsky.app/profile/cutoutstudios.com), though I'm
   just starting out here.
2. [Apply to join our small Discord!](https://discord.gg/DW5pyrjsYm) It's easy,
   just a bot-prevention measure. Would love to have you - we have weekly
   progress check-ins.
3. [Sponsoring the GitHub](https://github.com/sponsors/cutout-studios) would
   genuinely help me
   [qualify for food stamps and health insurance](https://www.fna.usda.gov/snap/work-requirements)
   so I can keep doing these sorts of things 😭

Until next time! ✌️

-- Daniel

---

<p align="center">
  <a href="./APPENDIX.md">Technical Appendix</a> | <a href="./PLAN.md">What's next?</a>
</p>
