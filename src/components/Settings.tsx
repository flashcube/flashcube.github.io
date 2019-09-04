import React from 'react';
import { Pll, plls } from '../domains/steps';

export interface SettingsState {
  coloredSide: boolean;
  pllPatternFilter: { [never in Pll]: boolean }
}
interface Props {
  state: SettingsState;
  updatePllPatternFilter(pll: Pll): void;
  updateColoredSide(): void;
  checkAll(): void;
}

export const Settings: React.FC<Props> = props => {
  const pllOptions = plls.map(pll => {
    const id = `Settings_option_pll_${pll}`;
    return (
      <li key={pll}>
        <input
          type="checkbox"
          id={id}
          checked={props.state.pllPatternFilter[pll]}
          onChange={() => props.updatePllPatternFilter(pll)}
        />
        <label htmlFor={id}>{pll}</label>
      </li>
    )
  });

  return (
    <div className="settings unselectable">
      <p><button onClick={() => props.checkAll()}>check all</button></p>
      <ul>
        <li>
          <input
            type="checkbox"
            id="Settings_option_colorSide"
            checked={props.state.coloredSide}
            onChange={() => props.updateColoredSide()}
          />
          <label htmlFor="Settings_option_colorSide">colored side</label>
        </li>
        {pllOptions}
      </ul>
    </div>
  );
}
