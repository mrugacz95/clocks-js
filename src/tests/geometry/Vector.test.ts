import { expect, test } from '@jest/globals';
import {Vector} from "../../app/geometry/Vector";

test('rotate vector', () => {
    const vec = new Vector(1,1)

    const result = vec.rotate(Math.PI / 2)
    expect(result.x).toBeCloseTo(-1);
    expect(result.y).toBeCloseTo(1);
});
