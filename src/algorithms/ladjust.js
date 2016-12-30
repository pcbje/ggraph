var ladjust = (function() {
  var create_rect = function(node) {
      return {
        left: (node.x - node.width / 2) - 1,
        right: (node.x + node.width / 2) + 1,
        top: (node.y - node.height / 2) - 1,
        bottom: (node.y + node.height / 2) + 1
      }
  }

  var collision = function(a, b) {
    var r1 = create_rect(a);
    var r2 = create_rect(b);

    return !(
        r2.left > r1.right ||
        r2.right < r1.left ||
        r2.top > r1.bottom ||
        r2.bottom < r1.top);
  };

  var get_closest_free = function(label, placed, dx, dy) {
    var copy = {x: label.x, y:label.y, width:label.width, height:label.height};
    var rel = {x: 0, y: 0, valid: true}
    var max_steps = 200;
    var steps = 0;

    for (var i=0; i<max_steps; i++) {
      steps++;
      var any_collision = false;
      for (var j=0; j<placed.length; j++) {
        var other = placed[j];
        if (collision(other, copy)) {
          any_collision = true;
          break;
        }
      }
      rel.steps = steps;
      if (!any_collision) {
        return rel;
      }

      rel.x += dx;
      rel.y += dy;
      copy.x += dx;
      copy.y += dy;
    }

    // Max steps reached.
    return {x: 0, y: 0, valid: false};
  };

  var step = function(placed, labels) {
      labels.sort(function(a, b) {return a.ox - b.ox;});

      directions = [
        [-1, -1],
        [-1,  0],
        [-1,  1],
        [ 0, -1],
        [ 1, -1],
        [ 1,  0],
        [ 1,  1],
        [ 0,  1],
      ]

      labels.map(function(label) {
        var min_dist = 9999999999999;
        var min = {x: 0, y: 0};
        directions.map(function(dir) {
          var rel = get_closest_free(label, placed, dir[0], dir[1]);
          var d = Math.sqrt(Math.pow(rel.x, 2) + Math.pow(rel.y, 2));

          if (rel.steps< min_dist) {
            min = rel;
            min_dist = rel.steps;
          }
        });

        label.x += min.x;
        label.y += min.y;
        placed.push(label);
      });
  }

  return {
    step: step,
    collision: collision
  }
})();
