import React, { useState } from 'react';
import { Pll } from '../domains/steps';
import { deepMerge } from '../Util';
import { Button, CheckBox } from 'grommet';
import * as Icons from 'grommet-icons';

export interface Settings {
  pll: PllSettings;
}
export interface PllSettings {
  coloredSide: boolean;
  patternFilter: { [never in Pll]: boolean };
}
interface Props {
  state: Settings;
  updateState(settings: Settings): void;
}

function updateColoredSide(props: Props) {
  const { state, updateState } = props;
  updateState(deepMerge(state, {
    pll: {
      coloredSide: !state.pll.coloredSide
    }
  }));
}

function updatePllPatternFilter(props: Props, pll: Pll): void {
  const { state, updateState } = props;
  updateState(deepMerge(state, {
    pll: {
      patternFilter: {
        [pll]: !state.pll.patternFilter[pll]
      }
    }
  }));
}
function checkAll(props: Props): void {
  const { state, updateState } = props;
  const allChecked = Object.values(state.pll.patternFilter).every(e => e) && state.pll.coloredSide;
  updateState(deepMerge(state, {
    pll: {
      coloredSide: !allChecked,
      patternFilter: Pll.values.reduce((acc, pll) => ({ ...acc, [pll]: !allChecked }), {} as { [never in Pll]: boolean })
    }
  }));
}


export const SettingsComponent: React.FC<Props> = props => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const pllOptions = Pll.values.map(pll => {
    return (
      <li key={pll}>
        <CheckBox
          label={pll}
          checked={props.state.pll.patternFilter[pll]}
          onChange={() => updatePllPatternFilter(props, pll)}
        />
      </li>
    )
  });

  return (
    <>
      <p><Button icon={<Icons.Menu />} onClick={() => setIsDrawerVisible(!isDrawerVisible)} /></p>
      <div className={`settings unselectable ${isDrawerVisible ? '' : 'no-display'}`}>
        <ul>
          <li><Button className="small" icon={<Icons.Compliance />} label="Check all/nothing" onClick={() => checkAll(props)} /></li>
          <li>
            <CheckBox
              label="colored side"
              checked={props.state.pll.coloredSide}
              onChange={() => updateColoredSide(props)}
            />
          </li>
          {pllOptions}
        </ul>
      </div>
    </>
  );
}
