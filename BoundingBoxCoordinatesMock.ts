import {Coordinate} from "./src/app/entity/Coordinate";

export const BoundingBoxCoordinatesMock: Coordinate[] = [
  {x1: 10, y1: 10, x2: 200, y2: 200, className: 'full', classifyProb: 0.5, detectProb: 0.9},
  {x1: 100, y1: 100, x2: 100, y2: 100, className: 'empty', classifyProb: 0.5, detectProb: 0.9},
  {x1: 50, y1: 50, x2: 150, y2: 400, className: 'halfempty', classifyProb: 0.5, detectProb: 0.9},
  {x1: 50, y1: 50, x2: 250, y2: 150, className: 'undefined', classifyProb: 0.5, detectProb: 0.9}
]
