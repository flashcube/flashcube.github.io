import React from 'react';
import './default.css';
import { Settings, SettingsComponent } from './components/Settings';
import { Pll, plls } from './domains/steps';
import { CubeComponent } from './components/CubeComponent';
import {
  Cube,
  Face,
  parseLastLayerFromFlattenExp,
  PllState,
} from './domains/cube/cube';
import { deepMerge, entries, repeat } from './Util';
import { validateColorSetting } from './domains/color';
import { theme } from './theme';
import { ThemeProvider } from 'theme-ui';

document.addEventListener('touchmove', e => e.preventDefault(), {
  passive: false,
});

const initialState = {
  settings: {
    pll: {
      coloredSide: true,
      patternFilter: plls.reduce(
        (acc, pll) => ({ ...acc, [pll]: true }),
        {} as { [a in Pll]: boolean }
      ),
    },
    color: {
      u: 'yellow',
      f: 'green',
      r: 'orange',
      b: 'blue',
      l: 'red',
      d: 'white',
      x: 'gray',
    },
    dFaces: {
      u: false,
      f: false,
      r: false,
      b: false,
      l: false,
      d: true,
    },
  },
  condition: {
    cube: {
      u: repeat('u' as Face, 9),
      f: repeat('f' as Face, 9),
      r: repeat('r' as Face, 9),
      b: repeat('b' as Face, 9),
      l: repeat('l' as Face, 9),
      d: repeat('d' as Face, 9),
    },
    size: 6,
  },
  baseMousePos: {
    x: null as number | null,
    y: null as number | null,
  },
  cubePointer: {
    x: 340,
    y: -40,
  },
};

export class App extends React.Component<{}, typeof initialState> {
  constructor(props: any, state: any) {
    super(props, state);
    this.state = initialState;
  }

  componentDidMount() {
    // Validate pllConditions (Not Strict)
    for (let i = 0; i < pllsImpl.pllConditions.length; i++) {
      const cond = pllsImpl.pllConditions[i];
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
          console.log(
            `pllConditions[${i}] ${name}is suspicious: ${JSON.stringify(map)}`
          );
          break;
        }
      }
    }

    const begin = new Date().getTime();
    const options = deepMerge(initialState.settings, loadOptions());
    this.setState(prevState => ({
      ...prevState,
      settings: options,
    }));
    console.log(`load stored options: ${JSON.stringify(options)}`);
    this.refreshCube(options);
    console.log(`Finished. Elapsed: ${new Date().getTime() - begin}`);
  }

  private updateSettings(settings: Settings) {
    const s = validateColorSetting(settings.color)
      ? settings
      : { ...settings, color: initialState.settings.color };
    this.setState(prevState => deepMerge(prevState, { settings: s }));
  }

  private onMouseMove(clientPos: { clientX: number; clientY: number }) {
    const { clientX, clientY } = clientPos;
    const dx =
      this.state.baseMousePos.x === null
        ? 0
        : clientX - this.state.baseMousePos.x;
    const dy =
      this.state.baseMousePos.y === null
        ? 0
        : this.state.baseMousePos.y - clientY;
    this.setState(prevState => ({
      ...prevState,
      baseMousePos: {
        x: clientX,
        y: clientY,
      },
      cubePointer: {
        x: Math.max(Math.min(prevState.cubePointer.x + dy, 375), 230),
        y: prevState.cubePointer.y + dx,
      },
    }));
  }

  componentDidUpdate(): void {
    storeOptions(this.state.settings);
  }

  private refreshCube(options: Settings = this.state.settings) {
    const candidates = pllsImpl.pllConditions.filter(
      c => options.pll.patternFilter[c.name]
    );
    if (candidates.length === 0) {
      candidates.push(pllsImpl.pllConditions[0]);
    }

    const dFace = oneOf(
      ...entries(options.dFaces)
        .filter(([, enabled]) => enabled)
        .map(([face]) => face)
    );

    function buildLlState(): [PllState, string] {
      const ll = oneOf(...candidates);
      const state = parseLastLayerFromFlattenExp(ll.state.split(''))
        .pattern(oneOf(0, 1, 2, 3))
        .rotate(oneOf(0, 1, 2, 3))
        .state();
      return [state, ll.name];
    }

    const [llState, llName] = buildLlState();
    const cubeState = new Cube()
      .direct(dFace)
      .y(oneOf(0, 1, 2, 3))
      .applyPll(llState)
      .state();

    console.log(`d-face(${dFace}), pll(${llName}) selected.`);

    this.setState(prevState => ({
      ...prevState,
      condition: {
        cube: cubeState,
        size: consts.size,
      },
      baseMousePos: {
        ...initialState.baseMousePos,
      },
      cubePointer: {
        ...initialState.cubePointer,
      },
    }));
  }

  private onTouchStart() {
    this.setState(prevState => ({
      ...prevState,
      baseMousePos: { x: null, y: null },
    }));
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <div
          className="App"
          onTouchMove={e => this.onMouseMove(getTouchEventPos(e))}
          onTouchStart={() => this.onTouchStart()}
          onMouseMove={e => this.onMouseMove(getMouseEventPos(e))}
        >
          <nav>
            <SettingsComponent
              state={{ ...this.state.settings }}
              updateState={settings => this.updateSettings(settings)}
            />
          </nav>
          <article>
            <CubeComponent
              settings={this.state.settings}
              condition={this.state.condition}
              cubePointer={this.state.cubePointer}
              onClick={() => this.refreshCube()}
            />
          </article>
        </div>
      </ThemeProvider>
    );
  }
}

