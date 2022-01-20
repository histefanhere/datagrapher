# TODO

- Use subplots
  - Makes everything zoom in together
  - OR multiple "synced" plots like in [this S.O. answer](https://stackoverflow.com/a/48192606/7718130)
- Add back the combined plot feature / probably change it in some way, it's literally completely useless in it's current form
  - Datetime manipulation!?!?
- Do I even need to clear the input element? https://stackoverflow.com/questions/1703228/how-can-i-clear-an-html-file-input-with-javascript/16222877
- option to remove spline behaviour
  - maybe make it the 0 level of smooth input?
- update options on save button click without deleting plots
- remove individual files, and button to remove all files
- adding files should add to current plots


# Ehhh....

- Use JQuery to make the smooth input slider visibility nicer
- Optimize taking out data from relevantKeys into keyData
- Switch to [Chart.js](https://github.com/chartjs/Chart.js)!?!?!?


# Completed

- Make a "hashing function" that transforms a key into a colour
  - conert key to binary, to base 10, sum digits, % colours.length?
- We can have a list of keys we recognize and pretty print them with a "dictionary"
- Multiple file support
  - Parse them like in [this S.O thread](https://stackoverflow.com/questions/29410435) but probably better from [this medium article using promises](https://medium.com/@kishanvikani/parse-multiple-files-using-papa-parse-and-perform-some-synchronous-task-2db18e531ede)