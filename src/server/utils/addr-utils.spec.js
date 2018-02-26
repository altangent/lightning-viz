let { expect } = require('chai');
let { splitAddr } = require('./addr');
// ipv4 127.0.0.1:9735
// ipv6 [2b03:8389:6901:8e81:97b1:ad35:9515:5c6f]:9735

describe('addr', () => {
  describe('splitAddr', () => {
    it('should split ipv4 with standard port', () => {
      expect(splitAddr('127.0.0.1:9735')).to.deep.equal(['127.0.0.1', 9735]);
    });
    it('should split ipv4 with non-standard port', () => {
      expect(splitAddr('127.0.0.1:1735')).to.deep.equal(['127.0.0.1', 1735]);
    });
    it('should split ipv6 with standard port', () => {
      expect(splitAddr('[2b03:8389:6901:8e81:97b1:ad35:9515:5c6f]:9735')).to.deep.equal([
        '2b03:8389:6901:8e81:97b1:ad35:9515:5c6f',
        9735,
      ]);
    });
    it('should split ipv6 with non-standard port', () => {
      expect(splitAddr('[2b03:8389:6901:8e81:97b1:ad35:9515:5c6f]:1735')).to.deep.equal([
        '2b03:8389:6901:8e81:97b1:ad35:9515:5c6f',
        1735,
      ]);
    });
  });
});
