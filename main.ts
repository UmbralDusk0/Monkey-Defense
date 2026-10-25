
// --- INITIALIZE ENVIRONMENT ---
tiles.setCurrentTilemap(tilemap`level`)
info.setLife(20)
info.setScore(1)
namespace userconfig {
    export const ARCADE_SCREEN_WIDTH = 192
    export const ARCADE_SCREEN_HEIGHT = 160
}
namespace SpriteKind {
    export const Tower = SpriteKind.create()
    export const ShopIcon = SpriteKind.create()
    export const MainCursor = SpriteKind.create()
}

// --- WAVE PATH COORDINATES ---
// --- WAVE PATH COORDINATES ---
let enemyPath: tiles.Location[] = [
    tiles.getTileLocation(0, 3),
    tiles.getTileLocation(1, 3),
    tiles.getTileLocation(2, 3),
    tiles.getTileLocation(3, 3),
    tiles.getTileLocation(4, 3),
    tiles.getTileLocation(5, 3),

    tiles.getTileLocation(5, 2),
    tiles.getTileLocation(5, 1),
    tiles.getTileLocation(4, 1),
    tiles.getTileLocation(3, 1),

    tiles.getTileLocation(3, 2),
    tiles.getTileLocation(3, 3),
    tiles.getTileLocation(3, 4),
    tiles.getTileLocation(3, 5),
    tiles.getTileLocation(3, 6),
    tiles.getTileLocation(3, 7),

    tiles.getTileLocation(2, 7),
    tiles.getTileLocation(1, 7),
    tiles.getTileLocation(1, 6),
    tiles.getTileLocation(1, 5),
    tiles.getTileLocation(2, 5),
    tiles.getTileLocation(3, 5),
    tiles.getTileLocation(4, 5),
    tiles.getTileLocation(5, 5),
    tiles.getTileLocation(6, 5),
    tiles.getTileLocation(7, 5),

    tiles.getTileLocation(7, 4),
    tiles.getTileLocation(7, 3),
    tiles.getTileLocation(8, 3),
    tiles.getTileLocation(9, 3),

    tiles.getTileLocation(9, 4),
    tiles.getTileLocation(9, 5),
    tiles.getTileLocation(9, 6),
    tiles.getTileLocation(9, 7),

    tiles.getTileLocation(8, 7),
    tiles.getTileLocation(7, 7),
    tiles.getTileLocation(6, 7),
    tiles.getTileLocation(5, 7),

    tiles.getTileLocation(5, 8),
    tiles.getTileLocation(5, 9),
]

// --- GAME BALANCING COSTS ---
let playerCash = 420
let holdingTowerType = "none"
let currentWaveIndex = 0
let spawnQueue: string[] = []
let waveInProgress = false

const MONKEY_COST = 210
const MONKEY_RANGE = 45
const NINJA_COST = 325
const NINJA_RANGE = 25
const DARTLING_COST = 900
const KILL_REWARD = 50

