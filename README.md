# Complete Dice Roller
The dice roller with the most complete dice notation integration.

You can create flexible and powerful formulas, so you can use it with any rpg or board game.

This app uses a custom extended Dice Notation ( https://en.wikipedia.org/wiki/Dice_notation ). See the in app documentation.

Examples:

- Pathfinder™ (skill check) = 1d20+6 = roll 1d20 then add 6 to the result
- Dungeons & Dragons™ 3.5 (pc creation) = 4d6-L = drop the lowest dice then sum the others
- Dungeons & Dragons™ 5 (advantage) = 2d20+H+2 = keep the highest dice then add 2 to the result
- Dungeons & Dragons™ 5 (disadvantage) = 2d20+L+2 = keep the lower dice then add 2 to the result
- Legend of the Five Rings™ = 4k3 = 4d10+H3 = roll 4d6 then sum the 3 highest dices
- Legend of the Five Rings™ = 4k3-R+R = 4d10-R1+R10+H3 = roll 4d6 then drop and reroll dices with result 1 (the default value when dropping), then keep and reroll dices with result 10 (the default value when keeping), then then sum the 3 highest dices
- Nameless Land™ = 1d100 = roll 1d100
- Arkham Horror™ = 2d6+S5 = count successes starting from 5 (the result will be 0, 1 or 2)
- Vampire, the Masquerade™ = 10d10+S = count successes starting from 8 (the default value)
- Fudge™ = 1dF = the result will be -1, 0 or 1
- Other = (1d3+3d6)+H+S = roll 1d3 and 3d6 and keep only the highest dice then count the successes = 0

Coming soon:

- Horizontal layout
- Make pharentesis work for actions too
- More dices: d% F.1 F.2 F.3
- Round, Floor, Ceil
- Custom dices
- Roll history
- Save favored formulas and name them
- Nested formulas (use favored formulas' name as element of a formula)
- Macros ("if" instruction to execute different formulas depending on the result of other formulas)
- Character profiles with custom stats usable as element of a formulas
- Online data sync
- Unique results (lottery style)
- Optionally use a different dice notation
