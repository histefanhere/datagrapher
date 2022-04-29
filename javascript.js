const defaultColours = [
    '#1f77b4',  // muted blue
    '#ff7f0e',  // safety orange
    '#2ca02c',  // cooked asparagus green
    '#d62728',  // brick red
    '#9467bd',  // muted purple
    '#8c564b',  // chestnut brown
    '#e377c2',  // raspberry yogurt pink
    '#7f7f7f',  // middle gray
    '#bcbd22',  // curry yellow-green
    '#17becf'   // blue-teal
];

function mapStringToColour(str) {
    return defaultColours[[...str].map((char) => { return char.charCodeAt(0) }).reduce((partsum, a) => partsum + a, 1) % defaultColours.length];
}

// These are fields we KNOW do not contain data we want to show
const keysToIgnore = ["UNIX", "Hour", "Minute", "Epoch_UTC", "Local_Date_Time", "Date/Time", "Unit"];

// Stores all the raw file data direct from PapaParse in case the settings change at some point
// and it needs re-parsing.
let papaParseData = [];

// Stores the current settings
let settings = getSettings();

let lines = [];

window.addEventListener('load', (_event) => {
    // This handles the smoothed Input slider toggled visibility via it's checkbox
    let smoothedInput = document.getElementById("smoothedInput");
    let smoothedSliderDiv = document.getElementById("smoothedSliderDiv");
    smoothedInput.addEventListener('change', () => {
        if (smoothedInput.checked) {
            smoothedSliderDiv.classList.remove('hidden');
        }
        else {
            smoothedSliderDiv.classList.add('hidden');
        }
    });

    let fileInput = document.getElementById('csv'); 
    fileInput.addEventListener('change', () => {
        // User has changed the file input, lets parse all the files and then clear the file input

        document.getElementById("loader").style.display = "block";

        let files = fileInput.files;
        Promise.all([...files].map((file) =>
            new Promise((resolve, reject) =>
                Papa.parse(file, {

                    // File has a header line
                    header: true,
            
                    // Convert to propper types instead of leaving as strings
                    dynamicTyping: true,
            
                    // If our file might need some post-processing, it will be done here
                    beforeFirstChunk: processChunk,
            
                    // For some reason it was reading a blank data field as the last value, so this fixes that
                    skipEmptyLines: true,
                    
                    comments: "#",
                    complete: (result, file) => {
                        resolve({
                            result: result,
                            file: file
                        })
                    },
                    error: reject
                })
            )
        ))
        .then((data) => {
            parseFiles(data)
        })
        .catch((err) => console.log('Something went wrong:', err));
    });
});


/*
My client gave me a very specific type of file he wanted me to make the grapher compatible with.
The way we detect if we've been given that specific filetype is if it has`Date/Time` in it.
If it does, we do some very specific REGEX processing on it.
*/
function processChunk(chunk) {
    for (let i = 0; i < chunk.length - "Date/Time".length; i++) {
        let substr = chunk.substring(i, i + "Date/Time".length);
        if (substr == "Date/Time") {
            let newChunk = chunk.substring(i, chunk.length);
            // The date format in the file is DD/MM/YY, but we need YY-MM-DD
            newChunk = newChunk.replace(/(\d+)\/(\d+)\/(\d+)/g, '$3-$2-$1');

            // The timestamps in the file have AM and PM in them, so we need to get rid of them.
            // Also, we need to add 12 Hours to the PM values to convert them properlly to 24 hour format
            newChunk = newChunk.replace(/ 12:(\d+):(\d+) AM/g, ' 0:$1:$2');
            newChunk = newChunk.replace(/ AM/g, "");
            newChunk = newChunk.replace(/ 12:(\d+):(\d+) PM/g, ' 12:$1:$2');
            newChunk = newChunk.replace(/ 1:(\d+):(\d+) PM/g, ' 13:$1:$2');
            newChunk = newChunk.replace(/ 2:(\d+):(\d+) PM/g, ' 14:$1:$2');
            newChunk = newChunk.replace(/ 3:(\d+):(\d+) PM/g, ' 15:$1:$2');
            newChunk = newChunk.replace(/ 4:(\d+):(\d+) PM/g, ' 16:$1:$2');
            newChunk = newChunk.replace(/ 5:(\d+):(\d+) PM/g, ' 17:$1:$2');
            newChunk = newChunk.replace(/ 6:(\d+):(\d+) PM/g, ' 18:$1:$2');
            newChunk = newChunk.replace(/ 7:(\d+):(\d+) PM/g, ' 19:$1:$2');
            newChunk = newChunk.replace(/ 8:(\d+):(\d+) PM/g, ' 20:$1:$2');
            newChunk = newChunk.replace(/ 9:(\d+):(\d+) PM/g, ' 21:$1:$2');
            newChunk = newChunk.replace(/ 10:(\d+):(\d+) PM/g, ' 22:$1:$2');
            newChunk = newChunk.replace(/ 11:(\d+):(\d+) PM/g, ' 23:$1:$2');

            // for SOME REASON, a single line has \r\n in it
            newChunk = newChunk.replace(/\r/g, '');

            return newChunk;
        }
    }
}


