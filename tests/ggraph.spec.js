describe("ggraph", function() {
  var graph;
  var container;

  beforeEach(function() {
    graph = {
      nodes: [
        {id: 'a', x: 1, y: 1, members:[{'id': 'a', type:'x'}]},
        {id: 'b', x: 2, y: 2, members:[{'id': 'b', type:'x'}]},
        {id: 'c', x: 3, y: 3, members:[{'id': 'c', type:'x'}]}
      ],
      links: [
        {source: {id: 'a'}, target: {id: 'b'}},
        {source: {id: 'a'}, target: {id: 'c'}},
        {source: {id: 'b'}, target: {id: 'c'}}
      ],
      all_links: {
        'a': {'b': true, 'c': true},
        'b': {'a': true, 'c': true},
        'c': {'a': true, 'b': true}
      },
      member_map: {
        'a': {type: 'x', id: 'a', group: 'a'},
        'b': {type: 'x', id: 'b', group: 'b'},
        'c': {type: 'x', id: 'c', group: 'c'}
      },
      group_map: {
        'a': 0,
        'b': 1,
        'c': 2
      }
    }

    graph.links.map(function(link) {
      link.source.members = graph.nodes[graph.group_map[link.source.id]];
      link.target.members = graph.nodes[graph.group_map[link.target.id]];
    });

    container = document.createElement('div');
    ggraph.init(container);
    ggraph.draw(graph, 1000);
  });

  it('draw/tick', function() {
    var members = 0;
    var links = 0;

    d3.select(container).selectAll('circle.member').each(function(circle) {
      members++;
    });

    d3.select(container).selectAll('line.rel').each(function(circle) {
      links++;
    });

    expect(members).toEqual(graph.nodes.length);
    expect(links).toEqual(graph.links.length);

    var group = d3.select(graph.nodes[0].members[0].circle.node().parentNode.parentNode.parentNode);

    var x_before_tick = group.attr('x');
    var y_before_tick = group.attr('y');

    ggraph.ticked();

    var x_after_tick = group.attr('x');
    var y_after_tick = group.attr('y');

    expect(x_after_tick).toNotEqual(x_before_tick);
    expect(y_after_tick).toNotEqual(y_before_tick);
  });

  it('select', function() {
    var selected = d3.select(container).selectAll('circle[name=selected]').size();
    var contacts = d3.select(container).selectAll('circle[name=contact]').size();

    expect(selected).toEqual(0);
    expect(contacts).toEqual(0);

    selection.add(graph.member_map['a']);
    selection.add(graph.member_map['b']);
    selection.add(graph.member_map['c'], 'contact');

    selected = d3.select(container).selectAll('circle[name=selected]').size();
    contacts = d3.select(container).selectAll('circle[name=contact]').size();

    expect(selected).toEqual(2);
    expect(contacts).toEqual(1);

    ggraph.clear_selected();

    selected = d3.select(container).selectAll('circle[name=selected]').size();
    contacts = d3.select(container).selectAll('circle[name=contact]').size();

    expect(selected).toEqual(0);
    expect(contacts).toEqual(0);
  });

  it('merge/split', function() {
    var node_count = d3.select(container).selectAll('g.node').size();
    expect(node_count).toEqual(3);

    ggraph.merge([
      graph.member_map['a'],
      graph.member_map['b']
    ]);

    node_count = d3.select(container).selectAll('g.node').size();
    expect(node_count).toEqual(2);

    ggraph.split([
      graph.member_map['a'], graph.member_map['b']
    ]);

    node_count = d3.select(container).selectAll('g.node').size();
    expect(node_count).toEqual(3);
  });

  it('remove', function() {
    var node_count = d3.select(container).selectAll('g.node').size();
    expect(node_count).toEqual(3);

    ggraph.remove([
      graph.member_map['a'],
      graph.member_map['b']
    ]);

    node_count = d3.select(container).selectAll('g.node').size();
    expect(node_count).toEqual(1);
  });

  it('merge/split multiple groups', function() {
    var node_count = d3.select(container).selectAll('g.node').size();
    expect(node_count).toEqual(3);

    ggraph.merge([
      [graph.member_map['a'], graph.member_map['b']],
      [graph.member_map['a'], graph.member_map['c']]
    ]);

    node_count = d3.select(container).selectAll('g.node').size();
    expect(node_count).toEqual(1);

    ggraph.split([
      graph.member_map['a'], graph.member_map['b']
    ]);

    node_count = d3.select(container).selectAll('g.node').size();
    expect(node_count).toEqual(3);
  });

  it('marks', function() {
    selected = d3.select(container).selectAll('circle[name=selected]').size();
    expect(selected).toEqual(0);
    marker.set([[0,0],[0,3],[3,3],[3,0]]);
    selected = d3.select(container).selectAll('circle[name=selected]').size();
    expect(selected).toEqual(2);
  });

  it('removes mark on drag', function() {
    marker.set([[0,0],[0,3],[3,3],[3,0]]);
    selected = d3.select(container).selectAll('circle[name=selected]').size();
    expect(selected).toEqual(2);
    // drag
    ggraph.drag.start({});
    selected = d3.select(container).selectAll('circle[name=selected]').size();
    expect(selected).toEqual(0);
  });

  it('cluster', function() {
    var clusters = ggraph.cluster([
      {source: {id: 'a'}, target: {id: 'b'}},
      {source: {id: 'd'}, target: {id: 'e'}},
      {source: {id: 'c'}, target: {id: 'b'}}
    ]);

    var expected = [
      [{id: 'a'}, {id: 'b'}, {id: 'c'}],
      [{id: 'd'}, {id: 'e'}]
    ]

    expect(clusters).toEqual(expected);
  });

  it('convert vanilla d3 graph', function() {
    var d3_graph = {
      nodes: ['a', 'b', {id: 'c', type:'mock'}],
      links: [
        {source: 'a', target: 'b'},
        {source: 'a', target: 'c'},
        {source: 'b', target: 'c'},
        {source: 'b', target: 'c'}
      ]
    };

    var converted = ggraph.convert(d3_graph);
    var expected = {
      nodes : [
        { id : 'a', members : [ { id : 'a', type : 'entity' } ] },
        { id : 'b', members : [ { id : 'b', type : 'entity' } ] },
        { id : 'c', members : [ { id : 'c', type : 'mock' } ] }
      ],
      links : [
        {
          source : { id : 'a', members : [ { id : 'a', type : 'entity' } ] },
          target : { id : 'b', members : [ { id : 'b', type : 'entity' } ] },
          value : 1
        },
        {
          source : { id : 'a', members : [ { id : 'a', type : 'entity' } ] },
          target : { id : 'c', members : [ { id : 'c', type : 'mock' } ] },
          value : 1
        },
        {
          source : { id : 'b', members : [ { id : 'b', type : 'entity' } ] },
          target : { id : 'c', members : [ { id : 'c', type : 'mock' } ] },
          value : 2
        },
        {
          source : { id : 'b', members : [ { id : 'b', type : 'entity' } ] },
          target : { id : 'c', members : [ { id : 'c', type : 'mock' } ] },
          value : 2
        }
      ],
      group_map : { a : 0, b : 1, c : 2 },
      member_map : {
        a : { type : 'entity', id : 'a', group : 'a' },
        b : { type : 'entity', id : 'b', group : 'b' },
        c : { type : 'mock', id : 'c', group : 'c' }
      },
      all_links : {
        a : { b : 1, c : 1 },
        b : { a : 1, c : 2 },
        c : { a : 1, b : 2 }
      }
    };

    expect(converted).toEqual(expected);
  });

  it('draws comments', function() {
    graph = {
      nodes: [
        {id: 'a', x: 1, y: 1, members:[{'id': 'a', type:'comment'}]},
        {id: 'b', x: 2, y: 2, members:[{'id': 'b', type:'x'}]}
      ],
      links: [
        {source: {id: 'a'}, target: {id: 'b'}}
      ],
      all_links: {
        'a': {'b': true},
        'b': {'a': true}
      },
      member_map: {
        'a': {type: 'comment', id: 'a', group: 'a'},
        'b': {type: 'x', id: 'b', group: 'b'}
      },
      group_map: {
        'a': 0,
        'b': 1
      }
    }

    graph.links.map(function(link) {
      link.source.members = graph.nodes[graph.group_map[link.source.id]];
      link.target.members = graph.nodes[graph.group_map[link.target.id]];
    });

    container = document.createElement('div');
    ggraph.init(container);
    ggraph.draw(graph, 1000);

    var comments = [];
    var links = []

    d3.select(container).selectAll('.comment').each(function(d) {
      comments.push(d);
    });

    d3.select(container).selectAll('line').each(function(link) {
      links.push(link);
    });

    expect(comments).toEqual([{
      id : 'a', x : 1, y : 1,
      members : [ { id : 'a', type : 'comment' } ],
      index : 0, vy : 0, vx : 0
    }]);

    expect(links.length).toEqual(1);
  })
});
