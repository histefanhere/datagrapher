# TODO

- if combined lines is ticked, there can be a bunch of values at the same X - these need to be averaged

- Use subplots
  - Makes everything zoom in together
  - OR multiple "synced" plots like in [this S.O. answer](https://stackoverflow.com/a/48192606/7718130)
- Do I even need to clear the input element? https://stackoverflow.com/questions/1703228/how-can-i-clear-an-html-file-input-with-javascript/16222877


# Ehhh....

- Use JQuery to make the smooth input slider visibility nicer
- Optimize taking out data from relevantKeys into keyData
- Switch to [Chart.js](https://github.com/chartjs/Chart.js)!?!?!?


# Completed

- need a quick script for downloading latest js files, BOTH datatypes.js and javascript.js - nah just datatypes g
- in deda_pcela_8, the last column for the BME680 headers is missspelt
- we need compatibility for the old BME680 headers
- sensor for DS18B20 temps (Temp1, Temp2, ...)
- getSensor() is undefined if it doesn't recognize the sensor, e.g. if it's an edf file
- if the key doesn't exist, it won't graph the data
- option to remove spline behaviour
  - maybe make it the 0 level of smooth input?
  - nah, it looks really bad without spline. maybe dial it down though
- Add back the combined plot feature / probably change it in some way, it's literally completely useless in it's current form
  - Datetime manipulation!?!?
- update options on save button click without deleting plots
- remove individual files, and button to remove all files
- adding files should add to current plots
- Make a "hashing function" that transforms a key into a colour
  - conert key to binary, to base 10, sum digits, % colours.length?
- We can have a list of keys we recognize and pretty print them with a "dictionary"
- Multiple file support
  - Parse them like in [this S.O thread](https://stackoverflow.com/questions/29410435) but probably better from [this medium article using promises](https://medium.com/@kishanvikani/parse-multiple-files-using-papa-parse-and-perform-some-synchronous-task-2db18e531ede)