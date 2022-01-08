import React from 'react';
import './App.css';
import './default.css';
import { SettingsComponent, Settings } from './components/Settings';
import { Pll } from './domains/steps';
import { CubeComponent } from './components/CubeComponent';
import { Face, Sticker } from './domains/Cube';
import { deepMerge } from './Util';

const initialState = {
  settings: {
    pll: {
      coloredSide: true,
      patternFilter: Pll.values.reduce((acc, pll) => ({ ...acc, [pll]: true }), {} as { [a in Pll]: boolean })
    }
  },
  condition: {
    stickers: {
      u: repeat('x' as Sticker, 12),
      f: repeat('x' as Sticker, 12),
      r: repeat('x' as Sticker, 12),
      b: repeat('x' as Sticker, 12),
      l: repeat('x' as Sticker, 12),
      d: repeat('x' as Sticker, 12)
    },
    size: 6
  },
  baseMousePos: {
    x: null as number | null,
    y: null as number | null
  },
  cubePointer: {
    x: 345 as number,
    y: -40 as number
  }
};
type Axis = [Sticker, Sticker, Sticker, Sticker, Sticker, Sticker];

export class App extends React.Component<{}, typeof initialState> {
  constructor(props: any, state: any) {
    super(props, state);
    this.state = initialState;
  }
  componentDidMount() {
    // Validate pllConditions (Not Strict)
    for (let i = 0; i < settings.pllConditions.length; i++) {
      const cond = settings.pllConditions[i];
      const name = cond.name ? `(${cond.name}) ` : '';
      if (cond.state.length !== consts.size * 4) {
        console.log(`pllConditions[${i}] ${name}is invalid size`);
      }
      const map: { [key: string]: number } = {};
      for (const s of cond.state.split('')) {
        map[s] = (map[s] || 0) + 1;
      }
      for (const s in map) {
        if (map[s] !== consts.size) {
          console.log(`pllConditions[${i}] ${name}is suspicious: ${JSON.stringify(map)}`);
          break;
        }
      }
    }

    const begin = new Date().getTime();
    const options = deepMerge(initialState.settings, loadOptions());
    this.setState(prevState => ({
      ...prevState,
      settings: options
    }));
    console.log(`load stored options: ${JSON.stringify(options)}`);
    this.refreshCube(options);
    console.log(`Finished. Elapsed: ${new Date().getTime() - begin}`);
  }

  private updateSettings(settings: Settings) {
    this.setState(prevState => deepMerge(prevState, { settings }));
  }

  private onMouseMove(clientPos: { clientX: number, clientY: number }) {
    const { clientX, clientY } = clientPos;
    const dx = this.state.baseMousePos.x === null ? 0 : (clientX - this.state.baseMousePos.x);
    const dy = this.state.baseMousePos.y === null ? 0 : (this.state.baseMousePos.y - clientY);
    this.setState(prevState => ({
      ...prevState,
      baseMousePos: {
        x: clientX,
        y: clientY
      },
      cubePointer: {
        x: Math.max(Math.min(prevState.cubePointer.x + dy, 375), 230),
        y: prevState.cubePointer.y + dx
      }
    }));
  }

  componentDidUpdate(): void {
    this.storeOptions(this.state.settings);
  }

  private storeOptions(options: Settings): void {
    localStorage.setItem('options', JSON.stringify(options));
  }
  private refreshCube(options: Settings = this.state.settings) {
    const candidates = settings.pllConditions.filter(c => options.pll.patternFilter[c.name]);
    if (candidates.length === 0) {
      candidates.push(settings.pllConditions[0]);
    }
    const ll = oneOf(candidates);
    const shuffled = shuffleColorLL(shiftRandomLL(ll.state.split('') as Sticker[]), settings.axis);
    const randomedAxis = shiftRandomAxis(settings.axis);
    const stickers = toPllStickers(shuffled, randomedAxis);

    // Apply non-color side
    if (!options.pll.coloredSide) {
      for (const f of ['f', 'r', 'b', 'l'] as const) {
        stickers[f] = stickers[f].slice(0, consts.size).concat(repeat('x', consts.size * (consts.size - 1)));
      }
      stickers.d = repeat('x', consts.size ** 2);
    }


    console.log(`${ll.name} selected.`);
    this.setState(prevState => ({
      ...prevState,
      condition: {
        stickers,
        size: consts.size
      },
      baseMousePos: {
        x: null,
        y: null
      },
      cubePointer: {
        x: 345,
        y: -40
      }
    }));
  }
  private onTouchStart() {
    this.setState(prevState => ({
      ...prevState,
      baseMousePos: { x: null, y: null }
    }));
  }

