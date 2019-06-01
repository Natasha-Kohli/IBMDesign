import xml.etree.ElementTree as ET
import csv

import db_connection
import db_model

def add_ways(file_name):
    tree = ET.parse(file_name)
    root = tree.getroot()

    street_names = set()
    street_refs = set()
    db_connection.connect("130_project")
    session = db_connection.SESSIONMAKER()

    for way in root.findall("way"):
        valid_street = False
        street_name = None
        for tag in way.findall("tag"):
            if tag.attrib['k'] == "highway" and tag.attrib['v'] not in ['footway', 'pedestrian', 'wall', 'path', 'steps', 'bridleway', 'cycleway']:
                valid_street = True
            if tag.attrib['k'] == 'name':
                street_name = tag.attrib['v']
                # street_names.add((tag.attrib['v']))
        if not valid_street or street_name is None:
            continue 
        way_id = int(way.attrib['id'])
        street_names.add((way_id, street_name))
        for ref in way.findall('nd'):
            street_refs.add((way_id, int(ref.attrib['ref'])))
    
    print(len(street_names))
    for i in street_names:
        session.add(db_model.Streets(id = i[0], name = i[1]))
    session.flush()
    print(len(street_refs))
    for i in street_refs:
        session.add(db_model.StreetHasNode(street=i[0], node=i[1]))
    session.flush()

    session.commit()
    session.close()

def add_nodes(file_name):
    tree = ET.parse(file_name)
    root = tree.getroot()

    nodes = set()
    db_connection.connect("130_project")
    session = db_connection.SESSIONMAKER()

    for node in root.findall("node"):
        nodes.add((int(node.attrib['id']), float(node.attrib['lat']), float(node.attrib['lon'])))
    
    nodes = list(nodes)
    print(len(nodes))
    for i in nodes:
        session.add(db_model.Node(id = i[0], location = 'SRID=4326;POINT({} {})'.format(i[2], i[1])))
    session.commit()
    session.close()