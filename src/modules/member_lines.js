var member_lines = (function() {
  var container;

  return {
    init: function(_container) {
      container = _container;
    },
    add: function(start_x, start_y, end_x, end_y) {
      container.append("line")
        .attr("class", "selected")
        .attr("x1", start_x).attr("y1", start_y)
        .attr("x2", end_x).attr("y2", end_y);
    },
    clear: function() {
      container.selectAll('line').remove();
    }
  }
})();
