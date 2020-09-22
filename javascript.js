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
    ignoreFields = ["UNIX", "Hour", "Minute", "Epoch_UTC", "Local_Date_Time"];
   
    let fields = results.meta.fields;
    let relevantFields = [];
    let fieldData = {};

    for (const field of fields) {
        if (ignoreFields.includes(field)) {
            continue;
        }
        else {
            relevantFields.push(field);
            fieldData[field] = [];
        }
    }

    let data = results.data;

    let x = [];

    for (const row of data) {
        let unix_timestamp = row['UNIX'] || row['Epoch_UTC'];
        let date = new Date(unix_timestamp * 1000);

        // Plotly doesn't like this format of String datetime
        //x.push(date.toUTCString());
       
        // Get all the time parameters from the generated `date` object and push the resulting string into our x values array
        let hours = "0" + date.getUTCHours();
        let minutes = "0" + date.getUTCMinutes();
        let seconds = "0" + date.getUTCSeconds();
        let days = "0" + date.getUTCDate();
        let month = "0" + (date.getUTCMonth() + 1);
        let year = date.getUTCFullYear();
        x.push(year + "-" + month.substr(-2) + "-" + days.substr(-2) + " " + hours.substr(-2) + ":" + minutes.substr(-2) + ":" + seconds.substr(-2));

        for (const field of relevantFields) {
            fieldData[field].push(row[field]); 
        }
    }

    let plotData = [];
    for (const field of relevantFields) {
        plotData.push({
            line: {shape: 'spline'},
            x: x,
            y: fieldData[field],
            type: 'scatter',
            name: field,
            mode: 'lines+markers'
        });
    }
    let layout = {
        title: file.name,
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

    Plotly.newPlot('graph', plotData, layout, config);
}

function parseError(error, file) {
    console.log(error);
}
