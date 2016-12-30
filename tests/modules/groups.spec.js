describe("modules", function() {
  var graph;
  var group_container, label_container;
  beforeEach(function() {


    graph = {
      nodes: [
        {id: 'y', x: 0, y: 0, members: [
          {id:'123', type: 'x', cx: 0, cy: 0},
          {id:'456', type: 'x', cx: 0, cy: 0}
        ]},
        {id: 'abc', x: 0, y: 0, members: [{id:'abc', type: 'x', cx: 0, cy: 0}]}
      ],
      member_map: {
        '123': {type: 'x', group: 'y'},
        '456': {type: 'x', group: 'y'},
        'abc': {type: 'x', group: 'abc'}
      },
      group_map: {
        'y': 0,
        'abc': 1
      },
      all_links: {
        '123': {'abc': true},
        'abc': {'123': true}
      }
    }

    group_container = d3.select(document.createElement('svg'));
    label_container = d3.select(document.createElement('svg'));

    group_container.selectAll('*').remove();
    label_container.selectAll('*').remove();

    groups.clear_all();
  });

  it("composite group pie", function() {
    groups.set_pie_limit(2);
    groups.create_group(graph, group_container, graph.nodes[0], label_container);
    expect(group_container.attr('name')).toEqual('composite');
  });

  it("composite group circles", function() {
    groups.set_pie_limit(1);
    groups.create_group(graph, group_container, graph.nodes[0], label_container);
    var circle_positions = [];
    group_container.selectAll('circle.member').each(function() {
      circle_positions.push({x: 1*d3.select(this).attr('cx'), y: 1*d3.select(this).attr('cy')});
    });
    expect(circle_positions).toEqual([{x: 0, y: 0}, {x: 0, y: 12}]);
    expect(group_container.attr('name')).toEqual('composite');
  });

  it("single group", function() {
    groups.create_group(graph, group_container, graph.nodes[1], label_container);
    expect(group_container.attr('name')).toEqual(null);
  });

  it("group background click", function() {
    var background_circle = groups.create_group(graph, group_container, graph.nodes[0], label_container);

    // nothing selected.
    expect(selection.size()).toEqual(0);

    var event = document.createEvent("HTMLEvents");
    event.initEvent("click");
    background_circle.node().dispatchEvent(event);

    // both group members in 'y' selected.
    expect(selection.size()).toEqual(2);
  });
});
