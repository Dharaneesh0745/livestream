from fastapi import APIRouter, HTTPException
from app.schemas.user_schemas import UserRegisterSchema, UserLoginSchema
from app.controllers.user_controller import register_user, login_user, get_all_companies, save_user_report, get_all_user_reports

from fastapi import APIRouter, HTTPException
from bson import ObjectId
from app.database import db

router = APIRouter()

@router.post("/register")
async def register(user: UserRegisterSchema):
    result = await register_user(user.dict())
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return {"message": "User registered successfully", "user_id": result["_id"]}

@router.post("/login")
async def login(user: UserLoginSchema):
    print("1")
    logged_in_user = await login_user(user.email, user.password)
    if not logged_in_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"message": "Login successful", "user": logged_in_user}


@router.get("/companies")
async def get_companies():
    result = await get_all_companies()
    if not result:
        raise HTTPException(status_code=404, detail="No companies found")
    return result

@router.post("/save-report")
async def save_report(report: dict):
    print("1")
    result = await save_user_report(report)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return {"message": "Report saved successfully", "success": True}

@router.get("/user-reports")
async def get_reports():
    return await get_all_user_reports()

@router.put("/user-reports/{report_id}/seen")
async def mark_report_as_seen(report_id: str):
    try:
        report_collection = db["user_reports"]
        result = await report_collection.update_one(
            {"_id": ObjectId(report_id)},
            {"$set": {"seen": True}}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Report not found or already marked as seen")
        return {"message": "Report marked as seen"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