/*
Called when the user clicks the "clear all files" button
*/
function clearFiles() {
    // if (confirm("Are you sure you want to clear all files?")) {
        document.getElementById('plots').innerHTML = '';
        lines = [];
        papaParseData = [];
    // }
}


/*
Gets the current settings configuration
*/
function getSettings() {
    return {
        doOverlayedLines: document.getElementById('overlayedLinesInput').checked,
        doExpandLines: document.getElementById('expandLinesInput').checked,
        doSmoothing: document.getElementById("smoothedInput").checked,
        SmoothFactor: parseInt(document.getElementById("smoothedSliderInput").value),
        doMarkers: document.getElementById("markersInput").checked,
        doEditable: document.getElementById("editableInput").checked
    }
}


/*
Called when the user clicks the "save" button
*/
function saveSettings() {
    parseFiles([]);
}

/*
Called when parsing of the CSV file is complete.
We want to do some more post-processing on the data before finally displaying it in plots.
*/
function parseFiles(rawData) {

    new Promise ((resolve, reject) => {
        document.getElementById("loader").style.display = "block";
        resolve();
    });

    // There are specific settings that require re-parsing of all the data
    let newSettings = getSettings();
    let reParseAllData = (newSettings.doOverlayedLines != settings.doOverlayedLines) || (newSettings.doSmoothing != settings.doSmoothing) || (newSettings.SmoothFactor |= settings.SmoothFactor);
    settings = newSettings;

    for (rawFileData of rawData) {
        papaParseData.push(rawFileData);
    }

    if (reParseAllData) {
        // The settings changed, so *all* the data needs to be re-parsed.
        lines = [];
        parseFileData(papaParseData);
    }
    else {
        // The settings didn't change, so all we need to parse is the new file.
        parseFileData(rawData);
    }

    // Up to this point we've got everything we need in `lines`,
    // and all that needs to be done is actually to plot them using Plotly.

    // Dictates whether markers will be drawn or not
    // Runs MUCH faster if disabled
    let drawMode = "lines";
    if (settings.doMarkers) {
        drawMode += "+markers"
    }

    // Generate the plots array
    plots = [];
    /*
    plots[0] = {
        id: 'banana',
        lines: [...],
        quantityId: 'banana',
        title: 'banana'
    }
    */

    if (settings.doExpandLines) {
        for (const line of lines) {
            plots.push({
                id: `${line.quantityId}-${line.key}-${line.filename}-plot`,
                lines: [line],
                quantityId: line.quantityId,
                title: `${getQuantity(line.quantityId).name} (${getSensor(line.sensorId).name} ${line.key})`
            });
        }
    }
    else {
        for (const line of lines) {
            let foundPlot = false;
            for (const plot of plots) {
                if (plot.quantityId == line.quantityId) {
                    plot.lines.push(line);
                    foundPlot = true;
                    break;
                }
            }

            if (foundPlot) { continue; }

            plots.push({
                id: `${line.quantityId}-plot`,
                lines: [line],
                quantityId: line.quantityId,
                title: `${getQuantity(line.quantityId).name}`
            });
        }
    }

    // For each of the plots, we need to generate a DIV element and make a new Plotly plot
    document.getElementById('plots').innerHTML = '';
    for (const plot of plots) {
        document.getElementById("plots").innerHTML += `<div id="${plot.id}" class="plot"></div>\n`;
    }

    let plotlyPromises = [];

    for (const plot of plots) {
        let data = [];
        for (const line of plot.lines) {
            let colourString = '';
            if (settings.doOverlayedLines) {
                colourString = `${line.filename}-${line.key}`;
            }
            else {
                colourString = `${line.key}`;
            }

            data.push({
                name: `${getSensor(line.sensorId).name} (${line.filename})`,
                x: line.x,
                y: line.y,
                type: 'scatter',
                mode: drawMode,
                line: {
                    shape: 'spline',
                    smoothing: 0.6, // 0-1.3, default=1
                    // shape: 'linear',
                    color: mapStringToColour(colourString)
                },
            });
        }

        let layout = {
            title: {
                text: plot.title
            },
            showlegend: true,
            legend: {
                font: {size: 16}
            },
            xaxis: {
                title: 'Time'
            },
            yaxis: {
                title: 'Value'
            }
        };
        let config = {
            editable: settings.doEditable,
            displayModeBar: true,
            displaylogo: false,
            responsive: true
        };

        plotlyPromises.push(Plotly.newPlot(plot.id, data, layout, config));
    }

    // Remove the loader once all the plots have been shown
    Promise.all(plotlyPromises).then((values) => {
        document.getElementById("loader").style.display = "none";
    });
}

