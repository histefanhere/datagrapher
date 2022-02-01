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
    },
    {
        id: 'weight',
        name: 'Weight',
        unit: 'kg'
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
        id: 'unknown',
        name: 'Unknown Sensor',
        measurements: []
    },
    {
        id: 'bme680',
        name: 'BME680',
        measurements: [
            {quantityId: 'temperature',     key: 'BMET'},
            {quantityId: 'humidity',        key: 'BMEH'},
            {quantityId: 'pressure',        key: 'BMEP'},
            {quantityId: 'gas',             key: 'BMEG'},
            {quantityId: 'gas',             key: 'BHEG'},
            {quantityId: 'temperature',     key: 'BMETemp'},
            {quantityId: 'humidity',        key: 'BMEHumid'},
            {quantityId: 'pressure',        key: 'BMEPressure'},
            {quantityId: 'gas',             key: 'BMEGas'},
        ]
    },
    {
        id: 'sgp30',
        name: 'SGP30',
        measurements: [
            {quantityId: 'tvoc',            key: 'TVOC'},
            {quantityId: 'eco2',            key: 'eCO2'},
            {quantityId: 'h2',              key: 'H2'},
            {quantityId: 'ethanol',         key: 'ETH'},
        ]
    },
    {
        id: 'sht31',
        name: 'SHT31',
        measurements: [
            {quantityId: 'temperature',     key: 'Temp'},
            {quantityId: 'humidity',        key: 'Humid'},
        ]
    },
    {
        id: 'hx711',
        name: 'HX711',
        measurements: [
            {quantityId: 'weight',          key: 'Weight'},
        ]
    },
    {
        id: 'ds18b20',
        name: 'DS18B20',
        measurements: [
            {quantityId: 'temperature',     key: 'Temp1'},
            {quantityId: 'temperature',     key: 'Temp2'},
            {quantityId: 'temperature',     key: 'Temp3'},
            {quantityId: 'temperature',     key: 'Temp4'},
            {quantityId: 'temperature',     key: 'Temp5'},
            {quantityId: 'temperature',     key: 'Temp6'},
            {quantityId: 'temperature',     key: 'Temp7'},
            {quantityId: 'temperature',     key: 'Temp8'},
            {quantityId: 'temperature',     key: 'Temp9'},
            {quantityId: 'temperature',     key: 'Temp10'},
            {quantityId: 'temperature',     key: 'Temp11'},
            {quantityId: 'temperature',     key: 'Temp12'},
            {quantityId: 'temperature',     key: 'Temp13'},
            {quantityId: 'temperature',     key: 'Temp14'},
            {quantityId: 'temperature',     key: 'Temp15'},
            {quantityId: 'temperature',     key: 'Temp16'},
            {quantityId: 'temperature',     key: 'Temp17'},
            {quantityId: 'temperature',     key: 'Temp18'},
            {quantityId: 'temperature',     key: 'Temp19'},
            {quantityId: 'temperature',     key: 'Temp20'},
            {quantityId: 'temperature',     key: 'Temp21'},
            {quantityId: 'temperature',     key: 'Temp22'},
            {quantityId: 'temperature',     key: 'Temp23'},
            {quantityId: 'temperature',     key: 'Temp24'},
            {quantityId: 'temperature',     key: 'Temp25'},
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
