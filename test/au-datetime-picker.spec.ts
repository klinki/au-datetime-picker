import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';

xdescribe('DateTimePicker', () => {
  let component;

  beforeEach(() => {
    component = StageComponent
      .withResources('../src/date-time-picker')
      .inView('<date-time-picker model.bind="date"></date-time-picker>')
      .boundTo({ date: new Date() });
  });

  it('should render input', done => {
    component.create(bootstrap).then(() => {
      const inputElement = document.querySelector('input');
      expect(inputElement).not.toBeNull();
      done();
    });
  });

  it('should render current date', done => {
    component.create(bootstrap).then(() => {
      const nameElement = document.querySelector('span');
      expect(nameElement.innerHTML).toBe('Hello Aurelia Plugins');
      done();
    }).catch(e => { console.log(e.toString()); });
  });

  afterEach(() => {
    component.dispose();
  });
});