// --- BLOON ART GRAPHICS ---
let redImage = img`
    . . . . . . . d d . . . . . . .
    . . . . . e 2 2 2 2 e b . . . .
    . . . d 2 2 2 2 2 1 2 2 f . . .
    . . . 2 2 2 2 2 2 e 1 2 2 . . .
    . . e 2 2 2 2 2 2 2 e 1 2 e . .
    . . e 2 2 2 2 2 2 2 2 1 4 4 . .
    . . e 2 2 2 2 2 2 2 2 1 1 2 . .
    . . e 2 2 2 2 2 2 2 2 3 2 2 . .
    . . e 2 2 2 2 2 2 2 2 d 2 2 . .
    . . d 2 2 2 2 2 2 2 2 2 2 f . .
    . . . e 2 2 2 2 2 2 2 2 2 . . .
    . . . . 2 2 2 2 2 2 2 2 e . . .
    . . . . . 2 2 2 2 2 2 f . . . .
    . . . . . . e 2 2 2 e . . . . .
    . . . . . . e e e . . . . . . .
    . . . . . . . e e . . . . . . .
`
let blueImage = img`
    . . . . . . . d d . . . . . . .
    . . . . . 8 6 6 6 6 8 b . . . .
    . . . d 6 6 6 6 6 1 6 6 f . . .
    . . . 6 6 6 6 6 6 8 1 6 6 . . .
    . . 8 6 6 6 6 6 6 6 8 1 6 8 . .
    . . 8 6 6 6 6 6 6 6 6 1 9 9 . .
    . . 8 6 6 6 6 6 6 6 6 1 1 6 . .
    . . 8 6 6 6 6 6 6 6 6 9 6 6 . .
    . . 8 6 6 6 6 6 6 6 6 d 6 6 . .
    . . d 6 6 6 6 6 6 6 6 6 6 f . .
    . . . 8 6 6 6 6 6 6 6 6 6 . . .
    . . . . 6 6 6 6 6 6 6 6 8 . . .
    . . . . . 6 6 6 6 6 6 f . . . .
    . . . . . f 8 6 6 6 8 . . . . .
    . . . . . . 8 8 8 . . . . . . .
    . . . . . . . 8 8 . . . . . . .
`
let greenImage = img`
    . . . . . . . d d . . . . . . .
    . . . . . 6 7 7 7 7 6 b . . . .
    . . . . 7 7 7 7 7 1 7 7 f . . .
    . . . 7 7 7 7 7 7 6 1 7 7 . . .
    . . 6 7 7 7 7 7 7 7 6 1 7 6 . .
    . . 6 7 7 7 7 7 7 7 7 1 6 6 . .
    . . 6 7 7 7 7 7 7 7 7 1 1 7 . .
    . . 6 7 7 7 7 7 7 7 7 3 7 7 . .
    . . 6 7 7 7 7 7 7 7 7 d 7 7 . .
    . . d 7 7 7 7 7 7 7 7 7 7 f . .
    . . . 6 7 7 7 7 7 7 7 7 7 . . .
    . . . . 7 7 7 7 7 7 7 7 6 . . .
    . . . . . 7 7 7 7 7 7 f . . . .
    . . . . . . 6 7 7 7 6 . . . . .
    . . . . . . 6 6 6 . . . . . . .
    . . . . . . . 6 6 . . . . . . .
`
let camoImage = img`
    . . . . . . . d d . . . . . . .
    . . . . . 6 7 7 7 7 6 b . . . .
    . . d 7 7 7 7 7 7 e e e f . . .
    . . . 6 6 7 7 7 7 1 e e e e . .
    . . 6 6 6 6 7 7 7 7 1 1 e e . .
    . . 6 6 6 6 7 7 7 7 7 1 e 6 . .
    . . 6 6 6 7 7 7 7 7 7 1 1 7 . .
    . . 6 7 7 7 7 7 7 7 7 3 7 7 . .
    . . 6 7 7 7 7 7 7 7 7 d 7 7 . .
    . . d e e e e 7 7 7 7 7 7 f . .
    . . . 6 e e e 7 7 7 6 6 6 . . .
    . . . . e e e 7 7 6 6 6 6 . . .
    . . . . . e 7 7 7 6 6 f . . . .
    . . . . . . 6 7 7 7 6 . . . . .
    . . . . . . 6 6 6 . . . . . . .
    . . . . . . . 6 6 . . . . . . .
`
// --- MOAB IMAGES: 4 DIRECTIONS ---
let moabUpImage = img`
    .............8866666688.............
    ...........886991111d9688...........
    .........886999999999999688.........
    .......886991191111119111968........
    ......886991191111111191191688......
    .....88619111911111111911191988.....
    .....86969996999199119969996968.....
    ....8868666666666666666666668688....
    ...886666666666666666666666666688...
    ...866866666666666666666666668668...
    ..88666666666666666666666666666688..
    ..86666666666666666666666666666668..
    ..86666666666666666666666666666668..
    .8868666666666666666666666666668668.
    886686666666666666666666666666686688
    686666666666666666666666666666666688
    886666666666666666666666666666666688
    866666666666666666666666666666666668
    866666666666666666666666666666666668
    866666666666666666666666666666668668
    866866666666666666666666666666668668
    866866666866666666666666666666668668
    866666666666666666666666666666668666
    866666666666666666666666666666668666
    666866666666666666666666666666668666
    866666666666666666666666666666668666
    866666666666666666666666666666668666
    866866666666666666666666666666668666
    866866666866666666666666666666668668
    866866666666666666666666666666668668
    866866666666666666666666666666668668
    666666666666666666666666666666666668
    686666666666666666666666666666666666
    881999999999996666666666999999999988
    .8991111111111111111111111111111998.
    .6919111119111111111111119111119196.
    .8919111119111111111111119111119198.
    ..61911111911111111111111911111916..
    ..89991111911111111111111911119998..
    ..86666666866696669699666666666666..
    ..86666666666666666666666666666666..
    ...6666666666666666666666666666668..
    ...899999996999996999999699999998...
    ...661911119111111111111911119166...
    ....6911111911111111111191111998....
    ....8911111911111111111191111996....
    .....61111191111111111119111116.....
    .....86669969999999999999996668.....
    .....68666666666666666686666688.....
    ......866666866666666668666668......
    ......866666866666666666666668......
    .....88668666666666666666686688.....
    .....86666666666666666666666668.....
    ....8866666666666666668666666688....
    ...886666686666666666686666666688...
    ...866666666666666666666666666668...
    ..88666666666686666668666666666688..
    ..86666666686686666668666666666668..
    .8866666666886666666666666666666688.
    .8666666666688686666866866666666668.
    .86666666666886866668688666666666688
    .8666666666688868668668866666666668.
    ..86666666668888866888886666666668..
    ..88888888888888888888888888888888..
`

let moabDownImage = img`
    ..88888888888888888888888888888888..
    ..86666666668888866888886666666668..
    .8666666666688668668688866666666668.
    88666666666688686666868866666666668.
    .8666666666686686666868866666666668.
    .8866666666666666666666886666666688.
    ..86666666666686666668668666666668..
    ..88666666666686666668666666666688..
    ...866666666666666666666666666668...
    ...886666666686666666666686666688...
    ....8866666668666666666666666688....
    .....86666666666666666666666668.....
    .....88668666666666666666686688.....
    ......866666666666666668666668......
    ......866666866666666668666668......
    .....88666668666666666666666686.....
    .....86669999999999999996996668.....
    .....61111191111111111119111116.....
    ....6991111911111111111191111198....
    ....8991111911111111111191111196....
    ...661911119111111111111911119166...
    ...899999996999999699999699999998...
    ..8666666666666666666666666666666...
    ..66666666666666666666666666666668..
    ..66666666666699696669666866666668..
    ..89991111911111111111111911119998..
    ..61911111911111111111111911111916..
    .8919111119111111111111119111119198.
    .6919111119111111111111119111119196.
    .8991111111111111111111111111111998.
    889999999999666666666699999999999188
    666666666666666666666666666666666686
    866666666666666666666666666666666666
    866866666666666666666666666666668668
    866866666666666666666666666666668668
    866866666666666666666666668666668668
    666866666666666666666666666666668668
    666866666666666666666666666666666668
    666866666666666666666666666666666668
    666866666666666666666666666666668666
    666866666666666666666666666666666668
    666866666666666666666666666666666668
    866866666666666666666666668666668668
    866866666666666666666666666666668668
    866866666666666666666666666666666668
    866666666666666666666666666666666668
    866666666666666666666666666666666668
    886666666666666666666666666666666688
    886666666666666666666666666666666686
    886686666666666666666666666666686688
    .8668666666666666666666666666668688.
    ..86666666666666666666666666666668..
    ..86666666666666666666666666666668..
    ..88666666666666666666666666666688..
    ...866866666666666666666666668668...
    ...886666666666666666666666666688...
    ....8868666666666666666666668688....
    .....86969996991199199969996968.....
    .....88919111911111111911191688.....
    ......886191191111111191199688......
    ........869111911111191199688.......
    .........886999999999999688.........
    ...........8869d111199688...........
    .............8866666688.............
`

