import React, { useState } from 'react';
import { Face } from '../domains/cube/cube';
import { Pll, plls } from '../domains/steps';
import { deepMerge, identity } from '../Util';
import { Box, Button, Grid, IconButton, Input, MenuButton } from 'theme-ui';
import Modal from 'react-modal';
import './Settings.css';
import { Tab, TabList, TabPanel, Tabs } from '@component-controls/components';
import 'react-tabs/style/react-tabs.css';
import { Sticker } from '../domains/color';

export interface Settings {
  color: { [s in Sticker]: string };
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

function updateColor(props: Props, face: Sticker, value: string): void {
  const { state, updateState } = props;
  updateState({
    ...state,
    color: { ...state.color, [face]: value },
  });
}

const customStyles = {
  content: {
    top: '0',
    left: '20%',
    right: 'auto',
    bottom: '0',
    width: '80vw',
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

  const sticker = (
    <Grid columns={[4]}>
      <div />
      <Input
        sx={{ borderColor: props.state.color['u'] }}
        value={props.state.color['u']}
        onChange={e => updateColor(props, 'u', e.target.value)}
      />
      <div />
      <div />
      <Input
        sx={{ borderColor: props.state.color['l'] }}
        value={props.state.color['l']}
        onChange={e => updateColor(props, 'l', e.target.value)}
      />
      <Input
        sx={{ borderColor: props.state.color['f'] }}
        value={props.state.color['f']}
        onChange={e => updateColor(props, 'f', e.target.value)}
      />
      <Input
        sx={{ borderColor: props.state.color['r'] }}
        value={props.state.color['r']}
        onChange={e => updateColor(props, 'r', e.target.value)}
      />
      <Input
        sx={{ borderColor: props.state.color['b'] }}
        value={props.state.color['b']}
        onChange={e => updateColor(props, 'b', e.target.value)}
      />
      <div />
      <Input
        sx={{ borderColor: props.state.color['d'] }}
        value={props.state.color['d']}
        onChange={e => updateColor(props, 'd', e.target.value)}
      />
      <div />
      <Input
        sx={{ borderColor: props.state.color['x'] }}
        value={props.state.color['x']}
        onChange={e => updateColor(props, 'x', e.target.value)}
      />
    </Grid>
  );

  const boxStyle = {
    width: '100%',
    p: '8px',
  };

  function dFaceButton(face: Face) {
    return (
      <Box
        sx={{
          ...boxStyle,
          color: props.state.dFaces[face] ? 'black' : 'white',
          border: '1px solid',
          borderRadius: '4px',
          borderColor: props.state.color[face],
          bg: props.state.dFaces[face]
            ? props.state.color[face]
            : 'rgba(0,0,0,0)',
        }}
        onClick={() => updateDFaces(props, face)}
      >
        {face}
      </Box>
    );
  }

  const dFaces = (
    <Grid columns={[4]}>
      <div />
      {dFaceButton('u')}
      <div />
      <div />
      {dFaceButton('l')}
      {dFaceButton('f')}
      {dFaceButton('r')}
      {dFaceButton('b')}
      <div />
      {dFaceButton('d')}
      <div />
      <div />
    </Grid>
  );

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
              <h3>sticker</h3>
              {sticker}
              <h3>d-face acceptances</h3>
              {dFaces}
            </TabPanel>
          </Tabs>
        </div>
      </Modal>
    </>
  );
};
