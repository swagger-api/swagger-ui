import { escapeCMD } from "../../../../../src/core/plugins/request-snippets/fn"

describe("escapeCMD", () => {
  it("escapes vertical bar | with caret ^ for CMD", () => {
    const input = 'foo|bar';
    const output = escapeCMD(input);
    expect(output).toContain('^|');
  });

  it("escapes other CMD special characters", () => {
    expect(escapeCMD('foo^bar')).toContain('^^');
    expect(escapeCMD('foo"bar')).toContain('""');
  });
});
