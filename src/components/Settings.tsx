import React, { useState } from 'react';
import { Face } from '../domains/cube/cube';
import { Pll, plls } from '../domains/steps';
import { deepMerge, entries, identity } from '../Util';
import {
  Box,
  Button,
  Flex,
  IconButton,
  Label,
  MenuButton,
  Switch,
} from 'theme-ui';
import Modal from 'react-modal';
import './Settings.css';
import { Tab, TabList, TabPanel, Tabs } from '@component-controls/components';
import 'react-tabs/style/react-tabs.css';

export interface Settings {
  color: {
    [f in Face | 'x']: string;
  };
  pll: PllSettings;
  dFaces: { [f in Face]: boolean };
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

function updateDFaces(props: Props, face: Face): void {
  const { state, updateState } = props;
  const settings = deepMerge(state, {
    dFaces: {
      [face]: !state.dFaces[face],
    },
  });
  if (Object.values(settings.dFaces).some(identity)) {
    updateState(settings);
  }
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

  const dFaces = entries(props.state.dFaces).map(([face, enabled]) => {
    const id = `Settings_option_dFaces_${face}`;
    return (
      <Flex
        key={face}
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 1,
        }}
      >
        <Label htmlFor={id} sx={{ flex: 1 }}>
          <Button sx={{ bg: props.state.color[face] }}>{face}</Button>
        </Label>
        <Box>
          <Switch
            id={id}
            checked={enabled}
            onChange={() => updateDFaces(props, face)}
          />
        </Box>
      </Flex>
    );
  });

  const menuButton = modalIsOpen ? null : (
    <MenuButton onClick={openModal} id="menuButton" />
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
          <Tabs>
            <TabList>
              <Tab key="tab_pll">pll</Tab>
              <Tab key="tab_color">color</Tab>
            </TabList>
            <TabPanel key="panel_pll">
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
                  <label htmlFor="Settings_option_colorSide">
                    colored side
                  </label>
                </li>
                {pllOptions}
              </ul>
            </TabPanel>
            <TabPanel key="panel_color">
              <h3>d-face acceptances</h3>
              {dFaces}
            </TabPanel>
          </Tabs>
        </div>
      </Modal>
    </>
  );
};
