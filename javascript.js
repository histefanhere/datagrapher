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

        // For some reason it was reading a blank data field as the last value, so this fixes that
        skipEmptyLines: true,
        // Callbacks
        complete: parseComplete,
        error: parseError
    });
}

function parseComplete(results, file) {
    // These are fields we KNOW do not contain data we want to show
    ignoreFields = ["UNIX", "Hour", "Minute", "Epoch_UTC", "Local_Date_Time"];
   
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
        return mapUNIXToString(unix_timestamp);
    }

    // `x` becomes the x-axis of our plots, Strings representing the datetime of the datapoint that Plotly knows how to parse
    let x = data.map(mapRowToUNIXString);

    // Take the data out of relevantFiels and into fieldData
    // TODO: Optimize Somehow?
    for (const field of relevantFields) {
        fieldData[field] = data.map((row) => {return row[field]; });
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
            mode: 'lines+markers',
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