function oneOf<A>(...xs: readonly A[]): A {
  return xs[Math.floor(Math.random() * xs.length)];
}

const pllsImpl = {
  pllConditions: [
    // state: FFF->RRR->BBB->LLL
    { name: 'Ub', state: 'brblblfffrlr' } as const,
    { name: 'Ua', state: 'blblrlfffrbr' } as const,
    { name: 'Ab', state: 'lblflrbffrrb' } as const,
    { name: 'Aa', state: 'fbrblblffrrl' } as const,
    { name: 'Z', state: 'blblblfrfrfr' } as const,
    { name: 'H', state: 'bfblrlfbfrlr' } as const,
    { name: 'E', state: 'rblflblfrbrf' } as const,
    { name: 'T', state: 'bblfrblffrlr' } as const,
    { name: 'V', state: 'rrlflblbrbff' } as const,
    { name: 'F', state: 'bflflblbfrrr' } as const,
    { name: 'Rb', state: 'blblbfrflfrr' } as const,
    { name: 'Ra', state: 'llfrflfbrbrb' } as const,
    { name: 'Jb', state: 'bllfbblffrrr' } as const,
    { name: 'Ja', state: 'rrblllffrbbf' } as const,
    { name: 'Y', state: 'bbfrllfrblfr' } as const,
    { name: 'Gd', state: 'brlffblbfrlr' } as const,
    { name: 'Gc', state: 'lrfrblffrblb' } as const,
    { name: 'Ga', state: 'rbblfrbrlflf' } as const,
    { name: 'Gb', state: 'bflfbblrfrlr' } as const,
    { name: 'Nb', state: 'bbfrrlffbllr' } as const,
    { name: 'Na', state: 'bffrllfbblrr' } as const,
  ],
};

function loadOptions(): Settings {
  const loaded = JSON.parse(localStorage.getItem('options') || '{}');
  return [
    (options: Settings) => deepMerge(initialState.settings, options),
    (options: Settings) =>
      Object.values(options.color).every(c => typeof c === 'string')
        ? options
        : { ...options, color: initialState.settings.color },
    // FIXME: 保存済みの color を無視。設定できるようになったら削除する
    (options: Settings) => ({ ...options, color: initialState.settings.color }),
  ].reduce((acc, f) => f(acc), loaded);
}

function getMouseEventPos(
  event: React.MouseEvent<HTMLDivElement, MouseEvent>
): { clientX: number; clientY: number } {
  const { clientX, clientY } = event;
  return { clientX, clientY };
}

function getTouchEventPos(event: React.TouchEvent<HTMLDivElement>): {
  clientX: number;
  clientY: number;
} {
  const { clientX, clientY } = event.touches[0];
  return { clientX, clientY };
}

const consts = {
  size: 3,
};
export default App;

function storeOptions(options: Settings): void {
  localStorage.setItem('options', JSON.stringify(options));
}
