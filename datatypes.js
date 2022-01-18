const QuantityTypes = [
    {
        id: 'temperature',
        name: 'Temperature',
        unit: '℃'
    },
    {
        id: 'humidity',
        name: 'Relative Humidity',
        unit: '%'
    },
    {
        id: 'pressure',
        name: 'Air Pressure',
        unit: 'Pa'
    },
    {
        id: 'gas',
        name: 'Gas',
        unit: ''
    },
    {
        id: 'tvoc',
        name: 'TVOC',
        unit: ''
    },
    {
        id: 'eco2',
        name: 'eCO2',
        unit: ''
    },
    {
        id: 'h2',
        name: 'H2',
        unit: ''
    },
    {
        id: 'ethanol',
        name: 'Ethanol',
        unit: ''
    }
];


function getQuantity(quantityId) {
    for (const quantity of QuantityTypes) {
        if (quantity.id === quantityId) {
            return quantity;
        }
    }
}


const SensorTypes = [
    {
        id: 'bmp680',
        name: 'BMP680',
        measurements: [
            {
                quantityId: 'temperature',
                key: 'BMET'
            },
            {
                quantityId: 'humidity',
                key: 'BMEH'
            },
            {
                quantityId: 'pressure',
                key: 'BMEP'
            },
            {
                quantityId: 'gas',
                key: 'BMEG'
            }
        ]
    },
    {
        id: 'sgp30',
        name: 'SGP30',
        measurements: [
            {
                quantityId: 'tvoc',
                key: 'TVOC'
            },
            {
                quantityId: 'eco2',
                key: 'eCO2'
            },
            {
                quantityId: 'h2',
                key: 'H2'
            },
            {
                quantityId: 'ethanol',
                key: 'ETH'
            }
        ]
    },
    {
        id: 'sht31',
        name: 'SHT31',
        measurements: [
            {
                quantityId: 'temperature',
                key: 'Temp'
            },
            {
                quantityId: 'humidity',
                key: 'Humid'
            }
        ]
    }
];

function getSensor(sensorId) {
    for (const sensor of SensorTypes) {
        if (sensor.id === sensorId) {
            return sensor;
        }
    }
}