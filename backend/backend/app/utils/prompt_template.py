"""
This file implements prompt template for llama based models.
Modify the prompt template based on the model you select.
This seems to have significant impact on the output of the LLM.
"""

from llama_index.prompts import PromptTemplate

# this is specific to Llama-2.

system_prompt = """You are a helpful assistant, you will use the provided context to answer user questions.
Read the given context before answering questions and think step by step. If you can not answer a user question based on
the provided context, inform the user. Do not use any other information for answering user. Provide a detailed answer to the question."""


def get_prompt_template(
    system_prompt=system_prompt, promptTemplate_type=None, history=False
):
    if promptTemplate_type == "llama":
        B_INST, E_INST = "[INST]", "[/INST]"
        B_SYS, E_SYS = "<<SYS>>\n", "\n<</SYS>>\n\n"
        SYSTEM_PROMPT = B_SYS + system_prompt + E_SYS
        instruction = """
        <Context>
        {context_str}
        <Chat History>
        {chat_history}
        
        {question}"""

        prompt_template = B_INST + SYSTEM_PROMPT + instruction + E_INST
        prompt = PromptTemplate(template=prompt_template)
    elif promptTemplate_type == "mistral":
        B_INST, E_INST = "<s>[INST] ", " [/INST]"
        prompt_template = (
            B_INST
            + system_prompt
            + """

        Context: {history} \n {context}
        User: {question}"""
            + E_INST
        )
        prompt = PromptTemplate(
            input_variables=["history", "context", "question"],
            template=prompt_template,
        )
    else:
        # change this based on the model you have selected.
        prompt_template = (
            system_prompt
            + """

        Context: {history} \n {context}
        User: {question}
        Answer:"""
        )
        prompt = PromptTemplate(
            input_variables=["history", "context", "question"],
            template=prompt_template,
        )

    return prompt
