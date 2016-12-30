'use strict'

var ggraph = (function() {
  var started;
  var container;
  var all;
  var background_lines_container;
  var callbacks = [];
  var transform;
  var svg;
  var background;
  var draw;
  var simulation;
  var link;
  var node;
  var already_selected;
  var graph;
  var labels_container;
  var width;
  var height;
  var root;

  var select = function(hide_labels) {
    var all_nodes = selection.all();
    var selected_nodes = selection.selected();

    d3.select('svg').attr('name', all_nodes.length > 0 ? 'filtered' : '');
    d3.selectAll('.member').attr('name', 'default');
    d3.selectAll('.visible').attr('class', '');

    if (all_nodes.length > 0) simulation.stop();

    var labels = [];
    var circles = [];
    var node_cache = {};

    var from_x, from_y, to_x, to_y;

    all_nodes.map(function(member) {
      member.circle.attr('name', selected_nodes && member.id in selected_nodes ? 'selected' : 'contact');
      member = graph.member_map[member.id];
      if (!hide_labels && selection.size() < 100) {
        var group = graph.nodes[graph.group_map[member.group]];
        if (!(member.group in node_cache)) {
          node_cache[member.group] = {
            x: group.x, y: group.y,
            width: group.radius * 2,
            height: group.radius * 2,
          };
          circles.push(node_cache[member.group]);
        }

        member.label.show();
        member.label.prepare();

        labels.push({
          x: group.x + member.cx,
          y: group.y + member.cy,
          ox: group.x + member.cx,
          oy: group.y + member.cy,
          cx: member.cx,
          cy: member.cy,
          width: member.label.width(),
          height: member.label.height(),
          label: member.label,
          group: group
        });
      }
    });

    ladjust.step(circles, labels);

    labels.map(function(member) {
      if (!member.label) return;

      from_x = member.group.x + member.cx;
      from_y = member.group.y + member.cy;
      to_x = member.group.x + member.cx + member.x - member.ox;
      to_y = member.group.y + member.cy + member.y - member.oy;

      member.label.move(from_x, from_y, to_x, to_y);
    });
  }

  var clear_selected = function() {
    d3.select(root).selectAll('circle.member').attr('name', 'default');
    member_lines.clear();
    selection.clear();
    simulation.restart();
  };

  function ticked() {
    // bounding box
    //node.attr("x", function(d) { return d.x = Math.max(groups.get_group(d.id).group.radius, Math.min(width - groups.get_group(d.id).group.radius, d.x)) });
    //node.attr("y", function(d) { return d.y = Math.max(groups.get_group(d.id).group.radius, Math.min(height - groups.get_group(d.id).group.radius, d.y))  });
    node.attr("x", function(d) { return d.x });
    node.attr("y", function(d) { return d.y });
    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y +")"; });

    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
  }

  var init = function(_root) {
    root = _root;
    if (root.constructor === String) {
      root = document.getElementById(root)
    }
    root.innerHTML = '';
    root.addEventListener('contextmenu', function(e) {e.preventDefault()});

    var element = root.getBoundingClientRect();
    width = element.width;
    height = element.height;

    transform = {current: {k: 1, x: 0, y: 0}};

    svg = d3.select(root).append('svg').call(d3.zoom().on("zoom", function () {
      all.attr("transform", d3.event.transform)
      transform.current = d3.event.transform;
    }));

    background = svg.append('g').append('rect').attr('width', element.width).attr('height', element.height)
      .attr('x', 0).attr('y', 0).attr('id', 'background').on('click', function() {
        clear_selected();
    });

    all = svg.append('g').attr('id', 'all');
    container = all.append('g')
    draw = all.append('g')
    background_lines_container = all.append('g')
    labels_container = all.append('g').attr('class', 'labels');

    simulation = d3.forceSimulation()
      .force("center", d3.forceCenter(element.width / 2, element.height / 2))
      .force('charge', d3.forceManyBody().strength(charge))
      .force("link", d3.forceLink().id(function(d) { return d.id; }).strength(link_strength))
        //.distance(100);

    callbacks.push(function(all, selected) {
      select(all, selected);
    });

    selection.listen(function() {
      var all = selection.all();
      var selected = selection.selected();
      var current = all.map(function(node) {return node.id});
      if (current.join(',') !== already_selected) {
        callbacks.map(function(callback) {
          callback();
        });
      }

      already_selected = current.join(',');
    });

    member_lines.init(background_lines_container);

    marker.init(draw, svg, transform, element.left * -1, element.top * -1);

    marker.marked(function(clear) {
      simulation.stop();
      if (clear) {
        selection.clear();
      }

      for (var member_id in graph.member_map) {

        var member = graph.member_map[member_id];
        if (selection.is_selected(member)) {
          continue
        }

        var group = graph.nodes[graph.group_map[member.group]];

        var point = [
          group.x + member.circle.attr('cx') *  1,
          group.y + member.circle.attr('cy') *  1
        ];

        if (marker.contains(point)) {
          selection.add(member);
        }
      }
    });
  };

  var charge = function(d) {
    return -50;
  };

  var link_strength = function(d) {
    if (d.filtered) return 0.01  / (d.source.members.length * d.target.members.length);
    return 1 / (d.source.members.length + d.target.members.length);
  };

  var drag = d3.drag()
    .on("start", function(d) {
      started = true;
      if (!d3.event.active) {
        simulation.alphaTarget(0.3).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    })
    .on("drag", function(d) {
      member_lines.clear();
      started = true;
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    })
    .on("end", function(d) {
      started = false;
      if (!d3.event.active) {
        simulation.alphaTarget(0);
      }
      d.fx = null;
      d.fy = null;
    });

  var _draw = function(_graph) {
    groups.clear();

    container.selectAll('*').remove();

    graph = _graph;

    graph.links.sort(function(a, b) {
      if (a.filtered && !b.filtered) {
        return -1;
      }

      if (!a.filtered && b.filtered) {
        return 1;
      }

      return 0;
    });

    link = container.append("g")
      .attr("class", "links").selectAll("line").data(graph.links).enter().append("line").attr('class', 'rel').attr("stroke-width", function(d, e) {
        d3.select(this).attr('name', d.filtered ? 'filtered' : '')
        if (!d.value) d.value = 1;
        return Math.sqrt(d.value);
      });

    var start = new Date().getTime() / 1000;
    node = container.append("g")
      .attr("class", "nodes").selectAll("g").data(graph.nodes).enter().append('g').attr('class', 'node').call(drag).each(function(d) {
        groups.create_group(graph, d3.select(this), d, labels_container);
      });
    var end = new Date().getTime() / 1000;

    simulation.nodes(graph.nodes).force("link").links(graph.links)
    simulation.on("tick", ticked);
    simulation.alpha(1).restart();
  };

  var split = function(selected) {
    var splitted_graph = splitter.split(graph, selected);
    _draw(splitted_graph);
    selection.clear();
    simulation.restart();
  }

  var _merge = function(selected, collapse) {
    if (!selected || !selected[0]) return;
    var s = [];
    if (selected[0].constructor === Array && collapse) {
      selected.map(function(a) {
        Array.prototype.push.apply(s, a);
      })
      selected = s;
    }

    if (selected[0].constructor === Array) {
        _merge_groups(selected);
    }
    else {
      _merge_groups([selected]);
    }

    selection.clear();
    d3.select('svg').attr('name', '');
    d3.selectAll('g[name=selected]').attr('name', 'default');
    d3.selectAll('.visible').attr('class', '');
  }

  var _remove = function(selected) {
    if (selected[0].constructor !== Array) {
      selected = [selected];
    }

    var modified_graph = remover.remove(graph, selected);

    if (modified_graph.nodes.length < graph.nodes.length) {
      member_lines.clear();
      graph = modified_graph;
      ggraph.draw(graph);
      simulation.restart();
    }

    selection.clear();
  }

  var cluster = function(selected) {
    var clusters = [];
    var computed = makecluster.from_links(selected);
    for (var c in computed) {
      clusters.push(computed[c]);
    }

    return clusters;
  }

  var _merge_groups = function(selected_groups) {
    var merged_graph = graph;

    selected_groups.map(function(selected) {
      merged_graph = merger.merge(merged_graph, selected);
    });

    if (merged_graph.nodes.length < graph.nodes.length) {
      member_lines.clear();
      graph = merged_graph;
      ggraph.draw(merged_graph);
      simulation.alpha(0.2).restart();
    }

    selection.clear();
  }

  var filter_links = function(map) {
    container.attr('name', 'backbone')
    graph.links.map(function(link) {
      if (link.source.id in map && link.target.id in map[link.source.id]
      && link.target.id in map && link.source.id in map[link.target.id]) {
        link.filtered = true;
      }
      /*else if (link.value === 1) {
        link.filtered = true;
      }*/
      else {
        link.filtered = false;
      }
    });

    ggraph.draw(graph);
    simulation.alpha(1).restart();
  }

  var convert = function(graph) {
    var converted = JSON.parse(JSON.stringify(graph))

    converted.group_map = {};
    converted.member_map = {};
    converted.all_links = {};

    converted.nodes.map(function(group, i) {
      if (!group.id) converted.nodes[i] = {id:group}
      group = converted.nodes[i];
      var member_type = 'entity';
      if (group.type) {
        member_type = group.type;
        delete group.type;
      }
      group.members = [{id: group.id, type: member_type}];
      converted.group_map[group.id] = i;
      converted.member_map[group.id] = {
        type: member_type,
        id: group.id,
        group: group.id
      };
    });

    converted.links.map(function(link) {
      if (!link.source.id) link.source = converted.nodes[converted.group_map[link.source]];
      if (!link.target.id) link.target = converted.nodes[converted.group_map[link.target]];
      if (!(link.source.id in converted.all_links)) { converted.all_links[link.source.id] = {}; }
      if (!(link.target.id in converted.all_links)) { converted.all_links[link.target.id] = {}; }
      if (converted.all_links[link.source.id][link.target.id] === undefined) converted.all_links[link.source.id][link.target.id] = 0;
      if (converted.all_links[link.target.id][link.source.id] === undefined) converted.all_links[link.target.id][link.source.id] = 0;
      converted.all_links[link.source.id][link.target.id]++;
      converted.all_links[link.target.id][link.source.id]++;
    });

    converted.links.map(function(link) {
      link.value = converted.all_links[link.target.id][link.source.id];
    });

    return converted;
  }

  var register = function(callback) {
    callbacks.push(callback);
  }

  var set_graph = function(_graph) {
    graph = _graph;
  }

  return {
    init: init,
    draw: _draw,
    on_select: register,
    select: select,
    merge: _merge,
    remove: _remove,
    merge_groups: _merge_groups,
    split: split,
    convert: convert,
    ticked: ticked,
    clear_selected: clear_selected,
    cluster: cluster,
    filter_links: filter_links
  }
})();
