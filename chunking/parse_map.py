import xml.etree.ElementTree as ET

def parse_map(file_name):
    tree = ET.parse(file_name)
    root = tree.getroot()

    street_names = set()


    for node in root.findall("node"):
        for tag in node.findall("tag"):
            if tag.attrib['k'] == "addr:street":
                street_names.add(tag.attrib['v'])

    return street_names