let moabLeftImage = img`
    ..............86888888886888888668..............................
    .............888866666666666666688868.....................8888..
    ..........8888666666666666666666619996888...............88866688
    ........888666666666886686688886699111966686..........8886666668
    .......886666886666666666666666669199996669668.......88666666668
    .....88866666666666666666666666669111196669199686..8886666666668
    ....886668666666666666666666666669111116669911168888666666666668
    ...8869866666666666666666666666669111116669111166666666666666668
    ...8616666666666666666666666666669111116669111166666666666666668
    ..86999666666666666668666666866669111116669111196668666666666668
    ..89919666666666666666666666666669199998669111196666668666666668
    .869119666666666666666666666666669111116666999966666666668866668
    .891116666666666666666666666666669111116669111196886666666888888
    8691999666666666666666666666666669111116669111196666666666688888
    8999119666666666666666666666666666111119669111196666666688666888
    6991119666666666666666666666666666111116669111196666666666688688
    6191111666666666666666666666666666111116669111196666666666666888
    6191119666666666666666666666666666111116666111196666666666666668
    6191119666666666666666666666666666111119669111196666666666666668
    6191111666666666666666666666666666111116669111196666666666666888
    6d91111666666666666666666666666666111119669111196666666666688688
    8999119666666666666666666666666666111119669111196666666688666688
    8691999666666666666666666666666666111116669111196666688666668888
    .891116666666666666666666666666666111116669111198866666666688888
    .861119666666666666666666666666669111116666999996666666666666668
    ..89919666666666666666666666666669199996669111196666666666666668
    ..86199666666666666666666666666669111116669111196668666666666668
    ...8616666666666666666666666666669111116669111166666666666666668
    ....899866666666666666666666666669111116669111166666666666666668
    ....886668666666666666666666666669111116669999168888666666666668
    .....88866666666666666666666666669111196669199688..8886666666668
    .......886666886666666666666666669199996669686.......88666666668
    ........888666666668888888888886699111966686..........8886666668
    ..........88866666666666666666666999968668..............88866688
    .............888866666666666666668868.....................8888..
    ..............88888888666666888868..........................8...
`

let moabRightImage = img`
    ..............................86688888868888888868..............
    ..8888.....................868886666666666666668888.............
    88666888...............8886999166666666666666666668888..........
    8666666888..........686669111996688886686688666666666888........
    86666666688.......866966699991966666666666666666688666688.......
    8666666666888..68699196669111196666666666666666666666666888.....
    866666666666888861119966611111966666666666666666666666866688....
    8666666666666666611119666111119666666666666666666666666689688...
    8666666666666666611119666111119666666666666666666666666666168...
    86666666666686669111196661111196666866666686666666666666699968..
    86666666686666669111196689999196666666666666666666666666691998..
    866668866666666669999666611111966666666666666666666666666911968.
    888888666666688691111966611111966666666666666666666666666611198.
    8888866666666666911119666111119666666666666666666666666669991968
    8886668866666666911119669111116666666666666666666666666669119998
    8868866666666666911119666111116666666666666666666666666669111996
    8886666666666666911119666111116666666666666666666666666661111916
    8666666666666666911116666111116666666666666666666666666669111916
    8666666666666666911119669111116666666666666666666666666669111916
    8886666666666666911119666111116666666666666666666666666661111916
    88688666666666669111196691111166666666666666666666666666611119d6
    8866668866666666911119669111116666666666666666666666666669119998
    8888666668866666911119666111116666666666666666666666666669991968
    888886666666668891111966611111666666666666666666666666666611198.
    866666666666666699999666611111966666666666666666666666666911168.
    86666666666666669111196669999196666666666666666666666666691998..
    86666666666686669111196661111196666666666666666666666666699168..
    8666666666666666611119666111119666666666666666666666666666168...
    866666666666666661111966611111966666666666666666666666668998....
    866666666666888861999966611111966666666666666666666666866688....
    8666666666888..88699196669111196666666666666666666666666888.....
    86666666688.......686966699991966666666666666666688666688.......
    8666666888..........686669111996688888888888866666666888........
    88666888..............86686999966666666666666666666888..........
    ..8888.....................868866666666666666668888.............
    ...8..........................86888866666688888888..............
`
// --- MONKEY IMAGES (BASE, TIER 1, TIER 2) ---
let monkeyImage = img`
    . . . . . . . d . . . . . . . .
    . . . . . b 1 e . . . . . . . .
    . . . . c e e e e . . . . . . .
    . . e e e e e e e . . . . . . .
    . e e e e e e e e e . . . . . .
    . e e e e e e 4 4 e . . . . . .
    . 4 e 4 e e d 1 4 4 e . . . . .
    . 4 1 1 4 4 1 e 1 4 4 e . . . .
    . 4 1 e 4 4 1 1 d . . . . . . .
    . . . 4 4 4 4 e e e e . . . . .
    . 1 5 . e e e e e e e . . . . .
    d c 4 e e . 4 4 e . 4 e . . . .
    c c c . . . 4 e e . 4 4 4 . . .
    e . . . . e . . e . . 4 4 . . .
    . . . . 4 4 e . e c . . . . . .
    . . . . . . . . 4 e . . . . . .
`
let monkeyTier1Image = img`
    . . . . . . . . . . . . e . . .
    . . . . . . . d 7 e . e . . . .
    . . . . . . e 7 7 7 7 e e . . .
    b . . . . e 4 e e e 7 7 . . . .
    . c c . d d 1 4 e c e 7 . . d .
    . . . . e 1 c 4 4 4 4 e e c c e
    . . . . . d 1 4 c b 4 e . e . .
    . . e 4 4 . 4 4 4 1 4 e . . 7 .
    . . e 4 4 e e e e 4 e e e 7 . e
    . . . . . e e 4 e . . . . . . .
    . . . . . . e 4 e e e 4 . . . .
    . . . . . . 4 4 e c e e . . . .
    . . . . . . e e e c . c b . . .
    . . . . . . e e . . . . . . . .
    . . . . . . . 4 . . . . e . . .
    . . . . . . 4 e . . . . . . . .
`
let monkeyTier2Image = img`
    . . . . . . . . . . . . 1 f f .
    . . . . . . 1 2 f 1 . d c f f .
    . . . . . c 2 2 2 f f f . . . .
    . . . . f 1 1 e 4 4 e e c c . .
    . . . . 2 1 f 4 f 1 4 e c . . .
    . . . . 2 e e 4 e 1 4 1 . . . .
    . . . . f d 4 4 1 1 4 . . . . .
    . . . . . 1 e 4 4 4 e e e e . .
    . . . 1 . 4 1 4 e c 4 . e e e 1
    f f c f . e 4 e e e 4 e . . . e
    . . c c 2 . . . e . 4 e . . . e
    . . . . . . . 4 4 . 4 e e . e .
    . f c 2 1 1 e 4 4 . e . . . . .
    f f c . . 1 . 4 . . e e . . . .
    . . . . c . . . . . . 4 . . . .
    . . . . . . . . . . e . . . . .
`

