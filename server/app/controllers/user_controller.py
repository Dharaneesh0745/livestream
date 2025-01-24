from app.database import db
from app.models.user import UserModel, PyObjectId
from pymongo.errors import DuplicateKeyError
from bson import ObjectId
from datetime import datetime

def serialize_object_id(obj):
    """
    This function recursively converts any ObjectId instances to strings in the dictionary.
    """
    if isinstance(obj, dict):
        return {key: serialize_object_id(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [serialize_object_id(item) for item in obj]
    elif isinstance(obj, ObjectId):
        return str(obj)
    return obj

async def register_user(user_data: dict):
    user_collection = db["users"]
    try:
        new_user = await user_collection.insert_one(user_data)
        return {"_id": str(new_user.inserted_id)}
    except DuplicateKeyError:
        return {"error": "User with this email already exists"}

async def login_user(email: str, password: str):
    print("2")
    user_collection = db["users"]
    user = await user_collection.find_one({"email": email})
    if user:
        # Convert ObjectId fields to strings
        return serialize_object_id(user)
    return None

async def get_all_companies():
    company_collection = db["users"]
    companies_cursor = company_collection.find({"user_type": "company"})
    companies = await companies_cursor.to_list(length=100)  # Get up to 100 companies
    return serialize_object_id(companies)

async def get_all_user_reports():
    reports_collection = db["user_reports"]
    reports_cursor = reports_collection.find()
    reports = await reports_cursor.to_list(length=100)  # Fetch up to 100 reports
    return [serialize_object_id(report) for report in reports]

async def save_user_report(report_data: dict):
    print("2")
    # Connect to the collections
    report_collection = db["user_reports"]
    user_collection = db["users"]

    # Add date and time to the report data
    report_data["date_time"] = datetime.utcnow()  # Store the current UTC date and time
    report_data["seen"] = False

    # Save the report data in the `user_reports` collection
    try:
        new_report = await report_collection.insert_one(report_data)
        report_id = new_report.inserted_id

        # Find the user by email and update their reports array
        user_email = report_data.get("email")
        if not user_email:
            return {"error": "User email is required"}

        user = await user_collection.find_one({"email": user_email})
        if not user:
            return {"error": "User not found"}

        # Add the report ID to the user's reports array
        await user_collection.update_one(
            {"email": user_email},
            {"$push": {"reports": report_id}}
        )

        return {"success": True, "report_id": str(report_id), "date_time": report_data["date_time"].isoformat()}

    except Exception as e:
        return {"error": str(e)}
