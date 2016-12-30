var labels = (function() {
  // Used if bounding box is not available
  var default_box = {
    x: 0, y: 0,
    height: 20,
    width: 100
  }
  this.create_label = function(g, member, color) {
    var line = g.append('polyline');
    var label = g.append('g');

    var text_background_background = label.append('rect')
      .attr('class', 'text-background-background')
      .attr('stroke', color)
      .attr('rx', 2).attr('ry', 2)
      .attr('cx', 0).attr('cy', 0);

    var text_background = label.append('rect')
      .attr('class', 'text-background')
      .attr('fill', color)
      .attr('rx', 2).attr('ry', 2)
      .attr('cx', 0).attr('cy', 0);

    var text = label.append('text')
      .attr('cx', 2).attr('cy', 2)
      .attr('class', 'label').text(member.id)

    return {
      show: function() {
        label.attr('class', 'visible');
        line.attr('class', 'visible');
      },
      hide: function() {
        label.attr('class', null);
        line.attr('class', null);
      },
      width: function() {
        return text_background.node().getBBox().width;
      },
      height: function() {
        return text_background.node().getBBox().height;
      },
      move: function(cx, cy, px, py) {
        label.attr('transform', 'translate(' + px + ',' + py + ')');
        var d = cy > py ? -5 : 5;
        line.attr('points', marker.to_str([
          [cx, cy],
          [px, cy + d],
          [px, py]
        ], 1))
      },
      prepare: function() {
        var text_size = text.node().getBBox ? text.node().getBBox() : default_box;
        text_background.attr('width', text_size.width + 6);
        text_background.attr('height', text_size.height);
        text_background.attr('y', (text_size.height) * -0.5);
        text_background.attr('x', (text_size.width + 6) / -2);

        text_background_background.attr('width', text_size.width + 6);
        text_background_background.attr('height', text_size.height);
        text_background_background.attr('y', (text_size.height) * -0.5);
        text_background_background.attr('x', (text_size.width + 6) / -2);

        text.attr('y', 4);
        text.attr('x', text_size.width / -2);
      }
    };
  }

  return this;
})();