  render() {
    return (
      <div
        className="App"
        onTouchMove={e => this.onMouseMove(getTouchEventPos(e))}
        onTouchStart={() => this.onTouchStart()}
        onMouseMove={e => this.onMouseMove(getMouseEventPos(e))}
      >
        <header></header>
        <article>
          <CubeComponent condition={this.state.condition} cubePointer={this.state.cubePointer} onClick={() => this.refreshCube()} />
        </article>
        <footer>
          <SettingsComponent state={{ ...this.state.settings }}
            updateState={settings => this.updateSettings(settings)}
          />
        </footer>
      </div>
    );
  }
}

function repeat<A>(a: A, n: number): A[] {
  return (Array(n) as A[]).fill(a, 0, n);
}

function oneOf<A>(a: A[]): A {
  return a[Math.floor(Math.random() * a.length)];
}

const settings = {
  axis: ['y', 'g', 'o', 'b', 'r', 'w'] as Axis, // U,F,R,B,L,D
  pllConditions: [
    {
      name: 'Ub',
      state: 'bobrbrgggoro' // FFF->RRR->BBB->LLL
    } as const,
    {
      name: 'Ua',
      state: 'brbrorgggobo'
    } as const,
    {
      name: 'Ab',
      state: 'rbrgrobggoob'
    } as const,
    {
      name: 'Aa',
      state: 'gbobrbrggoor'
    } as const,
    {
      name: 'Z',
      state: 'brbrbrgogogo'
    } as const,
    {
      name: 'H',
      state: 'bgbrorgbgoro'
    } as const,
    {
      name: 'E',
      state: 'obrgrbrgobog'
    } as const,
    {
      name: 'T',
      state: 'bbrgobrggoro'
    } as const,
    {
      name: 'V',
      state: 'oorgrbrbobgg'
    } as const,
    {
      name: 'F',
      state: 'bgrgrbrbgooo'
    } as const,
    {
      name: 'Rb',
      state: 'brbrbgogrgoo'
    } as const,
    {
      name: 'Ra',
      state: 'rrgogrgbobob'
    } as const,
    {
      name: 'Jb',
      state: 'brrgbbrggooo'
    } as const,
    {
      name: 'Ja',
      state: 'oobrrrggobbg'
    } as const,
    {
      name: 'Y',
      state: 'bbgorrgobrgo'
    } as const,
    {
      name: 'Gd',
      state: 'borggbrbgoro'
    } as const,
    {
      name: 'Gc',
      state: 'rogobrggobrb'
    } as const,
    {
      name: 'Ga',
      state: 'obbrgoborgrg'
    } as const,
    {
      name: 'Gb',
      state: 'bgrgbbrogoro'
    } as const,
    {
      name: 'Nb',
      state: 'bbgoorggbrro'
    } as const,
    {
      name: 'Na',
      state: 'bggorrgbbroo'
    } as const
  ]
};

// a= (U + side*4 + D)
function shiftRandomAxis(a: Axis): Axis {
  const ra = [] as Sticker[];

  ra.push(a[0]);
  const shift = Math.floor(Math.random() * 4);
  for (let i = 0; i < 4; i++) {
    ra.push(a[(i + shift) % 4 + 1]);
  }
  ra.push(a[5]);
  return [ra[0], ra[1], ra[2], ra[3], ra[4], ra[5]];
}

function shiftRandomLL(a: Sticker[]): Sticker[] {
  const ra = [] as Sticker[];
  const shift = Math.floor(Math.random() * 4) * consts.size;
  for (let i = 0; i < a.length; i++) {
    const b = a[(i + shift) % a.length];
    ra.push(b);
  }
  return ra;
}

function shuffleColorLL(a: Sticker[], axis: Axis): Sticker[] {
  const shuffled = shiftRandomAxis(axis);
  const map = {} as { [a in Sticker]: Sticker };
  for (let i = 0; i < 6; i++) {
    map[axis[i]] = shuffled[i];
  }
  return a.map(e => map[e]);
}


function toPllStickers(arr: Sticker[], axis: Axis): { [a in Face]: Sticker[] } {
  const ud = consts.size ** 2;
  const frbl = ud - consts.size;

  return {
    u: repeat(axis[0], ud),
    f: arr.slice(0, 3).concat(repeat(axis[1], frbl)),
    r: arr.slice(3, 6).concat(repeat(axis[2], frbl)),
    b: arr.slice(6, 9).concat(repeat(axis[3], frbl)),
    l: arr.slice(9, 12).concat(repeat(axis[4], frbl)),
    d: repeat(axis[5], ud)
  }
}


function loadOptions(): Settings {
  const optionString = localStorage.getItem('options');
  if (optionString) {
    return JSON.parse(optionString);
  }
  return initialState.settings;
}


function getMouseEventPos(event: React.MouseEvent<HTMLDivElement, MouseEvent>): { clientX: number, clientY: number } {
  const { clientX, clientY } = event;
  return { clientX, clientY };
}
function getTouchEventPos(event: React.TouchEvent<HTMLDivElement>): { clientX: number, clientY: number } {
  const { clientX, clientY } = event.touches[0];
  return { clientX, clientY };
}

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
  } as const
};
export default App;
