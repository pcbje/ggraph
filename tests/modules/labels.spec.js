describe("modules", function() {

  it("handles label show/hide", function() {
    var container = d3.select(document.createElement('svg'));

    expect(container.node().innerHTML).toEqual('');

    var label = labels.create_label(container, {id: 'abc', type: 'x'});

    expect(container.node().innerHTML).toEqual(
      '<polyline></polyline>' +
      '<g>' +
        '<rect class="text-background-background" rx="2" ry="2" cx="0" cy="0"></rect>' +
        '<rect class="text-background" rx="2" ry="2" cx="0" cy="0"></rect>' +
        '<text cx="2" cy="2" class="label">abc</text>' +
      '</g>');

    label.show()
    expect(container.node().innerHTML).toEqual(
      '<polyline class="visible"></polyline>' +
      '<g class="visible">' +
        '<rect class="text-background-background" rx="2" ry="2" cx="0" cy="0"></rect>' +
        '<rect class="text-background" rx="2" ry="2" cx="0" cy="0"></rect>' +
        '<text cx="2" cy="2" class="label">abc</text>' +
      '</g>');

    label.hide();
    expect(container.node().innerHTML).toEqual(
      '<polyline></polyline>' +
      '<g>' +
        '<rect class="text-background-background" rx="2" ry="2" cx="0" cy="0"></rect>' +
        '<rect class="text-background" rx="2" ry="2" cx="0" cy="0"></rect>' +
        '<text cx="2" cy="2" class="label">abc</text>' +
      '</g>');
  });

  it("handles label prepare/move", function() {
    var container = d3.select(document.createElement('svg'));

    var label = labels.create_label(container, {id: 'abc', type: 'x'});

    label.prepare()
    expect(container.node().innerHTML).toEqual(
      '<polyline></polyline>' +
      '<g>' +
        '<rect class="text-background-background" rx="2" ry="2" cx="0" cy="0" width="106" height="20" y="-10" x="-53"></rect>' +
        '<rect class="text-background" rx="2" ry="2" cx="0" cy="0" width="106" height="20" y="-10" x="-53"></rect>' +
        '<text cx="2" cy="2" class="label" y="4" x="-50">abc</text>' +
      '</g>')

    label.move(10, 10, -40, -40)
    expect(container.node().innerHTML).toEqual(
      '<polyline points="10,10 -40,5 -40,-40 -40,-40"></polyline>' +
      '<g transform="translate(-40,-40)">' +
        '<rect class="text-background-background" rx="2" ry="2" cx="0" cy="0" width="106" height="20" y="-10" x="-53"></rect>' +
        '<rect class="text-background" rx="2" ry="2" cx="0" cy="0" width="106" height="20" y="-10" x="-53"></rect>' +
        '<text cx="2" cy="2" class="label" y="4" x="-50">abc</text>' +
      '</g>')
  });
});
