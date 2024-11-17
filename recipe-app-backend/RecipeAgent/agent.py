from typing import List, Dict, Optional
import openai
from .database import get_db
from .prompts import SYSTEM_PROMPT
from .functions import functions, function_map
import json
import pandas as pd
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure OpenAI with API key
openai.api_key = os.getenv("OPENAI_API_KEY")

if not openai.api_key:
    raise ValueError("No OpenAI API key found. Please set OPENAI_API_KEY environment variable.")

class RecipeAgent:
    def __init__(self):
        self.db = get_db()

    async def process_message(
        self,
        message: str,
        conversation_history: List[Dict] = None
    ) -> Dict:
        """
        Process a user message and return a response
        """
        if conversation_history is None:
            conversation_history = []

        messages = [
            {"role": "system", "content": SYSTEM_PROMPT}
        ]

        # Add conversation history
        messages.extend(conversation_history)

        # Add the current message
        messages.append({"role": "user", "content": message})

        try:
            completion = await openai.ChatCompletion.acreate(
                model="gpt-4o",
                messages=messages,
                functions=functions,
                function_call="auto"
            )

            response_message = completion.choices[0].message

            if response_message.get("function_call"):
                # Execute the function
                function_name = response_message["function_call"]["name"]
                function_args = json.loads(response_message["function_call"]["arguments"])

                # Get the appropriate function from the function map
                function_to_call = function_map[function_name]

                try:
                    # Execute the function with the database connection
                    if function_name == "execute_sql":
                        results = self.db.execute_query(function_args["query"])
                        results_str = results.to_string()
                    else:
                        results = function_to_call(**function_args)
                        results_str = json.dumps(results, indent=2)
                except Exception as e:
                    results_str = f"Error executing function: {str(e)}"
                    print(f"Error executing {function_name}: {str(e)}")  # For debugging

                # Get final response from GPT
                messages.append(response_message)
                messages.append({
                    "role": "function",
                    "name": function_name,
                    "content": results_str
                })

                final_response = await openai.ChatCompletion.acreate(
                    model="gpt-4o",
                    messages=messages
                )

                final_message = final_response.choices[0].message

                return {
                    "reply": final_message.content,
                    "reasoning": f"Used {function_name} to analyze your request",
                    "data": results.to_dict('records') if isinstance(results, pd.DataFrame) else results
                }

            return {
                "reply": response_message.content,
                "reasoning": None,
                "data": None
            }

        except Exception as e:
            print(f"Error in process_message: {str(e)}")  # For debugging
            return {
                "reply": f"I apologize, but I encountered an error: {str(e)}",
                "reasoning": None,
                "data": None
            }

# Global instance
recipe_agent = RecipeAgent()

def get_agent():
    """Getter function for the agent instance"""
    return recipe_agent
