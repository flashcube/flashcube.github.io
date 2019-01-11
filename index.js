;(function() {
    const settings = {
        axis: ['y','g','o','b','r','w'], // U,F,R,B,L,D
        llConditions: [
            {
                name: 'U-perm:b',
                state: 'bobrbrgggoro' // FFF->RRR->BBB->LLL
            },
            {
                name: 'U-perm:a',
                state: 'brbrorgggobo'
            },
            {
                name: 'A-perm:b',
                state: 'rbrgrobggoob'
            },
            {
                name: 'A-perm:a',
                state: 'gbobrbrggoor'
            },
            {
                name: 'Z-perm',
                state: 'brbrbrgogogo'
            },
            {
                name: 'H-perm',
                state: 'bgbrorgbgoro'
            },
            {
                name: 'E-perm',
                state: 'obrgrbrgobog'
            },
            {
                name: 'T-perm',
                state: 'bbrgobrggoro'
            },
            {
                name: 'V-perm',
                state: 'oorgrbrbobgg'
            },
            {
                name: 'F-perm',
                state: 'bgrgrbrbgooo'
            },
            {
                name: 'R-perm:b',
                state: 'brbrbgogrgoo'
            },
            {
                name: 'R-perm:a',
                state: 'rrgogrgbobob'
            },
            {
                name: 'J-perm:b',
                state: 'brrgbbrggooo'
            },
            {
                name: 'J-perm:a',
                state: 'oobrrrggobbg'
            },
            {
                name: 'Y-perm',
                state: 'bbgorrgobrgo'
            },
            {
                name: 'G-perm:d',
                state: 'borggbrbgoro'
            },
            {
                name: 'G-perm:c',
                state: 'rogobrggobrb'
            },
            {
                name: 'G-perm:a',
                state: 'obbrgoborgrg'
            },
            {
                name: 'G-perm:b',
                state: 'bgrgbbrogoro'
            },
            {
                name: 'N-perm:b',
                state: 'bbgoorggbrro'
            },
            {
                name: 'N-perm:a',
                state: 'bggorrgbbroo'
            }
        ]
    };

    const consts = {
        size: 3,
        colorMap: {
            r: 'red',
            b: 'blue',
            o: 'orange',
            g: 'green',
            y: 'yellow',
            w: 'white',
            x: 'gray'
        }
    };

    const baseMousePos = {
        x: null,
        y: null
    };
    const cubePointer = {
        x: null,
        y: null
    };
    // Validate llConditions (Not Strict)
    for (let i = 0; i < settings.llConditions.length; i++) {
        const cond = settings.llConditions[i];
        const name = cond.name ? `(${cond.name}) ` : '';
        if (cond.state.length != consts.size * 4) {
            console.log(`llConditions[${i}] ${name}is invalid size`);
        } 
        const map = {};
        for (let s of cond.state.split('')) {
            map[s] = (map[s] || 0) + 1;
        }
        for (let s in map) {
            if (map[s] != consts.size) {
                console.log(`llConditions[${i}] ${name}is suspicious: ${JSON.stringify(map)}`);
                break;
            }
        }
    }

    const begin = new Date().getTime();    
    const $body = document.getElementsByTagName('body')[0];
    $body.addEventListener('mousemove', onMousemove);
    $body.addEventListener('touchstart', onTouchStart);
    $body.addEventListener('touchmove', onMousemove);
    const $article = document.getElementsByTagName('article')[0];

    const $cube = document.createElement('div');
    $cube.classList.add('cube');
    $article.appendChild($cube);

    const options = loadOptions();
    updateOptionsCtrl(options);
    console.log(`load stored options: ${JSON.stringify(options)}`);

    refreshCube();
    console.log(`Finished. Elapsed: ${new Date().getTime() - begin}`);


    // condition: {
    //     stickers: {
    //         u: 'yyyyyyyyy',
    //         f: 'ggggggggg',
    //         r: 'ooooooooo',
    //         b: 'bbbbbbbbb',
    //         l: 'rrrrrrrrr',
    //         d: 'wwwwwwwww'
    //     },
    //     size: number // game size
    // }
    function generateCube(condition) {
        const $disposableCube = document.createElement('div');
        const faces = 'ubrfld'.split('');

        for (let face of faces) {
            const $face = document.createElement('div');
            $face.classList.add(`face`);
            $face.classList.add(`${face}-face`);
            const faceStickers = condition.stickers[face];
            for (let row = 0; row < condition.size; row++) {
                for (let col = 0; col < condition.size; col++) {
                    const $cell = document.createElement('div');
                    $cell.classList.add('cell');
                    $cell.classList.add(`pif-top-${row}`);
                    $cell.classList.add(`pif-left-${col}`);
                    $cell.classList.add(consts.colorMap[faceStickers[row * consts.size + col]]);
                    $face.appendChild($cell);
                }
            }            
            $disposableCube.appendChild($face);
        }
        return $disposableCube;
    }

    function refreshCube() {
        const options = parseOptions();
        storeOptions(options);
        const candidates = filterConditions(settings.llConditions, options);
        const ll = getRandomFromArray(candidates);
        const shuffled = shuffleColorLL(shiftRandomLL(ll.state.split('')), settings.axis);
        const randomedAxis = shiftRandomAxis(settings.axis);
        const stickers = toPllStickers(shuffled, randomedAxis);

        // Apply non-color side
        if (!options['option_colorSide']) {
            for (let f of 'frbl'.split('')) {
                stickers[f] = stickers[f].substr(0, consts.size) + 'x'.repeat(consts.size * (consts.size - 1));
            }
            stickers['d'] = 'x'.repeat(consts.size ** 2);
        }

        const condition = {
            stickers,
            size: consts.size
        };
        console.log(`${ll.name} selected.`);
        cubePointer.x = 280;
        cubePointer.y = -17.5;
        $cube.style.transform = `rotateX(${cubePointer.x}deg) rotateY(${cubePointer.y}deg)`;
        baseMousePos.x = baseMousePos.y = null;
        const cube = generateCube(condition);
        $cube.appendChild(cube);
        $cube.onclick = () => {
            $cube.removeChild(cube);
            refreshCube();
        };
    }

    function toPllStickers(arr, axis) {
        const ud = consts.size**2;
        const frbl = ud - consts.size;
        return {
            u: axis[0].repeat(ud),
            f: arr.slice(0, 3).join('') + axis[1].repeat(frbl),
            r: arr.slice(3, 6).join('') + axis[2].repeat(frbl),
            b: arr.slice(6, 9).join('') + axis[3].repeat(frbl),
            l: arr.slice(9, 12).join('') + axis[4].repeat(frbl),
            d: axis[5].repeat(ud)
        }
    }

    function parseOptions() {
        const options = {};
        const $optionList = document.getElementById('optionList');
        const lis = $optionList.children;
        for (const li of lis) {
            for (const c of li.children) {
                if (!!c.id && c.id.startsWith('option_')) {
                    if (c.type === 'checkbox') {
                        options[c.id] = c.checked;
                    } else {
                        options[c.id] = c.value;
                    }
                }
            }
        }
        return options;
    }

    function loadOptions() {
        const optionString = decodeURIComponent(document.cookie).replace(/^options=(.*)$/, '$1');
        return JSON.parse(optionString || "{}");
    }

    function updateOptionsCtrl(options) {
        for (let o in options) {
            const elem = document.getElementById(o);
            if (!elem) continue;
            if (elem.type === 'checkbox') {
                elem.checked = options[o];
            } else {
                elem.value = options[o];
            }
        }
    }

    function storeOptions(options) {
        document.cookie = encodeURIComponent(`options=${JSON.stringify(options)}`);
    }

    function filterConditions(conds, options) {
        const candidates = [];
        for (let c of conds) {
            if (Boolean(options[`option_${c.name}`]) === true) {
                candidates.push(c);
            }
        }
        return candidates;
    }

    // a: string[] // length=6(U + side*4 + D)
    function shiftRandomAxis(a) {
        const ra = [];

        ra.push(a[0]);
        const shift = Math.floor(Math.random() * 4);
        for (let i = 0; i < 4; i++) {
            ra.push(a[(i + shift) % 4 + 1]);
        }
        ra.push(a[5]);
        return ra;
    }

    // a: string[] // length=const.size*4
    function shiftRandomLL(a) {
        const ra = [];
        
        const shift = Math.floor(Math.random() * 4) * consts.size;
        for (let i = 0; i < a.length; i++) {
            ra.push(a[(i + shift) % a.length]);
        }
        return ra;
    }

    function shuffleColorLL(a, axis) {
        const shuffled = shiftRandomAxis(axis);
        const map = {};
        for (let i = 0; i < 6; i++) {
            map[axis[i]] = shuffled[i];
        }
        return a.map(e => map[e]);
    }
    
    function getRandomFromArray(a) {
        return a[Math.floor(Math.random() * a.length)];
    }

    function onMousemove(event) {
        const { clientX, clientY } = event;
        const dx = baseMousePos.x === null ? 0 : (clientX - baseMousePos.x);
        const dy = baseMousePos.y === null ? 0 : (baseMousePos.y - clientY);
        cubePointer.x = Math.max(Math.min(cubePointer.x + dy, 375), 230);
        cubePointer.y = cubePointer.y + dx;
        $cube.style.transform = `rotateX(${cubePointer.x}deg) rotateY(${cubePointer.y}deg)`;
        baseMousePos.x = clientX;
        baseMousePos.y = clientY;
    }

    function onTouchStart(_) {
        baseMousePos.x = baseMousePos.y = null;
    }
})();
