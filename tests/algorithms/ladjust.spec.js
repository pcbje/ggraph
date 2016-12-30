describe("algorithms", function() {

  it("label adjust", function() {
    var placed = [
      {x: 0, y: 0, width: 100, height: 100},
    ]
    var nodes = [
      {x:   0, y: -10, ox:   0, oy: -10, width: 10, height: 10},
      {x:  10, y:   0, ox:  10, oy:   0, width: 10, height: 10},
      {x:   0, y:  10, ox:   0, oy:  10, width: 10, height: 10},
      {x: -10, y:   0, ox: -10, oy:   0, width: 10, height: 10},
    ]

    ladjust.step(placed, nodes);

    var expected = [
      {x: -58, y: -48, ox: -10, oy: 0, width: 10, height: 10},
      {x: 0, y: -58, ox: 0, oy: -10, width: 10, height: 10},
      {x: -48, y: 58, ox: 0, oy: 10, width: 10, height: 10},
      {x: 58, y: -48, ox: 10, oy: 0, width: 10, height: 10}
    ]

    var actual = JSON.parse(JSON.stringify(nodes));

    expect(actual).toEqual(expected);
  });
});
