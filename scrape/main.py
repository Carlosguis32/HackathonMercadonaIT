import pandas as pd
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver import ChromeOptions

options = ChromeOptions()
options.add_argument("--headless=new")

classnames ="product-cell__image-wrapper"

def getLink(p):
    driver = webdriver.Chrome(options=options)
    driver.get("https://tienda.mercadona.es/search-results?query=" + p)
    results = []
    content = driver.page_source

    driver = webdriver.Chrome(options=options)
    soup = BeautifulSoup(content, "html.parser")

    result = ""

    try:
        for a in soup.findAll(attrs={'class': classnames}):
            name = a.find("img")
            result = name.get("src")
            break
    except:
        print("could not get image")

    return result

productos = [
    "Manzanas",
    "Plátanos",
    "Naranjas",
    "Peras",
    "Fresas",
    "Uvas",
    "Kiwis",
    "Melocotones",
    "Sandía",
    "Melón",
    "Tomates",
    "Zanahorias",
    "Patatas",
    "Cebollas",
    "Pimientos",
    "Pepinos",
    "Berenjenas",
    "Calabacines",
    "Lechugas",
    "Espinacas",
    "Leche Entera",
    "Leche Desnatada",
    "Queso Fresco",
    "Queso Curado",
    "Yogur Natural",
    "Yogur de Frutas",
    "Mantequilla",
    "Nata",
    "Queso Rallado",
    "Queso Lonchas",
    "Pan Blanco",
    "Pan Integral",
    "Baguette",
    "Croissants",
    "Magdalenas",
    "Pan de Molde",
    "Napolitanas",
    "Donuts",
    "Pan Rallado",
    "Palmeras",
    "Pollo Entero",
]

import requests
import io
import os
from PIL import Image

results = []

for pro in productos:
    linkname = getLink(pro)
    path = "resc/" + pro + ".png"
    if linkname != "":
        print("found:", pro)
        image_content = requests.get(linkname).content
        image_file = io.BytesIO(image_content)
        image = Image.open(image_file).convert("RGB")
        image.save(path, "PNG", quality=80)
    else:
        print("not found:", pro)

    if os.path.exists(path):
        results.append("ok")
    else:
        results.append("not ok")

for i in range(len(results)):
    print(productos[i], "-", results[i])

#categoria: "Frutas"
#categoria: "Frutas"
#categoria: "Frutas"
#categoria: "Frutas"
#categoria: "Frutas"
#categoria: "Frutas"
#categoria: "Frutas"
#categoria: "Frutas"
#categoria: "Frutas"
#categoria: "Frutas"
#categoria: "Verduras"
#categoria: "Verduras"
#categoria: "Verduras"
#categoria: "Verduras"
#categoria: "Verduras"
#categoria: "Verduras"
#categoria: "Verduras"
#categoria: "Verduras"
#categoria: "Verduras"
#categoria: "Verduras"
#categoria: "Lácteos"
#categoria: "Lácteos"
#categoria: "Lácteos"
#categoria: "Lácteos"
#categoria: "Lácteos"
#categoria: "Lácteos"
#categoria: "Lácteos"
#categoria: "Lácteos"
#categoria: "Lácteos"
#categoria: "Lácteos"
#categoria: "Panadería"
#categoria: "Panadería"
#categoria: "Panadería"
#categoria: "Panadería"
#categoria: "Panadería"
#categoria: "Panadería"
#categoria: "Panadería"
#categoria: "Panadería"
#categoria: "Panadería"
#categoria: "Panadería"
#categoria: "Carnicería"

