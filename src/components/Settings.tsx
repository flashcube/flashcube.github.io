import React from 'react';
import { Face } from '../domains/cube/cube';
import { Pll, plls } from '../domains/steps';
import { deepMerge, identity } from '../Util';

export interface Settings {
  color: {
    [f in Face | 'x']: string;
  };
  pll: PllSettings;
}
export interface PllSettings {
  coloredSide: boolean;
  patternFilter: { [p in Pll]: boolean };
}
interface Props {
  state: Settings;
  updateState(settings: Settings): void;
}

function updateColoredSide(props: Props) {
  const { state, updateState } = props;
  updateState(
    deepMerge(state, {
      pll: {
        coloredSide: !state.pll.coloredSide,
      },
    })
  );
}

function updatePllPatternFilter(props: Props, pll: Pll): void {
  const { state, updateState } = props;
  updateState(
    deepMerge(state, {
      pll: {
        patternFilter: {
          [pll]: !state.pll.patternFilter[pll],
        },
      },
    })
  );
}
function checkAll(props: Props): void {
  const { state, updateState } = props;
  const allChecked =
    Object.values(state.pll.patternFilter).every(identity) &&
    state.pll.coloredSide;
  updateState(
    deepMerge(state, {
      pll: {
        coloredSide: !allChecked,
        patternFilter: plls.reduce(
          (acc, pll) => ({ ...acc, [pll]: !allChecked }),
          {} as { [p in Pll]: boolean }
        ),
      },
    })
  );
}

export const SettingsComponent: React.FC<Props> = props => {
  const pllOptions = plls.map(pll => {
    const id = `Settings_option_pll_${pll}`;
    return (
      <li key={pll}>
        <input
          type="checkbox"
          id={id}
          checked={props.state.pll.patternFilter[pll]}
          onChange={() => updatePllPatternFilter(props, pll)}
        />
        <label htmlFor={id}>{pll}</label>
      </li>
    );
  });

  return (
    <div className="settings unselectable">
      <p>
        <button onClick={() => checkAll(props)}>check all</button>
      </p>
      <ul>
        <li>
          <input
            type="checkbox"
            id="Settings_option_colorSide"
            checked={props.state.pll.coloredSide}
            onChange={() => updateColoredSide(props)}
          />
          <label htmlFor="Settings_option_colorSide">colored side</label>
        </li>
        {pllOptions}
      </ul>
    </div>
  );
};
