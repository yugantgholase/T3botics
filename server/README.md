
## This is backend repo of T3k chatbot




## Steps to run the backend application

Step 1: Download Ollama from the below link.

        Download Link : https://ollama.com/download

Step 2: Download llama2 model using following command.

        ollama pull llama2:13b

Step 3: Clone the repo and navigate to the project root directory.

Step 4: Create the virtual enviroment

        python -m venv venv

Step 5: Activate the virtual enviroment

        For Windows: .\venv\Scripts\activate
        
        For macOs/Linux: source venv/bin/activate

Step 6: Install the dependencies using following command

        pip install -r requirements.txt

Step 7: Run the application using following command.

        uvicorn src.app:app --reload



## To make Custom LLM
        ollama create t3k-llama2 -f Modelfile



New dependencies
        pip install langchain langchain-community
