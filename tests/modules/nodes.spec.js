describe("modules", function() {
  var graph;

  beforeEach(function() {
    nodes.clear();

    graph = {
      nodes: [
        {id: '123', x: 0, y: 0, members: [{id:'123', type: 'x', cx: 0, cy: 0}]},
        {id: 'abc', x: 0, y: 0, members: [{id:'abc', type: 'x', cx: 0, cy: 0}]}
      ],
      member_map: {
        '123': {type: 'x', id: '123', group: '123'},
        'abc': {type: 'x', id: 'abc', group: 'abc'}
      },
      group_map: {
        '123': 0,
        'abc': 1
      },
      all_links: {
        '123': {'abc': true},
        'abc': {'123': true}
      }
    }
  });

  it("handles node", function() {
    var container = d3.select(document.createElement('svg'));

    var node = nodes.create_node(graph, container, {id: 'abc', type: 'x'}, 1.0);

    expect(node.radius()).toEqual(5);

    node.set_position(10, 10);

    expect(container.node().innerHTML).toEqual(
      '<g class="membernode" id="abc" fill="#1f77b4" name="default">' +
        '<circle r="5" class="member-background" cx="10" cy="10"></circle>' +
        '<circle r="5" class="member" cx="10" cy="10"></circle>' +
      '</g>');

    var event = document.createEvent("HTMLEvents");
    event.initEvent("click");
    node.node().dispatchEvent(event);

    expect(selection.size()).toEqual(2);
    expect(Object.keys(selection.selected()).length).toEqual(1);
  });

  it("handles pie", function() {
    var container = d3.select(document.createElement('svg'));

    var pie = nodes.create_pie(graph, container, {id: 'abc', type: 'x'}, 0, 3);

    expect(container.node().innerHTML).toEqual(
      '<g class="membernode" id="abc" fill="#1f77b4" name="default">' +
        '<path d="M0 0 L0.0000 5.0000 A5 5 0 0 1 -4.3301 -2.5000 z" class="member"></path>' +
      '</g>');

    var event = document.createEvent("HTMLEvents");
    event.initEvent("click");
    pie.node().dispatchEvent(event);

    expect(selection.size()).toEqual(2);
    expect(Object.keys(selection.selected()).length).toEqual(1);
  });
});
