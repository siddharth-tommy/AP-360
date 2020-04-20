import { AssertproModule } from './assertpro.module';

describe('AssertproModule', () => {
  let assertproModule: AssertproModule;

  beforeEach(() => {
    assertproModule = new AssertproModule();
  });

  it('should create an instance', () => {
    expect(assertproModule).toBeTruthy();
  });
});
