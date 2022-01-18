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

// These are fields we KNOW do not contain data we want to show
const keysToIgnore = ["UNIX", "Hour", "Minute", "Epoch_UTC", "Local_Date_Time", "Date/Time", "Unit"];


// Stores information about each of the plots shown
let plots = {
    plots: [],

    getPlot: function(quantityId) {
        for (const plot of this.plots) {
            if (quantityId === plot.quantityId) {
                return plot;
            }
        }

        // no plot exists for that quantity, lets make one!
    }
};


/*
Called when the user clicks the "Show" button and wishes to plot the given datafile
*/
function submitFile() {
    var csv = document.getElementById("csv");

    // We can access the FileList object and want the one (and only) file in it
    var file = csv.files[0];

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
        complete: parseComplete,
        error: parseError
    });
}


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
Called when parsing of the CSV file is complete.
We want to do some more post-processing on the data before finally displaying it in plots.
*/
function parseComplete(results, file) {

    // `x` becomes the x-axis of our plots, Strings representing the datetime of the datapoint that Plotly knows how to parse
    let x = [];
    for (const row of results.data) {
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
        let hours = "0" + date.getUTCHours();
        let minutes = "0" + date.getUTCMinutes();
        let seconds = "0" + date.getUTCSeconds();
        let days = "0" + date.getUTCDate();
        let month = "0" + (date.getUTCMonth() + 1);
        let year = date.getUTCFullYear();
        x.push(year + "-" + month.substr(-2) + "-" + days.substr(-2) + " " + hours.substr(-2) + ":" + minutes.substr(-2) + ":" + seconds.substr(-2));
    }

    // `keys` is a list of keys we care about
    // `fileData` is a dictionary of the keys, and the values a list of values for that key
    let keys = results.meta.fields.filter((field) => { return !keysToIgnore.includes(field); });
    let fileData = {};

    // Take the data out of relevantFiels and into fieldData
    for (const key of keys) {
        fileData[key] = results.data.map((row) => {return row[key]; });
    }

    // Smooth the data if necessary
    let smooth = document.getElementById("smoothedInput").checked;
    if (smooth) {
        let smoothFactor = parseInt(document.getElementById("smoothedSliderInput").value);
        for (const key of keys) {
            fileData[key] = smoothArray(fileData[key], smoothFactor);
        }
    }

    // Dictates whether markers will be drawn or not
    // Runs MUCH faster if disabled
    let drawMode = "lines";
    let markers = document.getElementById("markersInput").checked;
    if (markers) {
        drawMode += "+markers"
    }

    // Create the plot data that we'll pass into the plotly plot
    let plotData = [];
    let colouri = 0;
    for (const key of keys) {
        plotData.push({
            line: {
                shape: 'spline',
                color: defaultColours[colouri]
            },
            x: x,
            y: fileData[key],
            type: 'scatter',
            name: key,
            mode: drawMode,
        });
        colouri = (colouri + 1) % defaultColours.length;
    }

    // Clear all existing plots
    document.getElementById('plots').innerHTML = '';


    if (document.getElementById("singlePlotInput").checked) {
        generateNewPlotDiv('combinedPlot');

        let layoutAndConfig = generateLayoutAndConfig(file.name);
        Plotly.newPlot('combinedPlot', plotData, layoutAndConfig.layout, layoutAndConfig.config);
    }

    // For each of the plots, we need to generate a DIV element and make a new Plotly plot
    for (const singlePlotData of plotData) {
        let id = `${singlePlotData.name}Plot`;
        generateNewPlotDiv(id);
    }

    for (const singlePlotData of plotData) {
        let id = `${singlePlotData.name}Plot`;

        let layoutAndConfig = generateLayoutAndConfig(`${file.name} - ${singlePlotData.name}`)
        Plotly.newPlot(id, [singlePlotData], layoutAndConfig.layout, layoutAndConfig.config);
    }
}


/*
Generates a new div element for a new plot
*/
function generateNewPlotDiv(id) {
    let template = `<div id="${id}" class="plot"></div>\n`;

    document.getElementById("plots").innerHTML += template;
}


/*
Generates the layout and config objects for the Plotly plots.
*/
function generateLayoutAndConfig(plotTitle) {
    let layout = {
        title: {
            text: plotTitle
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
        editable: true,
        displayModeBar: true,
        displaylogo: false,
        responsive: true
    };

    return {
        "layout": layout,
        "config": config
    };
}


/*
Called if papaparse encounters an error when parsing a file.
*/
function parseError(error, _file) {
    console.log(error);
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

window.addEventListener('load', (_event) => {
    // This handles the smoothed Input slider toggled visibility via it's checkbox
    var smoothedInput = document.getElementById("smoothedInput");
    var smoothedSliderDiv = document.getElementById("smoothedSliderDiv");
    smoothedInput.addEventListener('change', () => {
        if (smoothedInput.checked) {
            smoothedSliderDiv.classList.remove('hidden');
        }
        else {
            smoothedSliderDiv.classList.add('hidden');
        }
    });
});