let ninjaImage = img`
    . . . . . . d e 4 2 e 2 . . . .
    . . . . . 2 2 2 2 2 2 2 2 . . .
    . . . . . 4 2 2 2 2 2 2 2 e . .
    . . . . 1 2 2 2 2 2 2 2 2 2 . .
    . . . . 1 2 2 2 2 2 2 2 2 2 . .
    . . . 1 4 2 2 2 2 2 2 2 2 2 . .
    . . . 1 2 2 2 e 2 2 2 2 2 2 e c
    . . . e 2 2 2 d f 4 4 1 f c c c
    1 2 2 . e 2 2 d f 4 4 d f e c c
    e 2 . . . e 2 2 2 2 2 e 4 4 . c
    e . . . . 4 2 2 2 2 2 e 4 e . .
    2 2 e e e d 2 e 2 2 2 e . . . .
    . . 2 2 2 d d e e e e 4 . . . .
    . . . e 2 d d 2 e e 4 . . . . .
    . b 2 2 . d d e e 4 . . . . . .
    . e e e . d d e e 4 . . . . . .
`
let ninjaTier1Image = img`
    . . . . . . 3 2 2 2 3 d . . . .
    . . . . . 2 2 2 2 2 2 2 . . . .
    . . d d e 2 2 2 2 2 2 2 d . . .
    . d b d b 4 4 2 2 2 2 2 4 d d .
    d b c e e d d d d d d d d d d d
    b c c b 2 e d d d d b d d d . .
    . d c 4 e 1 f 4 e f 2 4 2 d d .
    . . c 4 2 d f 4 1 f 4 4 2 d d .
    . . e d 2 2 2 2 2 2 4 4 b d d .
    . . . . . b 2 2 e 2 2 e . . . .
    . . . . e 2 d 2 e 2 2 e . . . .
    . . . . 2 d b e . . . . . . . .
    . . . b d b 4 b e . . . . . . .
    . . . . . e e . d . . . . . . .
    . . . . e 4 d . e . . . . . . .
    . . . . e d e e d . . . . . . .
`
let ninjaTier2Image = img`
    . . . . . 4 f . . . . . . . . .
    . . . . . e 4 4 e . . . . . . .
    . . . c 4 e e 4 e 4 4 . . . . .
    . . . 4 e e 4 e 4 4 e 4 c . . .
    . . 4 e 4 e e 4 e 4 4 e 2 . . .
    . 4 e 4 e e e 4 4 e 4 e c 2 c .
    . e e 4 e e 4 e 4 4 b 2 2 2 . .
    . . 4 e 4 4 2 2 1 2 d d d 4 . c
    c b 1 f 1 1 f 1 1 2 d d 1 4 . d
    d d 1 d d 1 1 1 d 2 2 c e 4 c .
    . . c 2 1 c b b c 2 e c c c . .
    . c . 2 c c 2 2 c 2 c c . b . .
    . . d d . d b b c c c c d d . .
    . c d d . d . c c . . . . . . .
    . . . . c c d d d c . . . . . .
    . . . . . . . . . . . . . . . .
`

let dartlingImage = img`
    . . d e d d d . . . . . . . . .
    . c 7 7 d 1 7 7 . . . . . . . .
    d 7 7 7 5 5 7 7 7 . . . . . . .
    c 7 7 7 7 7 7 7 7 . . . . . . .
    c 7 7 7 c c f c c 7 . . . . . .
    d c c 7 7 e b d d c . . . . . .
    d c c 1 d 4 4 d d . . . . . . .
    d c c d d e b e e d . . . . . .
    . c c e e e e e d e e . . . . .
    . d . e e 4 e 7 e 4 4 d . . . .
    . b . e e 4 4 7 f e c e d b . .
    d e . b e 4 4 c c c 7 7 7 d d d
    d e . . b e 7 f c b 7 7 b c b c
    . e e e 4 . . e f c 7 7 c c c d
    . . . d 4 4 . . d d e e c b c d
    . . . . . . . . . . . d d b c d
`
let dartlingTier1Image = img`
    . . . . . 7 7 7 7 7 . . . . . .
    . . . d 7 7 7 1 1 d 7 7 . . . .
    . d b 7 7 7 7 4 2 5 7 7 c . . .
    . . 7 7 7 7 7 4 4 7 7 7 c . . .
    . . 7 7 7 7 7 7 7 7 c 7 7 c . .
    . f c 7 7 c c c e f f b c c c .
    . e 7 c c d 1 e 4 4 c 1 c e c .
    . . c c 1 1 e 1 4 4 1 1 c d b .
    . . c c e 1 1 4 4 4 e f c 4 f 4
    . . . c e e e e 4 e d e e 4 4 e
    . . f 4 4 e e 4 4 4 e e e e 4 4
    c f b b b 4 4 4 4 4 4 e 7 . e .
    c f c c b b 4 4 e e e e 7 . e .
    c f c f c c 4 e d e 4 e . . e .
    e f c c 4 4 4 . e e 4 f e e . .
    . . . . . . . . 4 4 e . . . . .
`
let dartlingTier2Image = img`
    1 1 1 1 1 7 7 7 7 7 1 1 1 1 1 1
    1 1 1 d 7 7 7 1 1 c 7 7 1 1 1 1
    1 d 7 7 7 7 5 2 2 5 5 7 c 1 1 1
    1 1 7 7 7 7 7 4 4 7 7 7 c 1 1 1
    1 1 7 7 7 7 7 7 7 c c 7 7 c 1 1
    1 c c c 7 c c c e f f b c c 1 1
    1 c 7 c f d d e 4 4 d 1 c e f 1
    1 1 c c 1 1 e 1 4 4 1 1 c 1 2 1
    1 1 c c e 1 1 4 4 4 e c c 4 c 4
    1 1 1 c e e e e 4 e 1 e e 4 4 4
    1 1 f 4 4 e e 4 4 4 e e e 4 e c
    c f f f f 4 4 4 4 4 4 e 7 1 b 1
    c f c c c f 4 e e e e e 7 1 e 1
    f f f f f f 4 f d e 4 c 1 1 e 1
    e f f f 4 4 4 1 4 e 4 c e e 1 1
    1 1 1 1 1 1 1 1 4 4 e 1 1 1 1 1
`

