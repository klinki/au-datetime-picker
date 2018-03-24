[![Build Status](https://travis-ci.org/klinki/au-datetime-picker.svg?branch=master)](https://travis-ci.org/klinki/au-datetime-picker)
[![npm version](https://badge.fury.io/js/au-datetime-picker.svg)](https://www.npmjs.com/package/au-datetime-picker)

# au-datetime-picker
Aurelia custom element for date time picker.

## Example
Example is located at: https://klinki.github.io/au-datetime-picker/

## How to use
* Run `npm install au-datetime-picker`
* Add `aurelia.use.plugin(PLATFORM.moduleName('au-datetime-picker'))` to your `main.ts` file (or other aurelia configuration file)
* Use `<au-datetime-picker></au-datetime-picker>` in your code

## Goal of this library
I created this library because I needed some lightweight date-time picker and almost all available solutions were using momentjs library.
Because momentjs is not treeshakeable and is very very bloated, I decided to replace it by date-fns which offers much more modular approach.

## License
MIT License

## Special thanks to
I would like to thank:
- https://github.com/ghiscoding/Aurelia-Bootstrap-Plugins
- https://github.com/Eonasdan/bootstrap-datetimepicker

for inspiration.
Also thanks to:
- https://github.com/twbs/bootstrap
- https://github.com/date-fns/date-fns

And of course
- https://github.com/aurelia/framework
