from flask import Flask, request, Response
from joblib import load
import recommend
import json


app = Flask(__name__)
app.debug = True

# input lat, long, dayofweeknum, monthdaynum, chunkindex (15-min)
@app.route("/testpredict", methods=['GET'])
def test_predict():
    clf = recommend.get_clf()
    data = request.get_json()['data']
    queries = [entry['entry'] for entry in data] # still in lat long
    cluster_queries = [list(recommend.loc_to_cluster(query[0], query[1])) + query[2:] for query in queries]

    output_preds = clf.predict(cluster_queries).tolist()

    response_data = {"data": output_preds}
    response_js = json.dumps(response_data.tolist())

    resp = Response(response_js, status=200, mimetype='application/json')
    return resp

# input lat, long, dayofweeknum, monthdaynum, chunkindex (15-min)
@app.route("/predict", methods=['GET'])
def predict():
    
    lat, lon = float(request.args['lat']), float(request.args['lon'])
    radius = int(request.args['radius'])
    nrows = int(request.args['nrows'])
    day = int(request.args['day'])
    month = int(request.args['month'])
    hour = int(request.args['hour'])
    minute = int(request.args['minute'])


    recommendations = recommend.recommend(lat, lon, radius, nrows, day, month, hour, minute)    
    response_js = json.dumps(recommendations)

    resp = Response(response_js, status=200, mimetype='application/json')
    return resp

@app.route("/")
def hello():
    return "Hello World!"

if __name__ == "__main__":
    app.run()
