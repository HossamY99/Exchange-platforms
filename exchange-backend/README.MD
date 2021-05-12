# Exchange Backend

## Getting Started

To start working on the code, you'll need to clone the repo in your local directory.

1. Create a Python virtual environment for your Flask project. This virtual environment allows you to isolate this
   project and install any packages you need without affecting the system Python installation. At the terminal, type the
   following command:

        $ python3 -m venv venv

2. Activate the virtual environment:

        $ source ./venv/bin/activate
   On Windows use:

        $ venv\Scripts\activate

3. Install Python dependencies for this project:

        $ pip install -r requirements.txt

4. Set the environment variables for this project:

        $ DB_USERNAME and DB_PASSWORD


5. Start the Flask development server:

        $ FLASK_APP=app.py FLASK_ENV=development flask run

6. Open http://127.0.0.1:5000/ in a web browser to view the application.

PS. Make sure your MySQL server is running, and you have initialized the db by running the following in a python shell
within your virtual environment:

      from app import db 
      db.create_all()
      exit()