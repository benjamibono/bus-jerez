import requests

base_url = "https://www.comujesa.es/fileadmin/Documentos/Autobuses_Urbanos/horario_invierno/LINEA_{}_SAB.pdf"

for i in range(1, 19):
  url = base_url.format(i)
  response = requests.get(url)
  if response.status_code == 200:
    with open(f"LINEA_{i}_SAB.pdf", 'wb') as file:
      file.write(response.content)
    print(f"Downloaded: LINEA_{i}_SAB.pdf")
  else:
    print(f"Failed to download: LINEA_{i}_SAB.pdf")