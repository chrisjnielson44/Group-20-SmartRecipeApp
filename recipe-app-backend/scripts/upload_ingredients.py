import pandas as pd
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import DATABASE_URL

# Create SQLAlchemy engine and session
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()

# Define the Ingredient model
Base = declarative_base()

class Ingredient(Base):
    __tablename__ = 'ingredients'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    quantity = Column(Float, nullable=False)
    unit = Column(String, nullable=False)

# Create the table
Base.metadata.create_all(engine)

# Read CSV file
df = pd.read_csv('available_ingredients.csv')

# Upload data to the database
for _, row in df.iterrows():
    ingredient = Ingredient(
        name=row['Ingredient'],
        quantity=row['Quantity'],
        unit=row['Unit']
    )
    session.add(ingredient)

# Commit the changes
session.commit()

print("Ingredients have been successfully uploaded to the database.")

# Close the session
session.close()
