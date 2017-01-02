describe("marker", function() {
  var container;
  var background;
  var transform;
  var path, index;

  beforeEach(function() {
    background = d3.select(document.createElement("svg"));
    container = background.append('g');
    transform = {current: {k: 1, x: 0, y: 0}};
    index = 0;

    marker.init(container, background, transform, 0, 0);
    marker.state.select = true;
  })

  var draw = function(path) {
    marker.get_mouse_pos = function() {
      index++;
      return {
        x: path[index-1][0],
        y: path[index-1][1]
      }
    }

    expect(marker.state.started).toEqual(false);
    background.dispatch('mousedown')
    expect(marker.state.started).toEqual(true);
    for (var i=0; i<path.length; i++) {
      background.dispatch('mousemove')
    }
  }

  it("should not draw if not select", function() {
    marker.state.select = false;

    background.dispatch('mousedown')
    background.dispatch('mousemove')

    expect(marker.points).toEqual([])
  });

  it("should draw", function() {
    var path = [[0, 0], [50, 0], [50, 50], [0, 50], [0, 0]]

    draw(path);

    expect(marker.points).toEqual(path)
  });

  it("should compute if point is marked", function() {
    var path = [[0, 0], [5, 10], [-5, 10], [0, 0]];

    draw(path);

    expect(marker.contains([0, 5])).toEqual(true);
    expect(marker.contains([-5, 5])).toEqual(false);
  });
});