let dartImage = img`
    . . f . .
    . f b f .
    f b c b f
    . f b f .
    . . f . .
`
let defaultCursorImage = img`
    . . . . f . . . .
    . . . f 1 f . . .
    . . . f 1 f . . .
    . f f 1 1 1 f f .
    f 1 1 1 f 1 1 1 f
    . f f 1 1 1 f f .
    . . . f 1 f . . .
    . . . f 1 f . . .
    . . . . f . . . .
`

// --- 10 EXTENDED CUSTOM WAVES ---
let waves: string[][] = [
    // 1
    ["red"],

    // 2
    ["red", "red"],

    // 3
    ["red", "blue"],

    // 4
    ["red", "red", "blue"],

    // 5
    ["blue", "blue", "red"],

    // 6
    ["red", "blue", "blue", "red"],

    // 7
    ["green", "red", "blue"],

    // 8
    ["green", "green", "red"],

    // 9
    ["green", "blue", "blue", "red"],

    // 10
    ["green", "green", "blue", "blue"],

    // 11
    ["green", "green", "green", "red"],

    // 12
    ["green", "green", "blue", "blue", "red"],

    // 13
    ["green", "green", "green", "blue"],

    // 14
    ["green", "green", "green", "blue", "blue"],

    // 15
    ["green", "green", "green", "green", "blue"],

    // 16
    ["green", "green", "green", "blue", "blue", "red"],

    // 17
    ["green", "green", "green", "green", "green"],

    // 18
    ["green", "green", "green", "green", "blue", "blue"],

    // 19
    ["green", "green", "green", "green", "green", "blue"],

    // 20
    ["green", "green", "green", "green", "green", "green"],

    // 21
    ["green", "green", "green", "green", "green", "blue", "blue"],

    // 22
    ["green", "green", "green", "green", "green", "green", "red"],

    // 23
    ["green", "green", "green", "green", "green", "blue", "blue", "blue"],

    // 24
    ["green", "green", "green", "green", "green", "green", "blue"],

    // 25
    ["green", "green", "green", "green", "green", "green", "green", "blue"],

    // 26
    ["green", "green", "green", "green", "green", "blue", "blue", "blue", "red"],

    // 27
    ["green", "green", "green", "green", "green", "green", "green", "blue", "blue"],

    // 28
    ["green", "green", "green", "green", "green", "green", "green", "green"],

    // 29
    ["green", "green", "green", "green", "green", "green", "blue", "blue", "blue", "blue"],

    // 30 - first camo rush
    ["green", "green", "green", "green", "green", "green", "camo", "camo"],

    // 31
    ["green", "green", "green", "green", "green", "green", "green", "camo", "blue"],

    // 32
    ["green", "green", "green", "green", "green", "green", "camo", "camo", "camo"],

    // 33
    ["green", "green", "green", "green", "green", "green", "green", "blue", "camo", "camo"],

    // 34
    ["green", "green", "green", "green", "green", "green", "camo", "camo", "camo", "camo"],

    // 35
    ["green", "green", "green", "green", "green", "green", "green", "green", "camo", "camo", "blue"],

    // 36
    ["green", "green", "green", "green", "green", "green", "green", "camo", "camo", "camo", "camo"],

    // 37
    ["green", "green", "green", "green", "green", "green", "green", "green", "blue", "camo", "camo", "camo"],

    // 38
    ["green", "green", "green", "green", "green", "green", "green", "camo", "camo", "camo", "camo", "camo"],

    // 39
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "camo", "camo", "camo"],

    // 40
    ["green", "green", "green", "green", "green", "green", "green", "green", "camo", "camo", "camo", "camo", "blue"],

    // 41
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "camo", "camo", "camo", "camo"],

    // 42
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "camo", "camo", "camo"],

    // 43
    ["green", "green", "green", "green", "green", "green", "green", "green", "camo", "camo", "camo", "camo", "camo", "blue"],

    // 44
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "camo", "camo", "camo", "camo", "camo"],

    // 45
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "camo", "camo", "camo", "camo"],

    // 46
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "camo", "camo", "camo", "camo", "camo", "blue"],

    // 47
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "camo", "camo", "camo", "camo", "camo"],

    // 48
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "camo", "camo", "camo", "camo"],

    // 49
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "camo", "camo", "camo", "camo", "camo", "blue"],

    // 50
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "camo", "camo", "camo", "camo", "camo", "camo"],

    // 51
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab"],

    // 52
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab"],

    // 53
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "blue"],

    // 54
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab"],

    // 55
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab"],

    // 56
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab"],

    // 57
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab"],

    // 58
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab"],

    // 59
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab"],

    // 60
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab"],

    // 61
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab", "blue"],

    // 62
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab"],

    // 63
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab", "moab"],

    // 64
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab", "moab"],

    // 65
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab", "moab"],

    // 66
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab", "moab", "moab"],

    // 67
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab", "moab", "moab"],

    // 68
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab", "moab", "moab"],

    // 69
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab", "moab", "moab"],

    // 70
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab", "moab", "moab"],

    // 71
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab", "moab", "moab"],

    // 72
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab", "moab", "moab"],

    // 73
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab", "moab", "moab", "blue"],

    // 74
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab", "moab", "moab", "moab"],

    // 75
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab", "moab", "moab", "moab"],

    // 76
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab", "moab", "moab", "moab"],

    // 77
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab", "moab", "moab", "moab"],

    // 78
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab", "moab", "moab", "moab"],

    // 79
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab", "moab", "moab", "moab"],

    // 80
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab", "moab", "moab", "moab"],

    // 81
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab", "moab", "moab", "blue"],

    // 82
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab", "moab", "moab", "moab"],

    // 83
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab", "moab", "moab"],

    // 84
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab", "moab", "moab", "moab"],

    // 85
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab", "moab", "moab", "moab"],

    // 86
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab", "moab", "moab", "moab", "blue"],

    // 87
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab", "moab", "moab", "moab", "moab"],

    // 88
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab", "moab", "moab", "moab", "moab"],

    // 89
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab", "moab", "moab", "moab", "blue"],

    // 90
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab", "moab", "moab", "moab", "moab"],

    // 91
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab", "moab", "moab", "moab", "moab"],

    // 92
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab", "moab", "moab", "moab", "moab"],

    // 93
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab", "moab", "moab", "moab", "moab", "blue"],

    // 94
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab", "moab", "moab", "moab", "moab", "moab"],

    // 95
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab", "moab", "moab", "moab", "moab", "moab"],

    // 96
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab", "moab", "moab", "moab", "moab", "moab", "blue"],

    // 97
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab", "moab", "moab", "moab", "moab", "moab"],

    // 98
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab", "moab", "moab", "moab", "moab", "blue"],

    // 99
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab", "moab", "moab", "moab", "moab", "moab"],

    // 100
    ["green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green", "green",
        "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "camo", "moab", "moab", "moab", "moab", "moab", "moab", "moab", "moab"]
];

