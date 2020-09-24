defaultColors = [
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

function submitFile() {
    // Called when the user clicks the "Show" button and wishes to plot the given
    // datafile

    var csv = document.getElementById("csv");
    // We can access the FileList object and want the one (and only) file in it
    var file = csv.files[0];

    Papa.parse(file, {
        // File has a header line
        header: true,
        // Convert to propper types instead of leaving as strings
        dynamicTyping: true,
        // Enables Comments
        comments: "#",

        // If our file might need some post-processing, it will be done here
        beforeFirstChunk: processChunk,

        // For some reason it was reading a blank data field as the last value, so this fixes that
        skipEmptyLines: true,
        // Callbacks
        complete: parseComplete,
        error: parseError
    });
}

function processChunk(chunk) {
    // My client gave me a very specific type of file he wanted me to make the grapher compatible with.
    // The way we detect if we've been given that specific filetype is if it has`Date/Time` in it.
    // If it does, we do some very specific REGEX processing on it.
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

function parseComplete(results, file) {
    // These are fields we KNOW do not contain data we want to show
    ignoreFields = ["UNIX", "Hour", "Minute", "Epoch_UTC", "Local_Date_Time", "Date/Time", "Unit"];

    let fields = results.meta.fields;
    // filter out the fields in ignoreFields
    let relevantFields = fields.filter((field) => { return !ignoreFields.includes(field); });
    let fieldData = {};

    let data = results.data;

    function mapUNIXToString(unix_timestamp) {
        let date = new Date(unix_timestamp * 1000);
       
        // Get all the time parameters from the generated `date` object and push the resulting string into our x values array
        let hours = "0" + date.getUTCHours();
        let minutes = "0" + date.getUTCMinutes();
        let seconds = "0" + date.getUTCSeconds();
        let days = "0" + date.getUTCDate();
        let month = "0" + (date.getUTCMonth() + 1);
        let year = date.getUTCFullYear();
        return year + "-" + month.substr(-2) + "-" + days.substr(-2) + " " + hours.substr(-2) + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
    }

    function mapRowToUNIXString(row) {
        let unix_timestamp = row['UNIX'] || row['Epoch_UTC'];
        if (!(row['Date/Time'] == null)) {
            return row['Date/Time'];
        }
        return mapUNIXToString(unix_timestamp);
    }

    // `x` becomes the x-axis of our plots, Strings representing the datetime of the datapoint that Plotly knows how to parse
    let x = data.map(mapRowToUNIXString);

    // Take the data out of relevantFiels and into fieldData
    // TODO: Optimize Somehow?
    for (const field of relevantFields) {
        fieldData[field] = data.map((row) => {return row[field]; });
    }

    // Smooth the data if necessary
    let smooth = document.getElementById("smoothedInput").checked;
    if (smooth) {
        let smoothFactor = parseInt(document.getElementById("smoothedSliderInput").value);
        for (const field of relevantFields) {
            fieldData[field] = smoothArray(fieldData[field], smoothFactor);
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
    let colori = 0;
    for (const field of relevantFields) {
        plotData.push({
            line: {
                shape: 'spline',
                color: defaultColors[colori]
            },
            x: x,
            y: fieldData[field],
            type: 'scatter',
            name: field,
            mode: drawMode,
        });
        colori = (colori + 1) % 10;
    }

    // Layout and config data for the plot
    let layout = {
        title: {
            text: file.name
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
        displaylogo: false
    };

    Plotly.newPlot('mainPlot', plotData, layout, config);

    // TODO: Use subplots?

    let multiplePlots = document.getElementById("multiplePlotsInput").checked;
    let extraPlots = document.getElementById("extraPlots");
    extraPlots.innerHTML = "";
    if (multiplePlots) {
        // For each of the plots, we need to generate a DIV element and make a new Plotly plot
        for (const singlePlotData of plotData) {
            let id = `${singlePlotData.name}Plot`;
            let template = `<div id="${id}" class="plot"></div>\n`;

            extraPlots.innerHTML += template;
        }

        for (const singlePlotData of plotData) {
            let id = `${singlePlotData.name}Plot`;

            let oldLayoutTitle = layout.title.text;
            layout.title.text = `${layout.title.text} - ${singlePlotData.name}`;

            Plotly.newPlot(document.getElementById(id), [singlePlotData], layout, config);

            layout.title.text = oldLayoutTitle;
        }
    }

}

function parseError(error, file) {
    console.log(error);
}

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

// This handles the smoothed Input slider toggled visibility via it's checkbox
// TODO: If we use JQuery this part here could be a lot nicer
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

