import os
import dotenv
import google.generativeai as genai
import re
import json
from openai import OpenAI
# Load environment variables from .env files
dotenv.load_dotenv()
tones ={
    "Friendly": "Friendly, like your talking to a friend. Use casual language",
    "Professional": "Professional, like your talking to a boss or a teacher. Use formal language and do not use emojis.",
    "Concise": "Concise, like your talking to a friend. Use short sentences and do not use emojis.",
    "Empathetic": "Empathetic, like your talking to a friend. Use empathetic language and do not use emojis.",
    "Persuasive": "Persuasive, like your trying to convince someone. Use persuasive language and do not use emojis.",
    "Informative": "Informative, like your trying to inform someone. Use informative language and do not use emojis.",
    "Urgent": "Urgent, like your trying to get something done quickly. Use urgent language and do not use emojis.",
    "Apologetic": "Apologetic, like your trying to apologize for something. Use apologetic language and do not use emojis.",
    "Grateful": "Grateful, like your trying to show gratitude. Use grateful language and do not use emojis.",
    "Assertive": "Assertive, like your trying to assert yourself. Use assertive language and do not use emojis.",
    "Humorous": "Humorous, like your trying to make someone laugh. Use humorous language and emojis if appropriate.",
    "Supportive": "Supportive, like your trying to support someone. Use supportive language and do not use emojis.",
    "Respectful": "Respectful, like your trying to show respect. Use respectful language and do not use emojis.",
    "Inspirational": "Inspirational, like your trying to inspire someone. Use inspirational language and do not use emojis.",
}

def generate_email(agent, key, recipient,query, info, tone):
    """
    Generates a response to an email based on the provided parameters.

    Args:
        from (str): The sender of the email.
        subject (str): The subject of the email.
        body (str): The body of the email.
        response (str): The response to be generated.
        tone (str): The tone of the response.

    Returns:
        str: The generated email response.
    """
    # For now, just return a formatted string
    system_prompt = """
    You are an AI assistant that generates email responses.
    Your response should be tuned to who is recieving the email.
    You will be provided with the sender, the subject, the email content, 
    the importance of the person recieving the email (Teacher, boss, friend, parent), the tone (how the user wants the email to sound like),
    and previous interactions with the sender. 
    Your response should be clear, grammaticlly correct and concise.
    Do not include a signoff in your response and do not use any emojis in the response.
    
    Information Provided:
    Recipient: The person who is recieving the email.
    Query: The users query, which is the response to the email or a question proposed to u about the email.
    Info: The information which is relevant to the email.
    Tone: The tone of the email, which is how the user wants the email to sound like.
    """

    full_prompt = f"""User Query: {query}
    Email Data:
    Recipient: {recipient}
    Info: {info}
    Tone: {tones[tone]}
        """

    if agent == "openai":
        return openai_email(key, system_prompt, full_prompt)
    elif agent == "gemini":
        return gemini_email(key, system_prompt, full_prompt)
    else:
        raise ValueError("Invalid agent specified")


def gemini_email(key, system_prompt, full_prompt):
    
    genai.configure(api_key=key)
    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content([
        {"role": "user", "parts": [system_prompt]},
        {"role": "user", "parts": [full_prompt]}
    ])

    reply = response.text.strip()
    print(f"[Gemini Raw Response]\n{reply}")
    return reply


def openai_email(key, system_prompt, full_prompt):
    client = OpenAI(api_key=key)
    completion = client.chat.completions.create(
    model="gpt-4.1",  # Use "gpt-4" or "gpt-4o" — "gpt-4.1" is not valid
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": full_prompt}
    ]
    )
    print(completion.choices[0].message.content)
    return completion.choices[0].message.content.strip()
