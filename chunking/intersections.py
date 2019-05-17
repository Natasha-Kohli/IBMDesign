from parse_map import parse_map
import overpy



def generate_intersections(out_file, bounding_box):
""" bounding box is a dictionary with indices max_lat, max_lon, min_lat, min_lon """



def query_intersections(file_name, bounding_box):
    names = parse_map(file_name)
    possible_intersections = []
    for i in names:
        for j in names:
            if i != j:
                possible_intersections.append([i,j])
    api = overpy.Overpass()
    #query_response = [ get(format_request(escape(i[0]),escape(i[1]))) for i in possible_intersections ]
    result = [ [api.query("""[bbox:40.5900, -74.2655,40.9514,-73.4512];
    way[highway][name="{}"];node(w)->.n1;
    way[highway][name="{}"];node(w)->.n2;
    node.n1.n2;
    out body;""".format(i[0], i[1])), i[0], i[1]] for i in possible_intersections[:15]]

    output = []
    for i in result:
        for j in i[0]._nodes:
            print(i[0]._nodes)
            output.append([
                float(i[0]._nodes[j].lat),
                float(i[0]._nodes[j].lon),
                i[1],
                i[2]   
            ])

    return output