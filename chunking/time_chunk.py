import datetime

CHUNK_SIZE = 15 * 60 #in seconds

def week_chunk(pickup_time):
    if type(pickup_time) is datetime.datetime:
        num_seconds = (pickup_time.weekday() * 86400) + (pickup_time.hour * 3600) + (pickup_time.minute * 60) + pickup_time.second
        return num_seconds // CHUNK_SIZE

def month_chunk(pickup_time):
    if type(pickup_time) is datetime.datetime:
        num_seconds = (pickup_time.day * 86400) + (pickup_time.hour * 3600) + (pickup_time.minute * 60) + pickup_time.second
        return num_seconds // CHUNK_SIZE