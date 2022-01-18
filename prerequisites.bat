@RMDIR /S /Q libraries

@MKDIR libraries
@CD libraries

@curl -s -O https://raw.githubusercontent.com/mholt/PapaParse/master/papaparse.min.js
@curl -s https://cdn.plot.ly/plotly-2.8.3.min.js -o plotly.min.js

@CD ..

@echo Installed all prerequisites in ./libraries!
