import React, { useState } from 'react';
import { Face } from '../domains/cube/cube';
import { Pll, plls } from '../domains/steps';
import { deepMerge, identity } from '../Util';
import { Button, IconButton } from 'theme-ui';
import Modal from 'react-modal';
import './Settings.css';

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

const customStyles = {
  content: {
    top: '0',
    left: '50%',
    right: 'auto',
    bottom: '0',
    width: '50vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
};

export const SettingsComponent: React.FC<Props> = props => {
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

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

  const menuButton = modalIsOpen ? null : (
    <IconButton onClick={openModal} id="menuButton">
      <svg viewBox="0 0 100 100" width="200" height="200" fill="currentcolor">
        <rect y="10" width="80" height="10" />
        <rect y="45" width="80" height="10" />
        <rect y="85" width="80" height="10" />
      </svg>
    </IconButton>
  );

  return (
    <>
      {menuButton}
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="settings unselectable">
          <IconButton onClick={closeModal} id="closeButton">
            x
          </IconButton>
          <p>
            <Button onClick={() => checkAll(props)}>check all</Button>
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
      </Modal>
    </>
  );
};
