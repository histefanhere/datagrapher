@REM @RMDIR /S /Q libraries

@REM @MKDIR libraries
@REM @CD libraries

@DEL datatypes.js
@curl -s https://raw.githubusercontent.com/histefanhere/datagrapher/master/datatypes.js -o datatypes.js

@echo Updated datatypes!
