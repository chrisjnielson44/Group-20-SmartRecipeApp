import sys
import os
import pytest
from fastapi.testclient import TestClient

# Add the parent directory to the sys.path to ensure routes can be imported
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from routes.ingredients import router

# Create a TestClient using the FastAPI router
client = TestClient(router)


def test_get_available_ingredients():
    response = client.get("/ingredients")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert all("name" in ingredient for ingredient in response.json())
    assert all("quantity" in ingredient for ingredient in response.json())
    assert all("unit" in ingredient for ingredient in response.json())


def test_output_grocery_list():
    # Ensure the grocery_list.csv file exists and has the expected format
    with open('grocery_list.csv', 'w', encoding='utf-8') as file:
        file.write("ingredient,missing_amount,unit\n")
        file.write("sugar,200,grams\n")

    response = client.post("/ingredients/grocery-list")
    assert response.status_code == 200
    assert isinstance(response.json(), dict)
    assert "sugar" in response.json()
    assert response.json()["sugar"] == "200"