// --- CONTROL CURSOR SETUP ---
let cursor = sprites.create(defaultCursorImage, SpriteKind.MainCursor)
cursor.setFlag(SpriteFlag.StayInScreen, true)
controller.moveSprite(cursor, 150, 150)

// --- SHOP HOVER ICONS ---
let iconBox1 = sprites.create(monkeyImage, SpriteKind.ShopIcon)
sprites.setDataString(iconBox1, "shopType", "monkey")
iconBox1.x = 180; iconBox1.y = 20
iconBox1.scale = 2

let iconBox2 = sprites.create(ninjaImage, SpriteKind.ShopIcon)
sprites.setDataString(iconBox2, "shopType", "ninja")
iconBox2.x = 180; iconBox2.y = 70
iconBox2.scale = 2
let iconBox3 = sprites.create(dartlingImage, SpriteKind.ShopIcon)
sprites.setDataString(iconBox3, "shopType", "dartling")
iconBox3.x = 180; iconBox3.y = 120
iconBox3.scale = 2

game.onShade(function () {
    screen.print("Cash: $" + playerCash, 2, 12, 15)
    screen.print("Hold: " + holdingTowerType.toUpperCase(), 2, 24, 15)
    screen.print("[B] START ROUND", 2, 150, 15)
})
// --- BUTTON B: LAUNCHES ROUND ON PRESS ---
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!waveInProgress && spawnQueue.length == 0 && sprites.allOfKind(SpriteKind.Enemy).length == 0) {
        if (currentWaveIndex < waves.length) {
            waveInProgress = true
            info.setScore(currentWaveIndex + 1)
            spawnQueue = []
            for (let enemyType of waves[currentWaveIndex]) { spawnQueue.push(enemyType) }
        } else {
            game.over(true)
        }
    }
})

