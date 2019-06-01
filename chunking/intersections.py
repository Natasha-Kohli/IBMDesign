import csv
import db_connection
import db_model
from sqlalchemy import func

def find_intersections():
    #bounding box is a dictionary with indices max_lat, max_lon, min_lat, min_lon
    db_connection.connect("130_project")
    session = db_connection.SESSIONMAKER()
    intersect_nodes = session.query(db_model.StreetHasNode.node, func.count(db_model.StreetHasNode.node)).group_by(db_model.StreetHasNode.node).having(func.count(db_model.StreetHasNode.node) > 1).all()
    print(len(intersect_nodes))

    # session.query(Child).join(Child, Child.parent_metadata_id == Parent.metadata_id)
    for i in intersect_nodes:
        streets = session.query(db_model.StreetHasNode).filter(db_model.StreetHasNode.node == i[0]).order_by(db_model.StreetHasNode.street.asc()).all()
        location = session.query(db_model.Node.location).filter(db_model.Node.id == i[0]).first()[0]
        session.add(db_model.Intersection(street_1 = streets[0].street, street_2 = streets[1].street, location = location))
        
    session.commit()
    session.close()