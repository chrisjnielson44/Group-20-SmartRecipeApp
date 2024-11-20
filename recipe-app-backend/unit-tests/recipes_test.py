import sys
import os
import pytest
from fastapi.testclient import TestClient

# Add the parent directory to the sys.path to ensure routes can be imported
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from routes.recipes import router

# Create a TestClient using the FastAPI router
client = TestClient(router)

def test_get_recipes_endpoint():
    response = client.get("/recipes")
    assert response.status_code == 200
    assert isinstance(response.json(), dict)
    # Check for the presence of at least one recipe name in the response
    assert len(response.json()) > 0

def test_get_recipe_by_name():
    recipe_name = "tomatoes"  # Ensure this recipe exists in your CSV
    response = client.get(f"/recipes/{recipe_name}")
    assert response.status_code == 200
    assert isinstance(response.json(), dict)
    assert response.json()["name"].lower() == recipe_name

def test_get_recipe_by_name_not_found():
    recipe_name = "non_existent_recipe"
    response = client.get(f"/recipes/{recipe_name}")
    assert response.status_code == 404
    assert response.json() == {"detail": f"Recipe '{recipe_name}' not found."}