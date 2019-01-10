;(function() {
    const settings = {
        colorSide: true,
        axis: ['r','b','o','g','y','w'], // B,R,F,L,U,D
        llConditions: [
            {
                name: 'U-perm:b',
                state: 'gggrbrboboro' // BBB->RRR->FFF->LLL
            },
            {
                name: 'U-perm:a',
                state: 'gggrorbrbobo'
            },
            {
                name: 'A-perm:b',
                state: 'ggborgrbrboo'
            },
            {
                name: 'A-perm:a',
                state: 'ggrbrbobgroo'
            },
            {
                name: 'Z-perm',
                state: 'gogrbrbrbogo'
            },
            {
                name: 'H-perm',
                state: 'gbgrorbgboro'
            },
            {
                name: 'E-perm',
                state: 'ogrbrgrbogob'
            },
            {
                name: 'T-perm',
                state: 'ggrbogrbboro'
            },
            {
                name: 'V-perm',
                state: 'obrbrgrooggb'
            },
            {
                name: 'F-perm',
                state: 'gbrbrgrgbooo'
            },
            {
                name: 'R-perm:b',
                state: 'rgogbrbrboog'
            },
            {
                name: 'R-perm:a',
                state: 'obgrgogrrbob'
            },
            {
                name: 'J-perm:b',
                state: 'ggrbbgrrbooo'
            },
            {
                name: 'J-perm:a',
                state: 'oggrrrboogbb'
            },
            {
                name: 'Y-perm',
                state: 'bogrrogbbogr'
            },
            {
                name: 'G-perm:d',
                state: 'gbrbggroboro'
            },
            {
                name: 'G-perm:c',
                state: 'oggrbogorbrb'
            },
            {
                name: 'G-perm:a',
                state: 'robogrbbogrg'
            },
            {
                name: 'G-perm:b',
                state: 'gorbbgrgboro'
            },
            {
                name: 'N-perm:b',
                state: 'bggroogbborr'
            },
            {
                name: 'N-perm:a',
                state: 'bbgrroggboor'
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
            w: 'white'
        }
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

    const $refresh = document.createElement('button');
    $refresh.innerText = 'Refresh';
    const $cube = document.createElement('div');
    $body.appendChild($refresh);
    $body.appendChild($cube);

    refreshCube();
    console.log(`Finished. Elapsed: ${new Date().getTime() - begin}`);

    // condition: {
    //     side: string[],
    //     ll: string[],
    //     size: number // game size
    // }
    function generateCube(condition) {
        const cube = document.createElement('table');
        for (let row = 0; row < consts.size * 3; row++) {
            const tr = document.createElement('tr');
            for (let col = 0; col < consts.size * 3; col++) {
                const td = createCell(row, col, condition)
                tr.appendChild(td);
            }
            cube.appendChild(tr);
        }
        return cube;
    }

    function createCell(row, col, condition) {
        const td = document.createElement('td');
        if ((consts.size <= row && row < consts.size * 2) || (consts.size <= col && col < consts.size * 2)) {
            td.classList.add('cell');
        }

        // Color Middle Layer cells
        // B-face
        if (condition.colorSide) {
            if (row < consts.size - 1 && (consts.size <= col && col < consts.size * 2)) {
                td.classList.add(consts.colorMap[condition.axis[0]]);
            }
            // R-face
            if ((consts.size <= row && row < consts.size * 2) && consts.size * 2 + 1 <= col) {
                td.classList.add(consts.colorMap[condition.axis[1]]);
            }
            // F-face
            if (consts.size * 2 <= row && (consts.size <= col && col < consts.size * 2)) {
                td.classList.add('f-face');
                if (consts.size * 2 + 1 <= row) {
                    td.classList.add(consts.colorMap[condition.axis[2]]);
                }
            }
            // L-face
            if ((consts.size <= row && row < consts.size * 2) && col < consts.size - 1) {
                td.classList.add(consts.colorMap[condition.axis[3]]);
            }
        }
        // Color LL cells
        // U-face
        if (consts.size <= row && row < consts.size * 2 && consts.size <= col && col < consts.size * 2) {
            td.classList.add(consts.colorMap[condition.axis[4]]);
            td.classList.add('u-face');
        }
        // B-face
        if (row == consts.size - 1 && (consts.size <= col && col < consts.size * 2)) {
            td.classList.add(consts.colorMap[condition.ll.state[col - consts.size]]);
        }
        // R-face
        if ((consts.size <= row && row < consts.size * 2) && consts.size * 2 == col) {
            td.classList.add(consts.colorMap[condition.ll.state[row]]);
        }
        // F-face
        if (consts.size * 2 == row && (consts.size <= col && col < consts.size * 2)) {
            td.classList.add(consts.colorMap[condition.ll.state[consts.size * 3 + 2 - col]]);
        }
        // L-face
        if ((consts.size <= row && row < consts.size * 2) && col == consts.size - 1) {
            td.classList.add(consts.colorMap[condition.ll.state[consts.size * 4 + 2 - row]]);
        }
        return td;
    }

    function refreshCube() {
        const ll = getRandomFromArray(settings.llConditions);
        const condition = {
            axis: shiftRandomAxis(settings.axis),
            ll: {
                name: ll.name,
                state: shuffleColorLL(shiftRandomLL(ll.state.split('')), settings.axis)
            },
            colorSide: settings.colorSide
        };
        console.log(`${ll.name} selected.`);
        const cube = generateCube(condition);
        $cube.appendChild(cube);
        $refresh.onclick = () => {
            $cube.removeChild(cube);
            refreshCube();
        };
    }

    // a: string[] // length=6(side*4 + U + D)
    function shiftRandomAxis(a) {
        const ra = [];
        
        const shift = Math.floor(Math.random() * a.length);
        for (let i = 0; i < 4; i++) {
            ra.push(a[(i + shift) % 4]);
        }
        ra.push(a[4]);
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
        for (let i = 0; i < 4; i++) {
            map[axis[i]] = shuffled[i];
        }
        return a.map(e => map[e]);
    }
    
    function getRandomFromArray(a) {
        return a[Math.floor(Math.random() * a.length)];
    }
})();
