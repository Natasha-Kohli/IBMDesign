from flask import Flask, request, Response
from joblib import load
import recommend
import json

# load model
clf = load('randf_trained.joblib')
app = Flask(__name__)

# input lat, long, dayofweeknum, monthdaynum, chunkindex (15-min)
@app.route("/getPredictions", methods=['GET'])
def predict():
    data = request.get_json()['data']
    queries = [entry['entry'] for entry in data] # still in lat long
    cluster_queries = [list(recommend.loc_to_cluster(query[0], query[1])) + query[2:] for query in queries]

    output_preds = clf.predict(cluster_queries).tolist()

    response_data = {"data": output_preds}
    response_js = json.dumps(response_data)

    resp = Response(response_js, status=200, mimetype='application/json')
    return resp

@app.route("/")
def hello():
    return "Hello World!"

if __name__ == "__main__":
    app.run()
