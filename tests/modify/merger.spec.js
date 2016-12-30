describe("modify", function() {

  it("should merge", function() {
    var graph = {
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

    var expected = {
      nodes : [
        {id: 'a-b', x : 1.5, y : 1.5, members: [{id : 'a', type: 'x'}, {id : 'b', type: 'x'}]},
        {id : 'c', x : 3, y : 3, members : [{id: 'c', type: 'x'}]}
      ],
      links : [
        {source: 'a-b', target: 'c'},
        {source: 'a-b', target: 'c'}
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

    var selected = [{id: 'a'}, {id: 'b'}]

    var actual = merger.merge(graph, selected);

    expect(actual).toEqual(expected);
  });
});
