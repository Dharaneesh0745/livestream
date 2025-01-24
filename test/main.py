import serial
from pymongo import MongoClient

try:
    arduino = serial.Serial(port='COM3', baudrate=9600, timeout=1)
except serial.SerialException as e:
    print(f"Error: {e}")
    exit()

MONGODB_URL = "mongodb+srv://dharaneesh0745:Dhoni_007@cluster0.iou4p.mongodb.net/swmm"
DATABASE_NAME = "swmm"

client = MongoClient(MONGODB_URL)
db = client[DATABASE_NAME]
users_collection = db["users"]

def read_output():
    while True:
        if arduino.in_waiting > 0:
            output = arduino.readline().decode('utf-8').strip()
            print(f"Received from Arduino: {output}")
            
            if "TDS" in output:
                try:
                    parts = output.split("TDS:")
                    if len(parts) > 1:
                        tds_value = parts[1].split("ppm")[0].strip()
                        tds_value_float = float(tds_value)
                        print(f"Saving TDS value: {tds_value_float}")

                        users_collection.update_one(
                            {"email": "sharp@mail.com"},
                            {"$set": {"tds_value": tds_value_float}},
                            upsert=False
                        )
                        print("TDS value saved to MongoDB for sharp@mail.com.")
                    else:
                        print(f"Failed to extract TDS value from: {output}")
                except Exception as e:
                    print(f"Error extracting or saving TDS value: {e}")

if __name__ == "__main__":
    read_output()
