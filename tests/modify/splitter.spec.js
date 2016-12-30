describe("modify", function() {
  var graph;


  it("should not split singles", function() {
    graph = {
      nodes : [
        {id: 'a', x : 1, y : 1, members: [{id : 'a', type: 'x'}]},
        {id: 'c', x : 1, y : 1, members : [{id: 'c', type: 'x'}]}
      ],
      links : [
        {source: {id: 'a'}, target: {id: 'c'}},
        {source: {id: 'c'}, target: {id: 'a'}}
      ],
      all_links : {
        'a': {'c': true},
        'c': {'a': true}
      },
      member_map: {
        'a': {type: 'x', group: 'a'},
        'c': {type: 'x', group: 'c'}
      },
      group_map: {
        'a': 0,
        'c': 1,
      }
    }

    // single value
    var splitted = splitter.split(graph, [[{id: 'c'}]]);

    expect(splitted.links).toEqual([
      {source : 'a', target : 'c' },
      {source : 'c', target : 'a' }
    ]);

    // multiple values, but in different groups
    var splitted = splitter.split(graph, [[{id: 'c'}, {id: 'a'}]]);

    expect(splitted.links).toEqual([
      {source : 'a', target : 'c' },
      {source : 'c', target : 'a' }
    ]);
  })

  it("should split", function() {
      graph = {
        nodes : [
          {id: 'a-b', x : 1.5, y : 1.5, members: [{id : 'a', type: 'x'}, {id : 'b', type: 'x'}]},
          {id : 'c', x : 3, y : 3, members : [{id: 'c', type: 'x'}]}
        ],
        links : [
          {source: {id: 'a-b'}, target: {id: 'c'}},
          {source: {id: 'a-b'}, target: {id: 'c'}},
          {source: {id: 'c'}, target: {id: 'a-b'}}
        ],
        all_links : {
          'a': {'b': true, 'c': true},
          'b': {'a': true, 'c': true},
          'c': {'a': true, 'b': true, 'a-b': true},
          'a-b' : {'c': true}
        },
        member_map: {
          'a': {type: 'x', group: 'a-b'},
          'b': {type: 'x', group: 'a-b'},
          'c': {type: 'x', group: 'c'}
        },
        group_map: {
          'a-b': 0,
          'c': 1,
        }
      }

    var expected = {
      nodes: [
        {id: 'a', x: 1.5, y: 1.5, members:[{'id': 'a', type:'x'}]},
        {id: 'b', x: 1.5, y: 1.5, members:[{'id': 'b', type:'x'}]},
        {id: 'c', x: 3, y: 3, members:[{'id': 'c', type:'x'}]}
      ],
      links: [
        {source: 'a', target: 'b'},
        {source: 'a', target: 'c'},
        {source: 'b', target: 'a'},
        {source: 'b', target: 'c'},
        {source: 'c', target: 'a'},
        {source: 'c', target: 'b'}
      ],
      all_links: {
        'a': {'b': true, 'c': true},
        'b': {'a': true, 'c': true},
        'c': {'a': true, 'b': true}
      },
      member_map: {
        'a': {type: 'x', group: 'a'},
        'b': {type: 'x', group: 'b'},
        'c': {type: 'x', group: 'c'}
      },
      group_map: {
        'a': 0,
        'b': 1,
        'c': 2
      }
    }

    var selected = [[{id: 'a'}, {id: 'b'}]];

    var splitted = splitter.split(graph, selected);

    expect(splitted).toEqual(expected);
  });
});
