var marker = (function() {
  var poly;
  var points = [];
  var max_radius = 0;
  var selected = {};
  var callbacks = [];
  var state = {select: true, started: false}


  // https://github.com/Jam3/chaikin-smooth
  var smooth = function(input, output) {
    if (!Array.isArray(output))
        output = []

    if (input.length>0 && input[0]) {
        output.push([input[0][0], input[0][1]])
    }
    for (var i=0; i<input.length-1; i++) {
        var p0 = input[i]
        var p1 = input[i+1]
        var p0x = p0[0],
            p0y = p0[1],
            p1x = p1[0],
            p1y = p1[1]

        var Q = [ 0.75 * p0x + 0.25 * p1x, 0.75 * p0y + 0.25 * p1y ]
        var R = [ 0.25 * p0x + 0.75 * p1x, 0.25 * p0y + 0.75 * p1y ]
        output.push(Q)
        output.push(R)
    }
    if (input.length > 1) {
      output.push([input[input.length-1][0], input[input.length-1][1]])

    }

    return output
  }

  var is_in = function(point) {
      var vs = marker.points;
      var x = point[0], y = point[1];
      var inside = false;
      for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
          var xi = vs[i][0], yi = vs[i][1];
          var xj = vs[j][0], yj = vs[j][1];
          var intersect = ((yi > y) != (yj > y))
              && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
          if (intersect) inside = !inside;
      }
      return inside;
  };

  var to_str = function(points, skip, do_smooth) {
    var arr = [];

    var x = [];
    points.map(function(a,i ) {
      if (i % skip == 0) x.push(a)
    });

    x.push(points[points.length - 1]);

    if (do_smooth) {
      x = smooth(x);
    }
    x.map(function(point) {
      arr.push(point[0] + ',' + point[1])
    })

    return arr.join(' ')
  }

  var register = function(callback) {
    callbacks.push(callback);
  };

  var call = function(clear) {
    callbacks.map(function(callback) {
      callback(clear);
    })
  }

  var get_mouse_pos = function() {
    return {
      x: d3.event.clientX + offset_x,
      y: d3.event.clientY + offset_y,
    }
  }

  var init = function(container, background, _transform, _offset_x, _offset_y) {
    poly = container.append('polygon').attr('class', 'polygon')
    transform = _transform;
    offset_x = _offset_x;
    offset_y = _offset_y;
    state.started = false;
    marker.points = [];

    background.on('mousedown', function() {
      if (!state.select) return;
      call(!d3.event.shiftKey);
      state.started = true;
    });

    var up = function() {
      state.started = false;
      marker.points = [];
      poly.attr('points', to_str(marker.points, 4, true));
    }

    document.addEventListener('mouseup', up);
    background.on('mouseup', up);

    background.on('mousemove', function() {
      if (!state.started) return;
      var pos = marker.get_mouse_pos();
      var x = (pos.x - transform.current.x) / transform.current.k;
      var y = (pos.y - transform.current.y) / transform.current.k;
      marker.points.push([x, y])
      poly.attr('points', to_str(marker.points, 4, true));
      call();
    });
  }

  return {
    init: init,
    marked: register,
    contains: is_in,
    state: state,
    get_mouse_pos: get_mouse_pos,
    points: points,
    to_str: to_str,
    set: function(points) {
      marker.points = points;
      call(true);
    }
  }
})();
