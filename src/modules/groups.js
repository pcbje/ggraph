var groups = (function() {
  // Groups of 1 or more nodes.
  var sizes = {};
  var color = d3.scaleOrdinal(d3.schemeCategory20c);
  var pie_limit = 4;

  this.set_pie_limit = function(_pie_limit) {
    pie_limit = _pie_limit;
  };

  this.clear_all = function() {
    color = d3.scaleOrdinal(d3.schemeCategory20c);

    cache = {};
    all = [];
  }

  var circle_radius = 5;
  var circle_margin = 2;

  var get_circle_position = function(circle_size, circle_index) {
    var ring_number = 1;
    var index = 0;

    while (index < circle_index) {
      var ring_circumference = (circle_size * ring_number) * 2 * Math.PI;
      var circles_in_ring = Math.floor(ring_circumference / circle_size);
      index += circles_in_ring;
      ring_number++;
    }

    ring_number--;

    var ring_circumference = circle_size * Math.max(1,ring_number) * 2 * Math.PI;
    var circles_in_ring = Math.floor(ring_circumference / circle_size);

    var radians = (((circle_index - index - 1) % circles_in_ring) * 360 / circles_in_ring) * (Math.PI / 180);
    var y = (ring_number * circle_size) * Math.cos(radians)
    var x = (ring_number * circle_size) * Math.sin(radians)

    return {x: x, y: y, rings: ring_number}
  }

  var draw_group_background = function(outer, group,  scale) {
    var id = group.id;
    var member_count = group.members.length;
    var background_radius = member_count + 5;

    if (member_count > pie_limit) {
      var rings = get_circle_position(circle_radius * 2 + circle_margin * 2, member_count - 1).rings;
      background_radius = (circle_radius * scale + circle_margin + (circle_radius * scale * 2 * rings + circle_margin * rings)) + 3;
    }

    outer.append("circle").attr("r", background_radius).attr("name", 'group-background');
    var circle = outer.append("circle")
      .attr("r", background_radius).attr("name", 'group-foreground')
      .attr('id', id)
      .attr("fill", color(id)).attr("fill-opacity", 0.2)
      .attr('stroke', color(id)).attr('stroke-width', 1)
      .on("click", function() {
        if (!d3.event.shiftKey) { selection.clear(); }
        //simulation.stop();

        group.members.map(function(node) {
          selection.add(node);
        })
      });

    return {
      circle: circle,
      radius: background_radius
    }
  }

  this.create_group = function(graph, g, group, label_container) {
    sizes[group.id] = {
      width: function() {
        return g.node().getBBox().width;
      },
      height: function() {
        return g.node().getBBox().height;
      }
    };

    var group_background = g.append('g').attr('class', 'outer');
    var group_labels = g.append('g').attr('class', 'labels');
    var group_members = g.append('g').attr('class', 'inner');

    var scale = Math.max(0.4, (1/Math.max(1, Math.log(group.members.length))));

    group.members.map(function(member, i) {
      var node;
      var position;

      if (group.members.length > 1 && group.members.length < pie_limit + 1) {
        node = nodes.create_pie(graph, group_members, member, i, group.members.length);
        position = {x: 0, y: 0};
      }
      else {
        node = nodes.create_node(graph, group_members, member, scale);
        position = get_circle_position(node.radius() * 2 + circle_margin, i);
      }

      graph.member_map[member.id].node = node;
      graph.member_map[member.id].circle = member.circle;
      graph.member_map[member.id].label = labels.create_label(label_container, member, node.attr('fill'));
      graph.member_map[member.id].cx = position.x;
      graph.member_map[member.id].cy = position.y;

      node.set_position(position.x, position.y);

      group.radius = node.radius();
    });

    if (group.members.length > 1) {
      g.attr('name', 'composite');
      var background = draw_group_background(group_background, group, scale);
      group.radius = background.radius;

      return background.circle;
    }
  }

  return this;
})();
