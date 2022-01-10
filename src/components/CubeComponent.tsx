import React from 'react';
import { Face, faces } from '../domains/cube/cube';

const consts = {
  size: 3,
};

interface Props {
  settings: {
    pll: {
      coloredSide: boolean;
    };
    color: {
      u: string;
      f: string;
      r: string;
      b: string;
      l: string;
      d: string;
      x: string;
    };
  };
  condition: {
    stickers: { [a in Face]: Face[] };
    size: number;
  };
  cubePointer: {
    x: number;
    y: number;
  };
  onClick: () => void;
}
export const CubeComponent: React.FC<Props> = ({
  settings,
  condition: { stickers, size },
  cubePointer,
  onClick,
}) => {
  // apply color
  const stickers_ = Object.entries(stickers).reduce(
    (acc, [cubeFace, cellFaces]) => {
      return {
        ...acc,
        [cubeFace]: cellFaces.map((f, cellFaceIndex) => {
          function isColored() {
            if (settings.pll.coloredSide) {
              return true;
            }
            switch (cubeFace) {
              case 'u':
                return true;
              case 'f':
              case 'r':
              case 'b':
              case 'l':
                return cellFaceIndex < 3;
              case 'd':
                return false;
            }
          }
          return isColored() ? settings.color[f] : settings.color['x'];
        }),
      };
    },
    {} as { [f in Face]: string[] }
  );

  return (
    <div
      className="cube"
      style={{
        transform: `rotateX(${cubePointer.x}deg) rotateY(${cubePointer.y}deg)`,
      }}
      onClick={onClick}
    >
      {faces.map(face => (
        <FaceComponent
          key={face}
          condition={{
            stickers: stickers_[face],
            face,
            size,
          }}
        />
      ))}
    </div>
  );
};

interface FaceComponentProps {
  condition: {
    face: Face;
    stickers: string[];
    size: number;
  };
}
const FaceComponent: React.FC<FaceComponentProps> = ({
  condition: { face, stickers, size },
}) => {
  const cells = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const { style, classColor } = (() => {
        const preservedColors = [
          'red',
          'blue',
          'orange',
          'green',
          'yellow',
          'white',
          'gray',
        ];
        const sticker = stickers[row * consts.size + col];
        const preserved = preservedColors.includes(sticker);
        return {
          classColor: preserved ? sticker : '',
          style: preserved ? {} : { backgroundColor: sticker },
        };
      })();
      cells.push(
        <div
          key={`pif-${row}-${col}`}
          className={`cell pif-top-${row} pif-left-${col} ${classColor}`}
          style={style}
        ></div>
      );
    }
  }
  return <div className={`face ${face}-face`}>{cells}</div>;
};
