template = '''{
    id: 'ds18b20_{number}', name: '18B20_{number}', measurements: [{quantityId: 'temperature', key: 'Temp{number}'}]
},'''

for x in range(1, 25):
    print(template.replace('{number}', str(x)))