// --- BUTTON A: SHOP SELECTION & HIERARCHY PLACEMENT ---
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (holdingTowerType == "none") {
        // Upgrade menu selection check
        for (let t of sprites.allOfKind(SpriteKind.Tower)) {
            if (cursor.overlapsWith(t)) {
                let type = sprites.readDataString(t, "type")
                let currentUpgradeLevel = sprites.readDataNumber(t, "upgradeLevel")

                if (type == "monkey") {
                    if (currentUpgradeLevel == 0) {
                        if ( playerCash >= 140) {
                            playerCash -= 140
                            sprites.setDataNumber(t, "upgradeLevel", 1)
                            sprites.setDataNumber(t, "range", MONKEY_RANGE + 15)
                            t.setImage(monkeyTier1Image) // Visual level swap
                        }
                    } else if (currentUpgradeLevel == 1) {
                       
                        if (playerCash >= 540) {
                            playerCash -= 540
                            sprites.setDataNumber(t, "upgradeLevel", 2)
                            sprites.setDataNumber(t, "cooldown", 650)
                            t.setImage(monkeyTier2Image) // Visual level swap
                        }
                    } else {
                        game.showLongText("Max Upgrades Reached!", DialogLayout.Bottom)
                    }
                } else if (type == "ninja") {
                    if (currentUpgradeLevel == 0) {
                        if (playerCash >= 340) {
                            playerCash -= 340
                            sprites.setDataNumber(t, "upgradeLevel", 1)
                            sprites.setDataNumber(t, "range", NINJA_RANGE + 20)
                            sprites.setDataNumber(t, "dartCount", 3)
                            t.setImage(ninjaTier1Image) // Visual level swap
                        }
                    } else if (currentUpgradeLevel == 1) {
                      
                        if (playerCash >= 905) {
                            playerCash -= 905
                            sprites.setDataNumber(t, "upgradeLevel", 2)
                            sprites.setDataNumber(t, "dartCount", 5)
                           
                            t.setImage(ninjaTier2Image) // Visual level swap
                        }
                    } else {
                        game.showLongText("Max Upgrades Reached!", DialogLayout.Bottom)
                    }
                } else if (type == "dartling") {
                    if (currentUpgradeLevel == 0) {
                        if (playerCash >= 500) {
                            playerCash -= 500
                            sprites.setDataNumber(t, "upgradeLevel", 1)
                            sprites.setDataNumber(t, "cooldown", 300)
                            t.setImage(dartlingTier1Image) // Visual level swap
                        }
                    } else if (currentUpgradeLevel == 1) {
                        
                        if (playerCash >= 6000) {
                            playerCash -= 6000
                            sprites.setDataNumber(t, "upgradeLevel", 2)
                            sprites.setDataNumber(t, "projSpeed", 220)
                            sprites.setDataNumber(t, "cooldown", 100)
                            t.setImage(dartlingTier2Image) // Visual level swap
                        }
                    } else {
                        game.showLongText("Max Upgrades Reached!", DialogLayout.Bottom)
                    }
                }
                return
            }
        }

        for (let icon of sprites.allOfKind(SpriteKind.ShopIcon)) {
            if (cursor.overlapsWith(icon)) {
                holdingTowerType = sprites.readDataString(icon, "shopType")
                if (holdingTowerType == "monkey") cursor.setImage(monkeyImage)
                if (holdingTowerType == "ninja") cursor.setImage(ninjaImage)
                if (holdingTowerType == "dartling") cursor.setImage(dartlingImage)
                return
            }
        }
    } else {
        let col = Math.floor(cursor.x / 16)
        let row = Math.floor(cursor.y / 16)

        if (col > 8) col = 8
        if (row > 8) row = 8

        let currentTile = tiles.getTileLocation(col, row)
        let activeCost = MONKEY_COST
        let imageToUse = monkeyImage
        let initialRange = MONKEY_RANGE
        let cd = 1000

        if (holdingTowerType == "ninja") { activeCost = NINJA_COST; imageToUse = ninjaImage; initialRange = NINJA_RANGE }
        if (holdingTowerType == "dartling") { activeCost = DARTLING_COST; imageToUse = dartlingImage; cd = 1000 }

        if (playerCash >= activeCost) {
            let isBlocked = false
            for (let pathLoc of enemyPath) { if (pathLoc.column == col && pathLoc.row == row) isBlocked = true }
            for (let existingTower of sprites.allOfKind(SpriteKind.Tower)) {
                let loc = existingTower.tilemapLocation()
                if (loc.column == col && loc.row == row) isBlocked = true
            }

            if (!isBlocked) {
                playerCash -= activeCost
                let tower = sprites.create(imageToUse, SpriteKind.Tower)
                sprites.setDataString(tower, "type", holdingTowerType)
                sprites.setDataNumber(tower, "range", initialRange)
                sprites.setDataNumber(tower, "cooldown", cd)
                sprites.setDataNumber(tower, "upgradeLevel", 0) // Initialize level status
                sprites.setDataNumber(tower, "dartCount", 2)
                sprites.setDataNumber(tower, "projSpeed", 140)
                sprites.setDataNumber(tower, "lastShotTime", 0)

                tiles.placeOnTile(tower, currentTile)

                holdingTowerType = "none"
                cursor.setImage(defaultCursorImage)
            } else { scene.cameraShake(3, 200) }
        } else { scene.cameraShake(2, 200) }
    }
})

// --- ENEMY RUNTIME GENERATION ---
game.onUpdateInterval(1000, function () {
    if (spawnQueue.length > 0) {
        let nextType = spawnQueue.shift()
        let isCamo = (nextType == "camo")

        let imgAsset = redImage
        let hp = 5

        if (nextType == "blue") {
            imgAsset = blueImage
            hp = 10
        }

        if (nextType == "green") {
            imgAsset = greenImage
            hp = 20
        }

        if (nextType == "camo") {
            imgAsset = camoImage
            hp = 50
        }

        if (nextType == "moab") {
            imgAsset = moabRightImage
            hp = 1000
        }
        
        let enemy = sprites.create(imgAsset, SpriteKind.Enemy)
        sprites.setDataString(enemy, "type", nextType)
        sprites.setDataNumber(enemy, "pathStep", 0)
        sprites.setDataNumber(enemy, "damage", hp)
        sprites.setDataNumber(enemy, "hp", hp)
        sprites.setDataNumber(enemy, "speed", 1100)
        sprites.setDataNumber(enemy, "nextMoveTime", game.runtime() + 1100)
        let enemySpeed = 1100

        if (nextType == "moab") {
            enemySpeed = 1800
        }

        sprites.setDataNumber(enemy, "speed", enemySpeed)
        sprites.setDataNumber(enemy, "nextMoveTime", game.runtime() + enemySpeed)
        sprites.setDataBoolean(enemy, "isCamo", isCamo)
        tiles.placeOnTile(enemy, enemyPath[0])
    }
})
function updateMoabDirection(moab: Sprite, currentStep: number) {
    if (currentStep + 1 >= enemyPath.length) return

    let currentLoc = enemyPath[currentStep]
    let nextLoc = enemyPath[currentStep + 1]

    let dx = nextLoc.column - currentLoc.column
    let dy = nextLoc.row - currentLoc.row

    if (dx > 0) {
        moab.setImage(moabRightImage)
    } else if (dx < 0) {
        moab.setImage(moabLeftImage)
    } else if (dy > 0) {
        moab.setImage(moabDownImage)
    } else if (dy < 0) {
        moab.setImage(moabUpImage)
    }
}

