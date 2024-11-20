from typing import List, Dict, Optional
import openai
from .prompts import SYSTEM_PROMPT
from .functions import functions, function_map
import json
import os
from dotenv import load_dotenv
import traceback

# Load environment variables
load_dotenv()

# Configure OpenAI with API key
openai.api_key = os.getenv("OPENAI_API_KEY")

print(f"OpenAI API Key Loaded: {openai.api_key}")

if not openai.api_key:
    raise ValueError("No OpenAI API key found. Please set OPENAI_API_KEY environment variable.")

class RecipeAgent:
    def process_message(
        self,
        message: str,
        conversation_history: List[Dict] = None
    ) -> Dict:
        """
        Process a user message and return a response without any database logic.
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
            completion = openai.ChatCompletion.create(
                model="gpt-4",
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
                    # Execute the function
                    results = function_to_call(**function_args)
                    results_str = json.dumps(results, indent=2)
                except Exception as e:
                    print(f"Error executing function {function_name}: {e}")
                    traceback.print_exc()
                    return {
                        "reply": f"I apologize, but I encountered an error executing {function_name}: {str(e)}",
                        "reasoning": None,
                        "data": None
                    }

                # Get final response from GPT
                messages.append(response_message)
                messages.append({
                    "role": "function",
                    "name": function_name,
                    "content": results_str
                })

                final_response = openai.ChatCompletion.create(
                    model="gpt-4",  # Use "gpt-3.5-turbo" or "gpt-4" if you have access
                    messages=messages
                )

                final_message = final_response.choices[0].message

                return {
                    "reply": final_message.content,
                    "reasoning": f"Used {function_name} to process your request",
                    "data": results  # Return the function results directly
                }

            return {
                "reply": response_message.content,
                "reasoning": None,
                "data": None
            }

        except openai.error.OpenAIError as e:
            print(f"OpenAI API error: {e}")
            print(f"Status code: {getattr(e, 'http_status', 'N/A')}")
            print(f"Error details: {getattr(e, 'error', 'N/A')}")
            traceback.print_exc()
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
