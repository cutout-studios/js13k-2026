# <mark>\[DRAFT\]</mark> DARKWHITE Postmortem

My goals with JS13K this year were simple: learn to build a 3D WebGPU game, make
it as fun as I possibly can as concisely as possible and get to know the
community a little bit.

## First-time observations

<!-- TODO: assert goal and how goal differed from the competition -->
<!-- TODO: 'curse of knowledge' observations on how specifically it's difficult -->

1. I came into JS13K thinking "hell yeah, I can proceduralize whatever I want" -
   <mark><b>The one thing you <em>can't</em> proceduralize is explaining your
   game,</b></mark> and that's paramount here.

This makes successful innovation _particularly_ tricky in the JS13K format - per
[Jakob's Law](https://lawsofux.com/jakobs-law/):

> Users spend most of their time on other \[games\]. This means that users
> prefer your \[game\] to work the same way as all the other \[games\] they
> already know.

Anything novel incurs "explanation debt" - debt you cannot proceduralize away.

There are many and better ways of managing that debt without slamming down a
wall of text. For instance, studios like From Software can pay it down with the
decades of goodwill they've built up.

I'd now recommend the following exercise to a version of my past self that was
actually trying to "win": embrace
"[documentation driven development](https://gist.github.com/zsup/9434452)" here.
Write out the entire design of your game in **full detail** to the degree that
someone else can completely visualize your intent by reading it, and reserve
space for that text in your bundle until it's time to tutorialize. Leaving in
the buffer needed to clarify your game will ensure that you always can, and if
you need to cut something, you can cut it from the buffer as well. This time
around, I would have spent that budget on more depth cues, visual indicators and
maybe even a "shooting gallery" - things I had to drop at the very last minute.

Ultimately, I'm not even disappointed. "Winning"
[wasn't not the thing I was optimizing for](#personal-context), in part because
I knew being a first-timer there were some unmoored assumptions I'd invariably
make: like, "well, my codebase is turning out to be barely legible, so clearly
none of the games will be". No, they just had less scope.

2. <mark><b>You can push updates to your project description at any time
   throughout the review period.</b></mark> - Director's Cut is not your only
   recourse for catching issues - consider
   [syncing your description to feedback](https://github.com/js13kGames/mission-darkwhite/pull/3)
   as it comes in so each players' experience is better than the last!

3. Lastly, I'm a bit embarrassed to admit, but for some selfish reason I
   initially thought that once I'd finally submitted I was done. My exhaustion
   was partially to blame - but! <mark>_During_ the review period you
   _definitely_ need to _pay it forward_.</mark> The JS13K platform is
   specifically designed to push you to leave feedback on the games of those who
   have left feedback on yours, and that was not clear to me until I'd actually
   received my first feedback.

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
get a rough idea of how much code it would be or compress to. <mark><b>I also
found that one line of sketch code ultimately averaged to ~5 bytes in the
bundle,</b></mark> but YMMV (the final ratio was 1 line:3 bytes).

I also didn't realize how painful debugging that same "sketch logic" would be.
Logging from the game loop crashes Safari, and debugging is too tedious. Do we
really need a separate widget to confirm our games work? A previous boss of mine
[worked with internet standards bodies](https://datatracker.ietf.org/doc/rfc9460/) -
unless I'm missing something, it's so bad I am in fact planning on
[proposing a `console.log` extension](#community-contributions) of my own.

Overall JS13K kinda forces you to choose small software over your own developer
experience and I <mark><b>got stuck a bit too long in the mindset that I
couldn't have ANYTHING nice</b></mark>, to my detriment.

When I did break that mentality, the lion's share of my total LLM use was in
service of [spitting out crappy devtools](./devtools/) to make it easier to work
with my custom formats in the final days. At time of writing they're decent at
that, pretty much everything else was hit or miss.

### 3. **Deciding against an event-driven architecture.**

<!-- TODO: admit technical, and test first -->

This is minor, but I initially ruled out an
[event-driven architecture](https://en.wikipedia.org/wiki/Event-driven_architecture)
for fear that it would be too heavy. But, as I slowly eroded the quality of my
codebase to shave bytes, I began to realize that such a structure would have
likely been more resistant to tangling,
[easier to debug](https://github.com/whatwg/console/issues/255), and similar in
terms of byteweight. I'd recommend this to anyone attempting JS13K now.

That said, in my own work I will likely continue to
[lean heavily on a core loop](https://github.com/cutout-studios/toolbox/tree/main/jsx),
so I at least gave myself a preview of that.

## In Closing

<!-- TODO: link roadmap, technical appendix -->

If you made it to the end, thank you very much for reading and I hope you
learned something!

You should certainly at least try
[`MISSION: DARKWHITE`](https://js13kgames.com/games/mission-darkwhite) if you
haven't already.

If you'd like to support future endeavors, I encourage you do any of the
following:

1. [Follow on Bluesky](https://bsky.app/profile/cutoutstudios.com), though I'm
   unclear what form this social media approach will ultimately take. Just
   starting out here.
2. [Apply to join our small Discord!](https://discord.gg/DW5pyrjsYm) It's easy,
   just a bot-prevention measure. Would love to have you - we have weekly
   progress check-ins.
3. [Sponsoring the GitHub](https://github.com/sponsors/cutout-studios) would
   genuinely help me
   [qualify for food stamps](https://www.fna.usda.gov/snap/work-requirements) so
   I can keep doing these sorts of things 😭

Thanks again, and until next time! ✌️

- Daniel
