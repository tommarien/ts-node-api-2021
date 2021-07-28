import tap from 'tap';

tap.test('it should not be this kind of rubbish', (t) => {
  t.equal(true, false);
  t.end();
});
