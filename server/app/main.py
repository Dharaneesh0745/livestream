from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import os
import uuid
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from app.routes.user_routes import router as user_router
from fastapi.staticfiles import StaticFiles
import ollama
import tempfile

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router, prefix="/api/v1/users", tags=["users"])

@app.get("/")
def root():
    return {"message": "Welcome to the User Management API"}

@app.post("/ollama")
async def upload_image_to_ollama(image: UploadFile = File(...)):
    try:
        # Read image content
        image_content = await image.read()

        # Save the image content to a temporary file so that ollama can access it
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
            temp_file.write(image_content)
            temp_file_path = temp_file.name

        # Call Ollama LLaVA model
        res = ollama.chat(
            model="llava",  # Your LLaVA model
            messages=[
                {
                    'role': 'user',
                    'content': 'Describe this image water quality: use step by step analysis and points.',
                    'images': [temp_file_path]  # Pass the image file path
                }
            ]
        )

        # Return response from the model
        return JSONResponse(content={"success": True, "modelResponse": res['message']['content']})

    except Exception as e:
        return JSONResponse(content={"success": False, "message": str(e)})

UPLOAD_DIR = Path("/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Serve static files from the /uploads directory (accessible as http://localhost:8000/uploads/{filename})
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

@app.post("/upload-image")
async def upload_image(image: UploadFile = File(...)):
    try:
        # Generate a unique filename using UUID
        file_extension = image.filename.split('.')[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"

        # Save the image to the /uploads directory
        file_path = UPLOAD_DIR / unique_filename
        with open(file_path, "wb") as buffer:
            buffer.write(await image.read())

        # Return the file name (or URL) to the frontend
        return JSONResponse(
            content={"success": True, "fileName": f"/uploads/{unique_filename}"},
            status_code=200,
        )
    except Exception as e:
        return JSONResponse(
            content={"success": False, "error": str(e)},
            status_code=500,
        )

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