// --- MOVEMENT ENGINES ---
game.onUpdate(function () {
    let currentTime = game.runtime()

    for (let bloon of sprites.allOfKind(SpriteKind.Enemy)) {

        if (currentTime >= sprites.readDataNumber(bloon, "nextMoveTime")) {

            let currentStep = sprites.readDataNumber(bloon, "pathStep")
            let nextStep = currentStep + 1

            if (nextStep < enemyPath.length) {

                // Move to next path tile
                tiles.placeOnTile(bloon, enemyPath[nextStep])

                // Save new path position
                sprites.setDataNumber(bloon, "pathStep", nextStep)

                // Set next movement time
                let speed = sprites.readDataNumber(bloon, "speed")
                sprites.setDataNumber(
                    bloon,
                    "nextMoveTime",
                    currentTime + speed
                )

                // =========================
                // MOAB DIRECTION
                // =========================
                if (sprites.readDataString(bloon, "type") == "moab") {

                    let oldTile = enemyPath[currentStep]
                    let newTile = enemyPath[nextStep]

                    let dx = newTile.column - oldTile.column
                    let dy = newTile.row - oldTile.row

                    if (dx > 0) {
                        // Moving RIGHT
                        bloon.setImage(moabRightImage)
                    } else if (dx < 0) {
                        // Moving LEFT
                        bloon.setImage(moabLeftImage)
                    } else if (dy > 0) {
                        // Moving DOWN
                        bloon.setImage(moabDownImage)
                    } else if (dy < 0) {
                        // Moving UP
                        bloon.setImage(moabUpImage)
                    }
                }

            } else {

                // Bloon reached the end
                info.changeLifeBy(
                    -sprites.readDataNumber(bloon, "damage")
                )

                bloon.destroy()
            }
        }
    }
})

// --- TARGET SCANNING AI ENGINE WITH COOLDOWN AND UPGRADE TRACKING ---
game.onUpdate(function () {
    let currentTime = game.runtime()
    for (let tower of sprites.allOfKind(SpriteKind.Tower)) {
        let towerType = sprites.readDataString(tower, "type")
        let cooldown = sprites.readDataNumber(tower, "cooldown")
        let lastShot = sprites.readDataNumber(tower, "lastShotTime")
        let enemies = sprites.allOfKind(SpriteKind.Enemy)

        if (currentTime - lastShot < cooldown) { continue }

        if (towerType == "dartling") {
            if (enemies.length > 0) {
                sprites.setDataNumber(tower, "lastShotTime", currentTime)
                let dart = sprites.createProjectileFromSprite(dartImage, tower, 0, 0)
                let pSpeed = sprites.readDataNumber(tower, "projSpeed")
                let dx = cursor.x - tower.x; let dy = cursor.y - tower.y
                let dist = Math.sqrt(dx * dx + dy * dy)
                if (dist > 0) { dart.vx = (dx / dist) * pSpeed; dart.vy = (dy / dist) * pSpeed }
            }
            continue
        }

        if (enemies.length > 0) {
            let nearestEnemy: Sprite = null; let shortestDistance = 999999
            let rangeLimit = sprites.readDataNumber(tower, "range")

            for (let enemy of enemies) {
                let isEnemyCamo = sprites.readDataBoolean(enemy, "isCamo")
                if (isEnemyCamo && towerType != "ninja") { continue }

                let diffX = tower.x - enemy.x; let diffY = tower.y - enemy.y
                let dist = Math.sqrt(diffX * diffX + diffY * diffY)
                if (dist < shortestDistance) { shortestDistance = dist; nearestEnemy = enemy }
            }

            if (nearestEnemy && shortestDistance <= rangeLimit) {
                sprites.setDataNumber(tower, "lastShotTime", currentTime)

                if (towerType == "ninja") {
                    let dCount = sprites.readDataNumber(tower, "dartCount")
                    for (let i = 0; i < dCount; i++) {
                        timer.after(i * 120, function () {
                            if (!(nearestEnemy.flags & sprites.Flag.Destroyed)) {
                                let dart = sprites.createProjectileFromSprite(dartImage, tower, 0, 0)
                                sprites.setDataSprite(dart, "target", nearestEnemy)
                                trackProjectileTarget(dart)
                            }
                        })
                    }
                } else {
                    let dart = sprites.createProjectileFromSprite(dartImage, tower, 0, 0)
                    sprites.setDataSprite(dart, "target", nearestEnemy)
                    trackProjectileTarget(dart)
                }
            }
        }
    }
})

function trackProjectileTarget(dart: Sprite) {
    game.onUpdate(function () {
        let target = sprites.readDataSprite(dart, "target")
        if (target && !(target.flags & sprites.Flag.Destroyed)) {
            let dx = target.x - dart.x; let dy = target.y - dart.y
            let dist = Math.sqrt(dx * dx + dy * dy)
            if (dist > 0) { dart.vx = (dx / dist) * 130; dart.vy = (dy / dist) * 130 }
        }
    })
}

// --- PROJECTILE DAMAGE LOOPS ---
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (projectile, enemy) {
    projectile.destroy()
    let currentHp = sprites.readDataNumber(enemy, "hp") - 1
    let enemyType = sprites.readDataString(enemy, "type")

    if (currentHp <= 0) { enemy.destroy(); playerCash += KILL_REWARD }
    else {
        sprites.setDataNumber(enemy, "hp", currentHp)
        if (enemyType != "camo") {
            if (currentHp == 2) enemy.setImage(blueImage)
            if (currentHp == 1) enemy.setImage(redImage)
        }
    }
})

// --- LIFECYCLE REFRESH ---
game.onUpdate(function () {
    if (waveInProgress && spawnQueue.length == 0 && sprites.allOfKind(SpriteKind.Enemy).length == 0) {
        waveInProgress = false
        currentWaveIndex++
        if (currentWaveIndex >= waves.length) game.over(true)
    }
})