/*
Parses the file data of a single file.

The parsing changes based on the currently applied settings, and once completed the plots are added to `plots`.
*/
function parseFileData(rawData) {
    for (const rawFileData of rawData) {
        let result = rawFileData.result;
        let file = rawFileData.file;

        // `x` becomes the x-axis of our plots, Strings representing the datetime of the datapoint that Plotly knows how to parse
        let x = [];
        for (const row of result.data) {
            let unix_timestamp = row['UNIX'] || row['Epoch_UTC'];
            if (!(row['Date/Time'] == null)) {
                x.push(row['Date/Time']);
                continue;
            }

            if (file.name.includes(".edf")) {
                // FIX FOR EDF files - we need to add +12 Hours to convert to propper timezone!
                unix_timestamp = unix_timestamp + 60 * 60 * 12
            }

            // Get all the time parameters from the generated `date` object and push the resulting string into our x values array
            let date = new Date(unix_timestamp * 1000);
            let hours = ("0" + date.getUTCHours()).slice(-2);
            let minutes = 0;
            if (settings.doOverlayedLines) {
                minutes = ("0" + Math.round(date.getUTCMinutes() / 6 * 10)).slice(-2);
            }
            else {
                minutes = ("0" + date.getUTCMinutes()).slice(-2);
            }
            let seconds = 0;
            if (settings.doOverlayedLines) {
                seconds = ("0" + Math.round(date.getUTCSeconds() / 6 * 10)).slice(-2);
            }
            else {
                seconds = ("0" + date.getUTCSeconds()).slice(-2);
            }
            // let seconds = ("0" + date.getUTCSeconds()).slice(-2);
            let days = ("0" + date.getUTCDate()).slice(-2);
            let month = ("0" + (date.getUTCMonth() + 1)).slice(-2);
            let year = date.getUTCFullYear();
            
            if (settings.doOverlayedLines) {
                // let statement = /\d+-\d+-\d+ (\d+):(\d+):\d+/g;
                x.push(`${hours}.${minutes}${seconds}`);
            }
            else {
                x.push(`${year}-${month}-${days} ${hours}:${minutes}:${seconds}`);
            }
        }

        // `keys` is a list of keys we care about
        // `fileData` is a dictionary of the keys, and the values a list of values for that key
        let keys = result.meta.fields.filter((field) => { return !keysToIgnore.includes(field); });
        let fileData = {};

        // For each of the interesting keys, take out all the data for that key from the table and into a single array in fileData
        for (const key of keys) {
            fileData[key] = result.data.map((row) => {return row[key]; });
        }

        // Sometimes, especially if we have `settings.doOverlayedLines` on where we lose a lot of data, there can be multiple identical x values.
        // These need to all be averaged into one.
        if (settings.doOverlayedLines) {
            let prevX = '';
            let n = 1;
            for (let i = x.length - 1; i >= 0; i--) {
                let curX = x[i];
                if (curX === prevX) {
                    n += 1;
                }

                if ((curX != prevX) || (i == 0)) {
                    if (i == 0) {
                        i -= 1;
                    }

                    // not the same as previous. if n is not 1, we just passed an identical trail
                    if (n > 1) {
                        // the trail goes from x[i+1] to x[i+1+n]
                        let total = {};
                        keys.forEach(key => {
                            total[key] = 0;
                        })

                        for (let j = 0; j < n; j++) {
                            for (const key of keys) {
                                total[key] = total[key] + fileData[key][i + 1 + j];
                            }
                        }

                        // Now we need to assign the averaged values to *one* x and delete the rest
                        x.splice(i + 1, n, prevX);
                        for (const key of keys) {
                            // fileData[key][i + 1] = total[key] / n;
                            // from index i+1, n items, insert the one we want
                            fileData[key].splice(i + 1, n, total[key] / n);
                        }
                        n = 1;
                    }
                }
                prevX = curX;
            }
        }

        // Smooth the data if necessary
        if (settings.doSmoothing) {
            let smoothFactor = parseInt(document.getElementById("smoothedSliderInput").value);
            for (const key of keys) {
                fileData[key] = smoothArray(fileData[key], smoothFactor);
            }
        }


        function getFilename(file) {
            let filename = file.name;
            let cutoff = 20;
            if (filename.length > cutoff) {
                filename = `${filename.slice(0, cutoff - 1)}...`;
            }
            return filename
        }

        // Categorize the data from fileData into seperate plots
        // This is based on what kind of quantity it is
        for (const key of keys) {
            let foundSensor = false;

            for (const sensor of SensorTypes) {
                for (const measurement of sensor.measurements) {
                    if (key === measurement.key) {
                        // We've found a sensor that measures this key
                        lines.push({
                            filename: getFilename(file),
                            key: key,
                            sensorId: sensor.id,
                            quantityId: measurement.quantityId,
                            x: x,
                            y: fileData[key]
                        });

                        foundSensor = true;
                        break;
                    }
                }

                if (foundSensor) { break; }
            }

            if (foundSensor) { continue; }
            // We scanned through all sensors and couldn't identify what sensor this is.
            // This happens if a sensor isn't in SensorTypes or we're dealing with an EDF file.

            // Lets create a dummy quantity
            let dummyQuantity = {
                id: key,
                name: key,
                unit: ''
            }
            QuantityTypes.push(dummyQuantity);

            // Also add this quantity as a measurement to the unknown sensor sensor
            getSensor('unknown').measurements.push({
                quantityId: key,
                key: key
            })

            lines.push({
                filename: getFilename(file),
                key: key,
                sensorId: 'unknown',
                quantityId: key,
                x: x,
                y: fileData[key]
            });
        }
    }
}


/*
Function to smooth an array of data points by averaging adjacent datapoints n times.
*/
function smoothArray(origArr, n) {
    let arr = origArr;
    for (let i = 0; i < n; i++) {
        let newArr = [];
        newArr[0] = arr[0];
        for (let j = 1; j < arr.length; j++) {
            newArr[j] = (arr[j-1] + 2*arr[j] + arr[j+1]) / 4;
        }
        newArr[newArr.length-1] = arr[arr.length-1];
        arr = newArr;
    }
    return arr;
}
