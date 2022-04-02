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
    },
    {
        id: 'altitude',
        name: 'Altitude',
        unit: 'm'
    },
    {
        id: 'co2',
        name: 'CO2',
        unit: ''
    },
    {
        id: 'vocindex',
        name: 'VOC Index',
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
        id: 'unknown',
        name: 'Unknown Sensor',
        measurements: []
    },
    {
        id: 'bmp280',
        name: 'BMP280',
        measurements: [
            {quantityId: 'temperature',     key: 'BMPT'},
            {quantityId: 'pressure',        key: 'BMPP'},
            {quantityId: 'altitude',        key: 'BMPA'},
        ]
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
            {quantityId: 'temperature',     key: 'SHTT'},
            {quantityId: 'humidity',        key: 'SHTH'},
        ]
    },
    {
        id: 'aht10',
        name: 'AHT10',
        measurements: [
            {quantityId: 'temperature',     key: 'AHTT'},
            {quantityId: 'humidity',        key: 'AHTH'},
        ]
    },
    {
        id: 'scd41',
        name: 'SCD41',
        measurements: [
            {quantityId: 'co2',             key: 'SCDC'},
            {quantityId: 'temperature',     key: 'SCDT'},
            {quantityId: 'humidity',        key: 'SCDH'},
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
        id: 'mcu681',
        name: 'MCU681',
        measurements: [
            {quantityId: 'temperature',     key: 'MCUT'},
            {quantityId: 'humidity',        key: 'MCUH'},
            {quantityId: 'pressure',        key: 'MCUP'},
            {quantityId: 'altitude',        key: 'MCUA'},
            {quantityId: 'vocindex',        key: 'MCUV'},
        ]
    },
    {
        id: 'ds18b20', name: 'DS18 1', measurements: [{quantityId: 'temperature',     key: 'Temp1'}]
    },
    {
        id: 'ds18b20_1', name: '18B20_1', measurements: [{quantityId: 'temperature', key: 'Temp1'}]
    },
    {
        id: 'ds18b20_2', name: '18B20_2', measurements: [{quantityId: 'temperature', key: 'Temp2'}]
    },
    {
        id: 'ds18b20_3', name: '18B20_3', measurements: [{quantityId: 'temperature', key: 'Temp3'}]
    },
    {
        id: 'ds18b20_4', name: '18B20_4', measurements: [{quantityId: 'temperature', key: 'Temp4'}]
    },
    {
        id: 'ds18b20_5', name: '18B20_5', measurements: [{quantityId: 'temperature', key: 'Temp5'}]
    },
    {
        id: 'ds18b20_6', name: '18B20_6', measurements: [{quantityId: 'temperature', key: 'Temp6'}]
    },
    {
        id: 'ds18b20_7', name: '18B20_7', measurements: [{quantityId: 'temperature', key: 'Temp7'}]
    },
    {
        id: 'ds18b20_8', name: '18B20_8', measurements: [{quantityId: 'temperature', key: 'Temp8'}]
    },
    {
        id: 'ds18b20_9', name: '18B20_9', measurements: [{quantityId: 'temperature', key: 'Temp9'}]
    },
    {
        id: 'ds18b20_10', name: '18B20_10', measurements: [{quantityId: 'temperature', key: 'Temp10'}]
    },
    {
        id: 'ds18b20_11', name: '18B20_11', measurements: [{quantityId: 'temperature', key: 'Temp11'}]
    },
    {
        id: 'ds18b20_12', name: '18B20_12', measurements: [{quantityId: 'temperature', key: 'Temp12'}]
    },
    {
        id: 'ds18b20_13', name: '18B20_13', measurements: [{quantityId: 'temperature', key: 'Temp13'}]
    },
    {
        id: 'ds18b20_14', name: '18B20_14', measurements: [{quantityId: 'temperature', key: 'Temp14'}]
    },
    {
        id: 'ds18b20_15', name: '18B20_15', measurements: [{quantityId: 'temperature', key: 'Temp15'}]
    },
    {
        id: 'ds18b20_16', name: '18B20_16', measurements: [{quantityId: 'temperature', key: 'Temp16'}]
    },
    {
        id: 'ds18b20_17', name: '18B20_17', measurements: [{quantityId: 'temperature', key: 'Temp17'}]
    },
    {
        id: 'ds18b20_18', name: '18B20_18', measurements: [{quantityId: 'temperature', key: 'Temp18'}]
    },
    {
        id: 'ds18b20_19', name: '18B20_19', measurements: [{quantityId: 'temperature', key: 'Temp19'}]
    },
    {
        id: 'ds18b20_20', name: '18B20_20', measurements: [{quantityId: 'temperature', key: 'Temp20'}]
    },
    {
        id: 'ds18b20_21', name: '18B20_21', measurements: [{quantityId: 'temperature', key: 'Temp21'}]
    },
    {
        id: 'ds18b20_22', name: '18B20_22', measurements: [{quantityId: 'temperature', key: 'Temp22'}]
    },
    {
        id: 'ds18b20_23', name: '18B20_23', measurements: [{quantityId: 'temperature', key: 'Temp23'}]
    },
    {
        id: 'ds18b20_24', name: '18B20_24', measurements: [{quantityId: 'temperature', key: 'Temp24'}]
    }
];

function getSensor(sensorId) {
    for (const sensor of SensorTypes) {
        if (sensor.id === sensorId) {
            return sensor;
        }
    }
}
