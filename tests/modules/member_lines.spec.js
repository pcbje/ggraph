describe("modules", function() {

  it("handles memberlines", function() {
    var container = d3.select(document.createElement('svg'))

    member_lines.init(container);
    expect(container.node().innerHTML).toEqual('')

    member_lines.add(0, 0, 100, 100);
    member_lines.add(50, 50, 150, 150);
    expect(container.node().innerHTML).toEqual(
      '<line class="selected" x1="0" y1="0" x2="100" y2="100"></line>' +
      '<line class="selected" x1="50" y1="50" x2="150" y2="150"></line>')

    member_lines.clear();
    expect(container.node().innerHTML).toEqual('')
  });
});
