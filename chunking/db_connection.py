
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

databases = {
    "130_project" : "postgresql+psycopg2://postgres:password@127.0.0.1:5432/130_project"
}

def connect(db_name):
    global ENGINE
    global SESSIONMAKER
    # if ENGINE is not None:
    #     raise ValueError("Engine already instantiated")
    ENGINE = create_engine(databases[db_name])
    SESSIONMAKER = sessionmaker(bind=ENGINE, autoflush=False)