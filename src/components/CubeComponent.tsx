import React from 'react';
import { Face, faces, Sticker } from '../domains/Cube';

const consts = {
  size: 3,
  colorMap: {
    r: 'red',
    b: 'blue',
    o: 'orange',
    g: 'green',
    y: 'yellow',
    w: 'white',
    x: 'gray',
  } as const,
};

interface Props {
  condition: {
    stickers: { [a in Face]: Sticker[] };
    size: number;
  };
  cubePointer: {
    x: number;
    y: number;
  };
  onClick: () => void;
}
export const CubeComponent: React.FC<Props> = ({
  condition: { stickers, size },
  cubePointer,
  onClick,
}) => {
  return (
    <div
      className="cube"
      style={{
        transform: `rotateX(${cubePointer.x}deg) rotateY(${cubePointer.y}deg)`,
      }}
      onClick={onClick}
    >
      {faces.values.map(face => (
        <FaceComponent
          key={face}
          condition={{
            stickers: stickers[face],
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
    stickers: Sticker[];
    size: number;
  };
}
const FaceComponent: React.FC<FaceComponentProps> = ({
  condition: { face, stickers, size },
}) => {
  const cells = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      cells.push(
        <div
          key={`pif-${row}-${col}`}
          className={`cell pif-top-${row} pif-left-${col} ${
            consts.colorMap[stickers[row * consts.size + col]]
          }`}
        ></div>
      );
    }
  }
  return <div className={`face ${face}-face`}>{cells}</div>;
};
