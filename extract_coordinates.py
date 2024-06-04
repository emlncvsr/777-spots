import pandas as pd
import googlemaps
import re
from urllib.parse import unquote

def extract_coordinates_from_url(url):
    """Extrait les coordonnées des URL explicites."""
    patterns = [
        r'@(-?\d+\.\d+),(-?\d+\.\d+)',  # Format @lat,lon
        r'(-?\d+\.\d+),(-?\d+\.\d+)',    # Format lat,lon
        r'q=(-?\d+\.\d+),(-?\d+\.\d+)',  # Format q=lat,lon
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return float(match.group(1)), float(match.group(2))
    return None, None

def extract_name_from_url(url):
    """Extrait le nom du lieu à partir de l'URL."""
    try:
        match = re.search(r'/place/([^/]+)/', url)
        if match:
            place_name = unquote(match.group(1))
            place_name = place_name.replace('+', ' ')
            return place_name
    except Exception as e:
        print(f"Erreur lors de l'extraction du nom de l'URL pour {url}: {e}")
    return None

def get_coordinates_from_geocode(gmaps, query):
    """Utilise l'API Geocoding pour obtenir les coordonnées à partir du nom du lieu."""
    try:
        geocode_result = gmaps.geocode(query)
        if geocode_result:
            location = geocode_result[0]['geometry']['location']
            return location['lat'], location['lng']
    except Exception as e:
        print(f"Erreur lors de l'extraction des coordonnées avec Geocode API pour {query}: {e}")
    return None, None

def get_coordinates_from_places(gmaps, query):
    """Utilise l'API Places pour obtenir les coordonnées à partir du nom du lieu."""
    try:
        place_result = gmaps.find_place(input=query, input_type="textquery", fields=["geometry"])
        if place_result['candidates']:
            location = place_result['candidates'][0]['geometry']['location']
            return location['lat'], location['lng']
    except Exception as e:
        print(f"Erreur lors de l'extraction des coordonnées avec Places API pour {query}: {e}")
    return None, None

def convert_urls_to_coordinates(input_csv, output_csv, api_key):
    """Convertit les URLs en coordonnées GPS et ajoute les noms des lieux."""
    gmaps = googlemaps.Client(key=api_key)
    df = pd.read_csv(input_csv)

    if 'URL' not in df.columns:
        raise ValueError("Le fichier CSV doit contenir une colonne 'URL'.")

    latitudes = []
    longitudes = []
    names = []
    errors = []

    for index, row in df.iterrows():
        url = row['URL']
        lat, lon = extract_coordinates_from_url(url)
        place_name = extract_name_from_url(url)

        if lat is None or lon is None:
            if place_name:
                lat, lon = get_coordinates_from_geocode(gmaps, place_name)
                if lat is None or lon is None:
                    lat, lon = get_coordinates_from_places(gmaps, place_name)
            if (lat is None or lon is None) and 'Title' in row:
                lat, lon = get_coordinates_from_geocode(gmaps, row['Title'])
                if lat is None or lon is None:
                    lat, lon = get_coordinates_from_places(gmaps, row['Title'])

        if place_name is None:
            place_name = f"{lat},{lon}" if lat is not None and lon is not None else "Unknown"

        if lat is None or lon is None:
            errors.append(url)

        latitudes.append(lat)
        longitudes.append(lon)
        names.append(place_name)

    df['Latitude'] = latitudes
    df['Longitude'] = longitudes
    df['Name'] = names

    df.to_csv(output_csv, index=False, encoding='utf-8-sig')

    if errors:
        print("Les URL suivantes n'ont pas pu être traitées :")
        for error_url in errors:
            print(error_url)

if __name__ == "__main__":
    input_csv = 'urls.csv'
    output_csv = 'coordinates_with_names.csv'
    api_key = 'ENTERAPIKEYHERE'
    convert_urls_to_coordinates(input_csv, output_csv, api_key)
    print(f"Les coordonnées et les noms ont été extraits et sauvegardés dans {output_csv}.")
