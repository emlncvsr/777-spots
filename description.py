import pandas as pd
import googlemaps

def get_brief_description(gmaps, query):
    """Utilise l'API Places Text Search pour obtenir une brève description du lieu."""
    try:
        place_results = gmaps.places(query)
        if place_results and 'results' in place_results and len(place_results['results']) > 0:
            place_id = place_results['results'][0]['place_id']
            place_details = gmaps.place(place_id=place_id, fields=['name', 'formatted_address', 'editorial_summary', 'reviews'])
            if place_details and 'result' in place_details:
                result = place_details['result']
                description_parts = []
                if 'editorial_summary' in result:
                    description_parts.append(result['editorial_summary']['overview'])
                if 'reviews' in result and len(result['reviews']) > 0:
                    description_parts.append(result['reviews'][0]['text'])
                description = " ".join(description_parts)
                return truncate_to_15_words(description)
    except Exception as e:
        print(f"Erreur lors de l'extraction de la description pour {query}: {e}")
    return "Description non disponible"

def truncate_to_15_words(text):
    """Tronque le texte à 15 mots."""
    words = text.split()
    return ' '.join(words[:15]) if len(words) > 15 else text

def add_descriptions_to_excel(input_excel, output_excel, api_key):
    """Ajoute les descriptions des lieux à partir de l'API Places Text Search."""
    gmaps = googlemaps.Client(key=api_key)
    df = pd.read_excel(input_excel)

    if 'Latitude' not in df.columns or 'Longitude' not in df.columns:
        raise ValueError("Le fichier Excel doit contenir des colonnes 'Latitude' et 'Longitude'.")

    descriptions = []

    for index, row in df.iterrows():
        lat = row['Latitude']
        lon = row['Longitude']
        query = f"{lat},{lon}"
        description = get_brief_description(gmaps, query)
        descriptions.append(description)

    df['Description'] = descriptions
    df.to_excel(output_excel, index=False, engine='openpyxl')

if __name__ == "__main__":
    input_excel = 'excel.xlsx'
    output_excel = 'final.xlsx'
    api_key = 'AIzaSyAq7I04fePA_qwdPp9j_NvzCqCgDDPf0_0'
    add_descriptions_to_excel(input_excel, output_excel, api_key)
    print(f"Les descriptions ont été extraites et sauvegardées dans {output_excel}.")
